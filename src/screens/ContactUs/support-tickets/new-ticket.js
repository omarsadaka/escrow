import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../../components/customHeader";
import CustomText from "../../../components/customText";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomInput from "../../../components/customInput";
import SelectDropdown from "react-native-select-dropdown";
import { hp, wp } from "../../../utilis/dimensions";
import Textarea from "react-native-textarea";
import CommonStyles from "../../../constants/CommonStyles";
import axios from "axios";
import { showSimpleModal } from "../../../redux/actions/modal";
import { useDispatch } from "react-redux";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import CustomButton from "../../../components/customButton";
import { getGeneralSettings } from "../../../utilis/apis";
import Entypo from "react-native-vector-icons/Entypo";

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";

const TicketPriority = [
  {
    id: "1",
    nameArr: "منخفض",
    nameEn: "low",
  },
  {
    id: "2",
    nameArr: "متوسط",
    nameEn: "medium",
  },
  {
    id: "3",
    nameArr: "عال",
    nameEn: "high",
  },
];

const NewSupportTicket = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [subject, setSubject] = useState(null);
  const [message, setMessage] = useState(null);
  const [priorityId, setPriortiyId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [env, setEnv] = useState("2");
  const [baseURL, setBaseURL] = useState("");
  const [files, setFiles] = useState([]);
  const [valid, setValid] = useState(false);
  const [maxUploadedFile, setMaxUploadedFile] = useState(null);
  const [fileExtensions, setFileExtensions] = useState(null);
  const [maxFileSize, setMaxFileSize] = useState(null);
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [env]);
  useEffect(() => {
    if (!baseURL) return;
    getGeneralSettings(baseURL).then((res) => {
      let arr = res?.allowed_exec.replace(/","/g, "").split('"');
      setMaxUploadedFile(res?.max_uploaded_file);
      setMaxFileSize(res?.max_attach_size);
      setFileExtensions(arr[1].split(".").filter((el) => el != ""));
    });
    return () => {
      cleanState();
    };
  }, [baseURL]);

  const handleAllowedFiles = (docs) => {
    if (files.length > maxUploadedFile) {
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header:
              i18n.language == "ar" ? "حدث خطأ ما" : "something went wrong",
            message: ` ${t("maxUploadFiles")} : ${maxUploadedFile} `,
            action: "",
            type:'error'
          },
        })
      );
      const newArr = files.splice(-1);
      console.log("new arr last ele?", newArr[0].name);
      const filteredAttachments = files.filter(
        (el) => el.name != newArr[0].name
      );
      console.log(
        "filteredAttachments",
        filteredAttachments.map((el) => el.name)
      );
      setFiles(filteredAttachments);
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    handleAllowedFiles();
  }, [files]);

  const checkValid = (email) => {
    if (
      email?.length > 0 &&
      validateEmail(email) &&
      name?.length > 0 &&
      priorityId &&
      subject?.length > 0 &&
      message?.length > 0
    )
      setValid(true);
    else setValid(false);
  };

  useEffect(() => {
    checkValid(email);
  }, [email, name, subject, message, priorityId]);

  const getSavedEnv = async () => {
    try {
      const value = await AsyncStorage.getItem("ENVIROMENT");
      if (value !== null) {
        // value previously stored
        setEnv(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getSavedEnv();
  }, []);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const cleanState = () => {
    setEmail(null);
    setName(null);
    setSubject(null);
    setMessage(null);
    setFiles([]);
  };

  const addNewTicket = async () => {
    setLoading(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      let Req = {
        name: name,
        email: email,
        subject: subject,
        priority: priorityId,
        message: message,
        attachments:
          files.length > 0
            ? files?.map((el) => {
                return {
                  base64: el?.base64,
                  extension: `.${el?.extension.split("/").pop()}`,
                };
              })
            : [],
        device_info: deviceInfo    
      };
      console.log("req", Req);

      axios({
        url: baseURL + ENDPOINTS.newSupportTicket,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json;",
          "X-Localization": i18n?.language,
        },
        data: Req,
      }).then((res) => {
        console.log("res", res);

        if (res?.data?.messages?.success) {
          setLoading(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'),   //res?.data?.status,
                message: res?.data?.messages?.success,
                action: "",
                type:'success'
              },
            })
          );
          cleanState();
          navigation.push("SupportTicketsHistory");
        } else {
          setLoading(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header:
                  i18n.language == "ar" ? "حدث خطأ" : "something went wrong",
                message: res?.data?.messages?.error,
                action: "",
                type:'error'
              },
            })
          );
        }
      });
    } catch (error) {
      setLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: i18n.language == "ar" ? "حدث خطأ" : "something went wrong",
            message: t("accountScreen.err"),
            action: "",
            type:'error'
          },
        })
      );
    }
  };

  const UploadFiles = () => {
    DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      readContent: true,
    }).then((pdf) => {
      if (pdf) {
        if (pdf.length > maxUploadedFile) {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header:
                  i18n.language == "ar" ? "حدث خطأ ما" : "something went wrong",
                message: ` ${t("maxUploadFiles")} : ${maxUploadedFile} `,
                action: "",
                type:'error'
              },
            })
          );
          return;
        } else {
          const docs = [];
          pdf?.map((el) => {
            if (el.size > 5242880) {
              dispatch(
                showSimpleModal({
                  status: true,
                  payload: {
                    header:
                      i18n.language == "ar"
                        ? "حدث خطأ ما"
                        : "something went wrong",
                    message: ` ${t(
                      "maxFileSizeValidation"
                    )} : ${maxFileSize} ${t("mega")}`,
                    action: "",
                    type:'error'
                  },
                })
              );
            } else {
              const xx = fileExtensions.filter((ext) => el.type.endsWith(ext));
              if (xx.length == 0) {
                dispatch(
                  showSimpleModal({
                    status: true,
                    payload: {
                      header:
                        i18n.language == "ar"
                          ? "حدث خطأ ما"
                          : "something went wrong",
                      message: ` ${t("fileExtensionValidation")}`,
                      action: "",
                      type:'error'
                    },
                  })
                );
              } else {
                RNFetchBlob.fs.readFile(el?.uri, "base64").then((data) => {
                  docs.push({
                    base64: data,
                    name: el?.name,
                    extension: `${el?.type.split("/").pop()}`,
                  });
                  let flag = handleAllowedFiles();
                  flag && setFiles([...files, ...docs]);
                });
              }
            }
          });
        }
      }
    });
  };

  return (
    <>
      <CustomHeader navigation={navigation} />

      <ScrollView contentContainerStyle={styles.ticketsScreen}>
        <CustomInput
          containerStyle={styles.inputContainer}
          label={`${t("supportTickets.name")} *`}
          // placeholder={t("supportTickets.zipp")}
          value={name}
          onChangeText={setName}
          error={name?.length > 0 ? false : true}
          errorMessage={t("requiredField")}
          // inputRef={ref5}
        />
        <CustomInput
          containerStyle={styles.inputContainer}
          label={`${t("supportTickets.email")}*`}
          // placeholder={t("supportTickets.zipp")}
          value={email}
          onChangeText={setEmail}
          error={!email || (email && !validateEmail(email)) ? true : false}
          errorMessage={
            !email ? t("requiredField") : t("profileScreens.emailRules")
          }
          // inputRef={ref5}
        />
        <View
          style={[
            styles.dropdownCont,
            {
              //marginLeft: wp(5),
            },
          ]}
        >
          <CustomText
            color={COLORS.lightGrey}
            size={14}
            text={`${t("supportTickets.priority")} *`}
          />
          <SelectDropdown
            data={
              i18n.language == "ar"
                ? TicketPriority.map((el) => el.nameArr)
                : TicketPriority.map((el) => el.nameEn)
            }
            defaultButtonText={t("supportTickets.selectPri")}
            renderDropdownIcon={() => {
              return (
                <FontAwesome5Icon
                  name="caret-down"
                  size={20}
                  color={COLORS.babyBlue2}
                />
              );
            }}
            buttonTextStyle={styles.dropDownBtnTxt}
            buttonStyle={{
              backgroundColor: COLORS.inputBackGround,
              width: "90%",
              height: hp(6),
              marginVertical: hp(2),
              borderWidth: wp(0.28),
              borderRadius: wp(2),
              borderColor: priorityId ? COLORS.header : COLORS.red,
            }}
            rowStyle={CommonStyles.dropDownRow}
            rowTextStyle={CommonStyles.dropDownTxt}
            onSelect={(val, index) => {
              i18n.language == "ar"
                ? setPriortiyId(
                    TicketPriority.find((el) => el.nameArr == val)?.id
                  )
                : setPriortiyId(
                    TicketPriority.find((el) => el.nameEn == val)?.id
                  );
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
          {!priorityId && (
            <CustomText
              containerStyle={{ alignSelf: "center" }}
              color={COLORS.red}
              text={t("requiredField")}
              size={12}
            />
          )}
        </View>
        <CustomInput
          containerStyle={styles.inputContainer}
          label={`${t("supportTickets.subject")} * `}
          // placeholder={t("supportTickets.zipp")}
          value={subject}
          onChangeText={setSubject}
          error={subject?.length > 0 ? false : true}
          errorMessage={t("requiredField")}
          // inputRef={ref5}
        />
        <View
          style={[
            styles.dropdownCont,
            {
              width: "100%",
              //marginLeft: wp(5),
            },
          ]}
        >
          <CustomText
            style={{ alignSelf: "flex-start", marginHorizontal: wp(5) }}
            color={COLORS.lightGrey}
            size={14}
            text={`${t("supportTickets.message")} *`}
          />
          <Textarea
            required={true}
            // inputRef={agRef2}
            containerStyle={[
              CommonStyles.textareaContainer,
              { borderColor: message ? COLORS.header : COLORS.red },
            ]}
            style={{
              fontFamily: "BahijTheSansArabic-Plain",
              textAlign:i18n.language=='ar'?'right': 'left',
              color: COLORS.black,
              height:'100%',
              textAlignVertical:'top'
            }}
            onChangeText={setMessage}
            maxLength={200}
            placeholder={`${t("supportTickets.message")} `}
            placeholderTextColor={"#c7c7c7"}
            underlineColorAndroid={"transparent"}
            value={message}
          />
          {!message && (
            <CustomText
              color={COLORS.red}
              size={13}
              style={{ textAlign: "center", width: "100%" }}
            >
              {t("requiredField")}
            </CustomText>
          )}
        </View>
        {/* attachments */}
        <View style={{ width: "90%", alignItems: "flex-start" }}>
          <CustomText
            color={COLORS.header}
            size={12}
            text={t("maxNum") + maxUploadedFile}
          />
          <CustomText
            color={COLORS.header}
            size={12}
            text={t("maxsize") + maxFileSize + " " + t("mega")}
          />
          <CustomText
            color={COLORS.header}
            size={12}
            text={t("extensions") + fileExtensions}
          />
        </View>
        <CustomButton
          color={COLORS.blue}
          onPress={UploadFiles}
          textSize={12}
          text={t("UploadFiles")}
          containerStyle={styles.btn}
        />
        {files.length > 0 &&
          files.map((el, index) => (
            <View
              key={index}
              style={{
                marginHorizontal: wp(5),
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: wp(70),
                minHeight: hp(4),
              }}
            >
              <CustomText color={COLORS.header} size={16} text={el.name} />
              <Entypo
                onPress={() => {
                  const arr = files.filter((ob) => ob.name != el.name);
                  setFiles(arr);
                }}
                name={"trash"}
                size={20}
                color={COLORS.red}
              />
            </View>
          ))}
        <CustomButton
          onPress={addNewTicket}
          textSize={12}
          text={t("submit")}
          containerStyle={styles.btn}
          loading={loading}
          disabled={!valid}
          color={!valid ? COLORS.grey : COLORS.header}
        />
      </ScrollView>
    </>
  );
};

export default NewSupportTicket;
