import React, { useEffect, useMemo, useState } from "react";
import {
  // Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Text from "../../components/globalText";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import createStyles from "./styles";
import { useRoute, useTheme } from "@react-navigation/native";
import CustomInput from "../../components/customInput";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BASE_URL,
  ENDPOINTS,
  ENDPOINTS2,
  getBaseURL,
  getBaseURL2,
} from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import {
  getHash,
  removeListener,
  startOtpListener,
} from "react-native-otp-verify";

const AccountVerification = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL2()?.then((res) => setBaseURL(res));
  const route = useRoute();
  const { ev, sv, profile_complete } = route?.params;

  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [validated, setValidated] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [counter, setCounter] = useState(121);
  const [isCounted, SetIsCounted] = useState(true);
  const [changeLan, setChangeLan] = useState(false);
  // using methods
  useEffect(() => {
    if (!isCounted) return;
    getHash()
      .then((hash) => {
        // use this hash in the message.
      })
      .catch(console.log);

    startOtpListener((message) => {
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      const otp = /(\d{6})/g.exec(message)[1];

      setCode(otp);
    });
    return () => removeListener();
  }, [isCounted]);
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
  useEffect(() => {
    ev && sv && (ev == 0 ? setSelected(0) : sv == 0 ? setSelected(1) : "");
  }, [ev, sv]);
  useEffect(() => {
    if (code > 5) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [code]);
  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 && (clearInterval(interval), SetIsCounted(false)); //navigation.goBack()
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);
  const handleVerifySms = async () => {
    const token = await AsyncStorage.getItem("USERTOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    if (!validated) {
      showMessage({
        message:
          i18n.language == "ar"
            ? "يجب إدخال رقم التاكيد"
            : "You must enter the validation code",
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
      return;
    }
    var formData = new FormData();
    formData.append("code", code);
    formData.append('device_info', deviceInfo)
    setLoading(true);
    fetch(baseURL + ENDPOINTS2.verifySMS, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        setLoading(false);
        if (responseData.messages?.error) {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if (profile_complete == 1) {
            navigation.navigate("AccountCreated");
          } else {
            navigation.navigate("UpdateUserProfile");
          }
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: e,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  const handleVerifyEmail = async () => {
    const token = await AsyncStorage.getItem("USERTOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("token ", token);
    if (!validated) {
      showMessage({
        message:
          i18n.language == "ar"
            ? "يجب إدخال رقم التاكيد"
            : "You must enter the validation code",
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
      return;
    }
    var formData = new FormData();
    formData.append("code", code);
    formData.append('device_info', deviceInfo)
    setLoading(true);
    fetch(baseURL + ENDPOINTS2.verifyEmail, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        setLoading(false);
        if (responseData.messages?.error) {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if (sv == 1) {
            if (profile_complete == 1) {
              navigation.navigate("AccountCreated");
            } else {
              navigation.navigate("UpdateUserProfile");
            }
          } else if (sv == 0) {
            handleSendVerificationSms();
            setCode("");
            setSelected(1);
            setCounter(120);
            SetIsCounted(true);
          }
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: e,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  const handleSendVerification = async () => {
    setLoading2(true);
    const token = await AsyncStorage.getItem("USERTOKEN");

    fetch(baseURL + ENDPOINTS2.sendVerificationEmail, {
      method: "GET",
      headers: {
        // "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        setLoading2(false);
        if (responseData.messages?.success) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCounter(120);
          SetIsCounted(true);
        } else {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: e,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading2(false);
      });
  };
  const handleSendVerificationSms = async () => {
    setLoading2(true);
    const token = await AsyncStorage.getItem("USERTOKEN");
    console.log("token ", token);
    fetch(baseURL + ENDPOINTS2.sendVerificationSms, {
      method: "GET",
      headers: {
        // "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        setLoading2(false);
        if (responseData.messages?.success) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCounter(120);
          SetIsCounted(true);
        } else {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: e,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading2(false);
      });
  };
  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <Image style={styles.logo} source={require("../../assets/nafaz.png")} />
      <ChangeLanguageModal
        show={changeLan}
        setShow={setChangeLan}
        handleLang={handleLang}
      />
      <CustomText
        color={COLORS.black}
        size={20}
        text={t("AccountVerification.verification")}
        style={styles.textColored}
      />
      <CustomText
        color={COLORS.black}
        size={15}
        text={t("AccountVerification.valid")}
        // style={styles.textColored3}
      />
      <View
        style={{
          flexDirection: i18n.language == "ar" ? "row" : "row-reverse",
          alignSelf: "center",
        }}
      >
        <View>
          <CustomText
            color={COLORS.header}
            size={24}
            text={counter >= 60 ? 1 : 0}
            style={styles.textColored3}
          />
          <CustomText
            color={COLORS.header}
            size={15}
            text={t("AccountVerification.minute")}
          />
        </View>
        <View>
          <CustomText
            color={COLORS.header}
            size={24}
            text={counter % 60}
            style={styles.textColored3}
          />
          <CustomText
            color={COLORS.header}
            size={15}
            text={t("AccountVerification.second")}
          />
        </View>
      </View>
      <CustomText
        color={COLORS.black}
        size={18}
        text={
          selected == 0
            ? t("AccountVerification.otp")
            : t("AccountVerification.otp2")
        }
        style={styles.text}
      />
      <OTPInputView
        style={styles.otp}
        pinCount={6}
        // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
        // onCodeChanged = {code => { this.setState({code})}}
        // autoFocusOnLoad
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(code) => {
          setCode(code);
          // handleVerifyEmail();
          // navigation.navigate('AccountCreated')
        }}
      />
      <Pressable
        disabled={loading2 || isCounted}
        onPress={() => {
          selected == 0
            ? handleSendVerification()
            : handleSendVerificationSms();
        }}
        style={styles.skipContainer}
      >
        <CustomText
          color={COLORS.black}
          size={13}
          text={
            loading2 ? (
              <ActivityIndicator size={"large"} color={COLORS.header} />
            ) : isCounted ? (
              <Text>{t("AccountVerification.encode")}</Text>
            ) : (
              <Text>
                {t("AccountVerification.didNotRecive")}
                <Text style={styles.textColored}>
                  {t("AccountVerification.resend")}
                </Text>
              </Text>
            )
          }
          style={styles.text}
        />
      </Pressable>
      <CustomButton
        color={COLORS.blue}
        loading={loading}
        onPress={() => {
          selected == 0 ? handleVerifyEmail() : handleVerifySms();
        }}
        textSize={12}
        text={t("AccountVerification.verify")}
        containerStyle={styles.btn}
      />
      <Pressable onPress={() => setChangeLan(true)}>
        <CustomInput
          containerStyle={styles.translate}
          inputStyle={styles.translateText}
          leftIcon={
            <FontAwesome5 name="caret-down" size={20} color={COLORS.blue} />
          }
          icon={
            <MaterialIcons name="g-translate" size={20} color={COLORS.blue} />
          }
          editable={false}
          value={t("loginScreen.lang")}
        />
      </Pressable>

      <CustomText
        color={COLORS.black}
        size={9}
        text={t("copyRights")}
        style={styles.text}
      />
    </ScrollView>
  );
};
export default AccountVerification;
