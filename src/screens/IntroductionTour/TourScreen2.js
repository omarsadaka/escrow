import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import Text from "../../components/globalText";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CustomInput from "../../components/customInput";
import createStyles from "../Add/ShortEscrowStyle";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { hp, width, wp } from "../../utilis/dimensions";
import { useDispatch, useSelector } from "react-redux";
import CustomAlert from "../../components/CustomAlert";
import { TouchableOpacity } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { storeStackValue } from "../../redux/actions/user";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserActions from "../../redux/actions/user";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import SelectDropdown from "react-native-select-dropdown";
import Textarea from "react-native-textarea";
import { showMessage } from "react-native-flash-message";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import CheckBox from "react-native-check-box";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Tooltip from "react-native-walkthrough-tooltip";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Modal } from "react-native-paper";

const {height}= Dimensions.get('window')
const TourScreen2 = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const [loading, setLoading] = useState(false);
  const code = route?.params?.code;
  const email = route?.params?.email;
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);

  const [showTip, setShowTip] = useState(true);
  const scrollViewRef = useRef();
  const dispatch = useDispatch();

  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const { steperPosition } = useSelector((state) => state.user);
  const [categoryList, setCategoryList] = useState([]);
  const [category, setCategory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const ref = useRef();
  const titleRef = useRef();
  const detailsRef = useRef();
  const phoneRef = useRef();
  const [maxUploadedFile, setMaxUploadedFile] = useState(null);
  const [fileExtensions, setFileExtensions] = useState(null);
  const [maxFileSize, setMaxFileSize] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [oldDocuments, setOldDocuments] = useState([]);
  const [showChargeWarning, setShowChargeWarning] = useState(false);
  const [showDeliveryTypeWarning, setShowDeliveryTypeWarning] = useState(false);
  const [showDeliveryPeriodWarning, setShowDeliveryPeriodWarning] =
    useState(false);
  const [showInspectionTypeWarning, setShowInspectionTypeWarning] =
    useState(false);
  const [showInspectionPeriodWarning, setShowInspectionPeriodWarning] =
    useState(false);
  const [showEscrowTypeWarning, setShowEscrowTypeWarning] = useState(false);
  const [showAmountWarning, setShowAmountWarning] = useState(false);
  const [showEscrowPeriodWarning, setShowEscrowPeriodWarning] = useState(false);
  const [showTiltleWarning, setShowTitleWarning] = useState(false);
  const [showDetailsWarning, setShowDetailsWarning] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [warningBack, setWarningBack] = useState(false);
  const [valid, setValid] = useState(false);
  const draftData = [];
  const [showAgreementLoading, setShowAgreementLoading] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitLoading2, setSubmitLoading2] = useState(false);
  const lables = [
    t("shortEscrow.label1"),
    // t("shortEscrow.label2"),
    t("shortEscrow.label3"),
    t("shortEscrow.label4"),
  ];
  const [buyerOrSeller, setBuyerOrSeller] = useState(
    route?.params?.sellerOrBuyer
      ? route?.params?.sellerOrBuyer == "Seller"
        ? t("RegisterScreen.Seller")
        : t("loginScreen.buyer")
      : t("RegisterScreen.Seller")
  );
  const [deliveryPeriod, setDeliveryPeriod] = useState(
    draftData ? draftData?.delivery_confirmation : ""
  );
  const [SaudiEscrowFeePaidBy, setSaudiEscrowFeePaidBy] = useState(
     t("loginScreen.buyer")
  );
  const [deliveryType, setDeliveryType] = useState(
    t("shortEscrow.hours")
  );
  const [inspectionType, setInspectionType] = useState(
   t("shortEscrow.hours")
  );
  const [escrowType, setEscrowType] = useState(
    t("shortEscrow.hours")
  );
  const [inspectionPeriod, setInspectionPeriod] = useState("");
  const [newOrUsed, setNewOrUsed] = useState(t("shortEscrow.new"));
  const [escrowPeriod, setEscrowPeriod] = useState("");
  const IndicatorStyles = {
    currentStepStrokeWidth: 1,
    stepStrokeCurrentColor: COLORS.header,
    stepStrokeWidth: 0,
    separatorStrokeFinishedWidth: 0,
    separatorStrokeWidth: 1,
    stepStrokeFinishedColor: COLORS.header,
    stepStrokeUnFinishedColor: "green",
    separatorFinishedColor: COLORS.primary,
    separatorUnFinishedColor: COLORS.black,
    stepIndicatorFinishedColor: "white",
    stepIndicatorUnFinishedColor: "white",
    stepIndicatorCurrentColor: "white",
    stepIndicatorLabelCurrentColor: "#fe7013",
    stepIndicatorLabelFinishedColor: COLORS.header,
    stepIndicatorLabelUnFinishedColor: "#aaaaaa",
    labelColor: "#999999",
    currentStepLabelColor: "#fe7013",
  };
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
  const getStepIndicatorIconConfig = ({ stepStatus, position }) => {
    const iconConfig = {
      name: "feed",
      color:
        stepStatus === "current"
          ? COLORS.header
          : stepStatus === "finished"
            ? COLORS.header
            : COLORS.black,
      size: 16,
    };
    switch (position) {
      case 0: {
        iconConfig.name = "text-box-outline";
        break;
      }
      // case 1: {
      //   iconConfig.name = "text-box-outline";
      //   break;
      // }
      case 1: {
        iconConfig.name = "text-box-outline";
        break;
      }
      case 2: {
        iconConfig.name = "content-save";
        break;
      }

      default: {
        break;
      }
    }
    return iconConfig;
  };

  const handleFieldsValidation = (Action, checkAgg) => {
    if (amount?.length == 0 || amount == undefined) {
      setShowAmountWarning(true);
    } else if (inspectionPeriod?.length == 0 || inspectionPeriod == undefined) {
      setShowInspectionPeriodWarning(true);
    } else if (escrowPeriod?.length == 0 || escrowPeriod == undefined) {
      setShowEscrowPeriodWarning(true);
    } else if (deliveryPeriod?.length == 0 || deliveryPeriod == undefined) {
      setShowDeliveryPeriodWarning(true);
    } else if (!isSelected && checkAgg) {
      showMessage({
        message: t("shortEscrow.previewErr"),
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
    } else if (title?.length == 0 || title == undefined) {
      setShowTitleWarning(true);
    } else if (details?.length == 0 || details == undefined) {
      setShowDetailsWarning(true);
    } else {
      Action();
    }
  };
  const handlePreviewEscrow = async () => {
    setPreviewLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      amount: amount,
      shipping_cost: "0",
      discount_amount: "0",
      discount_type: "1",
      inspection_period: inspectionPeriod,
      charge_payer:
        SaudiEscrowFeePaidBy == t("newTransactions.seller") ? "1" : "2",
      charge_shipping: "1",
    };
    fetch(baseURL + ENDPOINTS2.escrowCalculation, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseData) => {
        // console.log("preview data : ", responseData);
        setPreviewLoading(false);
        if (responseData.data) {
          setPreviewData(responseData?.data);
          dispatch(UserActions.increaseStepper(steperPosition));
        } else if (responseData.messages.error) {
          showMessage({
            message:
              typeof responseData?.messages?.error == "string"
                ? responseData?.messages?.error
                : responseData?.messages?.error?.map((el, index) => `${el}\n`),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(responseData?.messages?.error);
          setWarning(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("accountScreen.err"));
        setWarning(true);
        setPreviewLoading(false);
      });
  };

  const renderStepIndicator = (params) => (
    <MaterialCommunityIcons {...getStepIndicatorIconConfig(params)} />
  );
  const handleSaveAndUpdateDraft = async () => {
    setSubmitLoading2(true);
    const token = await AsyncStorage.getItem("TOKEN");
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      ...(inspectionPeriod?.toString()?.length > 0 && {
        inspection_period: inspectionPeriod,
      }),
      inspection_period_type:
        inspectionType == t("shortEscrow.days") ? "day" : "hour",
      ...(deliveryPeriod?.toString()?.length > 0 && {
        delivery_confirmation: deliveryPeriod,
      }),
      delivery_confirmation_type:
        deliveryType == t("shortEscrow.days") ? "day" : "hour",
      ...(escrowPeriod?.toString()?.length > 0 && {
        escrow_confirmation: escrowPeriod,
      }),
      escrow_confirmation_type:
        escrowType == t("shortEscrow.days") ? "day" : "hour",

      category_id: selectedId,
      short_agreement_confirmation: isSelected == true ? 1 : 0,
      ...(draftData && { id: draftData?.id }),
      ...(amount?.length > 0 && { amount: amount }),
      ...(title?.length > 0 && { title: title }),
      ...(details?.length > 0 && { details: details }),
      ...(shortName?.length > 0 && { escrow_short_name: shortName }),
      ...(draftData && { old_attachments: oldDocuments }),
      ...(documents?.length > 0 && {
        attachments: documents?.map((el) => {
          return {
            base64: el?.base64,
            extension: `.${el?.extension.split("/").pop()}`,
          };
        }),
      }),
      charge_payer:
        SaudiEscrowFeePaidBy == t("newTransactions.seller") ? "1" : "2",
      product_condition: newOrUsed == t("shortEscrow.new") ? "new" : "used", // new or used (if category is service leave it with any value)
    };

    // console.log("obj of create and update draft", obj);
    let createDraftUrl = baseURL + ENDPOINTS2.createShortDraft;
    let updateDraftUrl = baseURL + ENDPOINTS2.updateShortDraft;
    fetch(draftData ? updateDraftUrl : createDraftUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("res of update/ creatse draft", responseData);
        setSubmitLoading2(false);
        if (responseData.messages.success) {
          // success
          dispatch(storeStackValue(false));
          navigation.navigate("TransactionAdded", {
            message: responseData.messages.success,
            draft: true,
            notDraft: false,
            escrow_data: responseData?.escrow_data,
          });
        } else if (responseData.messages.error) {
          showMessage({
            message:
              typeof responseData?.messages?.error == "string"
                ? responseData?.messages?.error
                : responseData?.messages?.error?.map((el, index) => `${el}\n`),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(responseData?.messages?.error);
          setWarning(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("accountScreen.err"));
        setWarning(true);
        setSubmitLoading2(false);
      });
  };

  const renderLabel = ({ position, label, currentPosition }) => {
    return (
      <Text
        style={
          position === currentPosition
            ? styles.stepLabelSelected
            : position > currentPosition
              ? styles.unFinishedLable
              : styles.stepLabel
        }
      >
        {label}
      </Text>
    );
  };

  const toolTip=()=>{
    return(
      <View style={{width: "100%",alignItems: "center",position:'absolute'}}
            >
              <Tooltip
                isVisible={showTip}
                // accessible={false}
                allowChildInteraction={false}
                // closeOnChildInteraction={true}
                // closeOnContentInteraction={true}
                content={
                  <View>
                    <CustomText
                        color={COLORS.black}
                        size={13}
                        text={t('introductionTour.addEscrowText2')}
                      />
                     
                  </View>
                }
                onClose={() => { 
                  navigation.replace('TourScreen3')
                }}
                placement='bottom'
                // childrenWrapperStyle={{ width: "100%", }}
                tooltipStyle={{marginTop: height*0.3}}
                // below is for the status bar of react navigation bar
                topAdjustment={0}
                contentStyle={{width:'100%', paddingVertical:10, justifyContent:'center'}}
               >
                  {showTip?
                  <TouchableOpacity onPress={()=> {}}>
                   <MaterialCommunityIcons
                   name={i18n.language=='ar'?"arrow-left-circle": "arrow-right-circle"}
                   size={wp(20)}
                   color={"#DDE3E8"} style={{position:'absolute'}}/>
                   <CircularProgressBase
                   value={20}
                   maxValue={60}
                   radius={40}
                   title=""
                   showProgressValue={false}
                   activeStrokeColor={'#007598'}
                   inActiveStrokeColor={'#788995'} />
                   </TouchableOpacity>
                  :null}
              </Tooltip>
            </View>
    )
  }
  const controlBtn=()=>{
    return(
    <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
    onPress={()=> navigation.replace('TourScreen3')}>
      <MaterialCommunityIcons
      name={i18n.language=='ar'?"arrow-left-bold": "arrow-right-bold"}
      size={wp(16)}
      color={COLORS.blue} style={{position:'absolute'}}/>
      <CircularProgressBase
      value={20}
      maxValue={60}
      radius={40}
      title=""
      showProgressValue={false}
      activeStrokeColor={COLORS.blue}
      inActiveStrokeColor={'#788995'} />
    </TouchableOpacity>
    )
  }
  const content=()=>{
    return(
    <Modal
    animationType='fade'
    transparent={true}
    visible={true}
    onRequestClose={() => {
      setVisible(false);
    }}
  >
    <View style={styles.modelContainer}>
      {controlBtn()}
    <View style={styles.contentContainer}> 
    <CustomText
          color={COLORS.white}
          size={12}
          text={t('introductionTour.addEscrowText2')}
        />
    </View> 
    <Ionicons name={"caret-down-outline"} size={wp(10)} color={COLORS.blue} style={{marginTop:-height*0.022}}/>    
    </View>
  </Modal>
    )
  }


  return (
    <View style={{ height:'100%',backgroundColor: COLORS.white}}>
      <ChangeLanguageModal
        show={modalVisible1}
        setShow={setModalVisible1}
        handleLang={handleLang}
      />
     
     <View style={{ height: height*0.8 }}>
        <CustomText
          color={COLORS.black}
          size={16}
          text={t("shortEscrow.header")}
          containerStyle={styles.head}
        />
        <View style={styles.stepIndicator}>
          <StepIndicator
            stepCount={3}
            customStyles={IndicatorStyles}
            currentPosition={steperPosition}
            renderStepIndicator={renderStepIndicator}
            renderLabel={renderLabel}
            labels={lables}
          />
        </View>
        {steperPosition == 0 && (
          <>
            {loading ? (
              <ActivityIndicator size={"large"} color={COLORS.header} />
            ) : (
              <View style={styles.formWrapper}>
                  <View style={{ width: '100%' }}>
                    <View style={styles.dropdownCont}>
                      <CustomText
                        containerStyle={{ marginLeft: wp(2) }}
                        color={COLORS.lightGrey}
                        size={14}
                        text={t("RegisterScreen.iam")}
                      />
                      <SelectDropdown
                        data={[
                          t("RegisterScreen.Seller"),
                          t("loginScreen.buyer"),
                        ]}
                        defaultButtonText={buyerOrSeller}
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
                          setBuyerOrSeller(val);
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
                    <View style={styles.dropdownCont}>
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
                          // console.log("name id : ", val, categoryIDs[index]);
                          setCategory(val);
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
                    {selectedId != 3 && (
                      <View style={styles.dropdownCont}>
                        <CustomText
                          containerStyle={{ marginLeft: wp(2) }}
                          color={COLORS.lightGrey}
                          size={14}
                          text={t("shortEscrow.type")}
                        />
                        <SelectDropdown
                          data={[t("shortEscrow.new"), t("shortEscrow.used")]}
                          defaultButtonText={newOrUsed}
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
                            setNewOrUsed(val);
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
                    )}
                    <CustomInput
                      label={t("changeRole.title")}
                      placeholder={t("changeRole.tp")}
                      value={title}
                      onChangeText={setTitle}
                      // error={title.length ? false : true}
                      // errorMessage={t("requiredField")}
                      inputRef={titleRef}
                      icon={
                        <FontAwesome5
                          name="money-bill-wave-alt"
                          size={15}
                          color={COLORS.babyBlue2}
                        />
                      }
                      containerStyle={styles.textInputContainer}
                    />

                    <CustomText
                      color={COLORS.lightGrey}
                      size={13}
                      style={{ textAlign: "left", width: "97%" }}
                    >
                      {t("changeRole.details")}
                    </CustomText>
                    <Textarea
                      // required={true}
                      inputRef={detailsRef}
                      ref={detailsRef}
                      style={{
                        fontFamily: "BahijTheSansArabic-Plain",
                        textAlign:i18n.language=='ar'?'right': 'left',
                        color: COLORS.black,
                        height:'100%',
                        textAlignVertical:'top'
                      }}
                      containerStyle={[
                        styles.textareaContainer,
                        { borderColor: COLORS.header },
                      ]}
                      onChangeText={(val) => setDetails(val)}
                      maxLength={200}
                      placeholder={t("changeRole.dp")}
                      placeholderTextColor={"#c7c7c7"}
                      underlineColorAndroid={"transparent"}
                      value={details}
                    />
                    {/* {!details && (
                    <CustomText
                      color={COLORS.red}
                      size={13}
                      style={{ textAlign: "left", width: "76%" }}
                    >
                      {t("requiredField")}
                    </CustomText>
                  )} */}
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
                      onPress={() => {}}
                      textSize={12}
                      text={t("shortEscrow.upload")}
                      containerStyle={{
                        width: "40%",
                        alignSelf: "center",
                        marginVertical: hp(1),
                      }}
                    />
                    <CustomText color={COLORS.header} size={15} style={{ flex: 1, textAlign: 'left' }}>
                      {t("shortEscrow.attachedFiles")}
                    </CustomText>
                    {oldDocuments.length > 0 &&
                      oldDocuments.map((el, index) => (
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
                            text={
                              t("transDetailsScreen.attachment") + (index + 1)
                            }
                          />
                          <Entypo
                            onPress={() => {
                              const oldArr = oldDocuments.filter(
                                (ob) => ob != el
                              );
                              setOldDocuments(oldArr);
                            }}
                            name={"trash"}
                            size={20}
                            color={COLORS.red}
                          />
                        </View>
                      ))}
                    {documents.length > 0 &&
                      documents.map((el, index) => (
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
                              const arr = documents.filter(
                                (ob) => ob.name != el.name
                              );
                              setDocuments(arr);
                            }}
                            name={"trash"}
                            size={20}
                            color={COLORS.red}
                          />
                        </View>
                      ))}

                    {documents?.length == 0 && oldDocuments.length == 0 && (
                      <CustomText
                        color={COLORS.header}
                        size={16}
                        text={t("profileScreens.noDoc")}
                        style={{ flex: 1, textAlign: 'left' }}
                      />
                    )}
                  </View>
                <CustomButton
                  color={COLORS.blue}
                  onPress={() => {
                    dispatch(UserActions.increaseStepper(steperPosition));
                  }}
                  textSize={14}
                  text={t("shortEscrow.next")}
                  containerStyle={{
                    width: "80%",
                    alignSelf: "center",
                    marginTop: hp(1),
                  }}
                />
              </View>
            )}
          </>
        )}
        {steperPosition == 1 && (
          <>
            <ScrollView style={[styles.formWrapper]}>
              <View style={{ width: '100%', height: '100%' }}>
                <CustomInput
                  label={t("RegisterScreen.Amount")}
                  placeholder={t('AmountReq')}
                  value={amount}
                  onChangeText={setAmount}
                  error={!valid}
                  errorMessage={t("RegisterScreen.err")}
                  keyboardType="numeric"
                  inputRef={ref}
                  obBluer={true}
                  // bluerFun={() => {
                  //   setShowCharge(true);
                  // }}
                  icon={
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.babyBlue2}
                    />
                  }
                  containerStyle={styles.textInputContainer}
                />
                {/* <CustomInput
                editable={false}
                label={t("transDetailsScreen.charge")}
                value={chargeAmount}
                icon={
                  <FontAwesome5
                    name="money-bill-wave-alt"
                    size={15}
                    color={COLORS.babyBlue2}
                  />
                }
                containerStyle={styles.textInputContainer}
              /> */}
                <View style={styles.dropdownCont}>
                  <CustomText
                    containerStyle={{ marginLeft: wp(2) }}
                    color={COLORS.lightGrey}
                    size={14}
                    text={t("shortEscrow.inspectionType")}
                  />
                  <SelectDropdown
                    data={[
                      t("shortEscrow.fawry"),
                      t("shortEscrow.hours"),
                      t("shortEscrow.days"),
                    ]}
                    defaultButtonText={inspectionType ? inspectionType : " "}
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
                      setInspectionType(val);
                      if (val == t("shortEscrow.fawry")) {
                        setInspectionPeriod("2");
                      } else {
                        setInspectionPeriod("");
                      }
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                {(inspectionType == t("shortEscrow.hours") ||
                  inspectionType == t("shortEscrow.days")) && (
                    <>
                      <View style={styles.dropdownCont}>
                        <CustomText
                          containerStyle={{ marginLeft: wp(2) }}
                          color={COLORS.lightGrey}
                          size={14}
                          text={t("shortEscrow.inspectionPeriod")}
                        />
                        <SelectDropdown
                          data={
                            inspectionType == t("shortEscrow.hours")
                              ? [
                                3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                                17, 18, 19, 20, 21, 22, 23,
                              ]
                              : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                          }
                          defaultButtonText={
                            inspectionPeriod ? inspectionPeriod : " "
                          }
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
                            setInspectionPeriod(val);
                          }}
                          buttonTextAfterSelection={(selectedItem, index) => {
                            return inspectionPeriod;
                          }}
                          rowTextForSelection={(item, index) => {
                            return item;
                          }}
                        />
                      </View>
                    </>
                  )}

                <View style={styles.dropdownCont}>
                  <CustomText
                    containerStyle={{ marginLeft: wp(2) }}
                    color={COLORS.lightGrey}
                    size={14}
                    text={t("shortEscrow.deliveryType")}
                  />
                  <SelectDropdown
                    data={[
                      t("shortEscrow.fawry"),
                      t("shortEscrow.hours"),
                      t("shortEscrow.days"),
                    ]}
                    defaultButtonText={deliveryType ? deliveryType : " "}
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
                      setDeliveryType(val);
                      if (val == t("shortEscrow.fawry")) {
                        setDeliveryPeriod("2");
                      } else {
                        setDeliveryPeriod("");
                      }
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
                {(deliveryType == t("shortEscrow.hours") ||
                  deliveryType == t("shortEscrow.days")) && (
                    <View style={styles.dropdownCont}>
                      <CustomText
                        containerStyle={{ marginLeft: wp(2) }}
                        color={COLORS.lightGrey}
                        size={14}
                        text={t("shortEscrow.deliveryPeriod")}
                      />
                      <SelectDropdown
                        data={
                          deliveryType == t("shortEscrow.hours")
                            ? [
                              3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                              18, 19, 20, 21, 22, 23,
                            ]
                            : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                        }
                        defaultButtonText={deliveryPeriod ? deliveryPeriod : " "}
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
                          setDeliveryPeriod(val);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return deliveryPeriod;
                        }}
                        rowTextForSelection={(item, index) => {
                          return item;
                        }}
                      />
                    </View>
                  )}
                


              {/* <CustomInput
                label={t("shortEscrow.shortName")}
                // placeholder={t("changeRole.tp")}
                value={shortName}
                onChangeText={setShortName}
                // error={shortName.length ? false : true}
                // errorMessage={t("requiredField")}
                inputRef={shortNameRef}
                icon={
                  <FontAwesome5
                    name="money-bill-wave-alt"
                    size={15}
                    color={COLORS.babyBlue2}
                  />
                }
                containerStyle={styles.textInputContainer}
              /> */}
              <View style={styles.dropdownCont}>
                <CustomText
                  containerStyle={{ marginLeft: wp(2) }}
                  color={COLORS.lightGrey}
                  size={14}
                  text={t("shortEscrow.escrowType")}
                />
                <SelectDropdown
                  data={[
                    t("shortEscrow.fawry"),
                    t("shortEscrow.hours"),
                    t("shortEscrow.days"),
                  ]}
                  defaultButtonText={escrowType ? escrowType : " "}
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
                    setEscrowType(val);
                    if (val == t("shortEscrow.fawry")) {
                      setEscrowPeriod("2");
                    } else {
                      setEscrowPeriod("");
                    }
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
              {(escrowType == t("shortEscrow.hours") ||
                escrowType == t("shortEscrow.days")) && (
                  <View style={styles.dropdownCont}>
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("shortEscrow.escrowcon")}
                    />
                    <SelectDropdown
                      data={
                        escrowType == t("shortEscrow.hours")
                          ? [
                            3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17,
                            18, 19, 20, 21, 22, 23,
                          ]
                          : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
                      }
                      defaultButtonText={escrowPeriod ? escrowPeriod : " "}
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
                        setEscrowPeriod(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return escrowPeriod;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                  </View>
                )}
                {/* {buyerOrSeller == t("loginScreen.buyer") && ( */}
                <View style={styles.dropdownCont}>
                  <CustomText
                    containerStyle={{ marginLeft: wp(2) }}
                    color={COLORS.lightGrey}
                    size={14}
                    text={t("newTransactions.SaudiEscrowFeePaidBy")}
                  />

                  <SelectDropdown
                    data={[
                      t("newTransactions.buyer"),
                      t("newTransactions.seller"),
                    ]}
                    defaultButtonText={
                      SaudiEscrowFeePaidBy ? SaudiEscrowFeePaidBy : " "
                    }
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
                      setSaudiEscrowFeePaidBy(val);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                {/* )} */}
            

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  disabled={showAgreementLoading}
                  onPress={() => {
                    handleFieldsValidation(handleGetAgreement, false);
                  }}
                >
                  {showAgreementLoading ? (
                    <ActivityIndicator color={COLORS.header} />
                  ) : (
                    <CustomText
                      color={COLORS.header}
                      size={14}
                      text={t("shortEscrow.previewAgg")}
                      style={styles.accordionTitle}
                    />
                  )}
                </TouchableOpacity>
              </View>
              <CheckBox
                style={styles.checkBox}
                isChecked={isSelected}
                onClick={() => {
                  setIsSelected(!isSelected);
                }}
                rightText={t("shortEscrow.agg")}
                checkBoxColor={COLORS.black}
                rightTextStyle={{
                  color: COLORS.black,
                  fontFamily: "Nunito-Regular",
                }}
              />

              
              </View>
            </ScrollView>
            <View style={styles.btnContainer}>
                <CustomButton
                  loading={previewLoading}
                  disabled={previewLoading}
                  color={COLORS.blue}
                  onPress={() => {}}
                  textSize={14}
                  text={t("shortEscrow.submitAndReview")}
                  containerStyle={{ width: wp(25) }}
                />
                <CustomButton
                  loading={submitLoading2}
                  disabled={submitLoading2}
                  color={COLORS.blue}
                  onPress={()=>{}}
                  textSize={14}
                  text={
                    draftData
                      ? t("shortEscrow.updateDraft")
                      : t("shortEscrow.draft")
                  }
                  containerStyle={{ width: wp(25) }}
                />
                <CustomButton
                  color={COLORS.transactionsTitle}
                  onPress={() => {
                    dispatch(UserActions.decreaseStepper(steperPosition));
                  }}
                  textSize={14}
                  textColor={COLORS.black}
                  text={t("shortEscrow.back")}
                  containerStyle={{ width: wp(25) }}
                />

            </View>

          </>
        )}
        {/* {steperPosition == 2 && (
          <> */}

        {/* )} */}
        {steperPosition == 2 && (
          <>
            <ScrollView style={[styles.formWrapper]} contentContainerStyle={{}}>
              <View style={{ width: '100%', height: '100%' }}>
                <View style={{ alignSelf: "flex-start" }}>
                  <CustomPhoneInputFinal
                    valueToStore={phone}
                    inputRef={phoneRef}
                    setIsValid={setValidPhone}
                    onChangeText={setPhone}
                    showContacts={true}
                    placeholder={draftData && phone}
                    draft={true}
                    userPhone={userPhone}
                    showQRCode={true}
                  />
                </View>
                <Collapse>
                  <CollapseHeader style={styles.accordionHeaderCont}>
                    <CustomText
                      color={COLORS.header}
                      size={15}
                      text={t("shortEscrow.prev")}
                      style={styles.accordionFinalTitle}
                    />
                    <MaterialIcons
                      // style={{ width: wp(5) }}
                      name="arrow-drop-down"
                      size={30}
                      color={COLORS.header}
                    />
                  </CollapseHeader>
                  <CollapseBody>
                    {/* escrow type buying selling */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("shortEscrow.transactionType")}
                          style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={buyerOrSeller}
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                    {/* Amount */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("shortEscrow.enteredAmount")}
                          style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={
                            previewData?.escrow_amount +
                            t("reviewTransaction.sar")
                          }
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                    {/* charge payer */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("transDetailsScreen.chargePayer")}
                          style={styles.accordionTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={
                            SaudiEscrowFeePaidBy
                              ? SaudiEscrowFeePaidBy
                              : t("newTransactions.seller")
                          }
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                    {/* charge */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("transDetailsScreen.charge")}
                          style={styles.accordionTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={previewData?.charge + t("reviewTransaction.sar")}
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                    {/* vat Amount */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("transDetailsScreen.vatAmount")}
                          style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={
                            previewData?.vat_amount + t("reviewTransaction.sar")
                          }
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                    {previewData?.extended_vat != 0 && (
                      <>
                        {/* vat extended percentage */}
                        <View style={styles.transactionInfo2}>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={t("transDetailsScreen.extended")}
                              style={styles.accordionFinalTitle}
                            />
                          </View>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={previewData?.extended_vat_precentage}
                              style={styles.accordionTitle}
                            />
                          </View>
                        </View>
                        {/* vat extended Amount */}
                        <View style={styles.transactionInfo2}>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={t("transDetailsScreen.extendedamount")}
                              style={styles.accordionFinalTitle}
                            />
                          </View>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={
                                previewData?.extended_vat +
                                t("reviewTransaction.sar")
                              }
                              style={styles.accordionTitle}
                            />
                          </View>
                        </View>
                      </>
                    )}
                    {/* total Amount with vats*/}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          data
                          text={t("transDetailsScreen.tot1")}
                          style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={
                            previewData?.payed_amount + t("reviewTransaction.sar")
                          }
                          style={styles.accordionTitle}
                        />
                      </View>
                    </View>
                  </CollapseBody>
                </Collapse>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    disabled={showAgreementLoading}
                    onPress={() => {
                      validPhone
                        ? handleGetAgreement()
                        : phoneRef?.current?.focus();
                    }}
                  >
                    {showAgreementLoading ? (
                      <ActivityIndicator color={COLORS.header} />
                    ) : (
                      <CustomText
                        color={COLORS.header}
                        size={14}
                        text={t("shortEscrow.previewAgg")}
                        style={styles.accordionTitle}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
            <View style={styles.btnContainer}>
              <CustomButton
                loading={submitLoading}
                disabled={submitLoading}
                color={COLORS.blue}
                onPress={() => {
                  validPhone
                    ? handleSubmitShortEscrow()
                    : phoneRef.current.focus();
                }}
                textSize={14}
                text={t("shortEscrow.submit")}
                containerStyle={{ width: wp(40) }}
              />
              <CustomButton
                color={COLORS.transactionsTitle}
                onPress={() => {
                  dispatch(UserActions.decreaseStepper(steperPosition));
                }}
                textSize={14}
                textColor={COLORS.black}
                text={t("shortEscrow.back")}
                containerStyle={{ width: wp(40) }}
              />
            </View>
          </>
        )}

        <CustomAlert
          type={'error'}
          show={warning}
          header={"kk"}
          body={errmess}
          action1={() => {
            setWarning(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showChargeWarning}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.chargeWarning")}
          action1={() => {
            setShowChargeWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showDeliveryTypeWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwar")}
          action1={() => {
            setShowDeliveryTypeWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showDeliveryPeriodWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwarperiod")}
          action1={() => {
            setShowDeliveryPeriodWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showInspectionTypeWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwarIns")}
          action1={() => {
            setShowInspectionTypeWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showInspectionPeriodWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwarInsperiod")}
          action1={() => {
            setShowInspectionPeriodWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showAmountWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.amountWarr")}
          action1={() => {
            setShowAmountWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showEscrowTypeWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwarescrow")}
          action1={() => {
            setShowEscrowTypeWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showEscrowPeriodWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.typwwarescrowperiod")}
          action1={() => {
            setShowEscrowPeriodWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
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
        <CustomAlert
          type={'error'}
          show={showTiltleWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.titleWarr")}
          action1={() => {
            setShowTitleWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={showDetailsWarning}
          header={t("reviewTransaction.w")}
          body={t("shortEscrow.detailsWarr")}
          action1={() => {
            setShowDetailsWarning(false);
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
      </View>
     
      {/* {toolTip()} */}
      {content()}
    <View style={styles.iconBg}> 
            <View style={{alignItems:'center'}}>
             <MaterialCommunityIcons
                name="home-variant-outline"
                size={33}
                color={COLORS.footerIcon}
              />  
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("home")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
                <EvilIcons
                name="user"
                size={40}
                color={ COLORS.footerIcon}
              />
               <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("profile")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
              <View style={styles.homeCon}>
              <View style={[styles.home,{backgroundColor: COLORS.blue}]}>
              <FontAwesome
                name="plus"
                size={30}
                color={ COLORS.white}
              />   
              </View>
              </View>
              <CustomText
                  color={COLORS.blue}
                  size={width*0.022}
                  text={t("add")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
             <Ionicons
                name="settings-outline"
                size={26}
                color={ COLORS.footerIcon}
              /> 
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("setting")}
                  style={styles.statisticsTxt}
                />  
            </View>
            <View style={{alignItems:'center'}}>
             <EvilIcons
                name="navicon"
                size={30}
                color={ COLORS.footerIcon}
              />   
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("more")}
                  style={styles.statisticsTxt}
                />
            </View>    
    </View>
    </View>
  );
};
export default TourScreen2;
