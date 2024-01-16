import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Dimensions,
  Pressable,
  TextInput,
  BackHandler,
  Image,
  PermissionsAndroid,
  FlatList
} from "react-native";
import Text from "../../components/globalText";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomInput from "../../components/customInput";
import createStyles from "./ShortEscrowStyle";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../../components/customHeader";
import { height, hp, width, wp } from "../../utilis/dimensions";
import { useDispatch, useSelector } from "react-redux";
import CustomAlert from "../../components/CustomAlert";
import { TouchableOpacity } from "react-native";
import StepIndicator from "react-native-step-indicator";
import { storeStackValue , handleLogoutValue} from "../../redux/actions/user";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as UserActions from "../../redux/actions/user";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";
import AntDesign from "react-native-vector-icons/AntDesign";
import Textarea from "react-native-textarea";
import { showMessage } from "react-native-flash-message";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import { getGeneralSettings } from "../../utilis/apis";
import { showSimpleModal } from "../../redux/actions/modal";
import RNFetchBlob from "rn-fetch-blob";
import CheckBox from "react-native-check-box";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import Feather from "react-native-vector-icons/Feather";
import RBSheet from "react-native-raw-bottom-sheet";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import SlideToConfirm from 'rn-slide-to-confirm';
import ImageView from "react-native-image-viewing";
import moment from "moment";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import RNFS from "react-native-fs";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import FastImage from "react-native-fast-image";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { startTransition } from "react";
import * as Authentication from "../../redux/actions/authentication";


const HoursArr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23,
];
const DaysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const ShortEscrow = ({ navigation, route }) => {
  const draftData = route?.params?.draftData;
  const numberFromContact= route?.params?.Phone
  const { steperPosition, saveDraftValue, saveDraftWhere, saveDraftEnded } =
    useSelector((state) => state.user);
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const RBSheetRef1 = useRef({});
  const RBSheetRef2 = useRef({});
  const RBSheetRef3 = useRef({});
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [payMethods, setPayMethods] = useState([]);
  const [amount, setAmount] = useState(
    draftData
      ? draftData?.escrow_amount.toString() != 0
        ? draftData?.escrow_amount.toString()
        : ""
      : ""
  );
  const [title, setTitle] = useState(draftData ? draftData?.title : "");
  const [details, setDetails] = useState(draftData ? draftData?.details : "");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [slideState, setSlideState] = useState(false);
  const [valid, setValid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(
    draftData
      ? i18n.language == "ar"
        ? draftData?.category?.name_ar
        : draftData?.category?.name_en
      : ""
  );
  const [buyerOrSeller, setBuyerOrSeller] = useState(
    route?.params?.UserType?route?.params?.UserType:t("shortEscrow.buyer")
  );
  const [newOrUsed, setNewOrUsed] = useState(
    draftData
      ? draftData?.product_condition == "new"
        ? i18n.language == "ar"
          ? "جديد"
          : "New"
        : draftData?.product_condition == "used"
        ? i18n.language == "ar"
          ? "مستعمل"
          : "Used"
        : t("shortEscrow.new")
      : t("shortEscrow.new")
  );
  const [isSelected, setIsSelected] = useState(
    draftData
      ? draftData?.short_agreement_confirmation == 1
        ? true
        : false
      : false
  );
  const [disableNext, setDisableNext] = useState(false);
  const [warningBack, setWarningBack] = useState(false);
  const [inspectionPeriod, setInspectionPeriod] = useState(
    draftData ? draftData?.inspection_period : ""
  );
  const [deliveryPeriod, setDeliveryPeriod] = useState(
    draftData ? draftData?.delivery_confirmation : ""
  );

  const [inspectionLabel, setInspectionLabel] = useState(
    draftData?.inspection_period_type == "day"
      ? t("shortEscrow.day")
      : draftData?.inspection_period_type == "hour"
      ? t("shortEscrow.hour")
      : draftData?.inspection_period_type == "minutes"
      ? t("shortEscrow.min")
      : ""
  );
  const [deliveryLabel, setDeliveryLabel] = useState(
    draftData?.delivery_confirmation_type == "day"
      ? t("shortEscrow.day")
      : draftData?.delivery_confirmation_type == "hour"
      ? t("shortEscrow.hour")
      : draftData?.delivery_confirmation_type == "minutes"
      ? t("shortEscrow.min")
      : ""
  );

  const [SaudiEscrowFeePaidBy, setSaudiEscrowFeePaidBy] = useState("");
  const [deliveryType, setDeliveryType] = useState(
    draftData?.delivery_confirmation_type == "day"
      ? t("shortEscrow.days")
      : draftData?.delivery_confirmation_type == "hour"
      ? t("shortEscrow.hours")
      : t("shortEscrow.fawry")
  );
  const [inspectionType, setInspectionType] = useState(
    draftData?.inspection_period_type == "day"
      ? t("shortEscrow.days")
      : draftData?.inspection_period_type == "hour"
      ? t("shortEscrow.hours")
      : t("shortEscrow.fawry")
  );
  const [escrowType, setEscrowType] = useState(
    draftData?.escrow_confirmation_type == "day"
      ? t("shortEscrow.days")
      : draftData?.escrow_confirmation_type == "hour"
      ? t("shortEscrow.hours")
      : t("shortEscrow.fawry")
  );
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
  const [phone, setPhone] = useState(
    draftData
      ? draftData?.invitation_mail?.startsWith("966")
        ? draftData?.invitation_mail?.split("966")[1]
        : draftData?.invitation_mail
      : numberFromContact ? numberFromContact : ""
  );
  const [validPhone, setValidPhone] = useState(false);
  const [escrowPeriod, setEscrowPeriod] = useState(
    draftData ? draftData?.escrow_confirmation : ""
  );
  const [shortName, setShortName] = useState(
    draftData ? draftData?.escrow_short_name : ""
  );
  const [escrowPeriodLabel, setEscrowPeriodLabel] = useState(
    draftData?.escrow_confirmation_type == "day"
      ? t("shortEscrow.day")
      : draftData?.escrow_confirmation_type == "hour"
      ? t("shortEscrow.hour")
      : draftData?.escrow_confirmation_type == "minutes"
      ? t("shortEscrow.min")
      : ""
  );
  const [maxUploadedFile, setMaxUploadedFile] = useState(null);
  const [fileExtensions, setFileExtensions] = useState(null);
  const [maxFileSize, setMaxFileSize] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [oldDocuments, setOldDocuments] = useState(
    draftData && draftData.attachments.length > 0 ? draftData.attachments : []
  );
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitLoading2, setSubmitLoading2] = useState(false);
  const [showAgreementLoading, setShowAgreementLoading] = useState(false);
  const ref = useRef();
  const titleRef = useRef();
  const shortNameRef = useRef();
  const detailsRef = useRef();
  const phoneRef = useRef();
  const scrollRef = useRef();
  const [userPhone, setUserPhone] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [viewImage, setViewImage] = useState(false);
  const [imageObj, setImageObj] = useState(null);
  const [imageList, setImageList] = useState([]);

  const getUserPhone = async () => {
    const userData = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    const userData2 = JSON.parse(userData);
    setUserPhone(userData2?.mobile?.substr(3));
  };

  useEffect(() => {
    const backAction = async () => {
      setWarningBack(true);
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    if (saveDraftEnded && saveDraftWhere == "shortBack") {
      dispatch(storeStackValue(false));
      setWarningBack(false);
      navigation.goBack();
      dispatch(UserActions.handleSaveAsDraftWhere(""));
      dispatch(UserActions.handleSaveAsDraftEnded(false));
      dispatch(UserActions.handleSaveAsDraftValue(false));
    }
  }, [saveDraftEnded]);
  useEffect(() => {
    getUserPhone();
  }, [navigation]);
  const handleAllowedFiles = (docs) => {
    if (documents.length + oldDocuments.length == maxUploadedFile) {
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header:
              i18n.language == "ar" ? "حدث خطأ ما" : "something went wrong",
            message: ` ${t("maxUploadFiles")} : ${maxUploadedFile} `,
            action: "",
            type: "error",
          },
        })
      );
      return false;
    } else if (documents.length + oldDocuments.length > maxUploadedFile) {
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header:
              i18n.language == "ar" ? "حدث خطأ ما" : "something went wrong",
            message: ` ${t("maxUploadFiles")} : ${maxUploadedFile} `,
            action: "",
            type: "error",
          },
        })
      );
      const newArr = documents.splice(-1);
      // console.log("documents", documents.length);
      const filteredAttachments = documents.filter(
        (el) => el.name != newArr[0].name
      );
      setDocuments(filteredAttachments);
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
    documents &&
      oldDocuments &&
      maxUploadedFile &&
      documents.length + oldDocuments.length > maxUploadedFile &&
      handleAllowedFiles();
  }, [documents]);

  const handleFieldsValidation = (Action, checkAgg) => {
    if (amount?.length == 0 || amount == undefined) {
      setShowAmountWarning(true);
    } else if (inspectionPeriod?.length == 0 || inspectionPeriod == undefined) {
      setShowInspectionPeriodWarning(true);
    }
    // else if (escrowPeriod?.length == 0 || escrowPeriod == undefined) {
    //   setShowEscrowPeriodWarning(true);

    // }
    else if (deliveryPeriod?.length == 0 || deliveryPeriod == undefined) {
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
  const handleUploadDocuments = () => {
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
                type: "error",
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
                    type: "error",
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
                      type: "error",
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
                  flag && setDocuments([...documents, ...docs]);
                });
              }
            }
          });
        }
      }
    });
  };

  const handleGetAgreement = async () => {
    // console.log("in get agreement...");
    setShowAgreementLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      buyer_number: "966" + phone,
      title: title,
      details: details,
      amount: amount,
      charge_payer: "1",
      ...(buyerOrSeller == t("RegisterScreen.Seller") && {
        payment_type: SaudiEscrowFeePaidBy,
      }),

      inspection_period: inspectionPeriod,
      inspection_period_type:
        inspectionType == t("shortEscrow.days")
          ? "day"
          : inspectionType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",
      delivery_confirmation: deliveryPeriod,
      delivery_confirmation_type:
        deliveryType == t("shortEscrow.days")
          ? "day"
          : deliveryType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",
      escrow_confirmation: escrowPeriod ? escrowPeriod : 0,
      escrow_confirmation_type:
        escrowType == t("shortEscrow.days")
          ? "day"
          : escrowType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",
      device_info: deviceInfo    
    };
    // console.log("obj : ", obj);
    fetch(baseURL + ENDPOINTS2.previewAgreementShortEscrow, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setShowAgreementLoading(false);
        console.log("preview Agreement : ", responseData);
        if (responseData.url) {
          navigation.navigate("PDF", { link: responseData.url });
        } else {
          setErrMess(responseData?.messages?.error);
          setWarning(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("accountScreen.err"));
        setWarning(true);
        setShowAgreementLoading(false);
      });
  };
  const getCategories = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.categoryList,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language,
      },
    })
      .then(async (res) => {
        // console.log("cat ", res);
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

          await AsyncStorage.setItem(
            "PaymentMethodsSeller",
            JSON.stringify(res?.data.payments)
          );
          setCategoryList(catNames);
          setCategoryIDs(catIds);
          setCategoryImages(catImages);
          !draftData && setCategory(catNames[0]);
          setSelectedId(catIds[0]);

          if (res?.data.payments && res?.data.payments.length > 0) {
            setPayMethods(res?.data.payments);
            !draftData
              ? setSaudiEscrowFeePaidBy(res?.data.payments[0].value)
              : draftData?.payment_method
              ? setSaudiEscrowFeePaidBy(draftData?.payment_method.value)
              : setSaudiEscrowFeePaidBy(res?.data.payments[0].value);
          }
          setLoading(false);
        } else {
          setDisableNext(true);
          setErrMess(res?.data?.messages?.error);
          setCategory("");
          setLoading(false);
          // setWarning(true);
          handleLogout()
        }
      })
      .catch((er) => {
        setErrMess(t("accountScreen.err"));
        setCategory("");
        // setWarning(true);
        console.log("er : ");
        setLoading(false);
        handleLogout()
      });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("CUSTOMER_ID");
    await AsyncStorage.removeItem("USER_PIN");
    await AsyncStorage.removeItem("USER_PIN_VALUE");
    await AsyncStorage.removeItem("ChangeLang");
    await AsyncStorage.removeItem("AUTHLANG");
    await AsyncStorage.removeItem("TOKEN");
    await AsyncStorage.removeItem("NAVIGATION_STATE_TIME");
    // await AsyncStorage.removeItem("CUSTOMER_LOGIN");
    await AsyncStorage.removeItem("API_LANGUAGE");
    // await AsyncStorage.removeItem("CUSTOMER_OBJECT");
    dispatch(storeStackValue(false));
    dispatch(handleLogoutValue(true));
    dispatch(Authentication.logOut());
    showMessage({
      message: t("sideMenu.signOutSuccessfully"),
      type: "success",
      titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
    });
  };

  useEffect(() => {
    if (!baseURL) return;
    getGeneralSettings(baseURL).then((res) => {
      setMaxUploadedFile(res?.max_uploaded_file);
      let arr = res?.allowed_exec.replace(/","/g, "").split('"');
      setMaxFileSize(res?.max_attach_size);
      setFileExtensions(arr[1].split(".").filter((el) => el != ""));
    });
    getCategories();
  }, [navigation, baseURL]);

  useEffect(() => {
    const val = parseInt(amount);
    if (amount.length != 0) {
      if (val >= 50 && val <= 2000) {
        setValid(true);
      } else {
        setValid(false);
      }
    } else {
      setValid(true); //not required for draft purpose
    }
  }, [amount]);
  useEffect(() => {
    saveDraftValue && handleSaveAndUpdateDraft();
  }, [saveDraftValue]);

 

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
  const lables = [
    t("shortEscrow.label1"),
    // t("shortEscrow.label2"),
    t("shortEscrow.label3"),
    t("shortEscrow.label4"),
  ];
  const getStepIndicatorIconConfig = ({ stepStatus, position }) => {
    const iconConfig = {
      name: "feed",
      color:
        stepStatus === "current"
          ? COLORS.header
          : stepStatus === "finished"
          ? COLORS.header
          : COLORS.gray,
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
  const renderStepIndicator = (params) => (
    <MaterialCommunityIcons {...getStepIndicatorIconConfig(params)} />
  );
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

  const stepperView=()=>{
    return(
      <View style={{width:'95%',alignSelf:'center',flexDirection:'row'}}>
      <CircularProgressBase
      value={steperPosition==0?1:steperPosition==1?2:3}
      maxValue={3}
      radius={30}
      title=""
      showProgressValue={true}
      activeStrokeColor={COLORS.blue}
      inActiveStrokeColor={COLORS.lightGrey} />
      <View style={{alignItems:'flex-start',marginHorizontal:wp(2)}}>
        <CustomText
              color={COLORS.black}
              size={17}
              text={steperPosition==0? t("shortEscrow.label1"):steperPosition==1? t("shortEscrow.label3"): t("shortEscrow.label4")}
            />  
        <CustomText
            color={COLORS.lightGrey}
            size={15}
            text={steperPosition==0? t("shortEscrow.stay1"):steperPosition==1? t("shortEscrow.stay2"): t("shortEscrow.stay3")}
            
          />
      </View>
      </View>
    )
  }

  const handlePreviewEscrow = async () => {
    setPreviewLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      amount: amount,
      shipping_cost: "0",
      discount_amount: "0",
      discount_type: "1",
      charge_payer: "1",
      inspection_period:
        inspectionType == t("shortEscrow.days") ? inspectionPeriod : "0",
      ...(buyerOrSeller == t("RegisterScreen.Seller") && {
        payment_type: SaudiEscrowFeePaidBy,
      }),
      charge_shipping: "1",
      device_info: deviceInfo
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
        console.log("preview data : ", responseData);
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
  const handleSubmitShortEscrow = async () => {
    setSubmitLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      ...(draftData && { id: draftData?.id }),
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      amount: amount,
      category_id: selectedId,
      country_code: "966",
      mobile_number: phone,
      title: title,
      details: details,
      charge_payer: "1",
      ...(buyerOrSeller == t("RegisterScreen.Seller") && {
        payment_type: SaudiEscrowFeePaidBy,
      }),
      inspection_period: inspectionPeriod,
      inspection_period_type:
        inspectionType == t("shortEscrow.days")
          ? "day"
          : inspectionType == t("shortEscrow.hours")
          ? "hour"
          : "minutes", //day or hour
      delivery_confirmation: deliveryPeriod,
      delivery_confirmation_type:
        deliveryType == t("shortEscrow.days")
          ? "day"
          : deliveryType == t("shortEscrow.hours")
          ? "hour"
          : "minutes", //day or hour
      escrow_confirmation: escrowPeriod,
      escrow_confirmation_type:
        escrowType == t("shortEscrow.days")
          ? "day"
          : escrowType == t("shortEscrow.hours")
          ? "hour"
          : "minutes", //day or hour
      product_condition: newOrUsed == t("shortEscrow.new") ? "new" : "used", // new or used (if category is service leave it with any value)
      ...(shortName?.length > 0 && { escrow_short_name: shortName }),
      short_agreement_confirmation: isSelected == true ? 1 : 0,
      ...(draftData && { old_attachments: oldDocuments }),
      ...(documents?.length > 0 && {
        attachments: documents?.map((el) => {
          return {
            base64: el?.base64,
            extension: `.${el?.extension.split("/").pop()}`,
          };
        }),
      }),
      device_info: deviceInfo
    };
    // console.log("obj to confirm draft", obj);
    let url = baseURL + ENDPOINTS2.submitShortEscrow;
    let updateDraftUrlToLive = baseURL + ENDPOINTS2.makeDraftLive;
    fetch(draftData ? updateDraftUrlToLive : url, {
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
        console.log("res of confirm escrow", responseData);

        setSubmitLoading(false);
        setSubmitLoading2(false);
        setSlideState(false)
        if (responseData.messages.success) {
          dispatch(storeStackValue(false));
          navigation.navigate("TransactionAdded", {
            message: responseData.messages.success,
            draft: !draftData ? false : true,
            notDraft: true,
            escrow_data: responseData?.escrow_data,
          });
        } else if (responseData?.messages?.error) {
          showMessage({
            message:
              typeof responseData?.messages?.error == "string"
                ? responseData?.messages?.error
                : responseData?.messages?.error?.map((el, index) => `${el}\n`),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(responseData.messages.error);
          setWarning(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("accountScreen.err"));
        setWarning(true);
        setSubmitLoading(false);
        setSubmitLoading2(false);
        setSlideState(false)
      });
  };
  const handleSaveAndUpdateDraft = async () => {
    setSubmitLoading2(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      ...(inspectionPeriod?.toString()?.length > 0 && {
        inspection_period: inspectionPeriod,
      }),
      inspection_period_type:
        inspectionType == t("shortEscrow.days")
          ? "day"
          : inspectionType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",
      ...(deliveryPeriod?.toString()?.length > 0 && {
        delivery_confirmation: deliveryPeriod,
      }),
      delivery_confirmation_type:
        deliveryType == t("shortEscrow.days")
          ? "day"
          : deliveryType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",
      ...(escrowPeriod?.toString()?.length > 0 && {
        escrow_confirmation: escrowPeriod,
      }),
      escrow_confirmation_type:
        escrowType == t("shortEscrow.days")
          ? "day"
          : escrowType == t("shortEscrow.hours")
          ? "hour"
          : "minutes",

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
      ...(buyerOrSeller == t("RegisterScreen.Seller") && {
        payment_type: SaudiEscrowFeePaidBy,
      }),
      product_condition: newOrUsed == t("shortEscrow.new") ? "new" : "used", // new or used (if category is service leave it with any value)
      device_info: deviceInfo
    };

    console.log("obj of create and update draft", obj);
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
          if (saveDraftValue) {
            dispatch(UserActions.handleSaveAsDraftEnded(true));
            showMessage({
              message: responseData.messages.success,
              type: "success",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          } else {
            dispatch(storeStackValue(false));
            navigation.navigate("TransactionAdded", {
              message: responseData.messages.success,
              draft: true,
              notDraft: false,
              escrow_data: responseData?.escrow_data,
            });
          }
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

  const handleTakeImage = async () => {
    try {
      refRBSheet.current.close();
      const options = {
        // maxWidth: 500,
        // maxHeight: 500,
        noData: true,
        saveToPhotos: false,
        mediaType: "photo",
        includeBase64: true,
      };
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === "ios"
      ) {
        console.log("Camera permission given");
        launchCamera(options, (res) => {
          if (res.assets) {
            // setImageObj({
            //   base64: res.assets[0].base64,
            //   extension: "." + res.assets[0].type.split("/")[1],
            // });
            resizeUserImage(res.assets[0].uri)
          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleOpenGallery = async () => {
    const options = {
      // maxWidth: 500,
      // maxHeight: 500,
      noData: true,
      saveToPhotos: false,
      mediaType: "photo",
      includeBase64: true,
    };
    launchImageLibrary(options, (res) => {
      console.log('res.assets[0].type', res.assets[0].type)
      if (res.assets) {
        resizeUserImage(res.assets[0].uri)
      }
    });
  };

  const resizeUserImage= async(image)=>{
    try {
      let result = await ImageResizer.createResizedImage(
        image,
        800,
        800,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: false,
        }
      );
      console.log('resizeUserImage', result)
      setImageUri(result.uri);
      const data=[]
      const obj={
        image: result.uri
      }
      data.push(obj)
      setImageList(prevState => [...prevState,obj])
      convertToBase64(result.path,result.name)
    } catch (error) {
      console.log('resizeUserImage error', error)
    }
  };

  const convertToBase64=(url, name)=>{
    RNFS.readFile(url, 'base64')
    .then(res =>{
      const docs= []
      setImageObj({
        base64: res,
        name: name,
        extension: ".JPEG",
      });
      const obj= {
        base64: res,
        name: name,
        extension: "jpeg",
      };
      docs.push(obj)
       setDocuments([...documents, ...docs]);
    });
  }

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === "granted";
  };

  const ItemImage = ({item}) => (
    <View style={{alignSelf:'center'}}>
      <FastImage
          style={styles.imageStyle}
          source={{uri: `data:image/jpeg;base64,${item.base64}`}}/>
      <TouchableOpacity style={{position:'absolute', right:2}} onPress={()=> removeImage(item)}>
       <Ionicons name={"close-circle-outline"}  size={20} color={COLORS.blue}/>
      </TouchableOpacity>     
    </View>
  );



  const removeImage=(el)=>{
    // const filteredArray = imageList.filter(item => item.image !== el.image)
    // setImageList(filteredArray) 

    const arr = documents.filter(
      (ob) => ob.name != el.name
    );
    setDocuments(arr);
}
// console.log('oldDocuments', oldDocuments)
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <KeyboardAvoidingView behavior="padding">
        <CustomHeader
          navigation={navigation}
          warningLanguage={true}
          warningBack={true}
          backAction={() => setWarningBack(true)}
          // Home={true}
        />

        <View style={{ height: height * 0.75 }}>
          <ScrollView ref={scrollRef}>
            <CustomText
              color={COLORS.black}
              size={16}
              text={t("shortEscrow.header")}
              containerStyle={styles.head}
            />
            {/* <View style={styles.stepIndicator}>
              <StepIndicator
                stepCount={3}
                customStyles={IndicatorStyles}
                currentPosition={steperPosition}
                renderStepIndicator={renderStepIndicator}
                renderLabel={renderLabel}
                labels={lables}
              />
            </View> */}
            {stepperView()}
            {steperPosition == 0 && (
              <>
                {loading ? (
                  <ActivityIndicator size={"large"} color={COLORS.header} />
                ) : (
                  <View style={styles.formWrapper}>
                    <View style={{ width: "100%" }}>
                      <View style={styles.dropdownCont}>
                        <View style={{ flexDirection: "row"}}>
                          <CustomText
                            containerStyle={{ marginLeft: wp(2) }}
                            color={COLORS.lightGrey}
                            size={14}
                            text={t("RegisterScreen.iam")}
                          />
                          <CustomText
                            containerStyle={{ marginLeft: wp(1) }}
                            color={COLORS.red}
                            size={16}
                            text="*"
                          />
                        </View>
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
                        <View style={{ flexDirection: "row" }}>
                          <CustomText
                            containerStyle={{ marginLeft: wp(2) }}
                            color={COLORS.lightGrey}
                            size={14}
                            text={t("RegisterScreen.Category")}
                          />
                          <CustomText
                            containerStyle={{ marginLeft: wp(1) }}
                            color={COLORS.red}
                            size={16}
                            text="*"
                          />
                        </View>
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
                      {selectedId != 3 && (
                        <View style={styles.dropdownCont}>
                          <View style={{ flexDirection: "row" }}>
                            <CustomText
                              containerStyle={{ marginLeft: wp(2) }}
                              color={COLORS.lightGrey}
                              size={14}
                              text={t("shortEscrow.type")}
                            />
                            <CustomText
                              containerStyle={{ marginLeft: wp(1) }}
                              color={COLORS.red}
                              size={16}
                              text="*"
                            />
                          </View>
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
                        requiredLabel={true}
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
                      <View
                        style={{
                          flexDirection: "row",
                          marginHorizontal: wp(1),
                        }}
                      >
                        <CustomText
                          color={COLORS.lightGrey}
                          size={13}
                          style={{ textAlign: "left" }}
                        >
                          {t("changeRole.details")}
                        </CustomText>
                        <CustomText
                          containerStyle={{ marginLeft: wp(1) }}
                          color={COLORS.red}
                          size={16}
                          text="*"
                        />
                      </View>

                      <Textarea
                        // required={true}
                        inputRef={detailsRef}
                        ref={detailsRef}
                        style={{
                          fontFamily: "BahijTheSansArabic-Plain",
                          textAlign: i18n.language == "ar" ? "right" : "left",
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
                    <View style={{flexDirection: "row",marginHorizontal: wp(1),}}>
                        <CustomText
                          color={COLORS.lightGrey}
                          size={13}
                          style={{ textAlign: "left" }}>{t("changeRole.addImage")}</CustomText>
                    </View>
                  <View style={styles.imageContainer}>
                  <TouchableOpacity style={styles.addImageContainer}
                   onPress={()=> {
                    if(documents.length<maxUploadedFile){
                      refRBSheet.current.open()
                    }else{
                      showMessage({
                        message: t("maxNum") + maxUploadedFile,
                        type: "danger",
                        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                      });
                    }
                    }}>
                    <MaterialCommunityIcons name="image-plus" size={27} color={COLORS.blue} />
                  </TouchableOpacity>
                  <View style={{alignItems:'flex-start',marginHorizontal:wp(1),flex:1}}>
                  {documents.length>0&&
                   <FlatList
                   horizontal
                   data={
                    documents.filter(
                      (ob) => ob.extension == 'jpeg')
                   }
                   renderItem={({item}) => <ItemImage item={item} />}
                   keyExtractor={item => item.name}
                   ListEmptyComponent={()=>{
                    return(
                      <CustomText
                      color={COLORS.blue}
                      size={14}
                      text={t("shortEscrow.noImages")}
                      style={{marginHorizontal: wp(3)}}
                    />
                    )
                   }}/>
                   }

                 {/* {oldDocuments.length>0&&
                   <FlatList
                   horizontal
                   data={oldDocuments}
                   renderItem={({item}) => <ItemImage2 item={item} />}
                   keyExtractor={item => item.name}
                   ListEmptyComponent={()=>{
                    return(
                      <CustomText
                      color={COLORS.blue}
                      size={14}
                      text={t("shortEscrow.noImages")}
                      style={{marginHorizontal: wp(3)}}
                    />
                    )
                   }}/>
                   } */}
                  
                   </View>
                  </View>
                
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
                        onPress={() => {
                          if(documents.length<maxUploadedFile){
                            handleUploadDocuments();
                          }else{
                            showMessage({
                              message: t("maxNum") + maxUploadedFile,
                              type: "danger",
                              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                            });
                          }
                        }}
                        textSize={12}
                        text={t("shortEscrow.uploads")}
                        containerStyle={{
                          width: "40%",
                          alignSelf: "center",
                          marginVertical: hp(1),
                        }}
                      />
                      <CustomText
                        color={COLORS.header}
                        size={15}
                        style={{ flex: 1, textAlign: "left" }}
                      >
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
                          style={{ flex: 1, textAlign: "left" }}
                        />
                      )}
                    </View>
                    <CustomButton
                      color={COLORS.blue}
                      onPress={() => {
                        if(!title || !details){
                          showMessage({
                            message: t('shortEscrow.name_desc_required'),
                            type: "info",
                            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                          });
                        }
                        dispatch(UserActions.increaseStepper(steperPosition));
                        scrollRef.current.scrollTo({
                          x: 0,
                          y: 0,
                          animated: true,
                        });
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
              <View style={styles.formWrapper}>
                <View style={{ width: "100%" }}>
                  <CustomInput
                    label={t("RegisterScreen.Amount")}
                    requiredLabel={true}
                    placeholder={t("AmountReq")}
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

                  {/* <View style={styles.dropdownCont}>
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("shortEscrow.deliveryType")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />
                  </View>
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
                    <View style={{ flexDirection: "row" }}>
                      <CustomText
                        containerStyle={{ marginLeft: wp(2) }}
                        color={COLORS.lightGrey}
                        size={14}
                        text={t("shortEscrow.deliveryPeriod")}
                      />
                      <CustomText
                        containerStyle={{ marginLeft: wp(1) }}
                        color={COLORS.red}
                        size={16}
                        text="*"
                      />
                    </View>
                    <SelectDropdown
                      data={
                        deliveryType == t("shortEscrow.hours")
                          ? [
                              3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                              17, 18, 19, 20, 21, 22, 23,
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
                )} */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: hp(2),
                    }}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={width * 0.033}
                      text={t("shortEscrow.deliveryType")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />

                    <CustomText
                      containerStyle={styles.showescrowPeriodStyle}
                      color={COLORS.header}
                      size={width * 0.033}
                      text={deliveryPeriod + " " + deliveryLabel}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: hp(2),
                      alignItems: "center",
                    }}
                  >
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setDeliveryType(t("shortEscrow.fawry"));
                        setDeliveryPeriod("15");
                        setDeliveryLabel(t("shortEscrow.min"));
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.fawry")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 2 ,elevation: 5,shadowOpacity:0.3, shadowOffset:{width:1, height:2}}}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setDeliveryType(t("shortEscrow.hours"));
                        setDeliveryPeriod("1");
                        setDeliveryLabel(t("shortEscrow.hour"));
                        RBSheetRef2.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.hours")}
                      textColor={COLORS.blue}
                      containerStyle={{
                        flex: 1,
                        marginHorizontal: width * 0.02,
                        elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2}
                      }}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setDeliveryType(t("shortEscrow.days"));
                        setDeliveryPeriod("1");
                        setDeliveryLabel(t("shortEscrow.day"));
                        RBSheetRef2.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.days")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 1,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                    />
                    <View style={{ width: width * 0.02 }} />
                  </View>
                  <RBSheet
                    ref={RBSheetRef2}
                    height={250}
                    openDuration={250}
                    customStyles={{
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                        borderTopEndRadius:wp(8),
                        borderTopStartRadius:wp(8)
                      },
                    }}
                  >
                    <View
                      style={{
                        width: wp(100),
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: wp(5),
                        flexDirection: "row",
                        backgroundColor: COLORS.blue,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "BahijTheSansArabicSemiBold",
                          color: "white",
                          marginLeft: wp(35),
                        }}
                      >
                        {deliveryType == t("shortEscrow.hours")
                          ? t("shortEscrow.hours2")
                          : t("shortEscrow.days2")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => RBSheetRef2.current.close()}
                      >
                        <Text
                          style={{
                            fontFamily: "BahijTheSansArabicSemiBold",
                            color: COLORS.white,
                          }}
                        >
                          {t("shortEscrow.done")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollPicker
                      dataSource={
                        deliveryType == t("shortEscrow.hours")
                          ? HoursArr
                          : DaysArr
                      }
                      selectedIndex={0}
                      renderItem={(el, index) => (
                        <View
                          style={{
                            width: wp(30),
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              margin: 10,
                              fontFamily: "BahijTheSansArabicSemiBold",
                              color: "black",
                              fontSize: wp(4)
                            }}
                          >
                            {el}
                          </Text>
                        </View>
                      )}
                      onValueChange={(selectedItem, index) => {
                        setDeliveryPeriod(selectedItem);
                      }}
                      wrapperHeight={200}
                      wrapperWidth={50}
                      wrapperColor="#FFFFFF"
                      itemHeight={60}
                      highlightColor="#d8d8d8"
                      highlightBorderWidth={2}
                    />
                  </RBSheet>

                  {/* <View style={styles.dropdownCont}>
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("shortEscrow.inspectionType")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />
                  </View>
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
                      <View style={{ flexDirection: "row" }}>
                        <CustomText
                          containerStyle={{ marginLeft: wp(2) }}
                          color={COLORS.lightGrey}
                          size={14}
                          text={t("shortEscrow.inspectionPeriod")}
                        />
                        <CustomText
                          containerStyle={{ marginLeft: wp(1) }}
                          color={COLORS.red}
                          size={16}
                          text="*"
                        />
                      </View>
                      <SelectDropdown
                        data={
                          inspectionType == t("shortEscrow.hours")
                            ? [
                                3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                                17, 18, 19, 20, 21, 22, 23,
                              ]
                            : [
                                1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
                                15,
                              ]
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
                )} */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: hp(2),
                    }}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={width * 0.025}
                      text={t("shortEscrow.inspectionType")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />

                    <CustomText
                      containerStyle={styles.showescrowPeriodStyle}
                      color={COLORS.header}
                      size={width * 0.03}
                      text={inspectionPeriod + " " + inspectionLabel}
                    />
                  </View>
                  {/* good */}
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                      marginBottom: hp(2),
                    }}
                  >
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setInspectionType(t("shortEscrow.fawry"));
                        setInspectionPeriod("15");
                        setInspectionLabel(t("shortEscrow.min"));
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.fawry")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 2,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setInspectionType(t("shortEscrow.hours"));
                        setInspectionPeriod("1");
                        setInspectionLabel(t("shortEscrow.hour"));
                        RBSheetRef3.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.hours")}
                      textColor={COLORS.blue}
                      containerStyle={{
                        flex: 1,
                        marginHorizontal: width * 0.02,
                        elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2}
                      }}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setInspectionType(t("shortEscrow.days"));
                        setInspectionPeriod("1");
                        setInspectionLabel(t("shortEscrow.day"));
                        RBSheetRef3.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.days")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 1,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                    />
                    <View style={{ width: width * 0.02 }} />
                  </View>

                  <RBSheet
                    ref={RBSheetRef3}
                    height={250}
                    openDuration={250}
                    customStyles={{
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                        borderTopEndRadius:wp(8),
                        borderTopStartRadius:wp(8)
                      },
                    }}
                  >
                    <View
                      style={{
                        width: wp(100),
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: wp(5),
                        flexDirection: "row",
                        backgroundColor: COLORS.blue,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "BahijTheSansArabicSemiBold",
                          color: "white",
                          marginLeft: wp(35),
                        }}
                      >
                        {inspectionType == t("shortEscrow.hours")
                          ? t("shortEscrow.hours2")
                          : t("shortEscrow.days2")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => RBSheetRef3.current.close()}
                      >
                        <Text
                          style={{
                            fontFamily: "BahijTheSansArabicSemiBold",
                            color: COLORS.white,
                          }}
                        >
                          {t("shortEscrow.done")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollPicker
                      dataSource={
                        inspectionType == t("shortEscrow.hours")
                          ? HoursArr
                          : DaysArr
                      }
                      selectedIndex={0}
                      renderItem={(el, index) => (
                        <View
                          style={{
                            width: wp(30),
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              margin: 10,
                              fontFamily: "BahijTheSansArabicSemiBold",
                              color: "black",
                              fontSize: wp(4)
                            }}
                          >
                            {el}
                          </Text>
                        </View>
                      )}
                      onValueChange={(selectedItem, index) => {
                        setInspectionPeriod(selectedItem);
                      }}
                      wrapperHeight={200}
                      wrapperWidth={50}
                      wrapperColor="#FFFFFF"
                      itemHeight={60}
                      highlightColor="#d8d8d8"
                      highlightBorderWidth={2}
                    />
                  </RBSheet>

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

                  {buyerOrSeller == t("RegisterScreen.Seller") && (
                    <View style={styles.dropdownCont}>
                      <View style={{ flexDirection: "row" }}>
                        <CustomText
                          containerStyle={{ marginLeft: wp(2) }}
                          color={COLORS.lightGrey}
                          size={14}
                          text={t("shortEscrow.payMethod")}
                        />
                        <CustomText
                          containerStyle={{ marginLeft: wp(1) }}
                          color={COLORS.red}
                          size={16}
                          text="*"
                        />
                      </View>

                      <SelectDropdown
                        data={payMethods.map((el) => el.name)}
                        defaultButtonText={
                          draftData
                            ? draftData.payment_method
                              ? draftData.payment_method.name
                              : payMethods[0].name
                            : payMethods[0].name
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
                          setSaudiEscrowFeePaidBy(payMethods[index].value);
                        }}
                        buttonTextAfterSelection={(selectedItem, index) => {
                          return selectedItem;
                        }}
                        rowTextForSelection={(item, index) => {
                          return item;
                        }}
                      />
                    </View>
                  )}

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
                  <View style={styles.checkBoxCon}>
                    <CheckBox
                      isChecked={isSelected}
                      onClick={() => {
                        setIsSelected(!isSelected);
                      }}
                      checkBoxColor={COLORS.black}
                      rightTextStyle={{
                        color: COLORS.black,
                        fontFamily: "Nunito-Regular",
                      }}
                    />
                    <CustomText
                      color={COLORS.header}
                      size={14}
                      text={t("shortEscrow.agg")}
                      style={{ marginHorizontal: 5 }}
                    />
                  </View>
                </View>
                <View style={styles.btnContainer}>
                  <CustomButton
                    loading={previewLoading}
                    disabled={previewLoading}
                    color={COLORS.blue}
                    onPress={() => {
                      // !valid
                      // ? ref?.current?.focus()
                      // : dispatch(UserActions.increaseStepper(steperPosition));
                      handleFieldsValidation(handlePreviewEscrow, true);
                    }}
                    textSize={width * 0.025}
                    text={t("shortEscrow.next")}
                    containerStyle={{ width: wp(25) }}
                  />
                  <CustomButton
                    loading={submitLoading2}
                    disabled={submitLoading2}
                    color={COLORS.blue}
                    onPress={handleSaveAndUpdateDraft}
                    textSize={width * 0.025}
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
                    textSize={width * 0.025}
                    textColor={COLORS.black}
                    text={t("shortEscrow.back")}
                    containerStyle={{ width: wp(25) }}
                  />
                </View>
              </View>
            )}
            {/* {steperPosition == 2 && (
          <> */}

            {/* )} */}
            {steperPosition == 2 && (
              <View style={styles.formWrapper}>
                <View style={{ width: "100%" }}>
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
                  {/* <View style={styles.dropdownCont}>
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("shortEscrow.escrowType")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />
                  </View>
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
                        setEscrowPeriod("15");
                      } else {
                        setEscrowPeriod("");
                        RBSheetRef1.current.open();
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
                </View> */}

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: hp(2),
                    }}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={width * 0.025}
                      text={t("shortEscrow.escrowcon")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />

                    <CustomText
                      containerStyle={styles.showescrowPeriodStyle}
                      color={COLORS.header}
                      size={width * 0.03}
                      text={
                        escrowPeriod
                          ? escrowPeriod + " " + escrowPeriodLabel
                          : ""
                      }
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setEscrowType(t("shortEscrow.fawry"));
                        setEscrowPeriod("15");
                        setEscrowPeriodLabel(t("shortEscrow.min"));
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.fawry")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 2,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setEscrowType(t("shortEscrow.hours"));
                        setEscrowPeriod("1");
                        setEscrowPeriodLabel(t("shortEscrow.hour"));
                        RBSheetRef1.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.hours")}
                      textColor={COLORS.blue}
                      containerStyle={{
                        flex: 1,
                        marginHorizontal: width * 0.02,
                        elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2}
                      }}
                    />
                    <CustomButton
                      color={"#f5f5f5"}
                      onPress={() => {
                        setEscrowType(t("shortEscrow.days"));
                        setEscrowPeriod("1");
                        setEscrowPeriodLabel(t("shortEscrow.day"));
                        RBSheetRef1.current.open();
                      }}
                      textSize={width * 0.03}
                      text={t("shortEscrow.days")}
                      textColor={COLORS.blue}
                      containerStyle={{ flex: 1,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                    />
                    <View style={{ width: width * 0.02 }} />
                  </View>
                  <RBSheet
                    ref={RBSheetRef1}
                    height={250}
                    openDuration={250}
                    customStyles={{
                      container: {
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: COLORS.white,
                        borderTopEndRadius:wp(8),
                        borderTopStartRadius:wp(8)
                      },
                    }}
                  >
                    <View
                      style={{
                        width: wp(100),
                        justifyContent: "space-between",
                        paddingVertical: 10,
                        paddingHorizontal: wp(5),
                        flexDirection: "row",
                        backgroundColor: COLORS.blue,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: "BahijTheSansArabicSemiBold",
                          color: "white",
                          marginLeft: wp(35),
                        }}
                      >
                        {escrowType == t("shortEscrow.hours")
                          ? t("shortEscrow.hours2")
                          : t("shortEscrow.days2")}
                      </Text>
                      <TouchableOpacity
                        onPress={() => RBSheetRef1.current.close()}
                      >
                        <Text
                          style={{
                            fontFamily: "BahijTheSansArabicSemiBold",
                            color: COLORS.white,
                          }}
                        >
                          {t("shortEscrow.done")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ScrollPicker
                      dataSource={
                        escrowType == t("shortEscrow.hours")
                          ? HoursArr
                          : DaysArr
                      }
                      selectedIndex={0}
                      renderItem={(el, index) => (
                        <View
                          style={{
                            width: wp(30),
                          }}
                        >
                          <Text
                            style={{
                              alignSelf: "center",
                              margin: 10,
                              fontFamily: "BahijTheSansArabicSemiBold",
                              color: "black",
                              fontSize: wp(4)
                            }}
                          >
                            {el}
                          </Text>
                        </View>
                      )}
                      onValueChange={(selectedItem, index) => {
                        setEscrowPeriod(selectedItem);
                      }}
                      wrapperHeight={200}
                      wrapperWidth={50}
                      wrapperColor="#FFFFFF"
                      itemHeight={60}
                      highlightColor="#d8d8d8"
                      highlightBorderWidth={2}
                    />
                  </RBSheet>
                  {/* {(escrowType == t("shortEscrow.hours") ||
                  escrowType == t("shortEscrow.days")) && (
                  <View style={styles.dropdownCont}>
                    <View style={{ flexDirection: "row" }}>
                      <CustomText
                        containerStyle={{ marginLeft: wp(2) }}
                        color={COLORS.lightGrey}
                        size={14}
                        text={t("shortEscrow.escrowcon")}
                      />
                      <CustomText
                        containerStyle={{ marginLeft: wp(1) }}
                        color={COLORS.red}
                        size={16}
                        text="*"
                      />
                    </View>
                    <SelectDropdown
                      data={
                        escrowType == t("shortEscrow.hours")
                          ? [
                              3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
                              17, 18, 19, 20, 21, 22, 23,
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
                )} */}
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
                            text={buyerOrSeller== t("RegisterScreen.Seller")?t('sold'):t('purchased')}
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
                      {/* cpa method */}
                      {buyerOrSeller == t("RegisterScreen.Seller") && (
                        <View style={styles.transactionInfo2}>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={t("shortEscrow.payMethod")}
                              style={styles.accordionTitle}
                            />
                          </View>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={previewData?.payment_method?.name}
                              style={styles.accordionTitle}
                            />
                          </View>
                        </View>
                      )}

                       {/* {delivery confirm period} */}
                       <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transactionDetails.delivery")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={deliveryPeriod + " " + deliveryLabel}
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>

                       {/* {inspection confirm period} */}
                       <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transactionDetails.inspection")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={inspectionPeriod + " " + inspectionLabel}
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>

                       {/* {confirm confirm period} */}
                       <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transactionDetails.confirm")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={escrowPeriod + " " + escrowPeriodLabel}
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
                      {/* charge */}
                      {buyerOrSeller == t("RegisterScreen.Seller") && (
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
                              text={
                                previewData?.charge + t("reviewTransaction.sar")
                              }
                              style={styles.accordionTitle}
                            />
                          </View>
                        </View>
                      )}

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
                              previewData?.vat_amount +
                              t("reviewTransaction.sar")
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

                      {/* total vat amount */}
                      <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.totalVat")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={
                              parseFloat(
                                parseFloat(previewData?.charge) +
                                  parseFloat(previewData?.vat_amount) +
                                  parseFloat(previewData?.extended_vat)
                              ).toFixed(2) + t("reviewTransaction.sar")
                            }
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
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
                              previewData?.payed_amount +
                              t("reviewTransaction.sar")
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
                <View style={[styles.btnContainer,{flexDirection:'column'}]}>
                  {/* <CustomButton
                    loading={submitLoading}
                    disabled={submitLoading}
                    color={COLORS.blue}
                    onPress={() => {
                      if (!validPhone) {
                        phoneRef.current.focus();
                      } else if (
                        escrowPeriod?.length == 0 ||
                        escrowPeriod == undefined
                      ) {
                        setShowEscrowPeriodWarning(true);
                      } else {
                        handleSubmitShortEscrow();
                      }
                    }}
                    textSize={14}
                    text={t("shortEscrow.submit")}
                    containerStyle={{ width: wp(40) }}
                  /> */}
                  <SlideToConfirm
                   unconfimredTipText={t("shortEscrow.slideToSubmit")}
                   unconfirmedTipTextStyle={{
                      color: COLORS.white,
                      fontSize: 13,
                      fontFamily:'29LTBukra-Medium',
                   }}
                   confirmedTipText={t("shortEscrow.sending")}
                   confirmedTipTextStyle={{
                      color: COLORS.white,
                      fontSize: 13,
                      fontFamily:'29LTBukra-Medium'
                   }}
                   state={slideState}
                   onSlideConfirmed={() => {
                    setSlideState(true)
                    if (!validPhone) {
                      phoneRef.current.focus();
                      setSlideState(false)
                    } else if (
                      escrowPeriod?.length == 0 ||
                      escrowPeriod == undefined
                    ) {
                      setShowEscrowPeriodWarning(true);
                      setSlideState(false)
                    } else {
                      if(!slideState){
                        handleSubmitShortEscrow();
                        setSlideState(true)
                      }
                    }
                   }}
                   tipAnimationEnable={true}
                   tipTextSlideAnimEnable={true}
                   sliderStyle={{
                      justifyContent: 'center',
                      width: wp(90),
                      height: 48,
                      borderRadius: 10,
                      overflow: 'hidden',
                      backgroundColor:COLORS.blue,
                   }}
                   sliderButtonComponent={
                    <Feather name="chevron-right" size={25} color={COLORS.white}/>
                   } 
                  />
                  {submitLoading?
                   <View style={[i18n.language=='ar'?styles.right:styles.left,{position:'absolute'}]}>
                   <ActivityIndicator size={'large'} color={COLORS.white}/>
                   </View>
                  :null}
                  <CustomButton
                    color={COLORS.transactionsTitle}
                    onPress={() => {
                      dispatch(UserActions.decreaseStepper(steperPosition));
                    }}
                    textSize={14}
                    textColor={COLORS.black}
                    text={t("shortEscrow.back")}
                    containerStyle={{ width: wp(90), marginTop:hp(2) }}
                  />
                </View>
              </View>
            )}

            <CustomAlert
              type={"error"}
              show={warning}
              header={t("mistake")}
              body={errmess}
              action1={() => {
                setWarning(false);
              }}
              btn1={t("accountScreen.ok")}
              oneBtn={true}
            />
            <CustomAlert
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              type={"error"}
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
              saveAsDraft={true}
              saveDraftText={"shortBack"}
            />
            <CustomAlert
              type={"error"}
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
              type={"error"}
              show={showDetailsWarning}
              header={t("reviewTransaction.w")}
              body={t("shortEscrow.detailsWarr")}
              action1={() => {
                setShowDetailsWarning(false);
              }}
              btn1={t("reviewTransaction.ok")}
              oneBtn={true}
            />
          </ScrollView>
          <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "#00000060",
            },
            container: {
              backgroundColor: COLORS.bg,
              height: "22%",
              borderTopLeftRadius: wp(8),
              borderTopRightRadius: wp(8),
              justifyContent: "space-evenly",
            },
          }}
        >
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              handleTakeImage();
            }}
          >
            <CustomText
              color={COLORS.header}
              size={20}
              text={t("profileBS.takep")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              handleOpenGallery();
            }}
          >
            <CustomText
              color={COLORS.header}
              size={20}
              text={t("profileBS.gallery")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
        </RBSheet>
        <ImageView
          images={[
            {
              uri: imageUri + "?date=" + moment().valueOf(),
              cache: "reload",
              headers: { Pragma: "no-cache" },
            },
          ]}
          imageIndex={0}
          visible={viewImage}
          onRequestClose={() => {
            refRBSheet.current.close();
            setViewImage(false);
          }}
          // backgroundColor="red"
          presentationStyle="pageSheet"
        />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};
export default ShortEscrow;
