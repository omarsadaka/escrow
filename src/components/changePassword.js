import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import CustomInput from "./customInput";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../utilis/dimensions";
import CustomText from "./customText";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../constants/API";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = () => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const validatePassword = (input) => {
    let regex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    return regex.test(input);
  };
  useEffect(() => {
    if (
      oldPassword.length >= 8 &&
      validatePassword(password) &&
      password == confirmPassword
    ) {
      setValidated(true);
    } else {
      setValidated(false);
    }
  }, [password, confirmPassword, oldPassword]);

  const handleChangePassword = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    var formdata = new FormData();
    formdata.append("current_password", oldPassword);
    formdata.append("password", password);
    formdata.append("password_confirmation", confirmPassword);
    formdata.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS.changePassword, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((responseData) => {

        setLoading(false);
        if (responseData.messages.success) {
          showMessage({
            message: responseData.messages.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setOldPassword("");
          setPassword("");
          setConfirmPassword("");
          //   navigation.navigate('AccountVerification', {phone: phone});
        } else {
          showMessage({
            message: responseData.messages.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: t("apiErr"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  return (
    <>
      <CustomInput
        label={t("profileScreens.oldPass")}
        inputRef={ref1}
        placeholder={"*********"}
        password={true}
        value={oldPassword}
        onChangeText={setOldPassword}
        error={oldPassword.length > 0 && oldPassword.length < 8}
        errorMessage={t("profileScreens.passRules")}
        icon={<Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />}
      />
      <CustomInput
        label={t("profileScreens.newPass")}
        inputRef={ref2}
        placeholder={"*********"}
        password={true}
        value={password}
        onChangeText={setPassword}
        error={password.length > 0 && !validatePassword(password)}
        errorMessage={t("profileScreens.passRules")}
        icon={<Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />}
      />
      <CustomInput
        label={t("profileScreens.confirmPass")}
        inputRef={ref3}
        placeholder={"*********"}
        password={true}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={password !== confirmPassword}
        errorMessage={t("profileScreens.confirmPassRules")}
        icon={<Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />}
      />
      {/* oldPassword.length >= 8 && validatePassword(password) && password ==
      confirmPassword */}
      <TouchableOpacity
        disabled={loading ? true : false}
        onPress={() =>
          validated
            ? handleChangePassword()
            : oldPassword.length < 8
            ? ref1.current.focus()
            : validatePassword(password)
            ? confirmPassword == password
              ? handleChangePassword()
              : ref3.current.focus()
            : ref2.current.focus()
        }
        style={styles.buttonStyle}
      >
        {loading ? (
          <ActivityIndicator size={"large"} color={"white"} />
        ) : (
          <CustomText
            color={"white"}
            size={16}
            text={t("profileScreens.updatePass")}
            style={styles.BackTxt3}
          />
        )}
      </TouchableOpacity>
    </>
  );
};
const createStyles = (COLORS) =>
  StyleSheet.create({
    BackTxt3: {
      // fontWeight: 'bold',
      // marginHorizontal: 10,
    },
    buttonStyle: {
      height: hp(7),
      width: "84%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(5),
      marginHorizontal: wp(8),
      marginBottom: hp(4),
    },
  });
export default ChangePassword;
