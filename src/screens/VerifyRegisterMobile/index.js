import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  // Text,
  Image,
  View,
  ScrollView,
  Text,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import createStyles from "./style";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";
import {
  getHash,
  removeListener,
  startOtpListener,
} from "react-native-otp-verify";
import CustomText from "../../components/customText";
import { hp, wp } from "../../utilis/dimensions";

const VerifyRegisterMobile = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const { phone } = route.params;
  const styles = useMemo(() => createStyles(COLORS), []);
  const [code, setCode] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [navigation]);
  const [counter, setCounter] = useState(120);
  const [isCounted, SetIsCounted] = useState(true);
  const [resendLoading, setResendLoading] = useState(false);
  const [isResend, setIsResend] = useState(false);

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
  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 &&
          (clearInterval(interval), SetIsCounted(false));
          lastTimerCount <= 1 && isResend && navigation.goBack()
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);

  const handleVerifyMobile = async (c) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("verify code : ", c);
    var formdata = new FormData();
    formdata.append("ver_code", c);
    formdata.append("mobile_code", "966");
    formdata.append("mobile", phone);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.verifyMobileRegister,
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then(async (res) => {
        console.log("res disable : ", res.data);
        if (res?.data?.messages?.success) {
          // navigation.navigate("Register", { phone: phone });
          handleCheckCountry(res?.data?.messages?.success)
        } else {
          showMessage({
            message: res?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        showMessage({
          message: "something went wrong try again",
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  const handleCheckCountry = async (message) => {
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS2.checkCountry,
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
    }).then(async (res) => {
        console.log("res handleCheckCountry : ", res.data);
        if (res?.data?.status=='success') {
          showMessage({
            message: message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
          navigation.navigate("Register", { phone: phone });
        } else {
          showMessage({
            message: t('RegisterScreen.countryPanned'),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        showMessage({
          message: "something went wrong try again",
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  const handleSubmitPhone =async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setResendLoading(true);
    var formdata = new FormData();
    formdata.append("mobile_code", "966");
    formdata.append("mobile", phone);
    formdata.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS2.submitPhoneRegister, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("responseData omaraaa", responseData);
        setResendLoading(false);
        if (responseData?.messages?.success) {
          showMessage({
            message: responseData?.messages?.success+' '+ phone.substring(5)+'*****',     //responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setIsResend(true)
          setCounter(120)
          SetIsCounted(true)
        } else {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          // navigation.goBack()
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setResendLoading(false);
      });
  };
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <Image style={styles.logo} source={require("../../assets/newLogo.png")} />
      <CustomText
        text={
          <Text>
            {t("loginScreen.vma")}
            <Text>
              {phone}
              <Text>{t("loginScreen.vma2")}</Text>
            </Text>
          </Text>
        }
        size={16}
        // style={styles.modalText}
        color={COLORS.header}
      />
      <View
        style={{
          flexDirection: i18n.language == "ar" ? "row" : "row-reverse",
          alignSelf: "center",
          marginTop: hp(1),
        }}
      >
        <View>
          <CustomText
            color={COLORS.header}
            size={24}
            text={parseInt(counter / 60)}
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
      {/* <Pressable onPress={() => {}} style={styles.skipContainer}>
        <CustomText
          color={COLORS.black}
          size={13}
          text={
            <Text>
              {t("AccountVerification.didNotRecive")}
              <Text style={styles.textColored}>
                {" "}
                {t("AccountVerification.resend")}
              </Text>
            </Text>
          }
          style={styles.text}
        />
      </Pressable> */}
      <View style={[styles.skipContainer,{flexDirection:'row',alignItems:'center'}]}>
            <CustomText
                color={COLORS.black}
                size={13}
                text={
                  <Text>
                    {t("AccountVerification.didNotRecive")}
                  </Text>
                }
                style={styles.text}
              />
              {resendLoading?
              <ActivityIndicator size={'small'} color={COLORS.blue} style={{marginHorizontal: wp(3)}}/>
              :
              <TouchableOpacity onPress={() => handleSubmitPhone()}  disabled={counter>0}>
               <Text style={[styles.textColored,{color: counter>0?COLORS.grey:COLORS.blue}]}>
                 {" "}
                 {t("AccountVerification.resend")}
               </Text>
              </TouchableOpacity>
              }
      </View>

      <OTPInputView
        style={styles.otp}
        pinCount={6}
        code={code}
        onCodeChanged={(code) => setCode(code)}
        autoFocusOnLoad={true}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(c) => {
          setCode(c);
          handleVerifyMobile(c);
        }}
      />
    </ScrollView>
  );
};
export default VerifyRegisterMobile;
