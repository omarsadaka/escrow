import React, { useMemo, useRef, useState } from "react";
import { View, ScrollView, Modal } from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";

import CustomInput from "../../components/customInput";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseURL, ENDPOINTS2 } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { useTheme } from "@react-navigation/native";

const ApplicationPin = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [loading, setLoading] = useState(false);
  const ref1 = useRef();
  const ref2 = useRef();

  const handleChangePINStatus = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("status", 1);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.pinStatus,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
      },
      data: formdata,
    })
      .then((res) => {
        setLoading(false);
        console.log("res status : ", res.data);
        if (res?.data?.messages?.success) {
          handleUpdatePin();
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (res?.data?.error?.status) {
          showMessage({
            message: res?.data?.error?.status,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: res?.data,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setLoading(true);
        console.log("er : ", er);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };
  const handleUpdatePin = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("change pin value  : ");
    var formdata = new FormData();
    formdata.append("pin", pin);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.add_updatePin,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
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
          await AsyncStorage.setItem("USER_PIN", "1");
          await AsyncStorage.setItem("USER_PIN_VALUE", pin);
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
  return (
    <>
      <CustomHeader navigation={navigation} />
      <ScrollView scrollEnabled={true} contentContainerStyle={styles.bg}>
        <View>
          <CustomText
            text={t("profileScreens.ChangePin")}
            color={COLORS.black}
            size={20}
            style={styles.title}
          />
          <CustomInput
            inputRef={ref1}
            maxLength={6}
            keyboardType="phone-pad"
            label={t("AccountVerification.pin")}
            placeholder={"******"}
            value={pin}
            onChangeText={setPin}
            error={pin.length > 0 && pin.length != 6}
            errorMessage={t("profileScreens.pinRules")}
            icon={
              <Ionicons name="md-keypad" size={20} color={COLORS.babyBlue2} />
            }
          />
          <CustomInput
            inputRef={ref2}
            maxLength={6}
            keyboardType="phone-pad"
            label={t("profileScreens.confirmPin")}
            placeholder={"******"}
            value={confirmPin}
            onChangeText={setConfirmPin}
            error={confirmPin.length > 0 && pin !== confirmPin}
            errorMessage={t("profileScreens.confirmPinRules")}
            icon={
              <Ionicons name="md-keypad" size={20} color={COLORS.babyBlue2} />
            }
          />
        </View>
        <View>
          <CustomButton
            disabled={loading}
            loading={loading}
            color={COLORS.blue}
            onPress={() => {
              pin.length >= 0 && pin.length != 6
                ? ref1.current.focus()
                : confirmPin.length >= 0 && confirmPin.length != 6
                ? ref2.current.focus()
                : handleChangePINStatus();
            }}
            textSize={12}
            text={t("newTransactions.Save")}
            containerStyle={styles.btn}
          />
        </View>
      </ScrollView>
    </>
  );
};
export default ApplicationPin;
