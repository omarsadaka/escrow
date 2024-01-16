import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Modal,
  Image,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import Text from "../../components/globalText";

import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../components/customInput";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
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
import CustomAlert from "../../components/CustomAlert";
import messaging from "@react-native-firebase/messaging";
import { getUniqueId } from "react-native-device-info";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import CommonStyles from "../../constants/CommonStyles";

const Regsiter1Screen = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL2()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [modalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [modalVisible1, setModalVisible1] = useState(false);
  const [countryCode, setCountryCode] = useState("SA");
  const [countryName, setCountryName] = useState("Saudi Arabia");
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);

  // refs
  const emailRef = useRef(null);
  const iqamaRef = useRef(null);
  const passRef = useRef(null);
  const nameRef = useRef(null);
  const countryCodeRef = useRef(null);
  const countryNameRef = useRef(null);
  const confirmPassRef = useRef(null);
  const { t, i18n } = useTranslation();
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
  const validatePassword = (input) => {
    let regex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{7,})"
    );
    return regex.test(input);
  };
  const validateUserName = () => {
    if (userName && userName.length < 6) {
      return false;
    }
    return true;
  };
  const handleSendVerification = async (token) => {
    fetch(baseURL + ENDPOINTS2.sendVerificationEmail, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        if (responseData.messages?.success) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
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
      });
  };

  const handleSendVerificationSms = async (token) => {
    fetch(baseURL + ENDPOINTS2.sendVerificationSms, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("responseData", responseData);
        if (
          responseData.messages?.success ==
          "Email verification code sent successfully"
        ) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: responseData?.messages?.success,
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
      });
  };
  const SendToken = async (user_id) => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    fetch(baseURL + ENDPOINTS2.addToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify({
        uuid: await getUniqueId(),
        user_id: user_id,
        device_token: await messaging().getToken(),
        type: Platform.OS,
        device_info: deviceInfo
      }),
    });
  };
  const handleRegister = async () => {
    if (!validateEmail(email)) {
      emailRef.current.focus();
      return;
    }
    if (!validateUserName()) {
      nameRef.current.focus();
      return;
    }
    if (countryCode.length == 0) {
      countryCodeRef.current.focus();
      return;
    }
    if (countryName.length == 0) {
      countryNameRef.current.focus();
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
    if (userName) {
      handleFetchRegister();
    } else {
      setErrMessage(t("RegisterScreen.noUsername"));
      setErrShow(true);
    }
  };
  const handleFetchRegister =async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setErrShow(false);
    setLoading(true);
    var formdata = new FormData();
    formdata.append("email", email);
    formdata.append("mobile",'506666666'); // route.params.phone
    formdata.append("password", password);
    formdata.append("password_confirmation", confirmPassword);
    userName && formdata.append("username", userName);
    formdata.append("mobile_code", "966");
    formdata.append("country_code", countryCode);
    formdata.append("country", countryName);
    formdata.append("agree", "true");
    formdata.append('device_info', deviceInfo)
    console.log("userName ", userName);
    fetch(baseURL + ENDPOINTS2.register, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("responseData handleFetchRegister", responseData);
        setLoading(false);
        if (responseData?.status != "created") {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          SendToken(responseData?.data?.user?.id);
          await AsyncStorage.setItem(
            "USERTOKEN",
            responseData?.data?.access_token.toString()
          );
          await AsyncStorage.setItem("USERDATA", responseData?.data.toString());
          console.log("responseData?.message", responseData?.message);
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          handleSendVerification(responseData?.data?.access_token.toString());
          navigation.navigate("AccountVerification", {
            ev: responseData?.data?.user?.ev,
            sv: responseData?.data?.user?.sv,
            profile_complete: responseData?.data?.user?.profile_complete,
          });
        }
      })
      .catch((e) => {
        console.log('handleFetchRegister error',e);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={styles.bg}
    >
      <ChangeLanguageModal
        show={modalVisible1}
        setShow={setModalVisible1}
        handleLang={handleLang}
      />
      <Image
        resizeMode="contain"
        style={CommonStyles.logo}
        source={require("../../assets/newLogo1.jpeg")}
      />
      <CustomText
        color={COLORS.black}
        size={16}
        text={
          <Text>
            <Text style={styles.textColored}>{t("loginScreen.buyer")}</Text>
            {t("loginScreen.and")}
            <Text style={styles.textColored}>{t("loginScreen.seller")}</Text>
            {t("loginScreen.agree") + t("loginScreen.conditions")}
          </Text>
        }
        style={styles.text}
      />
      <View>
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
        {/* <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            height: hp(10),
            width: wp(20),
          }}
        >
          <CountryPicker
            {...{
              countryCode,
              // withFilter,
              // withFlag,
              // withCountryNameButton,
              // withAlphaFilter,
              // withCallingCode,
              // withEmoji,
              onSelect,
            }}
            visible
          />
        </View> */}
        <CustomInput
          editable={false}
          inputRef={countryCodeRef}
          label={t("RegisterScreen.countryCode")}
          placeholder={"SA"}
          value={countryCode}
          onChangeText={setCountryCode}
          keyboardType={"default"}
          error={countryCode.length == 0}
          errorMessage={t("RegisterScreen.countryCerror")}
          icon={<AntDesign name="edit" size={20} color={COLORS.babyBlue2} />}
        />
        <CustomInput
          editable={false}
          inputRef={countryNameRef}
          label={t("RegisterScreen.countryName")}
          placeholder={"Saudi arabia"}
          value={countryName}
          onChangeText={setCountryName}
          keyboardType={"default"}
          error={countryName.length == 0}
          errorMessage={t("RegisterScreen.countryNerror")}
          icon={<AntDesign name="edit" size={20} color={COLORS.babyBlue2} />}
        />
        <CustomInput
          inputRef={nameRef}
          label={t("RegisterScreen.nn")}
          placeholder={"Ali123"}
          value={userName}
          onChangeText={(e) =>
            setUserName(e.replace(/[\u0621-\u064A\u0660-\u0669 ]*/g, ""))
          }
          keyboardType={"default"}
          error={!validateUserName()}
          errorMessage={t("RegisterScreen.nameValidation")}
          icon={<AntDesign name="edit" size={20} color={COLORS.babyBlue2} />}
        />
        <CustomInput
          inputRef={passRef}
          label={t("loginScreen.password")}
          placeholder={"*********"}
          password={true}
          value={password}
          onChangeText={setPassword}
          error={password.length > 0 ? !validatePassword(password) : false}
          errorMessage={t("RegisterScreen.passwordRules")}
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
          onPress={() => setModalVisible(!modalVisible)}
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

        <CustomButton
          color={COLORS.blue}
          onPress={() => {
            handleRegister();
          }}
          loading={loading}
          textSize={12}
          text={t("loginScreen.signUp")}
          containerStyle={styles.btn}
        />

        <Pressable
          onPress={() => {
            navigation.navigate("Login");
          }}
          style={styles.skipContainer}
        >
          <CustomText
            color={COLORS.black}
            size={13}
            text={
              <Text>
                {t("RegisterScreen.or")}
                <Text style={styles.textColored}>
                  {" "}
                  {t("RegisterScreen.signIn")}
                </Text>
              </Text>
            }
            style={styles.text}
          />
        </Pressable>
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

      <CustomText
        color={COLORS.black}
        size={9}
        text={t("copyRights")}
        style={styles.text}
      />
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
            style={styles.centeredView2}
            contentContainerStyle={styles.scrollModal}
          >
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
                setModalVisible(!modalVisible);
              }}
              textSize={12}
              text={t("RegisterScreen.agree")}
              containerStyle={styles.btn}
            />
          </ScrollView>
        </View>
      </Modal>
      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          handleFetchRegister();
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={false}
        action2={() => {
          setErrShow(false);
        }}
        btn2={t("accountScreen.cancle")}
      />
    </ScrollView>
  );
};
export default Regsiter1Screen;
