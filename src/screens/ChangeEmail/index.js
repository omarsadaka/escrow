import React, { useMemo, useRef, useState } from "react";
import { View, ScrollView, Modal } from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomInput from "../../components/customInput";
import { useRoute, useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import { hp } from "../../utilis/dimensions";
import axios from "axios";
import { useDispatch } from "react-redux";
import { showSimpleModal } from "../../redux/actions/modal";
import i18n from "../../Translations";

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};
const ChangeEmail = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const dispatch = useDispatch();
  const route = useRoute();
  const { path } = route?.params;
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [updatedPin, setUpdatedPin] = useState("");
  const [updateConfirmPin, setUpdateConfirmPin] = useState("");
  const [oldPin, setOldPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkingLoader, setCheckingLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref1 = useRef();
  const ref2 = useRef();
  const ref3 = useRef();

  const handleChangeEmailOrPhone = async () => {
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const info = JSON.parse(userInfo);
    console.log("info", userInfo);
    let obj = {
      value: path == "phone" ? phone : email,
      type: path == "phone" ? "mobile" : path,
      device_info: deviceInfo
    };

    if (info.username == info.mobile && path == "phone") {
      dispatch(
        showSimpleModal({
          status: true,
          payload: {
            header: i18n.language == "ar" ? "تحذير" : "Warnning",
            message: t("usernamePhoneMatching"),
            action: "",
            type: "error",
          },
        })
      );
      Object.assign(obj, { force_username: 1 });
    }
    console.log("obj", obj);
    setCheckingLoader(true);
    let token = await AsyncStorage.getItem("TOKEN");
    try {
      axios({
        method: "POST",
        url: baseURL + ENDPOINTS.changeEmailOrPhone,
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
          "X-Localization": i18n?.language,
        },
        data: obj,
      }).then((responseData) => {
        console.log("res code", responseData);
        setCheckingLoader(false);
        if (responseData.data.messages.success) {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("success"),
                message: path == "phone"?t('profileScreens.phoneVerificationMessage')+' '+ phone.substring(5)+'*****' : responseData.data.messages.success,
                action: "",
                type: "success",
              },
            })
          );
          navigation.navigate("VerifyEmail", {
            path: path == "phone" ? "mobile" : path,
            value: path == "phone" ? phone : email,
          });
        } else {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("mistake"),
                message: responseData?.data?.messages?.error,
                action: "",
                type: "error",
              },
            })
          );
        }
      });
    } catch (error) {
      setCheckingLoader(false);
    }
  };

  const ModalComponent = ({ text }) => (
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
          <View style={styles.modalSubView}>
            <Ionicons
              name={
                path == "email" ? "mail" : path == "pin" ? "md-keypad" : "call"
              }
              size={20}
              color={COLORS.blue}
            />
            <CustomText
              text={
                path == "email"
                  ? t("profileScreens.email")
                  : path == "pin"
                  ? t("settingsScreen.pin")
                  : t("profileScreens.phone")
              }
              color={COLORS.blue}
              size={12}
              style={styles.passwordTitle}
            />
          </View>
          <CustomText
            text={text}
            style={styles.modalText}
            color={COLORS.grey}
          />
          <CustomButton
            color={COLORS.white}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.navigate("VerifyEmail", { path: path });
            }}
            textSize={12}
            text={t("accountScreen.closeAccount")}
            containerStyle={styles.closeButton}
            textStyle={styles.closeButtonTxt}
          />
        </View>
      </View>
    </Modal>
  );
  const handlePin = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    if (pin.length != 4 || pin != confirmPin) return;
    let token = await AsyncStorage.getItem("TOKEN");
    let phone = await AsyncStorage.getItem("CUSTOMER_ID");

    setLoading(true);
    fetch(baseURL + ENDPOINTS.saveMpin, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify({
        mpin: pin,
        device_info: deviceInfo
      }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log(responseData);
        setLoading(false);
        if (responseData.status == "failed" || responseData.error) {
          showMessage({
            message: responseData.message || responseData.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == "success") {
          showMessage({
            message: responseData.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          updatePin();
          await AsyncStorage.setItem("CUSTOMER_PIN", pin);
          navigation.goBack();
        } else {
          showMessage({
            message: responseData.message || responseData.error,
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
  const handleUpdatePin = async () => {
    console.log("oldPin: ", oldPin);
    console.log("updatedPin: ", updatedPin);
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("change pin value  : ");
    var formdata = new FormData();
    formdata.append("pin", updatedPin);
    // formdata.append("old_pin", oldPin);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.add_updatePin,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then(async (res) => {
        setLoading(false);
        console.log("res status : ", res.data);
        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          await AsyncStorage.setItem("USER_PIN_VALUE", updatedPin);
          navigation.goBack();
        } else if (res?.data?.messages?.error) {
          showMessage({
            message: res?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
            showMessage({
              message: res?.data?.message,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        setLoading(false);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  const updatePin = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    fetch(baseURL + ENDPOINTS.getSettings, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.status == "success") {
          fetch(baseURL + ENDPOINTS.saveSettings, {
            method: "POST",
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              faceId: responseData.data.faceId,
              language: responseData.data.language,
              theme: responseData.data.theme,
              notificationPreference: responseData.data.notificationPreference,
              fingerPrint: responseData.data.fingerPrint,
              applicationPin: 1,
              device_info: deviceInfo
            }),
          })
            .then((response) => response.json())
            .then((responseData) => {
              if (responseData.status == "success") {
              } else {
                console.log("error : ", responseData.message);
              }
            })
            .catch((e) => {
              console.log("error : ", e);
            });
        } else {
          console.log("error : ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error : ", e);
      });
  };

  return (
    <>
      <CustomHeader navigation={navigation} />
      <ScrollView scrollEnabled={true} contentContainerStyle={styles.bg}>
        <View>
          <CustomText
            text={
              path == "email"
                ? t("profileScreens.ChangeEmail")
                : path == "pin"
                ? t("profileScreens.ChangePin")
                : path == "updatePin"
                ? t("profileScreens.ChangePin2")
                : t("profileScreens.ChangePhone")
            }
            color={COLORS.black}
            size={20}
            style={styles.title}
          />
          <ScrollView style={{ marginTop: hp(1) }}>
            {path == "email" ? (
              <>
                <CustomInput
                  label={t("RegisterScreen.email2")}
                  placeholder={"user@email.com"}
                  value={email}
                  onChangeText={setEmail}
                  error={email.length > 0 ? !validateEmail(email) : false}
                  errorMessage={t("profileScreens.emailRules")}
                  icon={
                    <Ionicons name="mail" size={20} color={COLORS.babyBlue2} />
                  }
                />
                <CustomInput
                  label={t("profileScreens.confirmEmail")}
                  placeholder={"user@email.com"}
                  value={confirmEmail}
                  onChangeText={setConfirmEmail}
                  error={confirmEmail.length > 0 && email !== confirmEmail}
                  errorMessage={t("profileScreens.confirmEmailRules")}
                  icon={
                    <Ionicons name="mail" size={20} color={COLORS.babyBlue2} />
                  }
                />
              </>
            ) : path == "pin" ? (
              <>
                <CustomInput
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={t("AccountVerification.pin")}
                  placeholder={"******"}
                  value={pin}
                  onChangeText={setPin}
                  error={pin.length > 0 && pin.length != 6}
                  errorMessage={t("profileScreens.pinRules")}
                  icon={
                    <Ionicons
                      name="md-keypad"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
                <CustomInput
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={t("profileScreens.confirmPin")}
                  placeholder={"******"}
                  value={confirmPin}
                  onChangeText={setConfirmPin}
                  error={confirmPin.length > 0 && pin !== confirmPin}
                  errorMessage={t("profileScreens.confirmPinRules")}
                  icon={
                    <Ionicons
                      name="md-keypad"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
              </>
            ) : path == "updatePin" ? (
              <>
                {/* <CustomInput
                  inputRef={ref1}
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={t("AccountVerification.pin2")}
                  placeholder={"******"}
                  value={oldPin}
                  onChangeText={setOldPin}
                  error={oldPin.length > 0 && oldPin.length != 6}
                  errorMessage={t("profileScreens.pinRules")}
                  icon={
                    <Ionicons
                      name="md-keypad"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                /> */}
                <CustomInput
                  inputRef={ref2}
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={t("AccountVerification.pin3")}
                  placeholder={"****"}
                  value={updatedPin}
                  onChangeText={setUpdatedPin}
                  error={updatedPin.length > 0 && updatedPin.length != 6}
                  errorMessage={t("profileScreens.pinRules")}
                  icon={
                    <Ionicons
                      name="md-keypad"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
                <CustomInput
                  inputRef={ref3}
                  maxLength={6}
                  keyboardType="phone-pad"
                  label={t("AccountVerification.pin4")}
                  placeholder={"******"}
                  value={updateConfirmPin}
                  onChangeText={setUpdateConfirmPin}
                  error={
                    updateConfirmPin.length > 0 &&
                    updatedPin !== updateConfirmPin
                  }
                  errorMessage={t("profileScreens.confirmPinRules")}
                  icon={
                    <Ionicons
                      name="md-keypad"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
              </>
            ) : (
              <CustomPhoneInputFinal
                onChangeText={setPhone}
                // smaller={true}
                // containerStyle={{ width: "80%" ,marginLeft:'10%'}}
                dropDownContainerStyle={{ width: "29%" }}
                noContacts={true}
                showQRCode={false}
                changeMobile={true}
              />
            )}
          </ScrollView>
        </View>
        <View>
          <CustomButton
            disabled={
              (path == "email" && email?.length == 0) ||
              (path == "phone" && phone?.length == 0)
                ? true
                : loading
            }
            loading={
              path == "email" || path == "phone" ? checkingLoader : loading
            }
            color={COLORS.blue}
            onPress={() => {
              path == "pin"
                ? handlePin()
                : path == "updatePin"
                ? 
                // oldPin.length >= 0 && oldPin.length != 6
                //   ? ref1.current.focus()
                //   : 
                  updatedPin.length >= 0 && updatedPin.length != 6
                  ? ref2.current.focus()
                  : updateConfirmPin.length >= 0 &&
                    updatedPin !== updateConfirmPin
                  ? ref3.current.focus()
                  : handleUpdatePin()
                : path == "email" || path == "phone"
                ? handleChangeEmailOrPhone()
                : setModalVisible(true);
            }}
            textSize={12}
            text={t("newTransactions.Save")}
            containerStyle={styles.btn}
          />
          <CustomButton
            color={COLORS.white}
            onPress={() => {
              navigation.goBack();
            }}
            textSize={12}
            text={t("accountScreen.closeAccount")}
            containerStyle={styles.closeButton}
            textStyle={styles.closeButtonTxt}
          />
        </View>
        <ModalComponent
          text={
            path == "email"
              ? t("profileScreens.emailVerificationMessage")
              : path == "phone"
              ? t("profileScreens.phoneVerificationMessage")
              : ""
          }
        />
      </ScrollView>
    </>
  );
};
export default ChangeEmail;
