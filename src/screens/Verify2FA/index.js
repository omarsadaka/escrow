import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  // Text,
  Image,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Platform,
} from "react-native";
import Text from "../../components/globalText";

import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../components/customInput";
import { useDispatch } from "react-redux";
import createStyles from "./style";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import { getUniqueId } from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import * as Authentication from "../../redux/actions/authentication";
import CheckBox from "@react-native-community/checkbox";
import { wp } from "../../utilis/dimensions";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";

const Verify2FA = ({ navigation, route }) => {
  const { email, password, phone, firstlog } = route.params;
  // console.log("info :", email, password, phone, firstlog);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [code, setCode] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const { t, i18n } = useTranslation();
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [navigation]);
  const [counter, setCounter] = useState(120);
  const [isCounted, SetIsCounted] = useState(true);

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 && (clearInterval(interval), SetIsCounted(false));
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);
  if (counter == 0) {
    navigation.goBack();
  }
  const handleVerifyFA = async (c) => {
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("verify code : ", c);
    var formdata = new FormData();
    formdata.append("code", c);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.verifyFA,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language
      },
      data: formdata,
    })
      .then(async (res) => {
        console.log("res disable : ", res.data);
        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
          if (firstlog == "2") {
            dispatch(Authentication.setWelcome());
          } else {
            await AsyncStorage.setItem(
              "CUSTOMER_LOGIN",
              JSON.stringify({
                email: email,
                password: password,
                phone: phone,
              })
            );
            await AsyncStorage.setItem("FIRSTLogin", "2");
            dispatch(Authentication.setWelcome());
            // navigation.navigate("AccountAuthentication", {
            //   phone: phone,
            // });
          }
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
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <Image style={styles.logo} source={require("../../assets/newLogo.png")} />
      <CustomText
        text={t("loginScreen.vfa")}
        size={16}
        // style={styles.modalText}
        color={COLORS.header}
      />
      {/* <CustomText
        color={COLORS.header}
        size={15}
        text={t("loginScreen.vfa")}
        // style={styles.textColored3}
      /> */}
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
        code={code}
        onCodeChanged={(code) => setCode(code)}
        autoFocusOnLoad={false}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={(c) => {
          console.log("code : ", c);
          setCode(c);
          handleVerifyFA(c);
        }}
      />
    </ScrollView>
  );
};
export default Verify2FA;
