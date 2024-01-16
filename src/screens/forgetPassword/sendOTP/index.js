import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  // Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import CustomText from "../../../components/customText";
import CustomButton from "../../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../../components/customInput";
import { useDispatch } from "react-redux";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { setShowModal } from "../../../redux/actions/modal";
import { showMessage } from "react-native-flash-message";
import { hp } from "../../../utilis/dimensions";
import ChangeLanguageModal from "../../../modals/ChangeLanguageModal";

const SendOTPScreen = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const [loading, setLoading] = useState(false);
  const [sendingOTPLoader, setSendingOTPLoader] = useState(false);
  const [showOTPInput, setShowOTPInput] = useState(false);
  const [email, setEmail] = useState();
  const [code, setCode] = useState("");
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [counter, setCounter] = useState(0);
  const [isCounted, SetIsCounted] = useState(false);
  const ref1 = useRef();

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 &&
          (clearInterval(interval),
          SetIsCounted(false),
          setShowOTPInput(false));
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const sendOTPReq = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    try {
      fetch(baseURL + `${ENDPOINTS.forgetPassword}/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Localization": i18n?.language
        },
        body: JSON.stringify({
          type: email?.includes("@") ? "email" : "username",
          value: email,
          device_info: deviceInfo
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("resss after parse", data);
          if (data?.messages?.success) {
            setCounter(120);
            setLoading(false);
            SetIsCounted(true);
            setShowOTPInput(true);
          } else {
            setLoading(false);
            dispatch(
              setShowModal({
                status: true,
                header: t("updateHeader"),
                message: data?.messages?.success
                  ?data.messages.success
                  :  data.messages.error,
              })
            );
          }
        });
      setCode("");
    } catch (error) {
      setLoading(false);
      // alert('err')
      console.log(error);
    }
  };

  const handleValidateOTPReq = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setSendingOTPLoader(true);
    // setShowOTPInput(false);

    fetch(baseURL + ENDPOINTS.validateOTPPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        code: code,
        email: email,
        device_info: deviceInfo
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("resss of validate ", res);
        if (res?.status == "ok" && res?.data) {
          console.log("verified");
          showMessage({
            message:
               res?.messages?.success,
            type: "info",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("resetPassword", {
            code: res?.data?.token,
            email: res?.data?.email,
          });
          setSendingOTPLoader(false);
          setShowOTPInput(false);
        } else {
          setSendingOTPLoader(false);
          setCode("");
          //  Alert. alert(res.message)
          setShowOTPInput(false);
          showMessage({
            message:
              res?.messages?.error ,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      });
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

  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      <Image
        style={styles.logo}
        source={require("../../../assets/newLogo.png")}
      />
      <ChangeLanguageModal
        show={modalVisible1}
        setShow={setModalVisible1}
        handleLang={handleLang}
      />
      <CustomText
        color={COLORS.black}
        size={16}
        style={styles.textColored}
        containerStyle={{ maxWidth: "88%", alignSelf: "center" }}
        text={`${t("resetPassword.OTPHeader")}.......`}
      />
      <CustomInput
        inputRef={ref1}
        label={t("resetPassword.emailOrUsername")}
        placeholder={"test@meila.com"}
        value={email}
        onChangeText={(e) =>
          setEmail(e.replace(/[\u0621-\u064A\u0660-\u0669 ]*/g, ""))
        }
        error={
          email?.length && email.includes("@") ? !validateEmail(email) : false
        } // if it's an email validate
        errorMessage={t("profileScreens.emailRules")}
        icon={<Ionicons name="mail" size={20} color={COLORS.babyBlue2} />}
      />
      <View>
        <CustomButton
          color={COLORS.blue}
          onPress={() => {
            email?.length
              ? email.includes("@")
                ? validateEmail(email)
                  ? sendOTPReq()
                  : ref1.current.focus()
                : sendOTPReq()
              : ref1.current.focus();
          }}
          textSize={12}
          text={t("resetPassword.send")}
          containerStyle={styles.btn}
          loading={loading}
        />
        <TouchableOpacity onPress={sendOTPReq}>
          <CustomText
            color={COLORS.black}
            size={14}
            containerStyle={{ marginVertical: hp(1) }}
            //  style={styles.textColored}
            text={
              <CustomText size={15} color={COLORS.blue}>
                {" "}
                {t("AccountVerification.didNotRecive")} {"..."}
                {t("AccountVerification.resend")}
              </CustomText>
            }
          />
        </TouchableOpacity>

        <Pressable onPress={() => setModalVisible1(true)}>
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
      </View>
      {/* otp */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showOTPInput}
        onRequestClose={() => {
          setShowOTPInput(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View style={styles.modalContent1}>
              <Image
                style={styles.logo}
                source={require("../../../assets/newLogo.png")}
              />

              <CustomText
                // color={COLORS.black}
                color={"black"}
                size={15}
                text={t("AccountVerification.otp")}
                style={styles.text}
              />

              <CustomText
                color={COLORS.header}
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
                    text={counter % 60}
                    style={styles.textColored3}
                  />
                  <CustomText
                    color={COLORS.header}
                    size={15}
                    text={t("AccountVerification.second")}
                  />
                </View>
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
              </View>
              <OTPInputView
                style={styles.otp}
                pinCount={6}
                //editable={false}
                code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                onCodeChanged={(code) => {
                  setCode(code);
                }}
                autoFocusOnLoad={false}
                codeInputFieldStyle={styles.underlineStyleBase}
                codeInputHighlightStyle={styles.underlineStyleHighLighted}
                onCodeFilled={(code) => {
                  console.log(`Code is ${code}, you are good to go!`);
                }}
              />
            </View>

            <CustomButton
              color={COLORS.blue}
              onPress={handleValidateOTPReq}
              textSize={14}
              text={t("resetPassword.send")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
              loading={sendingOTPLoader}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default SendOTPScreen;
