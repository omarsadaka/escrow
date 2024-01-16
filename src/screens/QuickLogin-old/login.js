import React, { useEffect, useMemo, useState } from "react";
import {
  // Text,
  Image,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
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
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import { getUniqueId } from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import {
  setShowModal,
  setShowOTPModal,
  setShowVideoModal,
} from "../../redux/actions/modal";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import CommonStyles from "../../constants/CommonStyles";

const QuickLoginScreen = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("test@meila.com");
  const [password, setPassword] = useState("123456789");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [fcm, setFcm] = useState("");
  const [showLangModal, setShowLangModal] = useState(false);

  const handleOpeningOTPModal = () => {
    dispatch(
      setShowOTPModal({
        status: true,
        code: "1234",
      })
    );
  };

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      let fcm = await messaging().getToken();
      setFcm(fcm);
    }
  }
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
  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    console.log("uuid value : ", uuidValue);
    setUuid(uuidValue);
  };
  useEffect(() => {
    requestUserPermission();
    getUUID();
  }, [navigation]);
  useEffect(() => {
    if (validateEmail(email) && password.length >= 8) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [email, password]);
  // const handleLogin = () => {
  //   if (!validated) return;
  //   setLoading(true);
  //   fetch(baseUrl + ENDPOINTS.login, {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       emailId: email,
  //       password: password,
  //       fcmToken: fcm,
  //       deviceID: uuid,
  //     }),
  //   })
  //     .then(response => response.json())
  //     .then(async responseData => {
  //       setLoading(false);
  //       if (responseData.status == 'failed') {
  //         showMessage({
  //           message: responseData.message,
  //           type: 'danger',
  //         });
  //       } else if (responseData.status == 'success') {
  //         showMessage({
  //           message: responseData.message,
  //           type: 'success',
  //         });
  //         await AsyncStorage.setItem('TOKEN', responseData.accessToken);
  //         await AsyncStorage.setItem('CUSTOMER_ID', responseData.customerId);
  //         await AsyncStorage.setItem(
  //           'CUSTOMER_OBJECT',
  //           JSON.stringify(responseData),
  //         );
  //         await AsyncStorage.setItem(
  //           'CUSTOMER_LOGIN',
  //           JSON.stringify({
  //             email: email,
  //             password: password,
  //             phone: responseData.customerId,
  //             fcm: fcm,
  //             uuid: uuid,
  //           }),
  //         );
  //         navigation.navigate('AccountAuthentication', {
  //           phone: responseData.customerId,
  //         });
  //       } else {
  //         showMessage({
  //           message: responseData.message,
  //           type: 'info',
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.log(e);
  //       showMessage({
  //         message: e,
  //         type: 'danger',
  //       });
  //       setLoading(false);
  //     });
  // };
  // const handleStaticQuickLogin = () => {

  //   handleLogin(); return;
  //   console.log('credentials', email);
  //   if (email == 'test@meila.com') {
  //    handleOpeningOTPModal
  //    AsyncStorage.setItem('CUSTOMER_ID', 'static');
  //   navigation.navigate('AccountAuthentication');
  //    } else {

  //   }
  // };
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
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <ChangeLanguageModal
        show={showLangModal}
        setShow={setShowLangModal}
        handleLang={handleLang}
      />
      <Image
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
      <View>
        <CustomInput
          label={t("loginScreen.email")}
          placeholder={"user@email.com"}
          value={email}
          onChangeText={setEmail}
          error={email.length ? !validateEmail(email) : false}
          errorMessage={t("profileScreens.emailRules")}
          icon={<Ionicons name="mail" size={20} color={COLORS.babyBlue2} />}
        />

        <CustomButton
          color={COLORS.blue}
          onPress={handleOpeningOTPModal}
          // loading={loading}
          textSize={12}
          text={t("loginScreen.sendOTP")}
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
        <Pressable onPress={() => setShowLangModal(true)}>
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
    </ScrollView>
  );
};
export default QuickLoginScreen;
