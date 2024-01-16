import React, { useEffect, useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import CustomText from "./customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import { useSSR, useTranslation } from "react-i18next";
import { hp, wp } from "../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDrawerStatus } from "@react-navigation/drawer";
import ChangeLanguageModal from "../modals/ChangeLanguageModal";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../constants/API";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setUnSeenCount } from "../redux/actions/notification";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  handleSaveAsDraftEnded,
  handleSaveAsDraftValue,
  handleSaveAsDraftWhere,
  storeStackValue,
} from "../redux/actions/user";
import CustomAlert from "./CustomAlert";

const CustomHeader = ({
  navigation,
  warningBack,
  backAction,
  Home = false,
  data = [],
  preventBack,
  specialPress,
  firstScreenInStack,
  outStack
}) => {
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const { stackValue, saveDraftWhere, saveDraftEnded } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const isDrawerOpen = useDrawerStatus() === "open";
  const [modalVisible, setModalVisible] = useState(false);
  const styles = useMemo(() => createStyles(COLORS), []);
  const [language, setLanguage] = useState("ar");

  const [baseURL, setBaseURL] = useState("");
  const [lastDate, setLastDate] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { unSeenCount } = useSelector((state) => state.notification);
  const [unSeen_Count, setUnSeen_Count] = useState("");

  const handleChangeLang = async () => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    if (i18n.language == "ar") {
      await AsyncStorage.setItem("@CACHED_LANG", "en");
      await i18n.changeLanguage("en");
    } else {
      await AsyncStorage.setItem("@CACHED_LANG", "ar");
      await i18n.changeLanguage("ar");
    }
  };

  const [show, setShow] = useState(false);
  const getLanguage = async () => {
    const ll = await AsyncStorage.getItem("@CACHED_LANG");
    setLanguage(ll);
  };

  useEffect(() => {
    if (saveDraftEnded && saveDraftWhere == "notification") {
      dispatch(storeStackValue(false));
      navigation.navigate("Notification");
      getNotification();
      setShow(false);
      dispatch(handleSaveAsDraftWhere(""));
      dispatch(handleSaveAsDraftEnded(false));
      dispatch(handleSaveAsDraftValue(false));
    } else if (saveDraftEnded && saveDraftWhere == "language") {
      dispatch(storeStackValue(false));
      setModalVisible(false);
      handleChangeLang();
      dispatch(handleSaveAsDraftWhere(""));
      dispatch(handleSaveAsDraftEnded(false));
      dispatch(handleSaveAsDraftValue(false));
    }
  }, [saveDraftEnded]);

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    getLanguage();
    getLastLogin();
    // getNotification();
    const interval = setInterval(() => {
      getNotification();
    }, 5000);

    return () => clearInterval(interval);
  }, [navigation, baseURL]);


  // useEffect(() => {

  //   getNotification()
  // },[unSeenCounter]);

 
  const handleNotificationMethod = () => {
    if (stackValue) {
      setShow(true);
    } else {
      if(outStack) {
        navigation.navigate('home', { screen: 'Notification' })
      }else {
        navigation.navigate("Notification");
      }
      getNotification();
    }
  };
  const getNotification = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(baseURL + ENDPOINTS.getNotification, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.data) {
          //console.log('responseData.data',responseData)
          // setNotificationData(responseData);
          // setUnSeen_Count(responseData?.unseen_count)
          dispatch(
            setUnSeenCount({
              unSeenCount: responseData?.unseen_count,
            })
          );
        } else {
          // Alert.alert('notification Error')
        }
      })
      .catch((e) => {
        // Alert.alert('notification Error')
      });
  };

 
  const getLastLogin = async () => {
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    setUserInfo(JSON.parse(userInfo));
    const lastDate = await AsyncStorage.getItem("LastLoginDate");
    setLastDate(moment(lastDate).locale("en").format("llll"));
  };

  return (
    <View
      style={{
        backgroundColor: COLORS.header,
        borderBottomRightRadius: hp(3),
        borderBottomLeftRadius: hp(3),
        // minHeight: hp(17),
        // maxHeight:hp(17),
        height: Home
          ? Dimensions.get("window").height * 0.17
          : Dimensions.get("window").height * 0.08,
      }}
    >
      <ChangeLanguageModal
        show={modalVisible}
        setShow={setModalVisible}
        handleLang={handleChangeLang}
      />
      <CustomAlert
        type="error"
        show={show}
        header={t("reviewTransaction.w")}
        body={t("stackError")}
        action1={() => {
          dispatch(storeStackValue(false));
          navigation.navigate("Notification");
          getNotification();
          setShow(false);
        }}
        btn1={t("reviewTransaction.ok")}
        action2={() => {
          setShow(false);
        }}
        btn2={t("cancle")}
        oneBtn={false}
        saveAsDraft={true}
        saveDraftText={"notification"}
      />
      <View style={styles.transactionsHeader}>
        <View style={styles.txtHeaderContainerHome}>
          {Home && (
            <CustomText
              color={COLORS.headerContent}
              size={14}
              text={
                moment().locale("en").format("HH") >= 12 &&
                moment().locale("en").format("HH") <= 23
                  ? t("helloEvening")
                  : t("helloMorning")
              }
              style={styles.helloTxt}
            />
          )}
          {!Home && (
            <TouchableOpacity
              style={styles.txtHeaderContainer}
              onPress={() => {
                if (warningBack) {
                  backAction();
                } else if (firstScreenInStack) {
                  navigation.navigate("home");
                } else {
                  if (navigation.canGoBack()) {
                    if (specialPress) {
                      navigation.navigate(specialPress);
                    } else {
                     navigation.goBack();
                    }
                  } else navigation.navigate("home");
                }
              }}
            >
              <MaterialIcons
                name={i18n.language == "ar" ? "arrow-right" : "arrow-left"}
                size={35}
                color={COLORS.headerContent}
              />
              <CustomText
                color={COLORS.headerContent}
                size={15}
                text={t("Back")}
                style={styles.BackTxt}
              />
            </TouchableOpacity>
          )}
          {userInfo && Home && (
            <>
              <View style={styles.nameCont}>
                <CustomText
                  color={COLORS.headerContent}
                  size={15}
                  text={`${userInfo?.firstname} ${userInfo?.lastname}`}
                  style={styles.userNameTxt}
                />
                <CustomText
                  color={COLORS.headerContent}
                  size={15}
                  text={` (${userInfo?.username}) `}
                  style={styles.userNameTxt}
                />
              </View>

              <TouchableOpacity style={styles.verifyContainer}
              onPress={()=> {
                navigation.navigate('profile', {
                  screen: 'IDVerification',
                  params: { 
                      type: "IDVerification",
                      kv: userInfo?.kv,
                   },
                });
              }}>
                <CustomText
                  color={userInfo?.kv == 1 ? COLORS.green : COLORS.red}
                  size={14}
                  text={userInfo?.kv == 1 ? t("verified") : t("notVerified")}
                  // style={styles.userNameTxt}
                />
                <AntDesign
                  name={userInfo?.kv == 1 ? "checkcircleo" : "closecircleo"}
                  size={14}
                  color={userInfo?.kv == 1 ? COLORS.green : COLORS.red}
                  style={{ marginHorizontal: wp(1) }}
                />
              </TouchableOpacity>
            </>
          )}

          {Home && (
            <CustomText
              color={COLORS.headerContent}
              size={9}
              text={lastDate && `${t("lastLogin")} ${lastDate}`}
              style={styles.helloTxt}
            />
          )}
        </View>

        <View style={styles.headerNotification}>
          {/* <Hamburger
            type="crossArrow"
            active={isDrawerOpen ? true : false}
            color={COLORS.headerContent}
            //  size={15}
            onPress={() => navigation.toggleDrawer()}
            underlayColor="transparent"
          /> */}
          <TouchableOpacity
            onPress={handleNotificationMethod}
            style={{
              bottom: unSeenCount > 0 ? hp(1) : 0,
            }}
          >
            {unSeenCount > 0 && (
              <View style={styles.notificationCounter}>
                <CustomText
                  text={unSeenCount > 99 ? "+99" : unSeenCount}
                  size={9}
                />
              </View>
            )}
            <Ionicons
              name={"notifications"}
              size={30}
              color={COLORS.headerContent}
              style={{ marginHorizontal: wp(2), position: "relative" }}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <FontAwesome
              name={"language"}
              style={styles.lang}
              size={25}
              color={COLORS.headerContent}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
    // </View>
  );
};

export default CustomHeader;
const createStyles = (COLORS) =>
  StyleSheet.create({
    headerNotification: {
      width: "30%",
      flexDirection: "row-reverse",
      alignItems: "center",
      alignSelf: "flex-start",
      // backgroundColor: "red",
    },
    transactionsHeader: {
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: hp(1),
      marginHorizontal: wp(2),
      flexDirection: "row",
    },
    verifyContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    notificationCounter: {
      backgroundColor: "red",
      height: hp(2.2),
      width: hp(2.2),
      top: hp(1.5),
      left: hp(0.5),
      zIndex: 2000,
      position: "relative",
      borderRadius: hp(2),
    },
    txtHeaderContainer: {
      flexDirection: "row",

      width: "55%",
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: "hidden",

      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
      borderColor: COLORS.black,
      borderWidth: 1,
    },
    centeredView2: {
      position: "absolute",
      // top: '15%',
    },
    modalText: {
      paddingHorizontal: 20,
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      marginVertical: 10,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },

    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.blue,
    },
    closeButtonTxt: {
      color: COLORS.grey,
    },
    lang: {
      marginVertical: 5,
    },
    txtHeaderContainerHome: {
      alignItems: "flex-start",
      marginLeft: wp(1),
      maxWidth: "70%",
      flexWrap: "wrap",
    },
    helloTxt: {
      opacity: 0.7,
    },
    nameCont: {
      flexDirection: "row",
    },
    titleTxt: {
      // fontWeight: 'bold',
      textAlign: "center",
    },
    BackTxt: {
      width: wp(30),
      textAlign: "left",
      marginHorizontal: wp(2),
    },
  });
