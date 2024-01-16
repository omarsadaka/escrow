import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Text,
  ImageBackground,
  Button,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Linking,
  RefreshControl,
  PermissionsAndroid,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  BackHandler,
  Animated,
  Easing
} from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useIsFocused, useTheme } from "@react-navigation/native";
import RNFetchBlob from "rn-fetch-blob";
import createStyles from "./styles";
import CommonStyles from "../../constants/CommonStyles";
import styles from "./styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import Timeline from "react-native-timeline-flatlist";
import { height, hp, width, wp } from "../../utilis/dimensions";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  BASE_URL,
  ENDPOINTS,
  ENDPOINTS2,
  getBaseURL,
} from "../../constants/API";

import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import CustomAlert from "../../components/CustomAlert";
import { showSimpleModal } from "../../redux/actions/modal";
import { useDispatch, useSelector } from "react-redux";
import { GiftedChat, Send, Bubble } from "react-native-gifted-chat";
// import { ScrollView } from "react-native-gesture-handler";
import moment from "moment";
import NotesAlert from "../../modals/notesWithAttachmentModal";
import { showMessage } from "react-native-flash-message";
import CustomInput from "../../components/customInput";
import { getGeneralSettings } from "../../utilis/apis";
import CountDown from "react-native-countdown-component";
import SelectDropdown from "react-native-select-dropdown";
import { FlatList } from "react-native-gesture-handler";
import RBSheet from "react-native-raw-bottom-sheet";
import Lottie from "lottie-react-native";
import { RadioButton } from 'react-native-paper';
import { storeStackValue, handleLogoutValue } from "../../redux/actions/user";
import * as Authentication from "../../redux/actions/authentication";

const TransactionDetails = ({ navigation, route }) => {
  const { toChat } = route.params.el;
  const { from } = route.params;
  const { notificationReload } = useSelector((state) => state.user);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const { colors: COLORS } = useTheme();
  const isFocused = useIsFocused();
  const styles = useMemo(() => createStyles(COLORS), []);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const scrollViewRef = useRef();
  const scrollViewRef2 = useRef();
  const [showPayModal, setShowPayModal] = useState(false);
  const [showPayTypeModal, setShowPayTypeModal] = useState(false);

  const [acceptReturn, setAcceptReturn] = useState(false);
  const [details, setDetails] = useState(null);
  const [items, setItems] = useState([]);
  const [timeData, setTimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const [ButtonLoading, setButtonLoading] = useState(false);
  const [ButtonLoading2, setButtonLoading2] = useState(false);
  const [selected, setSelected] = useState(0);
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [warning2, setWarning2] = useState(false);
  const [errmess2, setErrMess2] = useState({ status: false, message: "" });
  const [showCancleEscrowModal, setShowCancleEscrowModal] = useState({
    status: false,
    val: "",
  });
  const [showKYCModal, setShowKYCModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [cancelNotes, setCancelNotes] = useState(null);
  const [showAcceptedBySellerModal, setShowAcceptedBySellerModal] =
    useState(false);
  const [cancelDocs, setCancelDocs] = useState([]);
  const [customerID, setCustomerID] = useState();
  const [payLoading, setPayLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponAmount, setCouponAmount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showAgreementDetails, setShowAgreementDetails] = useState(false);
  const [agreementDetails, setAgreementDetails] = useState(null);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [maxUploadedFile, setMaxUploadedFile] = useState(null);
  const [fileExtensions, setFileExtensions] = useState(null);
  const [maxFileSize, setMaxFileSize] = useState(null);
  const [disputePeriod, setDisputePeriod] = useState(15);
  const [isCounted, SetIsCounted] = useState(false);
  const [counterStatusName, setCounterStatusName] = useState("");
  const [counter, setCounter] = useState(0);
  const [reload, setReload] = useState(false);
  const [payType, setPayType] = useState("");
  const [sellerPaymentMethods, setSellerPaymentMethods] = useState(null);
  const [sellerPaymentValue, setSellerPaymentValue] = useState("");
  const [chargeAmount, setChargeAmount] = useState("");
  const [chargeLoading, setChargeLoading] = useState(false);
  const [deliveryText, setDeliveryText] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [inspectionText, setInspectionText] = useState("");
  const [showChatOptionAlert, setShowChatOptionAlert] = useState(false);
  const [showMessageReason, setShowMessageReason] = useState(false);
  const [chatOptionText, setChatOptionText] = useState("");
  const [nextStepText, setNextStepText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [reason, setReason] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [chatOptionType, setChatOptionType] = useState(null);
  const [showCardsModal, setShowCardsModal] = useState(null);
  const [defaultCard, setDefaultCard] = useState({});
  const [cardID, setCardID] = useState('');
  const [payStatus, setPayStatus] = useState('default');
  const [isScrollToEnd, setIsScrollToEnd] = useState(false);




  const refRBSheet = useRef();

  const SuggestedMessages=[
    {id:1, message: t('transDetailsScreen.message1')},
    {id:2,message: t('transDetailsScreen.message3')},
    {id:3,message: t('transDetailsScreen.message2')},
    {id:4,message: t('transDetailsScreen.message4')},
  ]
  let valueCounter = 0;
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotate = animatedValue.interpolate({
      inputRange: [0, 1, 2, 3, 4, 5, 6, 10],
      outputRange: ['0deg', '14deg', '-8deg', '14deg', '-4deg', '10deg', '0deg', '0deg']
  })

  useEffect(() => {
    const backAction = async () => {
      // write code to handel navigation
      if (route.params.from == "Pay") {
        navigation.navigate("Transactions");
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);
  useEffect(() => {
    let interval = setInterval(() => {
      if (valueCounter && valueCounter <= 1 && isCounted) {
        clearInterval(interval);
        SetIsCounted(false);
        showMessage({
          message: t("timeOut"),
          type: "warning",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        navigation.navigate("Transactions");
      } else if (isCounted && valueCounter >= 1) {
        // console.log("valueCounter : ", valueCounter, isCounted);
        valueCounter = valueCounter - 1;
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isCounted]);

  const handleAllowedFiles = (docs) => {
    if (cancelDocs.length > maxUploadedFile) {
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
      const newArr = cancelDocs.splice(-1);
      console.log("new arr last ele?", newArr[0].name);
      const filteredAttachments = cancelDocs.filter(
        (el) => el.name != newArr[0].name
      );
      console.log(
        "filteredAttachments",
        filteredAttachments.map((el) => el.name)
      );
      setCancelDocs(filteredAttachments);
      return false;
    } else {
      return true;
    }
  };
  useEffect(() => {
   if( toChat ) {
    setSelected(2);
  }
  }, [toChat]);

  useEffect(() => {
    handleAllowedFiles();
  }, [cancelDocs]);

  const handleCheckCoupon = async () => {
    setCouponLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.checkCoupon,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { escrow_id: route?.params?.el?.id, code: couponCode, device_info: deviceInfo },
    })
      .then((res) => {
        setCouponLoading(false);
        console.log("res coupon: ", res.data);
        if (res?.data?.messages?.success) {
          res?.data?.data?.type == 1
            ? setCouponAmount(
                (res?.data?.data?.amount * details?.escrow.amount) / 100
              )
            : setCouponAmount(
                details?.escrow?.amount - res?.data?.data?.amount
              );
          setShowCoupon(true);
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(res?.data?.messages?.error);
          setWarning(true);
        }
      })
      .catch((er) => {
        setCouponLoading(false);
        setErrMess(t("transactionDetails.err"));
        setWarning(true);
        // console.log("er : ", er);
      });
  };
  const handleUploadCancelDocuments = () => {
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
                  flag && setCancelDocs([...cancelDocs, ...docs]);
                });
              }
            }
          });
        }
      }
    });
  };

  const getTransactionDetails = async () => {
    console.log("route?.params?.el?.id: ", route?.params?.el?.id);
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    // console.log("in get transaction details...");
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.transactionDetails,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { escrow_id: route?.params?.el?.id , device_info: deviceInfo},
    })
      .then((res) => {
        // console.log("res details ", res?.data);
        if (res?.data && res?.data?.escrow) {
          setDetails(res?.data);
          setItems(res?.data?.escrow?.products);
          res?.data?.escrow?.user_kv == 1
            ? setIsVerified(true)
            : setIsVerified(false);
        if(res?.data?.escrow.next_step){
          setNextStepText(res?.data?.escrow.next_step)
        }    
          setLoading(false);
        } else {
          setLoading(false);
          setDetails(null);
          // setErrMess(res?.data?.messages?.error);
          // setWarning(true);
          handleLogout()
        }
      })
      .catch((er) => {
        setLoading(false);
        setErrMess(t("transactionDetails.err"));
        setWarning(true);
        // console.log("er : ", er);
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

  const getData = async () => {
    await getTransactionDetails();
    const CUSTOMER_ID = await AsyncStorage.getItem("CUSTOMER_ID");
    setCustomerID(CUSTOMER_ID);
  };
  const getSellerPaymentMethods = async () => {
    const payments = await AsyncStorage.getItem("PaymentMethodsSeller");
    const payments2 = JSON.parse(payments);
    setSellerPaymentMethods(payments2);
    setSellerPaymentValue(payments2[0].value);
  };
  useEffect(() => {
    if (!baseURL) return;
    getGeneralSettings(baseURL).then((res) => {
      setDisputePeriod(res?.dispute_period);
      setMaxUploadedFile(res?.max_uploaded_file);
      let arr = res?.allowed_exec.replace(/","/g, "").split('"');
      setMaxFileSize(res?.max_attach_size);
      setFileExtensions(arr[1].split(".").filter((el) => el != ""));
    });
    getData();
    getSellerPaymentMethods();
    getCards()
  }, [navigation, baseURL, isFocused, reload, notificationReload]);
 
  // useEffect(() => {
  //   setSelected(0);
  // }, [notificationReload]);

  useEffect(() => {
    if (isCounted && details?.escrow?.remaining_time?.remain > 0) {
      valueCounter = details?.escrow?.remaining_time?.remain + 2;
    }
  }, [isCounted]);
  useEffect(() => {
    if (details != null && details?.escrow?.remaining_time?.remain != 0) {
      setCounter(details?.escrow?.remaining_time?.remain + 2);
      SetIsCounted(true);
    } else {
      setCounter(0);
      SetIsCounted(false);
      return;
    }
    // //escrow confirmation counter
    // details?.escrow?.status?.code == 0 &&
    //   setCounterStatusName("escrowConfirmationCounter");

    // //edmn delivery confirmation counter
    // details?.escrow?.status?.code == 3 &&
    //   setCounterStatusName("deliveryConfirmationEdmnCounter");

    // //edmn inspection confirmation counter
    // details?.escrow?.status?.code == 11 &&
    //   setCounterStatusName("inspectionCounter");

    // details?.escrow?.status?.code == 8 &&
    //   setCounterStatusName("disputeCounter"); // disputed
  }, [details]);

  const onRefresh = async () => {
    setRefresh(false);
    await getTransactionDetails();
  };
  useEffect(() => {
    if (!details) return;
    details?.escrow?.escrow_confirmation_type == "hour"
      ? setConfirmText(t("transactionDetails.hour"))
      : details?.escrow?.escrow_confirmation_type == "day"
      ? setConfirmText(t("transactionDetails.day"))
      : setConfirmText(t("transactionDetails.minute"));

    details?.escrow?.delivery_confirmation_type == "hour"
      ? setDeliveryText(t("transactionDetails.hour"))
      : details?.escrow?.delivery_confirmation_type == "day"
      ? setDeliveryText(t("transactionDetails.day"))
      : setDeliveryText(t("transactionDetails.minute"));

    details?.escrow?.inspection_period_type == "hour"
      ? setInspectionText(t("transactionDetails.hour"))
      : details?.escrow?.inspection_period_type == "day"
      ? setInspectionText(t("transactionDetails.day"))
      : setInspectionText(t("transactionDetails.minute"));
  }, [details]);
  // done when escrow created by buyer but when seller create have a problem
  const handlePay = async (val) => {
    setPayLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    var formdata = new FormData();
    formdata.append("escrow_id", details?.escrow?.id);
    formdata.append("pay_via", "1");
    formdata.append('device_info', deviceInfo)
    couponCode.length > 0 && formdata.append("coupon_code", couponCode);
    fetch(baseURL + ENDPOINTS2.payEscrow, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("pay ress.. : ", responseData);
        if (responseData?.messages?.success) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if (
            details?.escrow?.status.code == 2 &&
            details?.escrow?.buyer_id == customerID
          ) {
            setPayLoading(false);
            setShowPayModal(false);
            navigation.navigate("Transactions");
          } else {
            // setShowPayModal(false);
            var formdata2 = new FormData();
            formdata2.append("escrow_id", details?.escrow?.id);
            formdata2.append('device_info', deviceInfo)
            fetch(baseURL + ENDPOINTS2.acceptAfterPay, {
              method: "POST",
              headers: {
                "Content-Type": "multipart/form-data;",
                Authorization: "Bearer " + token,
                "X-Localization": i18n?.language,
              },
              body: formdata2,
            })
              .then((response) => response.json())
              .then(async (responseData2) => {
                console.log("accept after ppay ress.. : ", responseData2);
                if (responseData2.messages?.success) {
                  setShowPayModal(false);
                  setPayLoading(false);
                  showMessage({
                    message: responseData2.messages?.success,
                    type: "success",
                    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                  });
                  navigation.navigate("Transactions");
                } else if (responseData2.messages.error) {
                  setShowPayModal(false);
                  setPayLoading(false);
                  dispatch(
                    showSimpleModal({
                      status: true,
                      payload: {
                        header: t("mistake"), //responseData2?.status,
                        message: responseData2.messages.error,
                        action: "",
                        type: "error",
                      },
                    })
                  );
                } else {
                  setPayLoading(false);
                  setShowPayModal(false);
                  showMessage({
                    message: "something else",
                    type: "danger",
                    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                  });
                }
              })
              .catch((e) => {
                setShowPayModal(false);
                setPayLoading(false);
                console.log(e);
                dispatch(
                  showSimpleModal({
                    status: true,
                    payload: {
                      header: t("updateHeader"),
                      message: t("accountScreen.err"),
                      action: "",
                      type: "error",
                    },
                  })
                );
              });
          }
        } else if (responseData?.messages?.error || responseData.error) {
          setPayLoading(false);
          setShowPayModal(false);
          showMessage({
            message: responseData.messages.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setPayLoading(false);
          setShowPayModal(false);
          showMessage({
            message: "something else",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        setPayLoading(false);
        setShowPayModal(false);
        console.log(e);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  const handlePayMoyasar = async (val) => {
    setPayLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("escrow_id", details?.escrow?.id);
    formdata.append("pay_via", "1");
    if(cardID&&cardID!=''){
      formdata.append('card_id', cardID)
    }
    formdata.append('device_info', deviceInfo)
    couponCode.length > 0 && formdata.append("coupon_code", couponCode);
    fetch(baseURL + ENDPOINTS2.payEscrowMoyasar, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("pay ress.. : ", responseData);
        if (responseData?.code == 200) {
          setPayLoading(false);
          if (responseData?.messages?.error) {
            setShowPayModal(false);
            setShowCardsModal(false)
            showMessage({
              message: responseData?.messages?.error,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          } else {
            setShowPayModal(false)
            setShowCardsModal(false)
            showMessage({
              message: t('transactionDetails.toOnlinePay'),
              type: "success",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
            navigation.navigate("PayWebView", {
              Url: responseData.url,
              EscrowID: details?.escrow?.id,
              BuyerID: details?.escrow?.buyer_id,
              CustomerID: customerID,
              StatusCode: details?.escrow?.status.code,
              El: details,
            });
          }
        } else if (responseData?.messages?.error || responseData.error) {
          setPayLoading(false);
          setShowPayModal(false);
          setShowCardsModal(false)
          showMessage({
            message: responseData.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setPayLoading(false);
          setShowPayModal(false);
          setShowCardsModal(false)
          showMessage({
            message: "something else",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        setPayLoading(false);
        setShowPayModal(false);
        setShowCardsModal(false)
        console.log(e);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  // seller can accept the rejection from buyer
  const handleAcceptReject = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    console.log("objReq buyer accept rejection : ", bodyObj);
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.sellerAcceptReject,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("handleAcceptReject", res);
    if (!res?.data?.messages?.error) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), //res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), //res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    }
  };
  // seller can raise dispute when buyer make reject & return
  const handleRaiseDisputeRETURN = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      dispute_reason: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      dispute_reason: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.raiseDispute,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    if (!res?.data?.messages?.error) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), // res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    }
  };
  // buyer can dispatch
  const handleDispatchByBuyer = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    console.log(
      "dispatch body : ",
      cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj
    );
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.buyerDispatch,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("dispatch response : ", res);
    if (res?.data?.messages?.success) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), // res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("EscrowReview", {
        escrow_id: details?.escrow?.id,
      });
    } else if (res?.data?.messages?.error) {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    } else if (res) {
      console.log("resssssssssindispath:", res);
    } else {
      console.log("res not true");
    }
  };
  //escrow plus buyer reject items and return it done
  const handleItemRejectedAndReturnedByBuyer = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.buyerRejectDelivery,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("handleAcceptReject", res);
    if (!res?.data?.messages?.error) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), // res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    }
  };

  // escrow plus cancel completed seller and buyer
  const handleCancleEscrowByBuyer = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS.cancleEscrowByBuyerOrSeller,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("res cancel ", res.date);
    if (!res?.data?.messages?.error) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), // res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    }
  };
  // accept escrow by buyer have a back problem when seller make escrow
  const handleAcceptEscrowByBuyer = async () => {
    // console.log("accept id ", details?.escrow?.id);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.acceptEscrowByBuyer,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { escrow_id: details?.escrow?.id, device_info: deviceInfo },
    })
      .then((res) => {
        // console.log("res details  status: ", res?.data);
        if (res?.data?.messages?.success) {
          setPayLoading(false);
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("Transactions");
          // dispatch(
          //   showSimpleModal({
          //     status: true,
          //     payload: {
          //       header: res?.data?.status,
          //       message: res?.data?.message?.success,
          //       action: "",
          //     },
          //   })
          // );
        } else if (res?.data?.messages?.error) {
          setPayLoading(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("mistake"), // res?.data?.status,
                message: res?.data?.messages?.error,
                action: "",
                type: "error",
              },
            })
          );
        } else {
          setPayLoading(false);
          showMessage({
            message: res?.data,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setPayLoading(false);
        setErrMess(t("transactionDetails.err"));
        console.log("erccccccccccc : ", er);
      });
  };
  // accept escrow by seller done when buyer make escrow
  const handleAcceptEscrowBySeller = async () => {
    setPayLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("escrow_id", details?.escrow?.id);
    formdata.append("payment_type", sellerPaymentValue);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "post",
      url: baseURL + ENDPOINTS2.sellerAccept,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then((res) => {
        console.log("res accept by seller : ", res?.data);
        setPayLoading(false);
        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setShowAcceptedBySellerModal(false);
          navigation.navigate("Transactions");
        } else {
          setShowAcceptedBySellerModal(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("mistake"), // res?.data?.status,
                message: res?.data?.messages?.error,
                action: "",
                type: "error",
              },
            })
          );
        }
      })
      .catch((er) => {
        setPayLoading(false);
        setErrMess(t("transactionDetails.err"));
        console.log("erbbbbbbb : ", er);
      });
  };
  // seller deliver items and notes done
  const handleSellerDeliveryNotes = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    console.log("objReq delivery notes", bodyObj);
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.sellerDelivery,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("res delivery notes ", res?.data);
    if (res?.data?.messages?.success) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), // res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else if (res?.data?.messages?.error) {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    } else if (res) {
      console.log("res : ", res);
    } else {
      console.log("res not true  : ");
    }
  };

  // buyer can confirm delivery when status is delivered
  const handleConfirmDelivery = async () => {
    setCancelLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const bodyObjWithoutAttachments = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      device_info: deviceInfo
    };
    const bodyObj = {
      escrow_id: details?.escrow?.id,
      notes: cancelNotes,
      attachments: cancelDocs?.map((el) => {
        return {
          base64: el?.base64,
          extension: `.${el?.extension.split("/").pop()}`,
        };
      }),
      device_info: deviceInfo
    };
    console.log("objReq buyer confirm: ", bodyObj);
    const res = await axios({
      method: "post",
      url: baseURL + ENDPOINTS2.delivery_confirm,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: cancelDocs?.length == 0 ? bodyObjWithoutAttachments : bodyObj,
    });
    console.log("results buyer confirm: ", res?.data);
    if (res?.data?.messages?.success) {
      setCancelLoading(false);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("success"), //  res?.data?.status,
            message: res?.data?.messages.success,
            action: "",
            type: "success",
          },
        })
      );
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      navigation.navigate("Transactions");
    } else if (res?.data?.messages?.error) {
      setCancelLoading(false);
      setShowCancleEscrowModal({
        status: false,
        val: "",
      });
      setCancelNotes(null);
      setCancelDocs([]);
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: t("mistake"), // res?.data?.status,
            message: res?.data?.messages?.error,
            action: "",
            type: "error",
          },
        })
      );
    } else if (res) {
      console.log("res : ", res);
    } else {
      console.log("res not true  : ");
    }
  };
  const [contentHeight, setContentHeight] = useState(0);

  const handleContentSizeChange = (contentWidth, contentHeight) => {
    setContentHeight(contentHeight);
    // Check if the content height has changed
    if (contentHeight !== 0 && scrollViewRef?.current) {
      // Get the current scroll position of the ScrollView
      const { x, y } = scrollViewRef?.current.contentOffset;
      // Scroll to the previous position
      scrollViewRef?.current.scrollTo({ x, y, animated: false });
    }
  };
 

  const rowItem=(icon1, label1, value1, icon2, label2, value2)=>{
    return(
      <View style={{width:'100%', flexDirection:'row', alignItems:'center',padding:4}}> 
        <View style={{flex:1, alignItems:'flex-start'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <FontAwesome5 name={icon1} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label1}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={13}
              text={value1}
              style={styles.value}/>
        </View>
        <View style={{width: wp(2)}}/>
        <View style={{flex:1, alignItems:'flex-start'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
               <FontAwesome5 name={icon2} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label2}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={13}
              text={value2}
              style={styles.value}/>
        </View>
      </View>
    )
  }
  const columItem=(icon, label, value)=>{
    return(
        <View style={{flex:1, alignItems:'flex-start',padding:4}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <FontAwesome5 name={icon} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={13}
              text={value}
              style={styles.value}/>
        </View>
    )
  }

  const handleChatReport = async () => {
    setReportLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.reportMessage,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { 
        conversation_id: details?.escrow?.conversation?.id, 
        report_message: reason, 
        device_info: deviceInfo 
      },
    })
      .then((res) => {
        setReportLoading(false);
        console.log("res handleChatReport: ", res.data);
        if (res?.data?.messages?.success) {
          setReason('')
          setShowMessageReason(false)
          setShowChatOptionAlert(true)
          refRBSheet.current.open()
        } else {
        }
      })
      .catch((er) => {
        setReportLoading(false);
        // console.log("er : ", er);
      });
  };

  const handleUserBlock = async () => {
    setReportLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.blockUserRequest,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { 
        conversation_id: details?.escrow?.conversation?.id, 
        block_reason: reason, 
        device_info: deviceInfo 
      },
    })
      .then((res) => {
        setReportLoading(false);
        console.log("res handleUserBlock: ", res.data);
        if (res?.data?.messages?.success) {
          setReason('')
          setShowMessageReason(false)
          setShowChatOptionAlert(true)
          refRBSheet.current.open()
        } else {
        }
      })
      .catch((er) => {
        setReportLoading(false);
        // console.log("er : ", er);
      });
  };
console.log('details?.escrow?.status?.code',details?.escrow?.status?.code)
  const isNextStep= 
             details?.escrow?.status?.code == 0|| details?.escrow?.status?.code == 6|| details?.escrow?.status?.code == 3||
            (details?.escrow?.status?.code == 0&&details?.escrow?.buyer_id == customerID&&details?.escrow?.creator_id != customerID)||
            (details?.escrow?.status?.code == 0 &&details?.escrow?.seller_id == customerID &&details?.escrow?.creator_id != customerID)||
            (details?.escrow?.status.code == 2 &&details?.escrow?.buyer_id == customerID)||
            (details?.escrow?.status?.code == 6 &&details?.escrow?.buyer_id != customerID)||
            (details?.escrow?.status?.code == 3 &&details?.escrow?.buyer_id == customerID &&details?.escrow?.escrow_type == 0)||
            (details?.escrow?.status?.code == 3 &&details?.escrow?.buyer_id == customerID &&details?.escrow?.escrow_type == 1)||
            (details?.escrow?.status?.code == 11 &&details?.escrow?.buyer_id == customerID &&details?.escrow?.escrow_type == 1)||
            (details?.escrow?.status?.code == 4 &&details?.escrow?.buyer_id != customerID)||
            (details?.escrow?.status?.code == 4 &&details?.escrow?.buyer_id == customerID)||
            (details?.escrow?.status?.code == 8 &&details?.escrow?.buyer_id == customerID)
 console.log('details?.escrow', details?.escrow)
    const DetailsInfo = () => {
    return (
      <TouchableWithoutFeedback>
        <ScrollView
          ref={scrollViewRef}
          nestedScrollEnabled={true}
          style={styles.detailsCont}
          scrollEnabled={true}
          onContentSizeChange={(contentWidth, contentHeight) => {
            if(isScrollToEnd) scrollViewRef.current.scrollToEnd({ animated: false });
          }}
        >
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Image
                  style={styles.avatar}
                  resizeMode="contain"
                  source={
                    details?.escrow?.buyer_id == customerID
                      ? details?.escrow?.partner_api == 0
                        ? require(`../../assets/buy_hires.png`)
                        : require(`../../assets/buy_hiresP.jpeg`)
                      : details?.escrow?.partner_api == 0
                      ? require(`../../assets/sell_hires.png`)
                      : require(`../../assets/sell_hiresP.jpeg`)
                  }
                />
            <CustomText
                  color={COLORS.loginTab}
                  size={14}
                  text={
                    details?.escrow?.buyer_id == customerID
                      ? t("transactionsScreen.bu")
                      : t("transactionsScreen.sel")
                  }
                />
          </View>
         
          {/* el details will be returned from api  */}
          {/* <TransactionCard
            navigation={navigation}
            route={route}
            el={details?.escrow}
            categoryName={details?.category[0]}
            acceptReturn={acceptReturn}
            details={true}
            isClickable={true}
          /> */}
         
          {/* products details */}
          {items?.length > 0 &&
            items.map((el, i) => (
              <View key={i}>
                <View style={styles.accordionContainer}>
                  <View style={styles.accordionTitleContainer}>
                    <CustomText
                      color={COLORS.transactionsItemName}
                      size={14}
                      text={t("transactionsScreen.itemName")}
                      style={styles.accordionTitleEdit}
                    />
                    <CustomText
                      color={COLORS.transactionsItemName}
                      size={14}
                      text={`${el.name}`}
                      style={styles.accordionTitleEdit}
                    />
                  </View>

                  <View style={styles.cardSubCont2}>
                    <View>
                      <CustomText
                        color={COLORS.transactionsTitle}
                        size={12}
                        text={t("transDetailsScreen.itemPrice")}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={13}
                        text={`${el.price}`}
                        style={styles.transactionInfo}
                      />
                    </View>

                    <View>
                      <CustomText
                        color={COLORS.transactionsTitle}
                        size={14}
                        text={t("transDetailsScreen.itemQnt")}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={14}
                        text={`${el.qty}`}
                        style={styles.transactionInfo}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          {/* calculation */}
          <View style={styles.collapsBodyCont}>

           {/* items actual price */}
           {/* reset Amount */}
            {rowItem('money-bill-wave-alt',t("transDetailsScreen.itemP"),details?.escrow?.escrow_amount + t("reviewTransaction.sar"),
            'money-bill-wave-alt',details?.escrow?.paid_amount == 0
            ? t("transDetailsScreen.resetAmount")
            : t("transDetailsScreen.payedAmount"),details?.escrow?.paid_amount == 0
            ? details?.escrow?.amount
            : details?.escrow?.paid_amount +
              t("reviewTransaction.sar"))}

            {details?.escrow?.escrow_type == 0 && (
              <>
                {/* payed Amount */}
                {columItem('money-bill-wave-alt',t("transDetailsScreen.payedAmount"),details?.escrow?.paid_amount +t("reviewTransaction.sar"))}
              </>
            )}
         {/* {rowItem('money-bill-wave-alt',details?.escrow?.paid_amount == 0
                      ? t("transDetailsScreen.resetAmount")
                      : t("transDetailsScreen.payedAmount"),
                      details?.escrow?.paid_amount == 0
                      ? details?.escrow?.amount
                      : details?.escrow?.paid_amount +
                        t("reviewTransaction.sar"),
            '',t("transactionsScreen.value"),parseFloat(details?.escrow?.escrow_amount).toFixed(2) + " SAR")} */}
           
            {details?.escrow?.discount_amount != 0 &&
              details?.escrow?.escrow_type == 0 && (
                <>
                  {/* discount type */}
                  {columItem('money-bill-wave-alt',t("transDetailsScreen.discountType"),details?.escrow?.discount_type == 1? t("transDetailsScreen.percen"): t("transDetailsScreen.fix"))}

                  {/* discount amount */}
                  {columItem('money-bill-wave-alt',t("transDetailsScreen.discountAmount"),details?.escrow?.discount_type == 1? details?.escrow?.discount_amount + " %": details?.escrow?.discount_amount +t("reviewTransaction.sar"))}
                </>
              )}
            {/* charge */}
            {/* total vat amount */}
           {rowItem('money-bill-wave-alt',t("transDetailsScreen.charge"),details?.escrow?.charge + t("reviewTransaction.sar"),
            'money-bill-wave-alt',t("transDetailsScreen.totalVat"),details?.escrow?.total_charge + t("reviewTransaction.sar"))}


           {/* {details?.escrow?.extended_vat != 0 && (
              <>
                {columItem('money-bill-wave-alt',t("transDetailsScreen.extendedamount"),details?.escrow?.extended_vat +t("reviewTransaction.sar"))}
                {columItem('money-bill-wave-alt',t("transDetailsScreen.extended"),details?.escrow?.extended_vat_pre + " %")}
              </>
            )} */}
            
             {/* vat extended percentage */}
         {rowItem('clipboard-list',t("transDetailsScreen.payMethod"),details?.escrow?.payment_method?.name?details?.escrow?.payment_method?.name:'--',
            'money-bill-wave-alt',t("transactionsScreen.value"),parseFloat(details?.escrow?.escrow_amount).toFixed(2) + t("reviewTransaction.sar"))}


            {/* vat extended Amount */}
            {details?.escrow?.extended_vat!='0.00'? columItem('money-bill-wave-alt',t("transDetailsScreen.extendedamount"),details?.escrow?.extended_vat +t("reviewTransaction.sar")):null}
            {/* vat Amount */}
            {details?.escrow?.vat_amount!='0.00'? columItem('money-bill-wave-alt',t("transDetailsScreen.vatAmount"),details?.escrow?.vat_amount + t("reviewTransaction.sar")): null}
            {details?.escrow?.extended_vat_pre ? columItem('money-bill-wave-alt',t("transDetailsScreen.extended"),details?.escrow?.extended_vat_pre + " %"): null}

            {columItem('clipboard-list',t("transactionsScreen.escrowTitle"),details?.escrow?.title)}

           {rowItem('clipboard-list',t("transactionsScreen.TransactionNo"),details?.escrow?.escrow_number,
            'clipboard-list',t("transactionsScreen.TransactionDate"),moment(details?.escrow?.created_at).locale("en").format("DD-MM-YYYY  HH:mm:ss a"))}

           {columItem('clipboard-list',details?.escrow?.buyer_id == customerID
                  ? details?.escrow?.invitation_mail
                    ? t("transactionsScreen.sphone")
                    : t("transactionsScreen.sname")
                  : details?.escrow?.invitation_mail
                  ? t("transactionsScreen.bphone")
                  : t("transactionsScreen.bname"),details?.escrow?.buyer_id == customerID ? details?.escrow?.seller_name+'@'+details?.escrow.seller.mobile : details?.escrow?.buyer_name+'@'+details?.escrow.buyer.mobile)}



           {rowItem('clipboard-list',t("transactionDetails.productType"),details?.escrow?.product_condition == "new"? t("transactionDetails.new"): t("transactionDetails.used"),
            'clipboard-list',t("transactionsScreen.category"),i18n.language == "ar"? details?.category[0]?.name_ar: details?.category[0]?.name_en)}

           {/* {columItem('clipboard-list',t("transactionsScreen.escrowTitle"),details?.escrow?.title)} */}
           
           {details?.escrow.escrow_type==0&&
           columItem('clipboard-list',t("transactionsScreen.ItemContains"),details?.escrow?.products?.length)
           }

           {/* {details?.escrow.escrow_type!=1&&
           columItem('',t("transactionsScreen.ItemContains"),details?.escrow?.agreement || t("transactionsScreen.Agreement_Linked"))
           } */}


          
            {/* {details} */}
            {columItem('clipboard-list',t("transactionDetails.productdesc"),details?.escrow?.details)}
           
            {rowItem('clipboard-list',t("transactionsScreen.status"),details?.escrow?.status.value,
            'clock',t("transactionDetails.delivery"),details?.escrow?.delivery_confirmation + " " + deliveryText)}

            {/* {escrow confirm period} */}
            {columItem('clock',t("transactionDetails.confirm"),details?.escrow?.escrow_confirmation + " " + confirmText)}
           
            {/* {delivery confirm period} */}
            {/* {columItem('clock',t("transactionDetails.delivery"),details?.escrow?.delivery_confirmation + " " + deliveryText)} */}
           
            {/* {inspection confirm period} */}
            {columItem('clock',t("transactionDetails.inspection"),details?.escrow?.inspection_period + " " + inspectionText)}
           
            {/* buyer charge */}
            {details?.escrow?.escrow_type == 0 && (
              <>
              {columItem('money-bill-wave-alt',t("transDetailsScreen.chargeBuyer"),details?.escrow?.buyer_charge +" " +t("reviewTransaction.sar"))}
                
                {/* seller charge */}
                {columItem('money-bill-wave-alt',t("transDetailsScreen.sellerCharge"),details?.escrow?.seller_charge +t("reviewTransaction.sar"))}

               
              </>
            )}

            {details?.escrow?.shipping_cost != 0 &&
              details?.escrow?.escrow_type == 0 && (
                <>
                  {/* shipping payer */}
                  {columItem('user',t("transDetailsScreen.shipingPayer"),details?.escrow?.charge_shipping == 1? t("transDetailsScreen.seller"): t("transDetailsScreen.bayer"))}

                 
                  {/* shipping Cost */}
                  {columItem('money-bill-wave-alt',t("transDetailsScreen.shippingCost"),details?.escrow?.shipping_cost +t("reviewTransaction.sar"))}

                 
                </>
              )}
            {/* vat percentage */}
          
            {details?.escrow?.escrow_type == 0 && (
              <>
                {/* Expiry date */}
                {columItem('calendar',t("transDetailsScreen.exp"),moment(details?.escrow?.expiry_date).locale("en").format("DD-MM-YYYY"))}

               
                {/* inspection period */}
                {columItem('calendar',t("transDetailsScreen.insPer"),details?.escrow?.extended_vat == 0
                          ? details?.escrow?.inspection_period +
                            t("transDetailsScreen.day") +
                            t("transDetailsScreen.standard")
                          : details?.escrow?.inspection_period +
                            t("transDetailsScreen.day"))}

               
              </>
            )}

           

            {/*  files*/}
            {details?.escrow?.escrow_type == 0 ? (
              <>
                <Collapse>
                  <CollapseHeader>
                    <View style={styles.accordionAgreementTitle}>
                      <View style={styles.aggIcon}>
                        <Ionicons
                          name="ios-documents"
                          size={18}
                          color={COLORS.loginTab}
                        />
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("transDetailsScreen.agg")}
                          style={styles.accordionTitle}
                        />
                      </View>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={30}
                        color={COLORS.header}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={styles.agreementBodyCont}>
                    {details?.agreements.map((el) => (
                      <TouchableOpacity
                        onPress={() => {
                          setAgreementDetails(el);
                          setShowAgreementDetails(true);
                        }}
                      >
                        <CustomText
                          color={COLORS.header}
                          size={14}
                          text={el?.title}
                          style={styles.accordionTitle}
                        />
                      </TouchableOpacity>
                    ))}
                  </CollapseBody>
                </Collapse>
              </>
            ) : (
              <>
                {details?.escrow?.attachments.length > 0 && (
                  <Collapse>
                    <CollapseHeader>
                      <View style={styles.accordionAgreementTitle}>
                        <View style={styles.aggIcon}>
                          <Ionicons
                            name="ios-documents"
                            size={18}
                            color={COLORS.loginTab}
                          />
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.attachments")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <MaterialIcons
                          name="arrow-drop-down"
                          size={30}
                          color={COLORS.header}
                        />
                      </View>
                    </CollapseHeader>
                    <CollapseBody style={styles.agreementBodyCont}>
                      {details?.escrow?.attachments.map((el, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            navigation.navigate("PDFViewer", {
                              link: el,
                              attachment: true,
                            });
                          }}
                        >
                          <CustomText
                            color={COLORS.header}
                            size={14}
                            text={
                              t("transDetailsScreen.attachment") + (index + 1)
                            }
                            style={styles.accordionTitle}
                          />
                        </TouchableOpacity>
                      ))}
                    </CollapseBody>
                  </Collapse>
                )}
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("PDFViewer", {
                      link: details?.agreements[0]?.attachment_path,
                    });
                  }}
                >
                  <CustomText
                    color={COLORS.header}
                    size={14}
                    text={t("shortEscrow.previewAgg")}
                    style={styles.accordionTitle}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* {isNextStep? */}
          <View style={styles.nextStepContainer}>
          <TouchableOpacity style={{width:'100%', flexDirection:'row',alignItems:'center',}}
          onPress={()=> {
            setIsExpanded(!isExpanded)
            setIsScrollToEnd(true)
            }}>
           <CustomText
           color={COLORS.black}
           size={16} style={{width:'95%',textAlign:'left'}}
           text={t('transactionsScreen.nextStep')}/>
           <Ionicons name={isExpanded?"caret-up-outline":"caret-down-outline"}  size={18} color={COLORS.header}/>
           </TouchableOpacity>
           {isExpanded?
           <View style={styles.btnContainer3}>
           <CustomText
           color={COLORS.black}
           size={16} style={{width:'95%',textAlign:'left'}}
           text={nextStepText?nextStepText:'- -'}/>
           </View>
          :null}
           </View>
          {/* :null} */}

          <View style={styles.btnContainer2}>
            {/* Buttons Section */}
            {/* all cases with codes 
            ["code"=>0,"value"=>"Awaiting Acceptance"]
            ["code"=>1,"value"=>"Completed"]
            ["code"=>2,"value"=>"Accepted"]
            ["code"=>3,"value"=>"Delivered"]
            ["code"=>4,"value"=>"Reject And Return"]
            ["code"=>5,"value"=>"Accept Return"]
            ["code"=>6,"value"=>"Accepted-Paid"]
            ["code"=>8,"value"=>"Disputed"]
            ["code"=>9,"value"=>"Cancelled"]
            ["code"=>10,"value"=>"On-Hold"]
            ["code"=>11,"value"=>"delivery-confirm"]
          */}
            {/*  (1)  if the escrow initiated  (Awaiting Acceptance) (Not Accepted yet ) buyer & seller  (done)*/}
            {details?.escrow?.status?.code == 0 && (
              <CustomButton
                color={COLORS.red}
                onPress={() => {
                  isVerified
                    ? setShowCancleEscrowModal({
                        status: true,
                        val: "",
                      })
                    : setShowKYCModal(true);
                }}
                textSize={12}
                text={t("transDetailsScreen.cancle")}
                containerStyle={styles.btn}
              />
            )}
            {/* (2) Accept and pay - buyer only if escrow created by seller (have a problem )*/}
            {/* omar */}
            {details?.escrow?.status?.code == 0 &&
              details?.escrow?.buyer_id == customerID &&
              details?.escrow?.creator_id != customerID && (
                <CustomButton
                  color={COLORS.blue}
                  loading={payLoading}
                  textSize={12}
                  onPress={
                    () => setShowPayTypeModal(true)
                    // isVerified ? setShowPayModal(true) : setShowKYCModal(true)
                  } // handlePay("payOnly")
                  text={t("transDetailsScreen.a")}
                  containerStyle={styles.btn}
                />
              )}
            {/* // if transaction created by buyer seller must make accept (done) */}
            {details?.escrow?.status?.code == 0 &&
              details?.escrow?.seller_id == customerID &&
              details?.escrow?.creator_id != customerID && (
                <CustomButton
                  color={COLORS.blue}
                  textSize={12}
                  onPress={() =>
                    isVerified
                      ? (getCharge(), setShowAcceptedBySellerModal(true))
                      : setShowKYCModal(true)
                  }
                  text={t("transDetailsScreen.accept")}
                  containerStyle={styles.btn}
                />
              )}
            {/* (3) escrow created by buyer and seller make accept buyer will make pay now (done) */}
            {details?.escrow?.status.code == 2 &&
              details?.escrow?.buyer_id == customerID && (
                <CustomButton
                  color={COLORS.blue}
                  loading={payLoading}
                  disabled={payLoading}
                  textSize={12}
                  onPress={() => {
                    setShowPayTypeModal(true);
                    // isVerified ? setShowPayModal(true) : setShowKYCModal(true); // handlePay("payOnly")
                  }}
                  text={t("transDetailsScreen.paynow")}
                  containerStyle={styles.btn}
                />
              )}

            {/* (5) Accept paid  seller can send delivery notes (done) */}
            {details?.escrow?.status?.code == 6 &&
              details?.escrow?.buyer_id != customerID && (
                <CustomButton
                  color={COLORS.blue}
                  // loading={ButtonLoading ? true : false}
                  textSize={12}
                  onPress={() => {
                    isVerified
                      ? setShowCancleEscrowModal({
                          status: true,
                          val: "deliveryNotes",
                        })
                      : setShowKYCModal(true);
                  }}
                  text={t("transDetailsScreen.ItemDeliveryNotice")}
                  containerStyle={styles.btn}
                />
              )}
            {/* (7) in case of Delivered and escrow_type = 0 old escrow(buyer) (reject and return, dispatch) */}
            {details?.escrow?.status?.code == 3 &&
              details?.escrow?.buyer_id == customerID &&
              details?.escrow?.escrow_type == 0 && (
                <>
                  <CustomButton
                    color={COLORS.red}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "rejectAndReturn",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.rr")}
                    containerStyle={styles.btn}
                  />
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "dispatchByBuyer",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.d")}
                    containerStyle={styles.btn}
                  />
                </>
              )}
            {/* (8) in case of Delivered and escrow_type = 1 short escrow(buyer) (confirm) */}
            {details?.escrow?.status?.code == 3 &&
              details?.escrow?.buyer_id == customerID &&
              details?.escrow?.escrow_type == 1 && (
                <>
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "confirmDelivery",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.confirmDelivery")}
                    containerStyle={styles.btn}
                  />
                </>
              )}
            {/* (11) in case of Delivery Confirmed and escrow_type = 1 short escrow(buyer) reject and return, dispatch) */}
            {details?.escrow?.status?.code == 11 &&
              details?.escrow?.buyer_id == customerID &&
              details?.escrow?.escrow_type == 1 && (
                <>
                  <CustomButton
                    color={COLORS.red}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "rejectAndReturn",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.rr")}
                    containerStyle={styles.btn}
                  />
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "dispatchByBuyer",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.d")}
                    containerStyle={styles.btn}
                  />
                </>
              )}
            {/* (9) in case of Reject And Return (seller) (accept return & dispute) */}
            {details?.escrow?.status?.code == 4 &&
              details?.escrow?.buyer_id != customerID && (
                <>
                  <CustomButton
                    color={COLORS.red}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "sellerRaiseDispute",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.rd")}
                    containerStyle={styles.btn}
                  />
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "sellerAcceptRejection",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.ar")}
                    containerStyle={styles.btn}
                  />
                </>
              )}
            {/* (10) in case of Reject And Return (buyer) (dispatch) */}
            {details?.escrow?.status?.code == 4 &&
              details?.escrow?.buyer_id == customerID && (
                <>
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "dispatchByBuyer",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.d")}
                    containerStyle={styles.btn}
                  />
                </>
              )}
            {/* (11) in case of Disputed (buyer) (dispatch) */}
            {details?.escrow?.status?.code == 8 &&
              details?.escrow?.buyer_id == customerID && (
                <>
                  <CustomButton
                    color={COLORS.blue}
                    textSize={12}
                    onPress={() => {
                      isVerified
                        ? setShowCancleEscrowModal({
                            status: true,
                            val: "dispatchByBuyer",
                          })
                        : setShowKYCModal(true);
                    }}
                    text={t("transDetailsScreen.d")}
                    containerStyle={styles.btn}
                  />
                </>
              )}

            {/*  (12) (cancelled / completed / Accept Return) have no btns -----
             */}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    );
  };
  const [messages, setMessages] = useState([]);

  const loadMessages = async () => {
    setChatLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS2.getMessages,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: { conversation_id: details?.escrow?.conversation?.id, device_info: deviceInfo },
    })
      .then((res) => {
        // let chat = res?.data?.data?.messages?.map((el) => ({
        //   _id: el.id,
        //   text: el.message,
        //   createdAt: el.created_at,
        //   user: {
        //     _id: el.sender.id,
        //     name: el.sender.firstname,
        //     avatar: el.sender.image,
        //   },
        //   sent: true,
        //   received: el.seen == 1,
        // }));
        // setMessages(chat);

        let chat =res?.data?.data?.messages
        if(chat?.length>0){
          const array=[]
          chat.forEach(el => {
            const obj={
               _id: el.id,
              text: el.message,
              createdAt: el.created_at,
              user: {
                _id: el.sender.id,
                name: el.sender.firstname,
                avatar: el.sender.image,
              },
            sent: true,
            received: el.seen == 1,
            }
           array.push(obj)
          });
          setMessages(array);
        }
        setChatLoading(false);
      })
      .catch((er) => {
        setChatLoading(false);
        setErrMess(t("transactionDetails.err"));
        console.log("er chat : ", er);
      });
  };
  useEffect(() => {
    baseURL && details && loadMessages();
  }, [baseURL, details]);

  const onSend = useCallback(
    async (messages = []) => {
      if (!details?.escrow?.conversation?.id) return;
      const token = await AsyncStorage.getItem("TOKEN");
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      axios({
        method: "post",
        url: baseURL + ENDPOINTS2.reply,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "X-Localization": i18n?.language,
        },
        data: {
          conversation_id: details?.escrow?.conversation?.id,
          message: messages[0]?.text,
          device_info: deviceInfo
        },
      }).then((res) => {
        console.log("chat res", res);
        if(res.data.error){
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('mistake'),
                message: res.data.error,
                action: "",
                type:'error'
              },
            })
          );
        }else{
          loadMessages();
        }
      })
      // setMessages((previousMessages) =>
      //   GiftedChat.append(previousMessages, messages)
      // );
      Keyboard.dismiss();
    },
    [details]
  );

  const PayTypeModel = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPayTypeModal}
        onRequestClose={() => {
          setShowPayTypeModal(!showPayTypeModal);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <CustomText
              color={COLORS.black}
              size={16}
              text={t("transDetailsScreen.choosePayType")}
              style={styles.title}
            />
            <View style={{ marginBottom: "10%" }}>
              <CustomButton
                loading={payLoading}
                disabled={payLoading}
                color={COLORS.blue}
                onPress={() => {
                  setPayType("wallet");
                  setShowPayTypeModal(false)
                  isVerified ? setShowPayModal(true) : setShowKYCModal(true);
                }}
                textSize={14}
                text={t("transDetailsScreen.wallet")}
                containerStyle={styles.closeButton}
                textStyle={styles.initiateBtnTxt}
              />
              <CustomButton
                loading={payLoading}
                disabled={payLoading}
                color={COLORS.blue}
                onPress={() => {
                  // setShowPayTypeModal(!showPayTypeModal);
                  setPayType("card");
                  setShowPayTypeModal(false);
                  isVerified ? setShowPayModal(true) : setShowKYCModal(true);
                }}
                textSize={14}
                text={t("transDetailsScreen.card")}
                containerStyle={styles.closeButton}
                textStyle={styles.initiateBtnTxt}
              />
            </View>
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                setShowPayTypeModal(!showPayTypeModal);
              }}
              textSize={14}
              text={t("transDetailsScreen.close")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const getCharge = async (val) => {
    setChargeLoading(true);
    console.log(
      "getCharge : ",
      details?.escrow?.id,
      val ? val : sellerPaymentValue
    );
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    fetch(baseURL + ENDPOINTS2.getChargeAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
      body: JSON.stringify({
        escrow_id: details?.escrow?.id,
        payment_type: val ? val : sellerPaymentValue,
        device_info: deviceInfo
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setChargeLoading(false);
        if (responseData.charge) {
          setChargeAmount(responseData.charge);
        } else {
          showMessage({ message: responseData.messages.error, type: "danger" ,titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}});
        }
      })
      .catch((e) => {
        setChargeLoading(false);
        console.log(e);
      });
  };
  const AcceptBySellerModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAcceptedBySellerModal}
        onRequestClose={() => {
          setShowAcceptedBySellerModal(!showAcceptedBySellerModal);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <CustomText
              color={COLORS.black}
              size={16}
              text={t("transDetailsScreen.confirmAccept")}
              style={styles.title}
            />
            {/* ibrahim */}
            <View style={styles.dropdownCont}>
              <CustomText
                containerStyle={{ marginLeft: wp(2) }}
                color={COLORS.lightGrey}
                size={14}
                text={t("transDetailsScreen.choosePayCharge")}
              />
              <SelectDropdown
                data={
                  sellerPaymentMethods
                    ? sellerPaymentMethods.map((el) => el.name)
                    : []
                }
                defaultButtonText={
                  sellerPaymentMethods ? sellerPaymentMethods[0].name : ""
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
                  setSellerPaymentValue(sellerPaymentMethods[index].value);
                  getCharge(sellerPaymentMethods[index].value);
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
            <View style={{ height: hp(15) }}>
              {chargeLoading ? (
                <ActivityIndicator size={"large"} color={COLORS.header} />
              ) : (
                <CustomInput
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
                />
              )}
            </View>

            <CustomButton
              loading={payLoading}
              disabled={payLoading}
              color={COLORS.blue}
              onPress={handleAcceptEscrowBySeller}
              textSize={14}
              text={t("transactionDetails.ok")}
              containerStyle={styles.closeButton}
              textStyle={styles.initiateBtnTxt}
            />
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                setShowAcceptedBySellerModal(!showAcceptedBySellerModal);
              }}
              textSize={14}
              text={t("transDetailsScreen.close")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          </View>
        </View>
      </Modal>
    );
  };

  const getCards = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "get",
      url: baseURL + ENDPOINTS.getCardsPlus,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
    })
      .then((res) => {
        if (res?.data?.cards) {
          if (res?.data?.cards.length > 0) {
            var card = res?.data?.cards.find((element) => element.default_card==1);
            setDefaultCard(card)
            setCardID(card?.id)
            // res?.data?.cards.forEach(element => {
            //   if(element.default_card==1){
            //     setDefaultCard(element)
            //   }
            // });
          } else {
            setDefaultCard({});
          }
        } 
      })
      .catch((er) => {
        console.log("errr : ", er);
      });
  };

  // animation when chat is locked
  const animate = () => {
      animatedValue.setValue(0);
      Animated.timing(animatedValue, {
          toValue: 20,
          useNativeDriver: true,
          easing: Easing.linear,
          duration: 3000,
      }).start();
}
  const showChatAlert=()=>{
    return(
      <Modal
        animationType="slide"
        transparent={true}
        visible={showMessageReason}
        onRequestClose={() => {
          setShowMessageReason(!showMessageReason);
        }}
      >
        <View style={styles.modalView2}>     
           <View style={{}}>

           <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() => {
                  setShowMessageReason(!showMessageReason);
                  refRBSheet.current.open();
                }}
                name={"closecircleo"}
                size={25}
                color={COLORS.red}
              />
            </TouchableOpacity>

            <CustomInput
                  label={t("transDetailsScreen.writeReason")}
                  value={reason}
                  containerStyle={styles.textInputContainer}
                  maxLength={100}
                  onChangeText={(text)=> setReason(text)}
                  textInputStyle={{height:hp(15)}}
                  multiline={true}
                />
            </View>
            <CustomButton
              loading={reportLoading}
              color={COLORS.blue}
              onPress={() => {
                if(reason){
                  if(chatOptionType==1){
                    handleChatReport()
                  }else{
                    handleUserBlock()
                  }
                }else{
                  showMessage({
                    message: t('transDetailsScreen.writeReasonFirst'),
                    type: "danger",
                    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                  });
                }
                
              }}
              textSize={14}
              text={t("Send")}
              containerStyle={styles.closeButton}
              textStyle={{color: COLORS.white}}
            />
        </View>
      </Modal>
    )
  }

  const chatOption=()=>{
    return(
      <>
      <TouchableOpacity style={[styles.chatOption,{marginTop:hp(3)}]}
     onPress={()=>{
       setChatOptionText(t("transDetailsScreen.chatReportDone"))
       setChatOptionType(1)
      //  refRBSheet.current.close();
       setShowMessageReason(true)
       }}>
       <Ionicons name="chatbox-outline" size={25} color={COLORS.blue}/>
       <CustomText
           color={COLORS.black}
           size={15}
           text={t("transDetailsScreen.chatReport")}
           style={{marginHorizontal:wp(2)}}/>
     </TouchableOpacity>
     <View style={{width:'100%', height:0.7, backgroundColor:COLORS.lightGrey}}/>
     <TouchableOpacity style={styles.chatOption}
      onPress={()=>{
       setChatOptionText(t("transDetailsScreen.chatBlockDone"))
       setChatOptionType(2)
      //  refRBSheet.current.close();
       setShowMessageReason(true)
       }}>
       <Ionicons name="person-remove-outline" size={25} color={COLORS.blue}/>
       <CustomText
           color={COLORS.black}
           size={15}
           text={t("transDetailsScreen.chatBlock")}
           style={{marginHorizontal:wp(2)}}/>
     </TouchableOpacity>   
     <View style={{width:'100%', height:0.7, backgroundColor:COLORS.lightGrey}}/>
     </>
    )
  }

  const chatMessageReason=()=>{
    return(
    <View style={{alignItems:'center',marginBottom: hp(2)}}>     
      <View style={{}}>
        <TouchableOpacity style={CommonStyles.closeCont}>
         <AntDesign
           onPress={() => {
             setShowMessageReason(!showMessageReason);
           }}
           name={"closecircleo"}
           size={25}
           color={COLORS.red}
           style={{marginTop: hp(1)}}
         />
        </TouchableOpacity>

        <CustomInput
             label={t("transDetailsScreen.writeReason")+'*'}
             value={reason}
             containerStyle={styles.textInputContainer}
             maxLength={100}
             onChangeText={(text)=> setReason(text)}
             textInputStyle={{height:hp(13)}}
             multiline={true}
           />
       </View>
       <CustomButton
         loading={reportLoading}
         color={COLORS.blue}
         onPress={() => {
           if(reason){
             if(chatOptionType==1){
               handleChatReport()
             }else{
               handleUserBlock()
             }
           }else{
             showMessage({
               message: t('transDetailsScreen.writeReasonFirst'),
               type: "danger",
               titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
             });
           }
         }}
         textSize={14}
         text={t("Send")}
         containerStyle={[styles.closeButton,{marginTop: 1,}]}
         textStyle={{color: COLORS.white}}
         disabled={!reason}
       />
    </View>
    )
  }

 const renderTimeLineItem=({item,index})=>{
  return(
    <View style={{width:'100%', alignItems:'center', flexDirection:'row'}}>
      <View style={{width: wp(30),flexDirection:'row'}}>
       <CustomText  color={COLORS.red} size={10} style={{width:wp(28),alignSelf:index==0 ?'flex-start':index==details?.timeline.length-1?'flex-end':'center'}}
       text={
        item.done==1?
        item.done_at? 
        moment(item?.done_at).locale("en").format("DD-MM-YYYY, hh:mm:ss a"):
        moment(item?.created_at).locale("en").format("DD-MM-YYYY, hh:mm:ss a")
        :''
        }/>
       <View style={{alignItems:'center'}}>
         {index!=0&&
          <View style={{height:hp(6.5), width:wp(1), backgroundColor: item.done==1? COLORS.blue : COLORS.grey}}/>
         }

         {item.current==1?
          <View style={{width:25, height:25,alignItems:'center',justifyContent:'center', borderRadius:25/2}}>
           <Lottie
           style={{
             width: 60,
             height:60,
           }}
           source={require("../../assets/lottie/circle-wave1.json")}
           autoPlay
           loop={true}/>
         </View>
         :
          <View style={{width:25, height:25,alignItems:'center', borderRadius:25/2, backgroundColor: item.done==1? COLORS.blue : COLORS.grey}}/>
         }
        
         {index!=details?.timeline.length-1&&
         <View style={{height:hp(6.5), width:wp(1), backgroundColor: item.done==1? COLORS.blue : COLORS.grey, marginBottom:-hp(2)}}/>
         }
       </View>
      </View>
      <View style={{width:wp(10)}}/>
      <View style={{flex:1,alignSelf:index==0?'flex-start':index==details?.timeline.length-1?'flex-end':'center'}}>
        {item.status&&
        <CustomText  color={item.done==1? COLORS.red: COLORS.grey} size={11} text={item.status} style={{flex:1,textAlign:'left'}}/>
        }
        {item.done==1&&
        <CustomText  color={item.done==1? COLORS.header: COLORS.grey} size={11} text={item.status_title} style={{flex:1,textAlign:'left'}}/>
        }
        {item.notes&&item.done==1&&
        <CustomText  color={COLORS.primaryTxt} size={12} text={item.notes} style={{flex:1,textAlign:'left',marginBottom:hp(2)}}/>
        }
      
      </View>
    </View>
  )
 }

  return (
    <View style={styles.container}>
      <CustomHeader
        navigation={navigation}
        warningBack={true}
        backAction={() => {
          if (route.params.from == "Pay") {
            navigation.navigate("Transactions");
          } else {
            navigation.goBack();
          }
        }}
      />
      <ScrollView
        // scrollEnabled={false}
        nestedScrollEnabled={true}
        horizontal
        contentContainerStyle={{ flex: 1 }}
        pagingEnabled={true}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View style={CommonStyles.transactionsContainer}>
          
          <View style={{width:'98%',flexDirection:'row', alignItems:'center',justifyContent:'center'}}>
          {/* <CustomText
            color={COLORS.primaryTxt}
            size={20}
            text={t("transDetailsScreen.transDet")}
            style={CommonStyles.titleTxt}
          /> */}
          {details?.escrow?.title&&details?.escrow?.escrow_number? 
           <View style={{alignItems:'center',justifyContent:'center' ,flexDirection:'row',flex:1}}> 
            <CustomText 
            color={COLORS.primaryTxt}
            size={13}
            text={`${t("transactionsScreen.details")}: ${details?.escrow?.title} `}
            style={{}}
            />
            <CustomText 
            color={COLORS.primaryTxt}
            size={13}
            text={`(${details?.escrow?.escrow_number})`}
            style={{}}
            />
            </View>
           :null}
          {selected==2 &&
          (details?.escrow?.status.code != 1 &&
          details?.escrow?.status.code != 9 &&
          details?.escrow?.status.code != 5)?
          <TouchableOpacity style={{alignItems:'center',marginHorizontal:wp(0.5)}}
           onPress={()=> refRBSheet.current.open()}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.blue}/>
          </TouchableOpacity>
          :null}
          
          </View>
          {/* tabs */}
          <View style={styles.tabCont}>
            {[
              { name: t("transDetailsScreen.transInfo"), icon: "details" },
              { name: t("transDetailsScreen.pay"), icon: "timeline-text" },
              { name: t("transDetailsScreen.chat"), icon: "chat" },
            ].map((el, i) => (
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  disabled={details ? false : true}
                  onPress={() => {
                    i == 1 && onRefresh();
                    setSelected(i);
                    if(i==2) {
                      animate()
                      const interval = setInterval(() => {
                        animate()
                      }, 2000);
                      return () => clearInterval(interval);
                    }
                  }}
                  key={i}
                  style={
                    i == selected
                      ? [styles.tabItem, { backgroundColor: COLORS.header }]
                      : styles.tabItem
                  } //in case of active]:''}
                >
                  <MaterialCommunityIcons
                    name={el.icon}
                    color={i == selected ? "white" : COLORS.loginTab}
                    size={20}
                  />
                  <CustomText
                    color={i == selected ? COLORS.activeTabTxt : COLORS.tabTxt} //state=el white
                    size={width * 0.025}
                    text={`${el.name}`}
                    // style={styles.tabTxt}
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {loading ? (
            <View style={styles.indicator}>
              <ActivityIndicator size={"large"} color={COLORS.header} />
            </View>
          ) : selected == 0 ? (
            details ? (
              <DetailsInfo />
            ) : (
              <CustomText
                text={t("transDetailsScreen.enf")}
                color={COLORS.header}
              />
            )
          ) : selected == 1 && !loading ? (
            details?.timeline?.length == 0 ? (
              <View style={{ alignSelf: "center" }}>
                <CustomText
                  text={t("transDetailsScreen.noD")}
                  color={COLORS.header}
                />
              </View>
            ) : (
              <View style={styles.TimeLineContainer}>
              <FlatList
                data={details?.timeline}
                renderItem={renderTimeLineItem}
                keyExtractor={(item, index) => index}
               />


                {/* <Timeline
                  circleColor={COLORS.header}
                  lineColor={COLORS.header}
                  descriptionStyle={{
                    color: COLORS.description,
                    fontFamily: "BahijTheSansArabic-Plain",
                    fontWeight: "normal",

                    backgroundColor: "red",
                    textAlign: "left",
                  }}
                  titleStyle={{
                    color: COLORS.black,
                    fontFamily: "BahijTheSansArabic-Plain",
                    fontWeight: "normal",
                    textAlign: "left",
                  }}
                  timeStyle={{
                    color: COLORS.black,
                    fontFamily: "BahijTheSansArabic-Plain",
                    fontWeight: "normal",
                    //  textAlign: "left",
                  }}
                  options={{
                    nestedScrollEnabled: true,
                    scrollEnabled: true,
                  }}
                  data={details?.timeline}
                  nestedScrollEnabled={true}
                  renderDetail={(rowData) => {
                    let title = (
                      <CustomText style={{ color: COLORS.red }}>
                        {rowData?.status}
                      </CustomText>
                    );
                    let desc = (
                      <>
                        <CustomText
                          size={13}
                          style={{
                            color: COLORS.header,
                            textAlign: i18n.language == "ar" ? "right" : "left",
                          }}
                        >
                          {rowData?.status_title}
                        </CustomText>
                        <CustomText size={12} style={{ color: "black" }}>
                          {rowData?.notes}
                        </CustomText>
                        <View>
                          {rowData?.attachment_path?.length > 0 &&
                            rowData?.attachment_path[0] != null &&
                            rowData?.attachment_path?.map((el, index) => (
                              <TouchableOpacity
                                disabled={downloadLoading}
                                onPress={() => {
                                  navigation.navigate("PDFViewer", {
                                    link: el,
                                    attachment: true,
                                  });
                                }}
                              >
                                <CustomText
                                  style={{
                                    color: "blue",
                                  }}
                                  size={13}
                                >
                                  {t("transDetailsScreen.attachment") +
                                    (index + 1)}
                                </CustomText>
                              </TouchableOpacity>
                            ))}
                        </View>
                      </>
                    );
                    return (
                      <View
                        style={{
                          alignItems: "flex-end",
                          marginHorizontal: wp(2),
                          textAlign: "left",

                          maxWidth: "80%",
                          alignSelf: "flex-end",
                        }}
                      >
                        {title}
                        {desc}
                      </View>
                    );
                  }}
                  renderTime={(rowData) => (
                    <View style={{ width: "20%" }}>
                      <CustomText color={COLORS.red} size={10}>
                        {moment(rowData?.created_at)
                          .locale("en")
                          .format("DD-MM-YYYY, hh:mm:ss a")}
                      </CustomText>
                    </View>
                  )}
                /> */}
                {/* {counters} */}
                {isCounted && (
                  <>
                    <CustomText
                      color={COLORS.header}
                      size={13}
                      text={
                        details?.escrow?.remaining_time?.title
                          ? details?.escrow?.remaining_time?.title
                          : ""
                      }
                    />
                    <View  style={i18n.language=='ar'? {transform: [{rotateY: '180deg'}]}:{}}>
                    <CountDown
                      size={18}
                      until={counter}
                      onFinish={() => {
                        setCounter(0);
                        SetIsCounted(false);
                        showMessage({
                          message: t("timeOut"),
                          type: "warning",
                          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                        });
                        navigation.navigate("Transactions");
                      }}
                      digitStyle={{
                        backgroundColor: "#FFF",
                        borderWidth: 2,
                        borderColor: COLORS.header,
                      }}
                      digitTxtStyle={i18n.language=='ar'?styles.digitTxtStyle_ar:styles.digitTxtStyle_en}
                      timeLabelStyle={i18n.language=='ar'?styles.timeLabelStyle_ar:styles.timeLabelStyle_en}
                      separatorStyle={{ color: COLORS.header }}
                      timeToShow={["D", "H", "M", "S"]}
                      timeLabels={{
                        d: t("days"),
                        h: t("hours"),
                        m: t("minutes"),
                        s: t("seconds"),
                      }}
                      showSeparator
                      // onChange={(e) => console.log("change counter : ", e)}
                    />
                    </View>
                  </>
                )}
                <CustomText color={COLORS.black} size={12} style={{width:'95%',textAlign:'left',marginTop:hp(1)}}
                 text={nextStepText?t('transactionsScreen.nextStep')+ ': ' + nextStepText:''}/>
              </View>
            )
          ) : selected == 2 ? (
            <View style={styles.chatCont}>
              <Pressable
                onPress={() => {
                  loadMessages();
                  animate()
                }}
              >
                {chatLoading ? (
                  <ActivityIndicator size={"large"} color={COLORS.header} />
                ) : (
                  <MaterialIcons
                    name="refresh"
                    size={30}
                    color={COLORS.header}
                  />
                )}
              </Pressable>
              <GiftedChat
                placeholder={t("chatPlaceHolder")}
                textInputProps={{textAlign:i18n.language=='ar'?'right': 'left',fontFamily:'BahijTheSansArabic-Plain',fontSize: wp(3)}}
                renderInputToolbar={
                  details?.escrow?.status.code == 1 ||
                  details?.escrow?.status.code == 9 ||
                  details?.escrow?.status.code == 5
                    ? () => null
                    : undefined
                }
                listViewProps={{
                  scrollEnabled: true,
                  nestedScrollEnabled: true,
                }}
                messages={messages}
                onSend={(messages) => {
                  onSend(messages)
                }}
                user={{
                  _id: parseInt(customerID),
                }}
                inverted={false}
                renderSend={(props) => {
                  return <Send label={t("Send")} {...props} />;
                }}
                renderMessage={(props) => {
                  console.log("props chat : ", props);
                  return (
                    // <></>
                    <Bubble
                      {...props}
                      wrapperStyle={{
                        right: {
                          marginVertical: hp(0.5),
                        },
                      }}
                      tickStyle={{
                        color:
                          props.currentMessage.sent &&
                          props.currentMessage.received
                            ? "#2AFA09"
                            : "#505455",
                        fontSize: 10,
                      }}
                    />
                  );
                }}
              />
              {Platform.OS === "android" && (
                <KeyboardAvoidingView behavior="padding" />
              )}
              
              { details?.escrow?.status.code == 1 ||
                details?.escrow?.status.code == 9 ||
                details?.escrow?.status.code == 5?

              <View style={{width:'100%', position:'absolute', top: height*0.15,alignItems:'center'}}>
                  <Animated.Text style={[styles.wave, { transform: [{ rotate }] }]}>👋</Animated.Text>
                  <CustomText
                    color={COLORS.black}
                    size={12}
                    text={t('transDetailsScreen.chatClocked')}
                  />
              </View>
              :
              <View style={{width:'100%', position:'absolute', bottom: height*0.07}}>
              <FlatList
              nestedScrollEnabled
              style={{flex:1}}
              data={SuggestedMessages}
              horizontal
              showsHorizontalScrollIndicator={true}
              renderItem={({item,index})=>{
                return(
                  <TouchableOpacity style={styles.messageContainer}
                  onPress={()=>onSend([{text: item.message}])}>
                  <CustomText
                    color={COLORS.header}
                    size={12}
                    text={item.message}
                  />
                  </TouchableOpacity>
                )
              }}
              keyExtractor={item => item.id}/>
              </View>
              }
              
            </View>
          ) : null}
        </View>
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showPayModal}
        onRequestClose={() => {
          setShowPayModal(!showPayModal);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View style={styles.modalContent1}>
              <CustomText
                color={COLORS.settTitle}
                size={18}
                text={t("transDetailsScreen.payHeader")}
                style={styles.title}
              />
              <View style={styles.settDescTitle}>
                <CustomText
                  color={COLORS.black}
                  size={16}
                  text={
                    t("transDetailsScreen.payAmount") + details?.escrow?.amount
                  }
                  style={styles.title}
                />
              </View>
              <View style={styles.couponContainer}>
                <CustomInput
                  containerStyle={{ width: "65%" }}
                  label={t("transDetailsScreen.couponLabel")}
                  // placeholder={t("transDetailsScreen.zipp")}
                  value={couponCode}
                  onChangeText={setCouponCode}
                  // error={zip.length > 0 ? false : true}
                  // errorMessage={t("updateProfile.err")}
                  // inputRef={ref5}
                  // icon={
                  //   <FontAwesome5
                  //     name="money-bill-wave-alt"
                  //     size={15}
                  //     color={COLORS.babyBlue2}
                  //   />
                  // }
                />
                <CustomButton
                  loading={couponLoading}
                  color={showCoupon ? COLORS.red : COLORS.blue}
                  onPress={() => {
                    couponCode.length > 0 &&
                      (showCoupon
                        ? (setShowCoupon(false), setCouponCode(""))
                        : handleCheckCoupon());
                  }}
                  textSize={wp(2.6)}
                  text={
                    showCoupon
                      ? t("transDetailsScreen.em")
                      : t("transDetailsScreen.applyCoupon")
                  }
                  containerStyle={styles.couponButton}
                  textStyle={styles.initiateBtnTxt}
                />
              </View>

              {showCoupon && (
                <>
                  <View style={styles.settDescTitle}>
                    <CustomText
                      color={COLORS.black}
                      size={16}
                      text={t("transDetailsScreen.amo") + couponAmount}
                      style={styles.title}
                    />
                  </View>
                  <View style={styles.settDescTitle}>
                    <CustomText
                      color={COLORS.black}
                      size={16}
                      text={
                        t("transDetailsScreen.aft") +
                        parseFloat(
                          details?.escrow?.amount - couponAmount
                        ).toFixed(2)
                      }
                      style={styles.title}
                    />
                  </View>
                </>
              )}
            </View>

            <CustomButton
              loading={payLoading}
              disabled={payLoading}
              color={COLORS.blue}
              onPress={() => {
                if (payType == "wallet") handlePay("payOnly");
                else{
                  setShowPayModal(false);
                  setShowCardsModal(true)
                  //  handlePayMoyasar("payOnly");
                  }
              }}
              textSize={14}
              text={t("transDetailsScreen.submit")}
              containerStyle={styles.closeButton}
              textStyle={styles.initiateBtnTxt}
            />
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                setShowPayModal(!showPayModal);
              }}
              textSize={14}
              text={t("transDetailsScreen.close")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          </View>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showAgreementDetails}
        onRequestClose={() => {
          setShowAgreementDetails(!showAgreementDetails);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView
            contentContainerStyle={styles.centeredView}
            style={styles.centeredView2}
          >
            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() => {
                  setShowAgreementDetails(!showAgreementDetails);
                }}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
            <CustomText
              color={COLORS.blue}
              size={18}
              text={t("agreementScreen.previewAgg")}
              // style={styles.title}
            />
            <View style={styles.labledDes2}>
              <CustomText
                color={COLORS.header}
                size={15}
                text={t("agreementScreen.viewTitle")}
              />
            </View>
            <CustomText
              color={COLORS.proTxt}
              size={15}
              text={agreementDetails?.title}
              style={styles.viewTitle} // here
            />
            <View style={styles.labledDes2}>
              <CustomText
                color={COLORS.header}
                size={15}
                text={t("agreementScreen.viewCat")}
              />
            </View>
            <CustomText
              color={COLORS.proTxt}
              size={15}
              text={
                i18n.language == "en"
                  ? agreementDetails?.category[0]?.name_en
                  : agreementDetails?.category[0]?.name_ar
              }
              style={styles.viewTitle} // here
            />
            <View style={styles.labledDes2}>
              <CustomText
                color={COLORS.header}
                size={15}
                text={t("agreementScreen.agDesc")}
              />
            </View>
            <CustomText
              color={COLORS.proTxt}
              size={15}
              text={agreementDetails?.description}
              style={styles.agreeDesc} // here
            />
            <View
              style={[
                styles.labledDes2,
                {
                  marginVertical: hp(-1),
                },
              ]}
            >
              <CustomText
                color={COLORS.header}
                size={15}
                text={t("agreementScreen.viewAtt")}
              />
            </View>
            {agreementDetails?.attachment_path ? (
              <>
                <CustomButton
                  loading={downloadLoading}
                  disabled={downloadLoading}
                  color={COLORS.header}
                  onPress={() => {
                    navigation.navigate("PDFViewer", {
                      link: agreementDetails?.attachment_path,
                    });
                  }}
                  textSize={14}
                  text={t("agreementScreen.vAtt")}
                  containerStyle={[
                    styles.closeButton,
                    {
                      height: hp(5),
                      borderColor: COLORS.header,
                      width: wp(30),
                    },
                  ]}
                />
                {/* <CustomText
                  color={COLORS.proTxt}
                  size={15}
                  text={agreementDetails?.attachment_path}
                  style={styles.viewTitle}
                /> */}
              </>
            ) : (
              <CustomText
                color={COLORS.proTxt}
                size={15}
                text={t("agreementScreen.noAtt")}
                style={styles.viewTitle}
              />
            )}
          </ScrollView>
        </View>
      </Modal>


      <Modal
        animationType="slide"
        transparent={true}
        visible={showCardsModal}
        onRequestClose={() => {
          setShowCardsModal(!showCardsModal);
        }}>
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
              <CustomText
                color={COLORS.settTitle}
                size={18}
                text={t("transDetailsScreen.choosePayType")}
                style={styles.title}
              />
            <View style={styles.cardContainer}>
             <RadioButton.Android
              color={COLORS.blue}
              value="default"
              status={ payStatus === 'default' ? 'checked' : 'unchecked' }
              onPress={() => {
                setPayStatus('default')
                setCardID(defaultCard.id)
                }}/>
              <View style={{alignItems:'flex-start',flex:1}}>
               <CustomText color={COLORS.black} size={14} text={t('accountScreen.cardNumber')+': '+defaultCard?.card_number} />
               <CustomText color={COLORS.settTitle} size={14} text={t('accountScreen.nickHolder')+': '+defaultCard?.card_holder} />
               <CustomText color={COLORS.settTitle} size={14} 
               text={t('accountScreen.expiryDate')+': '+ defaultCard?.month+'/'+defaultCard?.year} />
              </View>
            </View>
            <View style={styles.cardContainer}>
             <RadioButton.Android
              color={COLORS.blue}
              value="other"
              status={ payStatus === 'other' ? 'checked' : 'unchecked' }
              onPress={() => {
                setPayStatus('other')
                setCardID('')
                }}/>
               <CustomText
                color={COLORS.settTitle}
                size={15}
                text={t("transDetailsScreen.useOtherCard")}
                style={styles.title}
              />
            </View>
            <TouchableOpacity style={[styles.cardContainer,{paddingHorizontal:wp(3.5)}]}
            onPress={()=> {
              setCardID('')
              setShowCardsModal(false)
              navigation.navigate('Accounts',{isCard: true})
              }}>
              <MaterialIcons name="control-point" size={25} color={COLORS.header}/>

              <CustomText
                color={COLORS.settTitle}
                size={15}
                text={t("transDetailsScreen.addAnotherCard")}
                style={styles.title}
              />
            </TouchableOpacity>
              
             
            <CustomButton
              loading={payLoading}
              disabled={payLoading}
              color={COLORS.blue}
              onPress={() => {
                if (payType == "wallet") handlePay("payOnly");
                else{
                   handlePayMoyasar("payOnly");
                  }
              }}
              textSize={14}
              text={t("transDetailsScreen.submit")}
              containerStyle={styles.closeButton}
              textStyle={styles.initiateBtnTxt}
            />
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                setShowCardsModal(!showCardsModal);
              }}
              textSize={14}
              text={t("transDetailsScreen.close")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          </View>
        </View>
      </Modal>


      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#00000060",
          },
          container: { height: "30%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
        }}>
        <View style={{backgroundColor: COLORS.bg,flex: 1,}}>    
          {showChatOptionAlert?
          <>
            <Lottie
            style={{
              width: wp(20),
              height: hp(12),
              alignSelf:'center',
            }}
            source={require("../../assets/lottie/done3.json")}
            autoPlay={true}
            loop={false}
            />
          <CustomText
            color={COLORS.primaryTxt}
            size={20}
            text={chatOptionText}
          />
          </>
          :
            showMessageReason?chatMessageReason():chatOption()
          } 

            {!showMessageReason&&
             <CustomButton
             color={COLORS.blue}
             onPress={() => {
               setShowChatOptionAlert(false)
               refRBSheet.current.close();
             }}
             textSize={12}
             text={t("accountScreen.closeAccount")}
             containerStyle={styles.closeButton}
           />
            }
           
        </View>
      </RBSheet>
      
      <CustomAlert
        type={"error"}
        show={warning}
        header={t("accountScreen.w")}
        body={errmess}
        action1={() => {
          setWarning(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={"error"}
        show={warning2}
        header={t("accountScreen.w")}
        body={errmess2.message}
        action1={() => {
          errmess2.status
            ? (setWarning2(false), navigation.navigate("Transactions"))
            : setWarning2(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
        loading={ButtonLoading2}
      />
      <NotesAlert
        show={showCancleEscrowModal.status}
        header={t("transDetailsScreen.conWar")}
        notesLabel={
          showCancleEscrowModal.val == "deliveryNotes"
            ? t("transDetailsScreen.delNot")
            : showCancleEscrowModal.val == "rejectAndReturn"
            ? t("transDetailsScreen.RAR")
            : showCancleEscrowModal.val == "sellerRaiseDispute"
            ? t("transDetailsScreen.rdispute")
            : showCancleEscrowModal.val == "dispatchByBuyer"
            ? t("transDetailsScreen.disp")
            : showCancleEscrowModal.val == "sellerAcceptRejection"
            ? t("transDetailsScreen.disp2")
            : showCancleEscrowModal.val == "confirmDelivery"
            ? t("transDetailsScreen.confirmDeliveryNotes")
            : t("transDetailsScreen.label2")
        }
        body={cancelNotes ? cancelNotes : ""}
        onChange={setCancelNotes}
        handleUploadCancelDocuments={handleUploadCancelDocuments}
        uploadFiles={cancelDocs}
        onDeleteAttachment={setCancelDocs}
        action1={
          cancelNotes?.length > 0
            ? showCancleEscrowModal.val == "deliveryNotes"
              ? handleSellerDeliveryNotes
              : showCancleEscrowModal.val == "rejectAndReturn"
              ? handleItemRejectedAndReturnedByBuyer
              : showCancleEscrowModal.val == "sellerRaiseDispute"
              ? handleRaiseDisputeRETURN
              : showCancleEscrowModal.val == "dispatchByBuyer"
              ? handleDispatchByBuyer
              : showCancleEscrowModal.val == "sellerAcceptRejection"
              ? handleAcceptReject
              : showCancleEscrowModal.val == "confirmDelivery"
              ? handleConfirmDelivery
              : handleCancleEscrowByBuyer
            : () => {
                showMessage({
                  message: t("transDetailsScreen.notes"),
                  type: "danger",
                  titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                });
              }
        }
        btn1={t("transactionDetails.ok")}
        action2={() => {
          setShowCancleEscrowModal({
            status: false,
            val: "",
          });
          setCancelNotes(null);
          setCancelDocs([]);
        }}
        btn2={t("transactionDetails.cancel")}
        oneBtn={false}
        loading={cancelLoading}
        maxUploadedFile={maxUploadedFile}
        maxFileSize={maxFileSize}
        fileExtensions={fileExtensions}
      />
      <CustomAlert
        type={"error"}
        show={showKYCModal}
        header={t("accountScreen.w")}
        body={t("newTransactions.kycerr")}
        action1={() => {
          setShowKYCModal(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
      {PayTypeModel()}
      {AcceptBySellerModal()}
    </View>
  );
};
export default TransactionDetails;
