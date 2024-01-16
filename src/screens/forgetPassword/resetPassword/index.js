import React, { useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import CustomText from "../../../components/customText";
import CustomButton from "../../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../../components/customInput";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangeLanguageModal from "../../../modals/ChangeLanguageModal";
const ResetPasswordScreen = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const code = route?.params?.code;
  const email = route?.params?.email;
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);

  const handleResetApi = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    console.log(email, code);

    fetch(baseURL + ENDPOINTS.resetPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        token: code,
        email: email,
        password: newPassword,
        password_confirmation: confirmPassword,
        device_info: deviceInfo
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res asd", res);

        if (res.messages.success) {
          setLoading(false);
          Alert.alert(
             res.messages.success
          );
          navigation.navigate("Login");
        } else {
          setLoading(false);
          Alert.alert(
            res.messages.error
          );
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
        size={18}
        style={styles.textColored}
        text={t("resetPassword.resetPassword")}
      />

      <View>
        <CustomInput
          //inputRef={passRef}
          label={t("resetPassword.newPassword")}
          placeholder={"*********"}
          password={true}
          value={newPassword}
          onChangeText={(val) => setNewPassword(val)}
          //  error={password.length > 0 ? !validatePassword(newPassword) : false}
          errorMessage=" "
          icon={
            <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
          }
        />
        <CustomInput
          // inputRef={confirmPassRef}
          label={t("resetPassword.confirmPassword")}
          placeholder={"*********"}
          password={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          error={confirmPassword?.length > 0 && newPassword !== confirmPassword}
          errorMessage={t("resetPassword.confirmPassErr")}
          icon={
            <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
          }
        />

        <CustomButton
          color={COLORS.blue}
          onPress={handleResetApi}
          textSize={12}
          text={t("resetPassword.confirm")}
          containerStyle={styles.btn}
          loading={loading}
        />

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
      {/* <CustomText
        color={COLORS.black}
        size={9}
        text={t('copyRights')}
        style={styles.text}
      /> */}
    </ScrollView>
  );
};
export default ResetPasswordScreen;
