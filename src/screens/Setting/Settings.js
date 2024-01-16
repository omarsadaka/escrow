import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Switch,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { hp, wp } from "../../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";

const Settings = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [isEnabled, setIsEnabled] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const toggleSwitch = async() => {
    // setIsEnabled((previousState) => !previousState);
    if(isEnabled){
      setIsEnabled(false);
      await AsyncStorage.setItem("TheometricEffect", 'off');
    }else{
      setIsEnabled(true);
      await AsyncStorage.setItem("TheometricEffect", 'on');
    }
  };
  const toggleSwitchSound = async() => {
    // setIsSoundEnabled((previousState) => !previousState);
    // await AsyncStorage.setItem("SoundEffect", isSoundEnabled?'on':'off');
    if(isSoundEnabled){
      setIsSoundEnabled(false);
      await AsyncStorage.setItem("SoundEffect", 'off');
    }else{
      setIsSoundEnabled(true);
      await AsyncStorage.setItem("SoundEffect", 'on');
    }
  };
  const [isEnabledFinger, setIsEnabledFinger] = useState(false);
  const toggleSwitchFinger = () => {
    setIsEnabledFinger((previousState) => !previousState);
  };
  const [isEnabledPin, setIsEnabledPin] = useState(false);
  const toggleSwitchPin = () => {
    setIsEnabledPin((previousState) => !previousState);
  };
  const [theme, setTheme] = useState("");
  const [colorTheme, setColorTheme] = useState("");
  const [lang, setLang] = useState("en");
  const [lang1, setLang1] = useState("");
  const [notif, setNotif] = useState("EMAIL");
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [themeVisible, setThemeVisible] = useState(false);
  const [themeColorVisible, setThemeColorVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const [settingsData, setSettingsData] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [googleEnable, setGoogleEnable] = useState(false);
  const [pinEnable, setPinEnable] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [reload, setReload] = useState(false);
  const [pin, setPin] = useState("");
  const colorData=[
    {value:'blue', color:'#09518E'},
    {value:'green', color:'green'},
    {value:'brown', color:'#964B00'},
    {value:'orange', color:'orange'},
    {value:'#571B7E', color:'#571B7E'},
  ]
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    console.log("in get user info setting...");
    setLoading(true);
    fetch(baseURL + ENDPOINTS.getUserDetails, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("get info data pv: ", responseData.data.user.pv);
        setLoading(false);
        if (responseData.data) {
          responseData.data.user.ts == 1 && responseData.data.user.tsc != null
            ? setGoogleEnable(true)
            : setGoogleEnable(false);
          responseData.data.user.pv == 1
            ? setPinEnable(true)
            : setPinEnable(false);
          await AsyncStorage.setItem(
            "CUSTOMER_OBJECT",
            JSON.stringify(responseData?.data?.user)
          );
          responseData.data.user.pin ? setPin(true) : setPin(false);
          await AsyncStorage.setItem(
            "USER_PIN",
            responseData?.data?.user?.pv.toString()
          );
          await AsyncStorage.setItem(
            "USER_PIN_VALUE",
            responseData?.data?.user?.pin
              ? responseData?.data?.user?.pin.toString()
              : ""
          );
          // console.log("responseData ", responseData.message);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoading(false);
      });
  };
  const handleChangePINStatus = async () => {
    setPinLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("change pin status  : ", pinEnable);
    var formdata = new FormData();
    formdata.append("status", pinEnable ? 0 : 1);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.pinStatus,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
      },
      data: formdata,
    })
      .then((res) => {
        setPinLoading(false);
        console.log("res status : ", res.data);
        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setReload(!reload);
        } else if (res?.data?.error?.status) {
          showMessage({
            message: res?.data?.error?.status,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: res?.data,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setPinLoading(false);
        console.log("er : ", er);
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };
  const getTheme = async () => {
    const savedTheme = await AsyncStorage.getItem("THEME");
    console.log("theme  : ", savedTheme);
    setTheme(() => (savedTheme ? savedTheme : "light"));
    getColorTheme(savedTheme)
  };
  const getColorTheme = async (theme) => {
    const savedColorTheme = await AsyncStorage.getItem("COLORTHEME");
    console.log("colorTheme  : ", savedColorTheme);
    if(theme!=='dark') {
      setColorTheme(() => (savedColorTheme ? savedColorTheme : "#09518E"));
    }else {
      setColorTheme('#09518E')
    }
  };
  const getSoundEffect = async (theme) => {
    const sound = await AsyncStorage.getItem("SoundEffect");
      setIsSoundEnabled(() => (sound=='on' ? true : false));
  };
  const getTheometricEffect = async () => {
    const sound = await AsyncStorage.getItem("TheometricEffect");
      setIsEnabled(() => (sound=='off' ? false : true));
  };
  useEffect(() => {
    if (!baseURL) return;
    getUserInfo();
    getTheme();
    getSoundEffect()
    getTheometricEffect()
  }, [navigation, isFocused, baseURL, reload]);
  useEffect(() => {
    if (!baseURL) return;
    // getSettingsInfo();
  }, [navigation, baseURL, isFocused]);

  const handleTheme = async () => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    await AsyncStorage.setItem("ChangeLang", "1");
    try {
       theme == "dark"
        ? await AsyncStorage.setItem("THEME", "light")
        : await AsyncStorage.setItem("THEME", "dark");
      RNRestart.Restart();
    } catch (e) {
      // saving error
    }
  };
  const handleColorTheme = async () => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    await AsyncStorage.setItem("ChangeLang", "1");
    try {
      AsyncStorage.setItem("COLORTHEME", colorTheme);
      RNRestart.Restart();
    } catch (e) {
      // saving error
    }
  };
  const handleLang = async () => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    try {
      if (i18n.language == "ar") {
        await i18n.changeLanguage("en");
        await AsyncStorage.setItem("@CACHED_LANG", "en");
      } else {
        await i18n.changeLanguage("ar");
        await AsyncStorage.setItem("@CACHED_LANG", "ar");
      }
    } catch (e) {
      // saving error
    }
  };
  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1}}>
      <CustomHeader navigation={navigation}  />
      <ChangeLanguageModal
        show={modalVisible}
        setShow={setModalVisible}
        handleLang={handleLang}
      />
      <ChangeLanguageModal
        show={themeVisible}
        setShow={setThemeVisible}
        handleLang={handleTheme}
        theme={true}
      />
       <ChangeLanguageModal
        show={themeColorVisible}
        setShow={setThemeColorVisible}
        handleLang={handleColorTheme}
        theme={true}
      />
      <ScrollView
        contentContainerStyle={[
          styles.mainStyle,
          { alignItems: loading ? "center" : "flex-start" },
        ]}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <View style={{ alignSelf:'center'}}>
            <CustomText
              color={COLORS.black}
              size={20}
              text={t("settingsScreen.title")}
              style={styles.BackTxt}
            />
            <View style={styles.faceView}>
              <View style={styles.textView}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/fingerprint.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.faceID_fingerprint")}
                  style={styles.faceStyle}
                />
              </View>
              <Switch
                // disabled
                style={[styles.switch,i18n.language=='ar'&&Platform.OS=='android'?{transform: [{rotateY: '180deg'}],}:{}]}
                trackColor={{ false: '#767577', true: COLORS.header }}
                thumbColor={isEnabled ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            {/* <View style={styles.faceView}>
              <View style={styles.textView}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/fingerprint.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.fingerprint")}
                  style={styles.faceStyle}
                />
              </View>
              <Switch
                // disabled
                style={styles.switch}
                trackColor={{ false: "#767577", true: COLORS.header }}
                thumbColor={isEnabledFinger ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchFinger}
                value={isEnabledFinger}
              />
            </View> */}
            <View style={styles.faceView}>
              <View style={styles.textView}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/volume.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.soundEffects")}
                  style={styles.faceStyle}
                />
              </View>
              <Switch
                style={[styles.switch, i18n.language=='ar'&&Platform.OS=='android'?{transform: [{rotateY: '180deg'}],}:{}]}
                trackColor={{ false: "#767577", true: COLORS.header }}
                thumbColor={isSoundEnabled ? "#fff" : "#f4f3f4"}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitchSound}
                value={isSoundEnabled}
              />
            </View>
            <TouchableOpacity
              onPress={() => {
                pinEnable
                  ? handleChangePINStatus()
                  : pin
                  ? handleChangePINStatus()
                  : navigation.navigate("ApplicationPin");
              }}
              disabled={pinLoading}
              style={[
                styles.faceView,
                { justifyContent: pinLoading ? "center" : "space-between" },
              ]}
            >
              <View style={styles.textView}>
                {pinLoading ? (
                  <ActivityIndicator color={COLORS.header} size={"large"} />
                ) : (
                  <>
                    <Image
                      style={styles.logo}
                      source={require("../../assets/pin.png")}
                    />
                    <CustomText
                      color={COLORS.black}
                      size={18}
                      text={
                        pinEnable
                          ? t("settingsScreen.pin2")
                          : t("settingsScreen.pin")
                      }
                      style={styles.faceStyle}
                    />
                  </>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("GoogleAuthentication", {
                  active: googleEnable,
                })
              }
              style={styles.faceView}
            >
              <View style={styles.textView}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/Google_Authenticator.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={
                    googleEnable
                      ? t("settingsScreen.googleAuth2")
                      : t("settingsScreen.googleAuth")
                  }
                  style={styles.faceStyle}
                />
              </View>
            </TouchableOpacity>
            <View style={styles.languageView}>
              <View style={styles.textView2}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/language_icon.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.Language")}
                  style={styles.faceStyle}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => {
                    if (i18n.language == "ar") setModalVisible(true);
                  }}
                  style={styles.row}
                >
                  <MaterialIcons
                    name={
                      i18n.language == "en"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={"English"}
                    style={styles.textColored}
                  />
                </Pressable>
                <Pressable
                  onPress={() => {
                    if (i18n.language == "en") setModalVisible(true);
                  }}
                  style={styles.row2}
                >
                  <MaterialIcons
                    name={
                      i18n.language == "ar"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={"العربية"}
                    style={styles.textColored}
                  />
                </Pressable>
              </View>
            </View>
            <View style={styles.languageView}>
              <View style={styles.textView2}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/theme_icon.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.Theme")}
                  style={styles.faceStyle}
                />
              </View>
              <View style={{ flexDirection: "row" }}>
                <Pressable
                  onPress={() => theme == "dark" && setThemeVisible(true)}
                  style={styles.row}
                >
                  <MaterialIcons
                    name={
                      theme == "light"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={t("settingsScreen.Light")}
                    style={styles.textColored}
                  />
                </Pressable>
                <Pressable
                  onPress={() => theme == "light" && setThemeVisible(true)}
                  style={[styles.row2, { marginLeft: wp(24) }]}
                >
                  <MaterialIcons
                    name={
                      theme == "dark"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={t("settingsScreen.Dark")}
                    style={styles.textColored}
                  />
                </Pressable>
              </View>
            </View>

            <View style={styles.languageView}>
              <View style={styles.textView2}>
                <Image
                  style={styles.logo}
                  source={require("../../assets/theme_icon.png")}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.colorTheme")}
                  style={styles.faceStyle}
                />
              </View>
              <View style={styles.colorThemeCon}>
                {
                  colorData.map(item=>{
                    return(
                      <View style={[styles.colorItemCon,{borderWidth:colorTheme == item.color?2:0 }]}>
                        <TouchableOpacity onPress={()=> {
                          if(colorTheme!= item.color){
                            if(theme == "light"){
                              setColorTheme(item.color)
                              setThemeColorVisible(true)
                            }else{
                              showMessage({
                                message: t('settingsScreen.colorThemeNotAllowed'),
                                type: "danger",
                                titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                              });
                            }
                          }
                        }}
                          style={[styles.colorItem,{backgroundColor: item.color}]} />
                      </View>
                    )
                  })
                }
              </View>
            </View>

            <View style={styles.languageView}>
              <View style={styles.textView2}>
                {/* <Image
              style={styles.logo}
              source={require('../../assets/language_icon.png')}
            /> */}
                <Ionicons
                  style={[styles.logo, { height: 30 }]}
                  name="notifications"
                  size={30}
                  color={COLORS.header}
                />
                <CustomText
                  color={COLORS.black}
                  size={18}
                  text={t("settingsScreen.notifications")}
                  style={styles.faceStyle}
                />
              </View>
              <View style={styles.notificationStyle}>
                <TouchableOpacity
                  onPress={() => {
                    setNotif("EMAIL");
                  }}
                  style={styles.row}
                >
                  <MaterialIcons
                    name={
                      notif == "EMAIL"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={t("settingsScreen.Email")}
                    style={styles.textColored}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNotif("SMS");
                  }}
                  style={styles.row2}
                >
                  <MaterialIcons
                    name={
                      notif == "SMS"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={t("settingsScreen.SMS")}
                    style={styles.textColored}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setNotif("BOTH");
                  }}
                  style={styles.row2}
                >
                  <MaterialIcons
                    name={
                      notif == "BOTH"
                        ? "radio-button-checked"
                        : "radio-button-unchecked"
                    }
                    size={25}
                    style={styles.icon}
                    color={COLORS.blue}
                  />
                  <CustomText
                    color={COLORS.black}
                    size={16}
                    text={t("settingsScreen.Both")}
                    style={styles.textColored}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </View>
  );
};
export default Settings;
