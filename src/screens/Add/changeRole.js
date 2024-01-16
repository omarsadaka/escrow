import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  // Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import Text from "../../components/globalText";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomInput from "../../components/customInput";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../../components/customHeader";
import SelectDropdown from "react-native-select-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import * as transactionActions from "../../redux/actions/transactions/index";
import { hp, wp } from "../../utilis/dimensions";
import { useDispatch } from "react-redux";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import axios from "axios";
import CustomAlert from "../../components/CustomAlert";
import { Modal } from "react-native";
import { showMessage } from "react-native-flash-message";
import CheckBox from "react-native-check-box";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import { TouchableOpacity } from "react-native";
import Textarea from "react-native-textarea";
import { storeStackValue } from "../../redux/actions/user";
import CommonStyles from "../../constants/CommonStyles";
import ProgressBar from "react-native-animated-progress";

const NewTransactionRoleScreen = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingAg, setLoadingAg] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryAg, setCategoryAg] = useState("");
  const [selectedIdAg, setSelectedIdAg] = useState(null);
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [buyerOrSeller, setBuyerOrSeller] = useState("1");
  const [modalVisible, setModalVisible] = useState(false);
  const [aggName, setAggName] = useState("");
  const [aggMore, setAggMore] = useState("");
  const [isSelected, setIsSelected] = useState(false);
  const [agreementDocs, setAgreementDocs] = useState(null);
  const [disableNext, setDisableNext] = useState(false);
  const [termsPopUp, setTermsPopUp] = useState(false);
  const [warningBack, setWarningBack] = useState(false);
  const ref = useRef();
  const titleRef = useRef();
  const detailsRef = useRef();
  const agRef1 = useRef();
  const agRef2 = useRef();
  const handleLang = async (value) => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    if (i18n.language == "ar") {
      try {
        await i18n.changeLanguage("en");
        await AsyncStorage.setItem("@CACHED_LANG", "en");
      } catch (e) {
        // saving error
      }
    } else {
      try {
        await i18n.changeLanguage("ar");
        await AsyncStorage.setItem("@CACHED_LANG", "ar");
      } catch (e) {
        // saving error
      }
    }
  };
  const getCategories = async () => {
    setLoading(true);
    console.log("in get category list...");
    const token = await AsyncStorage.getItem("TOKEN");
    const change = await AsyncStorage.getItem("ChangeLang");

    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.categoryList,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
    })
      .then((res) => {
        // console.log("cat data : ", res?.data.categories[0]);
        if (res?.data?.categories) {
          let catNames = [];
          let catIds = [];
          let catImages = [];
          if (res?.data.categories[0] && res?.data.categories[0]?.length > 0) {
            setDisableNext(false);
            // console.log("cat data : ", res?.data.categories[0]);
            if (i18n.language == "en") {
              res?.data.categories[0]?.map((el) => {
                catNames.push(el?.name_en);
                catIds.push(el.id);
                catImages.push(el.image);
              });
            } else {
              res?.data.categories[0]?.map((el) => {
                catNames.push(el?.name_ar);
                catIds.push(el.id);
                catImages.push(el.image);
              });
            }
          }
          setCategoryList(catNames);
          setCategoryIDs(catIds);
          setCategoryImages(catImages);
          setCategory(catNames[0]);
          setSelectedId(catIds[0]);
          setSelectedImage(catImages[0]);
          setCategoryAg(catNames[0]);
          setSelectedIdAg(catIds[0]);
          setLoading(false);
        } else {
          setDisableNext(true);
          setErrMess(
            res?.data?.messages?.error
          );
          setCategory("");
          setCategoryAg("");
          setLoading(false);
          setWarning(true);
        }
      })
      .catch((er) => {
        setErrMess(t("accountScreen.err"));
        setCategory("");
        setCategoryAg("");
        setWarning(true);
        console.log("er : ", er);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!baseURL) return;
    getCategories();
  }, [navigation, baseURL]);

  useEffect(() => {
    dispatch(storeStackValue(true));
  }, [navigation]);

  useEffect(() => {
    const val = parseInt(amount);
    if (amount.length != 0) {
      if (val >= 50 && val <= 2000) {
        setValid(true);
      } else {
        setValid(false);
      }
    } else {
      setValid(false);
    }
  }, [amount]);
  const createAgreement = async () => {
    setLoadingAg(true);

    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let dataObj = agreementDocs
      ? {
          title: aggName,
          description: aggMore,
          category_id: selectedIdAg,
          attachment: agreementDocs,
          device_info: deviceInfo
        }
      : {
          title: aggName,
          description: aggMore,
          category_id: selectedIdAg,
          device_info: deviceInfo
        };

    axios({
      method: "POST",
      url: baseURL + ENDPOINTS.addAgreement,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
      data: dataObj,
    })
      .then((res) => {
        setLoadingAg(false);

        if (res?.data?.messages?.success) {
          setModalVisible(!modalVisible);
          setAggMore(null);
          setAggName(null);
          setAgreementDocs(null);
          setIsSelected(false);
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(
            res?.data?.messages?.error
          );
          setWarning(true);
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        setLoadingAg(false);
      });
  };

  const handleUploadِAgreementDocuments = () => {
    DocumentPicker.pickSingle({
      type: "*/*",
      readContent: true,
    }).then((pdf) => {
      if (pdf) {
        RNFetchBlob.fs.readFile(pdf?.uri, "base64").then((data) => {
          setAgreementDocs({
            base64: data,
            name: pdf?.name,
            extension: `.${pdf?.type.split("/").pop()}`,
          });
        });
        return;
      }
    });
  };
  return (
    <KeyboardAvoidingView behavior="padding">
      <CustomHeader
        navigation={navigation}
        warningLanguage={true}
        warningBack={true}
        backAction={() => setWarningBack(true)}
      />
      <ScrollView style={styles.bg}>
        {loading ? (
          <ActivityIndicator
            style={styles.loadingStyle}
            size={"large"}
            color={COLORS.header}
          />
        ) : (
          <>
            <View style={styles.progressCon}>
              <ProgressBar
                progress={20}
                height={10}
                backgroundColor="green"
                // animated={false}
              />
              {/* <View style={styles.progressCounter}></View> */}
              {/* <Lottie
                style={styles.progressCounter}
                source={require("../../assets/lottie/progressBarLottie.json")}
                autoPlay
                loop={true}
              /> */}
            </View>
            <CustomText
              color={COLORS.red}
              size={15}
              text={t("changeRole.step1")}
            />
            {/* <Image
              style={styles.logo}
              source={require("../../assets/newLogo.png")}
            /> */}
            <TouchableOpacity
              onPress={() => setTermsPopUp(true)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginVertical: hp(1),
              }}
            >
              <CustomText
                color={COLORS.black}
                size={16}
                text={
                  <Text style={{}}>
                    <Text style={styles.textColored}>
                      {t("loginScreen.buyer")}
                    </Text>{" "}
                    {t("loginScreen.and")}
                    <Text style={styles.textColored}>
                      {t("loginScreen.seller")}
                    </Text>{" "}
                    {t("loginScreen.agree")}
                  </Text>
                }
                // style={styles.text}
              />
              <CustomText
                style={[
                  styles.textColored,
                  { borderBottomColor: COLORS.blue, borderBottomWidth: 1 },
                ]}
                color={COLORS.black}
                size={16}
                text={t("loginScreen.conditions")}
              />
            </TouchableOpacity>
            <View>
              <View
                style={[
                  styles.dropdownCont,
                  {
                    marginLeft: wp(10),
                  },
                ]}
              >
                <CustomText
                  containerStyle={{ marginLeft: wp(2) }}
                  color={COLORS.lightGrey}
                  size={14}
                  text={t("RegisterScreen.iam")}
                />
                <SelectDropdown
                  data={[t("RegisterScreen.Seller"), t("loginScreen.buyer")]}
                  defaultButtonText={t("RegisterScreen.Seller")}
                  renderDropdownIcon={() => {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    );
                  }}
                  buttonTextStyle={styles.dropDownBtnTxt}
                  buttonStyle={styles.dropDownBtn}
                  rowStyle={styles.dropDownRow}
                  rowTextStyle={styles.dropDownTxt}
                  onSelect={(val, index) => {
                    val == t("RegisterScreen.Seller")
                      ? setBuyerOrSeller("1")
                      : setBuyerOrSeller("2");
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  // dropdownIconPosition="left"
                />
              </View>
              <View
                style={[
                  styles.dropdownCont,
                  {
                    marginLeft: wp(10),
                  },
                ]}
              >
                <CustomText
                  containerStyle={{ marginLeft: wp(2) }}
                  color={COLORS.lightGrey}
                  size={14}
                  text={t("RegisterScreen.Category")}
                />
                <SelectDropdown
                  data={categoryList}
                  defaultButtonText={category}
                  renderDropdownIcon={() => {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    );
                  }}
                  buttonTextStyle={styles.dropDownBtnTxt}
                  buttonStyle={styles.dropDownBtn}
                  rowStyle={styles.dropDownRow}
                  rowTextStyle={styles.dropDownTxt}
                  onSelect={(val, index) => {
                    console.log("name id : ", val, categoryIDs[index]);
                    setCategory(val);
                    setSelectedId(categoryIDs[index]);
                    setSelectedImage(categoryImages[index]);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                  // dropdownIconPosition="left"
                />
              </View>
              <CustomInput
                label={t("RegisterScreen.Amount")}
                placeholder={"500.00"}
                value={amount}
                onChangeText={setAmount}
                error={!valid}
                errorMessage={t("RegisterScreen.err")}
                keyboardType="numeric"
                inputRef={ref}
                icon={
                  <FontAwesome5
                    name="money-bill-wave-alt"
                    size={15}
                    color={COLORS.babyBlue2}
                  />
                }
              />
              <CustomInput
                label={t("changeRole.title")}
                placeholder={t("changeRole.tp")}
                value={title}
                onChangeText={setTitle}
                error={title.length ? false : true}
                errorMessage={t("requiredField")}
                inputRef={titleRef}
                icon={
                  <FontAwesome5
                    name="money-bill-wave-alt"
                    size={15}
                    color={COLORS.babyBlue2}
                  />
                }
              />
              <CustomText
                color={COLORS.lightGrey}
                size={13}
                style={{ textAlign: "left", width: "76%" }}
              >
                {t("changeRole.details")}
              </CustomText>
              <Textarea
                required={true}
                inputRef={detailsRef}
                style={{
                  fontFamily: "BahijTheSansArabic-Plain",
                  textAlign:i18n.language=='ar'?'right': 'left',
                  color: COLORS.black,
                  height:'100%',
                  textAlignVertical:'top'
                }}
                containerStyle={[
                  styles.textareaContainer,
                  { borderColor: details ? COLORS.header : COLORS.red },
                ]}
                onChangeText={(val) => setDetails(val)}
                // onChangeText={setDetails}
                maxLength={200}
                placeholder={t("changeRole.dp")}
                placeholderTextColor={"#c7c7c7"}
                underlineColorAndroid={"transparent"}
                value={details}
              />

              {!details && (
                <CustomText
                  color={COLORS.red}
                  size={13}
                  style={{ textAlign: "left", width: "76%" }}
                >
                  {t("requiredField")}
                </CustomText>
              )}
              <CheckBox
                style={styles.checkBox}
                // disabled={loading == true ? true : false}
                isChecked={isSelected}
                onClick={(newValue) => {
                  setAggMore(details);
                  setIsSelected(newValue);
                  setModalVisible(true);
                }}
                rightText={t("changeRole.addAg")}
                checkBoxColor={COLORS.black}
                rightTextStyle={{ color: COLORS.black }}
              />
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  valid
                    ? title.length > 0
                      ? details.length > 0
                        ? !disableNext
                          ? (dispatch(
                              transactionActions.updatePrice({
                                amount: amount,
                                title: title,
                                details: details,
                                type: buyerOrSeller,
                              })
                            ),
                            console.log(
                              "ccc : ",
                              category,
                              selectedId,
                              selectedImage
                            ),
                            dispatch(
                              transactionActions.addCategory({
                                category: category,
                                categoryId: selectedId,
                                categoryImage: selectedImage,
                              })
                            ),
                            navigation.navigate("viewNewTransactionItems"))
                          : (setErrMess(t("newTransactions.kycerr")),
                            setWarning(true))
                        : detailsRef?.current?.focus()
                      : titleRef.current.focus()
                    : ref.current.focus();
                }}
                textSize={16}
                text={t("newTransactions.Next")}
                containerStyle={styles.btn2}
              />

              {/* <Pressable onPress={handleLang}>
              <CustomInput
                containerStyle={styles.translate}
                inputStyle={styles.translateText}
                leftIcon={
                  <FontAwesome5
                    name="caret-down"
                    size={20}
                    color={COLORS.blue}
                  />
                }
                icon={
                  <MaterialIcons
                    name="g-translate"
                    size={20}
                    color={COLORS.blue}
                  />
                }
                editable={false}
                value={t("loginScreen.lang")}
              />
            </Pressable> */}
            </View>
            <CustomText
              color={COLORS.black}
              size={9}
              text={t("copyRights")}
              style={[styles.text, { marginTop: hp(2) }]}
            />
          </>
        )}
        <CustomAlert
          type={'error'}
          show={warning}
          header={t("accountScreen.w")}
          body={errmess}
          action1={() => {
            setWarning(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={styles.centeredViewAg}
              style={styles.centeredView2Ag}
            >
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setAggMore(null);
                  setAggName(null);
                  setIsSelected(false);
                }}
                style={CommonStyles.closeCont}
              >
                <AntDesign name={"closecircleo"} size={30} color={COLORS.red} />
              </TouchableOpacity>

              <CustomText
                color={COLORS.blue}
                size={18}
                text={t("agreementScreen.newAg")}
                style={styles.title}
              />
              <CustomInput
                inputRef={agRef1}
                value={aggName}
                onChangeText={setAggName}
                label={t("agreementScreen.agName")}
                placeholder={"Agreement"}
                error={aggName?.length == 0 || aggName == null}
                errorMessage={t("requiredField")}
                icon={
                  <Ionicons name="flag" size={20} color={COLORS.babyBlue2} />
                }
                containerStyle={styles.agreementName}
              />
              <CustomText
                color={COLORS.proTxt}
                size={15}
                text={t("agreementScreen.c")}
                style={styles.title2}
              />
              <SelectDropdown
                data={categoryList}
                defaultButtonText={categoryAg}
                defaultValue={categoryAg}
                renderDropdownIcon={() => {
                  return (
                    <FontAwesome5
                      name="caret-down"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  );
                }}
                buttonTextStyle={styles.dropDownBtnTxt}
                buttonStyle={styles.dropDownBtn2}
                rowStyle={styles.dropDownRow}
                rowTextStyle={styles.dropDownTxt}
                onSelect={(val, index) => {
                  setCategoryAg(val);
                  setSelectedIdAg(categoryIDs[index]);
                  console.log("cat : ", val, categoryIDs[index]);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
                // dropdownIconPosition="left"
              />
              <CustomInput
                value={aggMore}
                inputRef={agRef2}
                error={aggMore?.length == 0 || aggMore == null}
                errorMessage={t("requiredField")}
                onChangeText={setAggMore}
                label={t("agreementScreen.agDesc")}
                placeholder={t("changeRole.aggdesc")}
                containerStyle={styles.agreementDes}
                textInputStyle={styles.agreementInputDes}
                multiline={true}
              />
              {/* // add attachments */}
              <TouchableOpacity
                onPress={handleUploadِAgreementDocuments}
                style={[styles.buttonStyle, { marginTop: hp(2) }]}
              >
                <CustomText
                  color={"white"}
                  size={15}
                  text={t("agreementScreen.addAttachement")}
                />
              </TouchableOpacity>
              {agreementDocs != null && (
                <CustomText
                  // key={index}
                  color={COLORS.proTxt}
                  size={15}
                  text={agreementDocs.name}
                  style={styles.title2}
                />
              )}
              {/* // Add button */}
              <TouchableOpacity
                disabled={loadingAg}
                onPress={() => {
                  aggName == null || aggName?.length == 0
                    ? agRef1.current.focus()
                    : aggMore == null || aggMore?.length == 0
                    ? agRef2.current.focus()
                    : createAgreement();
                }} //
                style={styles.buttonStyle}
              >
                {loadingAg ? (
                  <ActivityIndicator size={"large"} color={"white"} />
                ) : (
                  <CustomText
                    color={"white"}
                    size={15}
                    text={t("agreementScreen.add")}
                  />
                )}
              </TouchableOpacity>
              {/* // cancel button */}
              {/* <TouchableOpacity
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setAggMore(null);
                  setAggName(null);
                  setIsSelected(false);
                }}
                style={[styles.buttonStyle, { backgroundColor: "white" }]}
              >
                <CustomText
                  color={"black"}
                  size={15}
                  text={t("agreementScreen.close")}
                />
              </TouchableOpacity> */}
            </ScrollView>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={termsPopUp}
          onRequestClose={() => {
            setTermsPopUp(!termsPopUp);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView
              style={styles.termsModal}
              contentContainerStyle={styles.scrollModal}
            >
              <View style={styles.termsHeader}>
                <CustomText
                  color={COLORS.blue}
                  size={20}
                  text={t("RegisterScreen.termsTitle")}
                  style={styles.text2}
                />
              </View>
              <CustomText
                color={COLORS.grey}
                size={14}
                text={t("RegisterScreen.termsText")}
                style={{ textAlign: "left" }}
              />
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  setTermsPopUp(!termsPopUp);
                }}
                textSize={12}
                text={t("RegisterScreen.agree")}
                containerStyle={styles.btn}
              />
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      <CustomAlert
        type={'error'}
        show={warningBack}
        header={t("reviewTransaction.w")}
        body={t("stackError")}
        action1={() => {
          dispatch(storeStackValue(false));
          setWarningBack(false);
          navigation.goBack();
        }}
        btn1={t("reviewTransaction.ok")}
        btn2={t("newTransactions.cancle")}
        action2={() => setWarningBack(false)}
        oneBtn={false}
      />
    </KeyboardAvoidingView>
  );
};
export default NewTransactionRoleScreen;
