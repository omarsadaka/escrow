import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  // Text,
  Image,
  View,
  Pressable,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import Text from "../../components/globalText";

import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../components/customInput";
import { useDispatch } from "react-redux";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BASE_URL,
  ENDPOINTS,
  ENDPOINTS2,
  getBaseURL,
} from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import { setShowOTPModal } from "../../redux/actions/modal";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import CommonStyles from "../../constants/CommonStyles";
import { useRoute } from "@react-navigation/native";

const QuickLoginScreen = ({ navigation }) => {
  const route = useRoute();
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("test@meila.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phone, setPhone] = useState("");
  const [step, setStep] = useState(0);
  const [phoneValid, setPhoneValid] = useState(false);
  const [iquama, setIqama] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(true);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [changeLan, setChangeLan] = useState(false);
  const {Type, user} = route?.params;


  // refs
  const emailRef = useRef(null);
  const iqamaRef = useRef(null);
  const passRef = useRef(null);
  const confirmPassRef = useRef(null);

  const handleOpeningOTPModal = () => {
    dispatch(
      setShowOTPModal({
        status: true,
        code: phone,
      })
    );
  };
  const requestCallPermission = async () => {
    request(PERMISSIONS.ANDROID.CALL_PHONE).then((result) => {
      console.log("result", result);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            "This feature is not available (on this device / in this context)"
          );
          break;
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.LIMITED:
          console.log("The permission is limited: some actions are possible");
          break;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          showMessage({
            message: "The permission is granted",
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          showMessage({
            message: "The permission is denied and not requestable anymore",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          break;
      }
      // …
    });
  };

  const requestSMSPermission = async () => {
    request(PERMISSIONS.ANDROID.READ_SMS).then((result) => {
      console.log("result", result);
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            "This feature is not available (on this device / in this context)"
          );
          break;
        case RESULTS.DENIED:
          console.log(
            "The permission has not been requested / is denied but requestable"
          );
          break;
        case RESULTS.LIMITED:
          console.log("The permission is limited: some actions are possible");
          break;
        case RESULTS.GRANTED:
          console.log("The permission is granted");
          showMessage({
            message: "The permission is granted",
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          showMessage({
            message: "The permission is denied and not requestable anymore",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          break;
      }
      // …
    });
  };
  const handleSendPhone = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("mobile", `966${phone}`);
    formdata.append('device_info', deviceInfo)
    setLoading(true)
    console.log('url: ',baseURL + ENDPOINTS2.otp_login)
    console.log('url: ',formdata)
    fetch(baseURL + ENDPOINTS2.otp_login, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      body: formdata
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("reeesss  : ", responseData);
        setLoading(false)
        if (responseData.status == true) {
          showMessage({
            message: responseData.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if(Type=='fastSignIn'){
            navigation.navigate("VerifyOtpFastLogin",{
              Email: responseData.email,
              Phone:  `966${phone}`,
              user: user
            })
          }
        } else {
          showMessage({
            message: responseData.messages.error,
            type: "warning",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setLoading(false)
        console.log("er ", er);
        showMessage({
          message: er.toString(),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  const ModalComponent = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.modalView}>
        <View style={styles.centeredView}>
          <View style={styles.modalSubView}></View>
          <CustomText
            text={
              step == 0
                ? t("quickLogin.m1")
                : step == 1
                ? t("quickLogin.m2") + "\n" + phone
                : t("quickLogin.m3")
            }
            style={styles.modalText}
            color={COLORS.grey}
          />
          <CustomButton
            color={COLORS.white}
            onPress={() => {
              setModalVisible(!modalVisible);
                if (step == 0) {
                  setStep(1);
                  requestCallPermission();
                } else if (step == 1) {
                  // setStep(2);
                  handleSendPhone();
                } else if (step == 3) {
                  requestSMSPermission();
                }            
            }}
            textSize={12}
            text={
              step == 0 || step == 3
                ? t("quickLogin.continue")
                : t("quickLogin.yes")
            }
            containerStyle={styles.closeButton}
            textStyle={styles.closeButtonTxt}
          />
          {step == 1 && (
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
              textSize={12}
              text={t("quickLogin.edit")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          )}
        </View>
      </View>
    </Modal>
  );

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
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleBiometricAuthentication = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("CUSTOMER_LOGIN");
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      if (value !== null) {
        navigation.navigate("AccountAuthentication", {
          login: true,
          phone: value.phone,
          user: value,
        });
      } else {
        Alert.alert("You need to login atleast once ");
      }
    } catch (e) {
      // error reading value
    }
  };

  const validatePassword = (input) => {
    let regex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})"
    );
    return regex.test(input);
  };
  const handleRegister = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setLoading(true);
    fetch(baseURL + ENDPOINTS.register, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify({
        emailId: email,
        phone: phone,
        iquama: iquama,
        password: password,
        usertype: "seller",
        device_info: deviceInfo
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        setLoading(false);
        if (responseData?.status == "failed") {
          showMessage({
            message: responseData?.message,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData?.status == "success") {
          showMessage({
            message: responseData?.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          handleOpeningOTPModal();
          setStep(3);
          setModalVisible(!modalVisible);
        } else {
          showMessage({
            message: responseData?.message,
            type: "info",
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
        setLoading(true);
      });
  };
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <ModalComponent />
      <ChangeLanguageModal
        show={changeLan}
        setShow={setChangeLan}
        handleLang={handleLang}
      />

      <Image
        resizeMode="contain"
        style={CommonStyles.logo}
        source={require("../../assets/newLogo1.jpeg")}
      />
      <CustomText
        color={COLORS.black}
        size={18}
        text={
          <Text>
            <Text style={styles.textColored}>{t("loginScreen.buyer")}</Text>{" "}
            {t("loginScreen.and")}
            <Text style={styles.textColored}>
              {" "}
              {t("loginScreen.seller")}
            </Text>{" "}
            {t("loginScreen.agree") + t("loginScreen.conditions")}
          </Text>
        }
        style={styles.text}
      />
      <View style={{ paddingTop: 30 }}>
        {step == 0 || step == 1 ? (
          <CustomPhoneInputFinal
            onChangeText={setPhone}
            setIsValid={setPhoneValid}
            noContacts={true}
            showQRCode={false}
          />
        ) : step == 2 ? (
          <>
            <CustomInput
              inputRef={emailRef}
              label={t("RegisterScreen.email")}
              placeholder={"user@email.com"}
              value={email}
              onChangeText={setEmail}
              error={email.length > 0 ? !validateEmail(email) : false}
              errorMessage={t("profileScreens.emailRules")}
              icon={<Ionicons name="mail" size={20} color={COLORS.babyBlue2} />}
            />
            <CustomInput
              inputRef={iqamaRef}
              label={t("RegisterScreen.id")}
              placeholder={"456321025785"}
              value={iquama}
              onChangeText={setIqama}
              keyboardType={"number-pad"}
              error={iquama.length > 0 && iquama.length != 10}
              errorMessage={t("RegisterScreen.IqamaValidation")}
              icon={
                <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
              }
            />
            <CustomInput
              inputRef={passRef}
              label={t("loginScreen.password")}
              placeholder={"*********"}
              password={true}
              value={password}
              onChangeText={setPassword}
              error={password.length > 0 ? !validatePassword(password) : false}
              errorMessage=" "
              icon={
                <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
              }
            />
            <CustomInput
              inputRef={confirmPassRef}
              label={t("RegisterScreen.confirmPassword")}
              placeholder={"*********"}
              password={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              error={confirmPassword.length > 0 && password !== confirmPassword}
              errorMessage={t("profileScreens.confirmPassRules")}
              icon={
                <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
              }
            />

            {!validatePassword(password) && (
              <View style={styles.passRulesContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={COLORS.blue}
                />
                <CustomText
                  color={COLORS.blue}
                  size={10}
                  text={t("RegisterScreen.passwordRules")}
                  style={{ textAlign: "left", width: "95%" }}
                />
              </View>
            )}
            <Pressable
              onPress={() => setModalVisible2(!modalVisible2)}
              style={styles.conditionsContainer}
            >
              <Ionicons name="checkmark-circle" size={25} color={COLORS.blue} />
              <CustomText
                color={COLORS.black}
                size={10}
                text={
                  <Text>
                    {t("RegisterScreen.accepting")}
                    <Text style={styles.textColored}>
                      {t("RegisterScreen.terms")}
                    </Text>
                  </Text>
                }
                style={{ textAlign: "left", width: "95%" }}
              />
            </Pressable>
          </>
        ) : (
          <></>
        )}

        <CustomButton
          color={COLORS.blue}
          onPress={() => {
            if(Type=='fastSignIn'){
              phoneValid && setModalVisible(!modalVisible);
              return
            }
            if (step == 1) {
              phoneValid && setModalVisible(!modalVisible);
            } else if (step == 2) {
              if (!validateEmail(email)) {
                emailRef.current.focus();
                return;
              }
              if (iquama.length != 10) {
                iqamaRef.current.focus();
                return;
              }
              if (!validatePassword(password)) {
                passRef.current.focus();
                return;
              }
              if (password !== confirmPassword) {
                confirmPassRef.current.focus();
                return;
              }
              handleRegister();
            }
          }}
          loading={loading}
          textSize={12}
          text={t("quickLogin.continue")}
          containerStyle={styles.btn}
        />

        <Pressable
          onPress={() => {
            navigation.navigate("RegisterValidateMobile");
          }}
          style={styles.skipContainer}
        >
          <CustomText
            color={COLORS.black}
            size={13}
            text={
              <Text>
                {t("loginScreen.noAccount")}
                <Text style={styles.textColored}>
                  {" "}
                  {t("loginScreen.signUp")}
                </Text>
              </Text>
            }
            style={styles.text}
          />
        </Pressable>
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
        <Pressable
          onPress={() => handleBiometricAuthentication()}
          style={styles.socialContainer}
        >
          <Image
            style={styles.social}
            source={require("../../assets/fingerprint.png")}
          />
          <Image
            style={styles.social}
            source={require("../../assets/face_recognition2.png")}
          />
          <Image
            style={styles.social}
            source={require("../../assets/pin.png")}
          />
        </Pressable>
      </View>

      <CustomText
        color={COLORS.black}
        size={9}
        text={t("copyRights")}
        style={styles.text}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible2}
        onRequestClose={() => {
          setModalVisible2(!modalVisible2);
        }}
      >
        <View style={styles.centeredView2}>
          <View style={styles.termsHeader}>
            <CustomText
              color={COLORS.blue}
              size={20}
              text={t("RegisterScreen.termsTitle")}
              style={styles.text2}
            />
          </View>

          <CustomText
            color={COLORS.grey}
            size={14}
            text={t("RegisterScreen.termsText")}
            style={{ textAlign: "left" }}
          />
          <CustomButton
            color={COLORS.blue}
            onPress={() => {
              setModalVisible2(!modalVisible2);
            }}
            textSize={12}
            text={t("RegisterScreen.agree")}
            containerStyle={styles.btn}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};
export default QuickLoginScreen;
