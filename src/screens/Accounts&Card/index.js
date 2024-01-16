import React, {
  useEffect,
  useMemo,
  useState,
  useRef,
  useCallback,
} from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  Image,
  Switch,
  ActivityIndicator,
  Text,
  RefreshControl,
} from "react-native";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";

import createStyles from "./styles";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import CustomAlert from "../../components/CustomAlert";
import MonthPicker from "react-native-month-year-picker";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import axios from "axios";
import { height, hp, width, wp } from "../../utilis/dimensions";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import SelectDropdown from "react-native-select-dropdown";
import Swipeable from "react-native-gesture-handler/Swipeable";
import IBAN from "iban";

const AccountAndCards = ({ navigation, route }) => {
  const { isCard } = route?.params;
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [section, setSection] = useState(1);
  const [modalSection, setModalSection] = useState(1);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isEnabledCard, setIsEnabledCard] = useState(false);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remove, setRemove] = useState(false);
  const [show, setShow] = useState(false);
  const [accName, setAccName] = useState("");
  const [accIban, setAccIban] = useState("");
  const [accBankName, setAccBankName] = useState("");
  const [accNick, setAccNick] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [minimumDate, setMinimumDate] = useState("");
  const [visibleDate, setVisibleDate] = useState(false);
  const [warning, setWarning] = useState({ status: false, no: 0 });
  const [refresh, setRefresh] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [warning3, setWarning3] = useState({ status: false, no: 0 });
  const [typeWa, setTypeWa] = useState(false);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [accountsempty, setAccountsEmpty] = useState(false);
  const [cardsEmpty, setCardsEmpty] = useState(true);
  const [cards, setCards] = useState(null);
  const [removeErr, setRemoveErr] = useState("");
  const [removeShow, setRemoveShow] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [updateEl, setUpdateEl] = useState(null);
  const [cardType, setCardType] = useState("");
  const [cvv, setCvv] = useState("");
  const [loadingAddCard, setLoadingAddCard] = useState(false);
  const [loadingUpdateCard, setLoadingUpdateCard] = useState(false);
  const [accID, setAccID] = useState(null);


  const { t, i18n } = useTranslation();
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const showPicker = useCallback((value) => setVisibleDate(value), []);
  let row = [];
  let prevOpenedRow;
  let rowCard = [];
  let prevOpenedRowCard;

  const onValueChange = useCallback(
    (event, newDate) => {
      let month = newDate.toString().substr(4, 3);
      let selectedDate;
      let monthNumber;
      if (month == "Jan") {
        monthNumber = "01";
      } else if (month == "Feb") {
        monthNumber = "02";
      } else if (month == "Mar") {
        monthNumber = "03";
      } else if (month == "Apr") {
        monthNumber = "04";
      } else if (month == "May") {
        monthNumber = "05";
      } else if (month == "Jun") {
        monthNumber = "06";
      } else if (month == "Jul") {
        monthNumber = "07";
      } else if (month == "Aug") {
        monthNumber = "08";
      } else if (month == "Sep") {
        monthNumber = "09";
      } else if (month == "Oct") {
        monthNumber = "10";
      } else if (month == "Nov") {
        monthNumber = "11";
      } else if (month == "Dec") {
        monthNumber = "12";
      }
      selectedDate = `${monthNumber} / ${newDate.toString().substr(13, 2)}`;
      showPicker(false);
      setCardExpiry(selectedDate);
    },
    [cardExpiry, showPicker]
  );
  useEffect(() => {
    let date = new Date();
    let forma = `${date.getFullYear().toString()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    setMinimumDate(forma);
  }, [navigation]);

  useEffect(()=>{
     if(isCard){
      setModalVisible(true);
      setModalSection(2)
     }
  },[isCard])
  const handleChangeLang = async () => {
    if (i18n.language == "ar") {
      await AsyncStorage.setItem("@CACHED_LANG", "en");
      await i18n.changeLanguage("en");
    } else {
      await AsyncStorage.setItem("@CACHED_LANG", "ar");
      await i18n.changeLanguage("ar");
    }
  };
  const updateCardPlus = async () => {
    setLoadingUpdateCard(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("id", updateEl);
    formdata.append("card_type", cardType == "MASTERCARD" ? 2 : 1);
    formdata.append("card_number", cardNumber);
    formdata.append("card_holder", cardName);
    formdata.append("valid_till", cardExpiry);
    // formdata.append("month", (cardExpiry.split('/')[0]).trim());
    // formdata.append("year", (cardExpiry.split('/')[1]).trim());
    // formdata.append("cvc", cvv);
    formdata.append("default_card", isEnabledCard ? 1 : 0);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.editCardPlus,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n.language
      },
      data: formdata,
    })
      .then((res) => {
        if (res?.data?.messages?.success) {
          setLoadingUpdateCard(false);
          setModalVisible(!modalVisible);
          setShow(true);
          setRefetch(!refetch);
          resetCardValues();
        } else {
          setLoadingUpdateCard(false);
          setRemoveErr(
            res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        setLoadingUpdateCard(false);
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  // plus done
  const addCardData = async () => {
    setLoadingAddCard(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    console.log('cardExpiry',cardExpiry)
    console.log('cardExpiry month',cardExpiry.split('/')[0])
    console.log('cardExpiry year',cardExpiry.split('/')[1])
    formdata.append("card_type", cardType == "MASTERCARD" ? 2 : 1);
    formdata.append("card_number", cardNumber);
    formdata.append("card_holder", cardName);
    // formdata.append("valid_till", cardExpiry);
    formdata.append("month", (cardExpiry.split('/')[0]).trim());
    formdata.append("year", (cardExpiry.split('/')[1]).trim());
    formdata.append("cvc", cvv);
    formdata.append("default_card", isEnabledCard ? 1 : 0);
    // formdata.append('device_info', deviceInfo)
    console.log('formdata',formdata)
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.addCardRequest,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n.language
      },
      data: formdata,
    })
      .then((res) => {
        console.log('res addCardData', res.data)
        if (res?.data?.status=='ok') {
          setLoadingAddCard(false);
          setModalVisible(!modalVisible);
          // setShow(true);
          // setRefetch(!refetch);
          resetCardValues();
          navigation.navigate('AddCard',{Url:res?.data?.url})
        } else {
          setLoadingAddCard(false);
          setRemoveErr(
            res?.data?.messages?.error[0]
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        setLoadingAddCard(false);
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  const addBankAccount = async () => {
    setLoadingAddCard(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS2.addBank,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
      data: {
        iban: accIban,
        account_name: accName,
        bank_name: accBankName,
        nick_name: accNick,
        default_account: isEnabled ? "1" : "0",
        device_info: deviceInfo
      },
    })
      .then((res) => {
        setLoadingAddCard(false);
        if (res?.data?.messages?.success) {
          setModalVisible(!modalVisible);
          setShow(true);
          resetAccountValues();
          setRefetch(!refetch);
        } else {
          setRemoveErr(
            res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        setLoadingAddCard(false);
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  const updateBankAccount = async () => {
    setLoadingUpdateCard(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS2.editBank,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
      data: {
        id: accID,
        iban: accIban,
        account_name: accName,
        bank_name: accBankName,
        nick_name: accNick,
        default_account: isEnabled ? "1" : "0",
        device_info: deviceInfo
      },
    })
      .then((res) => {
        setLoadingUpdateCard(false);
        if (res?.data?.messages?.success) {
          setModalVisible(!modalVisible);
          setShow(true);
          resetAccountValues();
          setRefetch(!refetch);
        } else {
          setRemoveErr(
           res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        setLoadingUpdateCard(false);
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  const removeBankAccount = async (id) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "post",
      url: baseURL + ENDPOINTS2.deleteBank,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
      data: {
        id: id,
        device_info: deviceInfo
      },
    })
      .then((res) => {
        if (res?.data?.messages?.success) {
          setShow(true);
          setRemove(true);
          setRefetch(!refetch);
        } else {
          setRemoveErr(
            res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  // plus done
  const removeCard = async (cNo) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("id", cNo);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "post",
      url: baseURL + ENDPOINTS.deleteCardPlus,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n.language
      },
      data: formdata,
    })
      .then((res) => {
        if (res?.data?.messages.success) {
          setShow(true);
          setRemove(true);
          setRefetch(!refetch);
        } else {
          setRemoveErr(
             res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
        resetCardValues();
      });
  };
  const getBankAccounts = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "get",
      url: baseURL + ENDPOINTS2.getBanks,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
    })
      .then((res) => {
        if (res?.data?.bank_accounts) {
          if (res?.data?.bank_accounts?.length > 0) {
            setBankAccounts(res?.data?.bank_accounts);
            setAccountsEmpty(false);
          } else {
            setBankAccounts([]);
            setAccountsEmpty(true);
          }
        } else if (res?.data?.messages) {
          setBankAccounts([]);
          setAccountsEmpty(true);
        }
      })
      .catch((er) => {
        console.log("er get banks: ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  // plus done
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
            setCards(res?.data?.cards);
            setCardsEmpty(false);
          } else {
            setCards([]);
            setCardsEmpty(true);
          }
        } else if (res?.data?.messages) {
          setRemoveErr(
             res?.data?.messages?.error
          );
          setRemoveShow(true);
        }
      })
      .catch((er) => {
        setCardsEmpty(true);
        console.log("errr : ", er);
        setRemoveErr(t("accountScreen.err"));
        setRemoveShow(true);
      });
  };
  const getData = async () => {
    setLoading(true);
    await getBankAccounts();
    await getCards();
    setLoading(false);
  };
  useEffect(() => {
    if (!baseURL) return;
    getData();
  }, [navigation, baseURL, refetch]);
  const onRefresh = () => {
    setRefetch(!refetch);
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const toggleSwitchCard = () =>
    setIsEnabledCard((previousState) => !previousState);

  const renderLeftActions = (progress, dragX, el, ii, type) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-5, 0, 0, 1],
    });
    return (
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: wp(6),
        }}
      >
        {type == "Account"?
        <Pressable
          onPress={() => {
            if (type == "Account") {
              setAccID(el.id);
              setAccBankName(el.bank_name);
              setAccIban(el.iban);
              setAccName(el.account_name);
              setAccNick(el.nick_name);
              setIsEnabled((v) => (el.default_account == 1 ? true : false));
              setModalVisible(!modalVisible);
              setEdit(true);
              // setEditHeader(title);
              setModalSection(1);
            }
            //  else {
            //   setEdit(true);
            //   setCardName(el.card_holder);
            //   setCardNumber(el.card_number);
            //   setCardType(el.card_type == 1 ? "VISA" : "MASTERCARD");
            //   setCardExpiry(el.valid_till);
            //   setCvv(el.cvc)
            //   setIsEnabledCard((el) => (el?.default_card == 1 ? true : false));
            //   setUpdateEl(ii);
            //   setModalVisible(!modalVisible);
            //   setModalSection(2);
            // }
          }}
          style={{
            backgroundColor: "green",
            height: "80%",
            width: wp(18),
            justifyContent: "space-around",
            borderTopRightRadius: wp(5),
            borderBottomRightRadius: wp(5),
            // marginLeft: wp(1),
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons
            style={{ alignSelf: "center", marginLeft: 5 }}
            color={COLORS.white}
            size={20}
            name="pencil-outline"
          />
          <CustomText
            color={COLORS.wjite}
            size={14}
            text={t("agreementScreen.edit")}
          />
        </Pressable>
        :null}
        <Pressable
          onPress={() => {
            if (type == "Account") {
              setWarning({ status: true, no: ii });
            } else {
              setWarning3({ status: true, no: ii });
            }
          }}
          style={{
            backgroundColor: "red",
            height: "80%",
            width: wp(18),
            // justifyContent: "center",
            // borderRadius: wp(5),
            flexDirection: "row",
            justifyContent: "space-around",
            borderTopLeftRadius: wp(5),
            borderBottomLeftRadius: wp(5),
          }}
        >
          <Ionicons
            style={{ alignSelf: "center" }}
            color={COLORS.white}
            size={20}
            name="trash-outline"
          />
          <CustomText
            color={COLORS.white}
            size={14}
            text={t("agreementScreen.remove")}
          />
        </Pressable>
      </View>
    );
  };
  const closeRow = (index) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };
  const closeRowCard = (index) => {
    if (prevOpenedRowCard && prevOpenedRowCard !== rowCard[index]) {
      prevOpenedRowCard.close();
    }
    prevOpenedRowCard = rowCard[index];
  };
  const AccountItem = ({ el, Index }) => {
    const [more, setMore] = useState(false);
    return (
      <Swipeable
        friction={1}
        ref={(ref) => (row[Index] = ref)}
        onSwipeableOpen={() => closeRow(Index)}
        renderRightActions={(progress, dragX) =>
          i18n.language == "ar" &&
          renderLeftActions(progress, dragX, el, el.id, "Account")
        }
        renderLeftActions={(progress, dragX) =>
          i18n.language == "en" &&
          renderLeftActions(progress, dragX, el, el.id, "Account")
        }
      >
        <View style={styles.accountItem}>
          <View style={styles.innerContainer}>
            {/* styles.row100 */}
            <Ionicons name="card" size={20} color={COLORS.babyBlue2} />
            <CustomText
              color={COLORS.black}
              size={14}
              text={t("accountScreen.bankAccountName")}
              style={styles.innerText}
            />
            <CustomText
              color={COLORS.grey}
              size={14}
              text={el.bank_name}
              style={styles.innerText}
            />
          </View>
          <View style={styles.innerContainer}>
            <Ionicons name="card" size={20} color={COLORS.babyBlue2} />
            <CustomText
              color={COLORS.black}
              size={14}
              text={"IBAN "}
              style={styles.innerText}
            />
            <CustomText
              color={COLORS.grey}
              size={14}
              text={el.iban}
              style={styles.innerText}
            />
          </View>
          <View style={styles.innerContainer}>
            <Ionicons name="person" size={20} color={COLORS.babyBlue2} />
            <CustomText
              color={COLORS.black}
              size={14}
              text={t("accountScreen.n")}
              style={styles.innerText}
            />
            <CustomText
              color={COLORS.grey}
              size={14}
              text={el.account_name}
              style={styles.innerText}
            />
          </View>
          <View style={styles.innerContainer}>
            <Ionicons name="person" size={20} color={COLORS.babyBlue2} />
            <CustomText
              color={COLORS.black}
              size={14}
              text={t("accountScreen.nickName")}
              style={styles.innerText}
            />
            <CustomText
              color={COLORS.grey}
              size={14}
              text={el.nick_name}
              style={styles.innerText}
            />
          </View>
          {el.default_account == 1 && (
            <View style={styles.innerContainer}>
              <CustomText
                color={COLORS.blue}
                size={14}
                text={t("accountScreen.defaultA")}
                style={styles.innerText}
              />
            </View>
          )}
        </View>
      </Swipeable>
    );
  };
  const CardItem = ({ el, Index }) => {
    return (
      <Swipeable
        friction={1}
        ref={(ref) => (rowCard[Index] = ref)}
        onSwipeableOpen={() => closeRowCard(Index)}
        renderRightActions={(progress, dragX) =>
          i18n.language == "ar" &&
          renderLeftActions(progress, dragX, el, el.id, "Card")
        }
        renderLeftActions={(progress, dragX) =>
          i18n.language == "en" &&
          renderLeftActions(progress, dragX, el, el.id, "Card")
        }
      >
        <View
          style={[
            styles.cardItem,
            {
              backgroundColor:
                el.card_type == 2 ? COLORS.cardGreen : COLORS.cardBlue,
            },
          ]}
        >
          <View style={styles.cardRow}>
            <CustomText
              color={COLORS.white}
              size={14}
              text={el.card_type == 2 ? "MASTERCARD" : "VISA"}
              style={styles.title}
            />
            {el.default_card == 1 && (
              <CustomText
                color={"white"}
                size={14}
                text={t("accountScreen.defaultC")}
                style={styles.title}
              />
            )}
          </View>
          <View style={styles.cardRow}>
            <Image
              style={styles.sim}
              source={require("../../assets/sim.png")}
            />
          </View>
          <View style={styles.cardRow}>
            <CustomText
              color={COLORS.white}
              size={14}
              text={el.card_number.substring(0,4)+'************'}
              style={styles.title}
            />
          </View>
          <View style={styles.cardRow}>
            <View style={{width: wp(50), alignItems: "flex-start"}}>
              <CustomText
                color={COLORS.white}
                size={8}
                text={"Cardholder Name"}
                style={styles.cardTitle}
              />
              <CustomText
                color={COLORS.white}
                size={14}
                text={el.card_holder}
                style={styles.cardSubTitle}
              />           
            </View>

            <View style={styles.cardBottomContainer}>
              <View>
                <CustomText
                  color={COLORS.white}
                  size={8}
                  text={"Valid Till"}
                  style={styles.cardTitle}
                />
                <CustomText
                  color={COLORS.white}
                  size={14}
                  text={`${el.month}/${el.year}`}
                  style={styles.cardSubTitle}
                />
              </View>
              <Image
                style={styles.sim}
                source={
                  el.card_type == 2
                    ? require("../../assets/mastercard.png")
                    : require("../../assets/visaBlack.png")
                }
              />
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };
  const validateAccountName = (val) => {
    return val.length > 0 && val.length < 21 ? true : false;
  };
  const validateAccountBankName = (val) => {
    return val.length > 0 && val.length < 21 ? true : false;
  };
  const validateAccountNick = (val) => {
    return val.length > 0 && val.length < 21 ? true : false;
  };
  const resetAccountValues = () => {
    setAccName("");
    setAccIban("");
    setAccBankName("");
    setAccNick("");
    setIsEnabled(false);
  };
  const validateCardNumber = (val) => {
    return val.length == 16 ? true : false;
  };
  const validateCardName = (val) => {
    return val.length > 0 && val.length < 31 ? true : false;
  };
  const validateCvv = (val) => {
    return val.length > 0 && val.length <= 3 ? true : false;
  };
  const validateCardExpiry = (val) => {
    return val.length > 0 ? true : false;
  };
  const resetCardValues = () => {
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardType("");
    setCvv('')
    setIsEnabledCard(false);
  };
  const addCard=async()=>{
   alert('open link in webView')
   const token = await AsyncStorage.getItem("TOKEN");
   const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
   var formdata = new FormData();
   formdata.append("id", cNo);
   formdata.append('device_info', deviceInfo)
   setLoadingAddCard(true)
   axios({
     method: "post",
     url: baseURL + ENDPOINTS.addCardRequest,
     headers: {
       Authorization: "Bearer " + token,
       "Content-Type": "multipart/form-data;",
       "X-Localization": i18n.language
     },
     data: formdata,
   })
     .then((res) => {
      setLoadingAddCard(false)
       if (res?.data?.messages.success) {
        navigation.navigate('AddCard',{Url:''})
       } else {
        
       }
     })
     .catch((er) => {
      setLoadingAddCard(false)
       console.log("er : ", er);
     });
  }
  return (
    <>
      <CustomHeader
        navigation={navigation}
        handleChangeLang={handleChangeLang}
      />
      <ScrollView
        contentContainerStyle={styles.bg}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <View style={styles.row111}>
          <CustomText
            color={COLORS.headerText}
            size={20}
            text={t("accountScreen.title")}
            style={styles.title}
          />
          <Pressable
            onPress={() => {
              setModalVisible(!modalVisible);
              setModalSection(section);
              resetAccountValues();
              resetCardValues();
            }}
            style={styles.addContainer}
          >
            <CustomText
              color={COLORS.blue}
              size={14}
              text={t("accountScreen.add")}
              style={styles.title}
            />
            <Ionicons name="add" size={18} color={COLORS.loginTab} />
          </Pressable>
        </View>

        <View style={styles.selectStyle}>
          <Pressable
            onPress={() => setSection(1)}
            style={section == 1 ? styles.selectedStyle : styles.basicStyle}
          >
            <MaterialCommunityIcons
              name="card-account-details"
              size={16}
              color={section == 1 ? COLORS.white : COLORS.loginTab}
              style={{ marginHorizontal: wp(2) }}
            />
            <CustomText
              color={section == 1 ? COLORS.white : COLORS.header}
              size={width*0.03}
              text={t("accountScreen.myAccounts")}
            />
          </Pressable>
          <Pressable
            onPress={() => setSection(2)}
            style={section == 2 ? styles.selectedStyle : styles.basicStyle}
          >
            <MaterialCommunityIcons
              name="credit-card"
              size={16}
              color={section == 2 ? COLORS.white : COLORS.loginTab}
              style={{ marginHorizontal: wp(2) }}
            />
            <CustomText
              color={section == 2 ? COLORS.white : COLORS.header}
              size={width*0.03}
              text={t("accountScreen.myCards")}
            />
          </Pressable>
        </View>
        {section == 1 ? (
          <>
            {loading ? (
              <ActivityIndicator size={"large"} color={COLORS.header} />
            ) : accountsempty ? (
              <CustomText
                color={COLORS.header}
                size={14}
                text={t("accountScreen.nodata")}
                style={styles.BackTxt3}
              />
            ) : (
              <>
                {bankAccounts.map((el, index) => (
                  <AccountItem el={el} Index={index} />
                ))}
              </>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <ActivityIndicator size={"large"} color={COLORS.header} />
            ) : cardsEmpty ? (
              <CustomText
                color={COLORS.header}
                size={14}
                text={t("accountScreen.nodata2")}
                style={styles.BackTxt3}
              />
            ) : (
              <>
                {cards.map((el, index) => (
                  <CardItem el={el} Index={index} />
                ))}
              </>
            )}
          </>
        )}
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
              contentContainerStyle={styles.centeredView}
              style={styles.centeredView2}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.selectStyleCard}>
                  <Pressable
                    disabled={edit ? true : false}
                    onPress={() => setModalSection(1)}
                    style={
                      modalSection == 1
                        ? styles.selectedStyle2
                        : styles.basicStyle2
                    }
                  >
                    <MaterialCommunityIcons
                      name="card-account-details"
                      size={16}
                      color={modalSection == 1 ? COLORS.white : COLORS.loginTab}
                      style={{ marginHorizontal: wp(2) }}
                    />
                    <CustomText
                      color={modalSection == 1 ? COLORS.white : COLORS.header}
                      size={14}
                      text={t("accountScreen.account")}
                      style={styles.BackTxt3}
                    />
                  </Pressable>
                  <Pressable
                    disabled={edit ? true : false}
                    onPress={() => setModalSection(2)}
                    style={
                      modalSection == 2
                        ? styles.selectedStyle2
                        : styles.basicStyle2
                    }
                  >
                    <MaterialCommunityIcons
                      name="credit-card"
                      size={16}
                      color={modalSection == 2 ? COLORS.white : COLORS.loginTab}
                      style={{ marginHorizontal: wp(2) }}
                    />
                    <CustomText
                      color={modalSection == 2 ? COLORS.white : COLORS.header}
                      size={14}
                      text={t("accountScreen.card")}
                      style={styles.BackTxt3}
                    />
                  </Pressable>
                </View>
                <TouchableOpacity style={styles.closeCont}
                 onPress={() => {
                  setModalVisible(!modalVisible);
                  setEdit(false);
                }}>
                  <AntDesign
                    name={"closecircleo"}
                    size={30}
                    color={COLORS.red}
                    onPress={() => {
                      setModalVisible(!modalVisible);
                      setEdit(false);
                    }}
                  />
                </TouchableOpacity>
              </View>
              {modalSection == 1 ? (
                <>
                  <CustomInput
                    multiline
                    inputRef={ref1}
                    label={t("accountScreen.accName")}
                    placeholder={t("accountScreen.name")}
                    value={accName}
                    onChangeText={setAccName}
                    maxLength={20}
                    error={
                      accName.length ? !validateAccountName(accName) : false
                    }
                    errorMessage={t("accountScreen.m1")}
                    icon={
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <CustomInput
                    multiline
                    inputRef={ref2}
                    label={"IBAN"}
                    placeholder={"865180000284608011234589"}
                    value={accIban}
                    onChangeText={(e) =>
                      setAccIban(e.replace(/[^A-Za-z0-9]*/g, ""))
                    }
                    error={accIban.length ? !IBAN.isValid(accIban) : false}
                    errorMessage={t("accountScreen.m2")}
                    icon={
                      <Ionicons
                        name="card"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <CustomInput
                    multiline
                    inputRef={ref3}
                    label={t("accountScreen.bankName")}
                    placeholder={t("accountScreen.b1")}
                    value={accBankName}
                    onChangeText={setAccBankName}
                    maxLength={20}
                    error={
                      accBankName.length
                        ? !validateAccountBankName(accBankName)
                        : false
                    }
                    errorMessage={t("accountScreen.m3")}
                    icon={
                      <Ionicons
                        name="flag"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <CustomInput
                    multiline
                    inputRef={ref4}
                    label={t("accountScreen.nickName")}
                    placeholder={t("accountScreen.nickHolder")}
                    value={accNick}
                    onChangeText={setAccNick}
                    maxLength={20}
                    error={
                      accNick.length ? !validateAccountNick(accNick) : false
                    }
                    errorMessage={t("accountScreen.m4")}
                    icon={
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <View
                    style={[
                      styles.cardRow,
                      {
                        marginVertical: 0,
                      },
                    ]}
                  >
                    <CustomText
                      color={COLORS.darkBlue}
                      size={14}
                      text={t("accountScreen.defaultA")}
                      style={styles.text2}
                    />
                    <Switch
                      style={styles.switch}
                      // trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
                      thumbColor={isEnabled ? COLORS.green : COLORS.gray}
                      // ios_backgroundColor={COLORS.darkBlue}
                      onValueChange={toggleSwitch}
                      value={isEnabled}
                    />
                  </View>
                  <View
                    style={[
                      styles.cardRow,
                      styles.footer,
                      {
                        marginVertical: 0,
                      },
                    ]}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={COLORS.darkBlue}
                    />
                    <CustomText
                      color={COLORS.darkBlue}
                      size={10}
                      text={t("accountScreen.text")}
                      style={[styles.text, { width: "95%" }]}
                    />
                  </View>
                </>
              ) : (
                // <View style={{width:wp(100)}}></View>
                <>
                  <CustomInput
                    multiline
                    inputRef={ref5}
                    keyboardType="numeric"
                    label={t("accountScreen.cardNumber")}
                    placeholder={"5689286558329952"}
                    value={cardNumber}
                    maxLength={16}
                    onChangeText={(e) =>
                      setCardNumber(e.replace(/[^0-9]*/g, ""))
                    }
                    error={
                      cardNumber.length
                        ? !validateCardNumber(cardNumber)
                        : false
                    }
                    errorMessage={t("accountScreen.m6")}
                    icon={
                      <Ionicons
                        name="card"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <CustomInput
                    inputRef={ref6}
                    multiline
                    label={t("accountScreen.cardName")}
                    placeholder={t("accountScreen.name")}
                    value={cardName}
                    maxLength={30}
                    onChangeText={(e) => {
                      setCardName(e.replace(/[^A-Za-z0-9\s]*/g, ""));
                    }}
                    error={
                      cardName.length ? !validateCardName(cardName) : false
                    }
                    errorMessage={t("accountScreen.m5")}
                    icon={
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <CustomInput
                    onPress={() => setVisibleDate(true)}
                    // editable={false}
                    dateInput={true}
                    placeholder={t("accountScreen.expiry")}
                    containerStyle={styles.agreementName}
                    label={t("newTransactions.expiryDate")}
                    value={cardExpiry}
                    yearMonth={true}
                    icon={
                      <AntDesign
                        name="calendar"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  {visibleDate && (
                    <MonthPicker
                      locale={i18n.language}
                      value={new Date()}
                      minimumDate={new Date()}
                      onChange={onValueChange}
                      okButton={i18n.language == "ar" ? "تأكيد" : "Confirm"}
                      cancelButton={i18n.language == "ar" ? "إلغاء" : "Cancle"}
                    />
                  )}
                  
                  <View
                    style={[
                      styles.dropdownCont,
                      {
                        marginLeft: wp(5),
                      },
                    ]}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(1),marginBottom: -height*0.019 }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("accountScreen.tt")}
                    />
                    <SelectDropdown
                      data={["VISA", "MASTERCARD"]}
                      defaultButtonText={
                        cardType ? cardType : t("accountScreen.type")
                      }
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
                      buttonStyle={styles.dropDownBtn}
                      rowStyle={styles.dropDownRow}
                      rowTextStyle={styles.dropDownTxt}
                      onSelect={(val, index) => {
                        setCardType(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                  </View>
                  <CustomInput
                    inputRef={ref7}
                    label={'CVV'}
                    placeholder={'cvv'}
                    value={cvv}
                    maxLength={3}
                    password={true}
                    keyboardType="numeric"
                    onChangeText={(e) => {
                      setCvv(e)
                    }}
                    error={
                      cvv.length ? !validateCvv(cvv) : false
                    }
                    errorMessage={t("accountScreen.m7")}
                    icon={
                      <Ionicons
                        name="key"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                    containerStyle={styles.agreementName}
                  />
                  <View
                    style={[
                      styles.cardRow,
                      {
                        marginVertical: 0,
                      },
                    ]}
                  >
                    <CustomText
                      color={COLORS.darkBlue}
                      size={14}
                      text={t("accountScreen.defaultC")}
                      style={styles.text2}
                    />
                    <Switch
                      style={styles.switch}
                      // trackColor={{ false: COLORS.grey, true: COLORS.green }}
                      thumbColor={isEnabledCard ? COLORS.green : COLORS.gray}
                      // ios_backgroundColor={COLORS.darkBlue}
                      onValueChange={toggleSwitchCard}
                      value={isEnabledCard}
                    />
                  </View>
                  <View
                    style={[
                      styles.cardRow,
                      styles.footer,
                      {
                        marginVertical: 0,
                      },
                    ]}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={20}
                      color={COLORS.darkBlue}
                    />
                    <CustomText
                      color={COLORS.darkBlue}
                      size={10}
                      text={t("accountScreen.condition")}
                      style={[styles.text, { width: "95%" }]}
                    />
                  </View>
                </>
              )}
              <CustomButton
                loading={edit ? loadingUpdateCard : loadingAddCard}
                disabled={edit ? loadingUpdateCard : loadingAddCard}
                color={COLORS.blue}
                onPress={() => {
                  if (modalSection == 1) {
                    validateAccountName(accName)
                      ? IBAN.isValid(accIban)
                        ? validateAccountBankName(accBankName)
                          ? validateAccountNick(accNick)
                            ? edit
                              ? updateBankAccount()
                              : addBankAccount()
                            : ref4.current.focus()
                          : ref3.current.focus()
                        : ref2.current.focus()
                      : ref1.current.focus();
                  } else {
                    validateCardNumber(cardNumber)
                      ? validateCardName(cardName)
                        ? validateCardExpiry(cardExpiry)
                         ? validateCvv(cvv)
                           ? cardType != ""
                             ? edit
                               ? updateCardPlus()
                              : addCardData()
                            : setTypeWa(true)
                          :ref7.current.focus()
                        : setWarning2(true)
                      : ref6.current.focus()
                    : ref5.current.focus()
                  }
                }}
                textSize={12}
                text={
                  edit
                    ? t("accountScreen.update")
                    : modalSection == 1
                    ? t("accountScreen.addAccount")
                    : t("accountScreen.addcard")
                }
                containerStyle={styles.btn}
              />
            </ScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            setShow(false);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={styles.centeredView3}
              style={styles.centeredView2}
            >
              <Lottie
                style={styles.logo2}
                source={require("../../assets/lottie/paymentDoneLottie.json")}
                autoPlay
                loop={false}
              />
              <CustomText
                color={COLORS.header}
                size={20}
                text={
                  remove
                    ? t("accountScreen.re")
                    : edit
                    ? t("accountScreen.up")
                    : t("accountScreen.ad")
                }
                style={styles.title2}
              />
              <CustomButton
                color={COLORS.white}
                onPress={() => {
                  setShow(false);
                  setEdit(false);
                  setRemove(false);
                }}
                textSize={16}
                text={t("accountScreen.close")}
                containerStyle={styles.closeButton2}
                textStyle={styles.closeButtonTxt}
              />
            </ScrollView>
          </View>
        </Modal>
        <CustomAlert
          type={'error'}
          show={warning2}
          header={t("accountScreen.w")}
          body={t("accountScreen.mw")}
          action1={() => {
            setWarning2(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={typeWa}
          header={t("accountScreen.w")}
          body={t("accountScreen.cardType")}
          action1={() => {
            setTypeWa(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={removeShow}
          header={t("accountScreen.w")}
          body={removeErr}
          action1={() => {
            setRemoveShow(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={warning3.status}
          header={t("accountScreen.w")}
          body={t("accountScreen.m")}
          action1={() => {
            removeCard(warning3.no);
            setWarning3({ status: false, no: 0 });
          }}
          btn1={t("accountScreen.ok")}
          btn2={t("accountScreen.cancle")}
          action2={() => setWarning3({ status: false, no: 0 })}
          oneBtn={false}
        />
        <CustomAlert
          type={'error'}
          show={warning.status}
          header={t("accountScreen.w")}
          body={t("accountScreen.deleteAccount")}
          action1={() => {
            removeBankAccount(warning.no);
            setWarning({ status: false, no: 0 });
            // setMore(!more);
          }}
          btn1={t("accountScreen.ok")}
          btn2={t("accountScreen.cancle")}
          action2={() => {
            setWarning({ status: false, no: 0 });
            // setMore(true);
          }}
          oneBtn={false}
        />
      </ScrollView>
    </>
  );
};
export default AccountAndCards;
