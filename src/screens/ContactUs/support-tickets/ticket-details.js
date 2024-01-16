import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../../components/customHeader";
import CustomText from "../../../components/customText";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomAlert from "../../../components/CustomAlert";
import axios from "axios";
import { showSimpleModal } from "../../../redux/actions/modal";
import { useDispatch } from "react-redux";
import CustomButton from "../../../components/customButton";
import Textarea from "react-native-textarea";
import { hp, wp } from "../../../utilis/dimensions";
import DocumentPicker from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import CommonStyles from "../../../constants/CommonStyles";
import { getGeneralSettings } from "../../../utilis/apis";
import Entypo from "react-native-vector-icons/Entypo";
const SupportTicketDetails = ({ navigation, route }) => {
  const [maxUploadedFile, setMaxUploadedFile] = useState(null);
  const [fileExtensions, setFileExtensions] = useState(null);
  const [maxFileSize, setMaxFileSize] = useState(null);

  const dispatch = useDispatch();
  const data = route?.params?.data;
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [TicketDetails, setTicketDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadingNewReply, setLoadingNewReply] = useState(false);
  const [closeTicketLoading, setCloseTicketLoading] = useState(false);
  const [env, setEnv] = useState("2");
  const [closeTicketModal, setCloseTicketModal] = useState(false);
  const [newReply, setNewReply] = useState(null);
  const [replyAttachments, setReplyAttachments] = useState([]);
  const [baseURL, setBaseURL] = useState("");
  const [refresh, setRefresh] = useState(false);

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

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [env]);

  useEffect(() => {
    if (!baseURL) return;
    fetchTicketDetails();
    getGeneralSettings(baseURL).then((res) => {
      let arr = res?.allowed_exec.replace(/","/g, "").split('"');
      setMaxUploadedFile(res?.max_uploaded_file);
      setMaxFileSize(res?.max_attach_size);
      setFileExtensions(arr[1].split(".").filter((el) => el != ""));
    });
  }, [baseURL]);

  const handleAllowedFiles = (docs) => {
    if (replyAttachments.length > maxUploadedFile) {
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
      const newArr = replyAttachments.splice(-1);
      console.log("new arr last ele?", newArr[0].name);
      const filteredAttachments = replyAttachments.filter(
        (el) => el.name != newArr[0].name
      );
      console.log(
        "filteredAttachments",
        filteredAttachments.map((el) => el.name)
      );
      setReplyAttachments(filteredAttachments);
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    handleAllowedFiles();
  }, [replyAttachments]);
  const fetchTicketDetails = async () => {
    setLoading(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      fetch(baseURL + `${ENDPOINTS.ticketDetails}/${data?.ticket} `, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json;",
          "X-Localization": i18n?.language,
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.myTicket) {
            setTicketDetails(responseData);

            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
    }
  };
  const UploadFiles = () => {
    DocumentPicker.pickMultiple({
      type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      readContent: true,
    }).then((pdf) => {
      if (pdf) {
        console.log("pdf.length", pdf.length, maxUploadedFile);
        if (pdf.length > maxUploadedFile) {
          console.log("upload files from details");
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
                  flag && setReplyAttachments([...replyAttachments, ...docs]);
                });
              }
            }
          });
        }
      }
    });
  };

  const handleNewReply = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoadingNewReply(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      let bodyWithoutAttachments = {
        id: data?.id,
        message: newReply,
        device_info: deviceInfo  
      };
      let bodyWithAttachments = {
        id: data?.id,
        message: newReply,
        attachments: replyAttachments.map((el) => {
          return {
            base64: el?.base64,
            extension: `.${el?.extension.split("/").pop()}`,
          };
        }),
        device_info: deviceInfo  
      };

      fetch(baseURL + ENDPOINTS.ticketReply, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json;",
          "X-Localization": i18n?.language,
        },
        body:
          replyAttachments?.length == 0
            ? JSON.stringify(bodyWithoutAttachments)
            : JSON.stringify(bodyWithAttachments),
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("res of new rep", responseData);

          if (responseData?.messages?.success) {
            setLoadingNewReply(false);
            fetchTicketDetails();
            setReplyAttachments([]);
            setNewReply(null);
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header:
                    i18n.language == "ar" ? "تم بنجاح" : responseData?.status,
                  message: responseData?.messages?.success,
                  action: "",
                  type:'success'
                },
              })
            );
          } else {
            setLoadingNewReply(false);
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header:
                    i18n.language == "ar" ? "حدث خطأ" : responseData?.status,
                  message: responseData?.messages?.error,
                  action: "",
                  type:'error'
                },
              })
            );
          }
        });
    } catch (error) {
      setLoadingNewReply(false);
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

  const handleCloseTicket = async () => {
    console.log("delete");

    setCloseTicketLoading(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      axios({
        url: baseURL + ENDPOINTS.closeTicket,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json;",
          "X-Localization": i18n?.language,
        },
        data: {
          id: TicketDetails?.myTicket?.id,
          device_info: deviceInfo
        },
      }).then((responseData) => {
        console.log("res", responseData);

        if (responseData?.data?.messages?.success) {
          setCloseTicketLoading(false);
          setCloseTicketModal(false);
          fetchTicketDetails();
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'),  // responseData?.data?.status,
                message: responseData?.data?.messages?.success,
                action: "",
                type:'success'
              },
            })
          );
        } else {
          setCloseTicketLoading(false);
          setCloseTicketModal(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'), //responseData?.data?.status,
                message: responseData?.data?.messages?.success,
                action: "",
                type:'success'
              },
            })
          );
        }
      });
    } catch (error) {
      setCloseTicketLoading(false);
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
  const onRefresh = () => {
    fetchTicketDetails();
  };
  return (
    <>
      <CustomHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.ticketsScreen}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <CustomText
          text={t("supportTickets.ticketDetails")}
          color={COLORS.cardBlue}
          // style={styles.title}
        />

        {!loading ? (
          TicketDetails ? (
            <>
              <View style={styles.detailsCont}>
                <View style={styles.statusCont}>
                  {TicketDetails?.myTicket?.status != 3 && (
                    <AntDesign
                      onPress={() => setCloseTicketModal(true)}
                      name={"closecircleo"}
                      size={18}
                      color={COLORS.red}
                    />
                  )}
                  <CustomText
                    text={
                      TicketDetails?.myTicket?.status == 0
                        ? i18n.language == "ar"
                          ? "جديدة"
                          : "Opened"
                        : TicketDetails?.myTicket?.status == 1
                        ? i18n.language == "ar"
                          ? "رد جديد من المشرف"
                          : "admin answer"
                        : TicketDetails?.myTicket?.status == 2
                        ? i18n.language == "ar"
                          ? "رد من المستخدم"
                          : "user answer"
                        : TicketDetails?.myTicket?.status == 3
                        ? i18n.language == "ar"
                          ? "مغلقة"
                          : "closed"
                        : ""
                    }
                    color={
                      TicketDetails?.myTicket?.status == 0
                        ? COLORS.green
                        : TicketDetails?.myTicket?.status == 3
                        ? COLORS.red
                        : COLORS.yellow
                    }
                    style={styles.statusTxt}
                  />
                </View>
                <CustomText
                  text={TicketDetails?.myTicket?.Ticket}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
                <CustomText
                  text={` ${t("supportTickets.name")}  :    ${
                    TicketDetails?.myTicket?.name
                  }`}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
                <CustomText
                  text={` ${t("supportTickets.email")}  :   ${
                    TicketDetails?.myTicket?.email
                  }`}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
                <CustomText
                  text={` ${t("supportTickets.subject")}  :   ${
                    TicketDetails?.myTicket?.subject
                  }`}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
                <CustomText
                  text={` ${t("supportTickets.ticketNo")}  :   ${
                    TicketDetails?.myTicket?.ticket
                  }`}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
                <CustomText
                  text={` ${t("supportTickets.postedOn")}  : ${moment(
                    TicketDetails?.myTicket?.created_at
                  )
                    .locale("en")
                    .format("DD-MM-YYYY h:mm:ss a")}`}
                  color={COLORS.cardBlue}
                  // style={styles.title}
                />
              </View>

              {TicketDetails?.messages?.map((el) => {
                return (
                  <View style={styles.detailsCont}>
                    <View
                      style={{
                        flexDirection: "row",
                        minWidth: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <CustomText
                        text={`${el.message}`}
                        color={COLORS.cardBlue}
                        // style={styles.title}
                      />
                    </View>
                    {el?.admin_id != 0 && (
                      <CustomText
                        text={` ${t("supportTickets.repliedBy")} : ${
                          el?.admin != null ? el?.admin?.name : ""
                        }`}
                        color={COLORS.red}
                        // style={styles.title}
                      />
                    )}
                    <CustomText
                      text={` ${t("supportTickets.postedOn")}  : ${moment(
                        el?.created_at
                      )
                        .locale("en")
                        .format("DD-MM-YYYY h:mm:ss a")}`}
                      color={COLORS.cardBlue}
                      // style={styles.title}
                    />
                    {el?.attachments?.map((el, index) => {
                      return (
                        <TouchableOpacity
                          onPress={() => {
                            // downloadFileFetch(el.attachment);
                            navigation.navigate("PDFViewer", {
                              link: el.attachment,
                              attachment: true,
                            });
                          }}
                        >
                          <CustomText
                            text={`attachment ${index + 1}`}
                            color={COLORS.green}
                            // style={styles.title}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}

              {TicketDetails?.myTicket?.status != 3 && (
                <View style={{ width: "100%", alignItems: "center" }}>
                  <Textarea
                    required={true}
                    // inputRef={agRef2}
                    containerStyle={[
                      CommonStyles.textareaContainer,
                      { borderColor: newReply ? COLORS.header : COLORS.red },
                    ]}
                    style={{
                      fontFamily: "BahijTheSansArabic-Plain",
                      textAlign:i18n.language=='ar'?'right': 'left',
                      color: COLORS.black,
                      height:'100%',
                      textAlignVertical:'top'
                    }}
                    onChangeText={setNewReply}
                    maxLength={200}
                    placeholder={`${t("supportTickets.message")} `}
                    placeholderTextColor={"#c7c7c7"}
                    underlineColorAndroid={"transparent"}
                    value={newReply}
                  />
                  {!newReply && (
                    <CustomText
                      color={COLORS.red}
                      size={13}
                      style={{ textAlign: "center", width: "100%" }}
                    >
                      {t("requiredField")}
                    </CustomText>
                  )}
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
                  {replyAttachments?.length > 0 &&
                    replyAttachments.map((el, index) => (
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
                        <CustomText
                          color={COLORS.header}
                          size={16}
                          text={el.name}
                        />
                        <Entypo
                          onPress={() => {
                            const arr = replyAttachments.filter(
                              (ob) => ob.name != el.name
                            );
                            setReplyAttachments(arr);
                          }}
                          name={"trash"}
                          size={20}
                          color={COLORS.red}
                        />
                      </View>
                    ))}
                  <CustomButton
                    disabled={!newReply}
                    loading={loadingNewReply}
                    color={!newReply ? COLORS.grey : COLORS.blue}
                    onPress={handleNewReply}
                    textSize={12}
                    text={t("supportTickets.newRep")}
                    containerStyle={styles.btn}
                  />
                </View>
              )}
            </>
          ) : (
            <CustomText
              text={t("supportTickets.noReplyData")}
              color={COLORS.cardBlue}
              // style={styles.title}
            />
          )
        ) : (
          <ActivityIndicator color={COLORS.header} />
        )}

        <CustomAlert
          type={'success'}
          show={closeTicketModal}
          header={t("supportTickets.confirmClose")}
          body={t("supportTickets.removeBody")}
          action1={handleCloseTicket}
          action2={() => {
            setCloseTicketModal(false);
          }}
          btn1={t("accountScreen.ok")}
          // loading={deleteLoading}
          btn2={t("cancle")}
          oneBtn={false}
          loading={closeTicketLoading}
        />
      </ScrollView>
    </>
  );
};

export default SupportTicketDetails;
