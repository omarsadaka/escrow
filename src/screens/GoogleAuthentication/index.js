import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Switch,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import { wp } from "../../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomButton from "../../components/customButton";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { showMessage } from "react-native-flash-message";
import Clipboard from "@react-native-community/clipboard";

const GoogleAuthentication = ({ navigation, route }) => {
  const { active } = route.params;
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [googleAccount, setGoogleAccount] = useState("");
  const [googleKey, setGoogleKey] = useState("");
  const [googleLoading, setGoogleLoading] = useState(true);
  const [code, setCode] = useState("");

  useEffect(() => {
    if (!baseURL) return;
    if (!active) {
      getGoogleKey();
    } else {
      setGoogleLoading(false);
    }
  }, [navigation, baseURL, isFocused]);

  // plus done
  const getGoogleKey = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    setGoogleLoading(true);
    axios({
      method: "get",
      url: baseURL + ENDPOINTS2.getKey,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        setGoogleLoading(false);
        console.log("key : ", res.data);
        if (res?.data?.data?.request == "success") {
          setGoogleAccount(res?.data?.data?.account);
          setGoogleKey(res?.data?.data?.key);
        } else {
          setErrMessage(t("accountScreen.err"));
          setErrShow(true);
        }
      })
      .catch((er) => {
        setGoogleLoading(false);
        console.log("errr : ", er);
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };
  const handleVerifyGoogleAuth = async (c) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("cccc : ", c);
    var formdata = new FormData();
    formdata.append("key", googleKey);
    formdata.append("code", c);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.enableGoogle,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
      },
      data: formdata,
    })
      .then((res) => {
        setGoogleLoading(false);
        console.log("res enable : ", res.data);
        if (
          res?.data?.messages?.request &&
          res?.data?.messages?.request == "success"
        ) {
          showMessage({
            message: res?.data?.messages?.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
          navigation.goBack();
          // setErrMessage(res?.data?.message?.message);
          // setErrShow(true);
        } else if (res?.data?.messages?.request) {
          showMessage({
            message: res?.data?.messages?.message,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: res?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setGoogleLoading(false);
        console.log("er : ", er);
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };
  const handleDisableAuth = async (c) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("disable code : ", c);
    var formdata = new FormData();
    formdata.append("code", c);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.disableGoogle,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
      },
      data: formdata,
    })
      .then((res) => {
        console.log("res disable : ", res.data);
        if (
          res?.data?.messages?.request &&
          res?.data?.messages?.request == "success"
        ) {
          showMessage({
            message: res?.data?.messages?.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
          navigation.goBack();
          // setErrMessage(res?.data?.message?.message);
          // setErrShow(true);
        } else if (res?.data?.messages?.request) {
          showMessage({
            message: res?.data?.messages?.message,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: res?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setGoogleLoading(false);
        console.log("er : ", er);
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };
  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={[
          styles.mainStyle,
          { alignItems: googleLoading ? "center" : "flex-start" },
        ]}
      >
        {googleLoading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <>
            <CustomText
              color={COLORS.black}
              size={25}
              text={
                active
                  ? t("settingsScreen.googleAuth2")
                  : t("settingsScreen.googleAuth")
              }
              style={styles.BackTxt}
            />
            {active ? (
              <>
                <CustomText
                  text={t("settingsScreen.ec")}
                  size={18}
                  style={styles.modalText}
                  color={COLORS.black}
                />
                <OTPInputView
                  style={styles.otp}
                  pinCount={6}
                  // code={"fg"}
                  // onCodeChanged = {code => { this.setState({code})}}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={(c) => {
                    console.log("code : ", c);
                    setCode(c);
                    handleDisableAuth(c);
                  }}
                />
              </>
            ) : (
              <>
                <CustomText
                  text={t("settingsScreen.gm")}
                  size={13}
                  style={styles.modalText}
                  color={COLORS.black}
                />
                <View style={styles.copyCon}>
                  <CustomText
                    text={t("settingsScreen.acc") + googleAccount}
                    size={13}
                    style={styles.modalText}
                    color={COLORS.black}
                  />
                  <FontAwesome
                    onPress={() => {
                      Clipboard.setString(googleAccount.toString());
                      ToastAndroid.show(
                        t("settingsScreen.copyA"),
                        ToastAndroid.SHORT
                      );
                    }}
                    name="copy"
                    color={COLORS.header}
                    size={20}
                  />
                </View>
                <View style={styles.copyCon}>
                  <CustomText
                    text={t("settingsScreen.key") + googleKey}
                    size={13}
                    style={styles.modalText}
                    color={COLORS.black}
                  />
                  <FontAwesome
                    onPress={() => {
                      Clipboard.setString(googleKey.toString());
                      ToastAndroid.show(
                        t("settingsScreen.copyK"),
                        ToastAndroid.SHORT
                      );
                    }}
                    name="copy"
                    color={COLORS.header}
                    size={20}
                  />
                </View>
                <OTPInputView
                  style={styles.otp}
                  pinCount={6}
                  code={code}
                  onCodeChanged={(code) => setCode(code)}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={(c) => {
                    console.log("code : ", c);
                    setCode(c);
                    handleVerifyGoogleAuth(c);
                  }}
                />
                <CustomButton
                  color={COLORS.blue}
                  onPress={() => {
                    if (code.length == 6) {
                      handleVerifyGoogleAuth(code);
                    } else {
                      showMessage({
                        message: "you must enter the 6 digit",
                        type: "warning",
                        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                      });
                    }
                  }}
                  textSize={12}
                  text={t("quickLogin.yes")}
                  containerStyle={styles.btn}
                />
              </>
            )}
          </>
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
export default GoogleAuthentication;
