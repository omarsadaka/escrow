import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  // Text,
  ScrollView,
  Modal,
  Pressable,
  Image,
} from "react-native";
import CustomText from "../components/customText";
import { useRoute, useTheme } from "@react-navigation/native";
import createStyles from "./styles";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../components/customButton";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useSelector, useDispatch } from "react-redux";
import { setShowOTPModal } from "../redux/actions/modal";
import {
  getHash,
  removeListener,
  startOtpListener,
} from "react-native-otp-verify";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../constants/API";
import { showMessage } from "react-native-flash-message";
const OTPModaL = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();
  const { otpStatus, code } = useSelector((state) => state.modal);
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async() => {
    // if (!validated) return;
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setLoading(true);
    fetch(baseURL + ENDPOINTS.validateOtp, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n.language
      },
      body: JSON.stringify({
        cellNo: code.split("966")[1],
        otpNum: otpCode,
        device_info: deviceInfo
      }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setLoading(false);
        if (responseData.status == "failed") {
          showMessage({
            message: responseData.message,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == "success") {
          showMessage({
            message: responseData.message,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          AsyncStorage.setItem("CUSTOMER_ID", "static");
          dispatch(
            setShowOTPModal({
              status: false,
              code: null,
            })
          );
          navigation.navigate("AccountCreated");
        } else {
          showMessage({
            message: responseData.message,
            type: "info",
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
  const handleValidateOTPReq = () => {
    handleVerify();
    // AsyncStorage.setItem('CUSTOMER_ID', 'static');
    // navigation.navigate('AccountAuthentication');
    //   dispatch(setShowOTPModal({
    //     status:false,
    //     code:null
    // }
    //     ))
  };
  // using methods
  useEffect(() => {
    if (!otpStatus) return;
    getHash()
      .then((hash) => {
        // use this hash in the message.
      })
      .catch(console.log);

    startOtpListener((message) => {
      // extract the otp using regex e.g. the below regex extracts 4 digit otp from message
      const otp = /(\d{4})/g.exec(message)[1];

      setOtpCode(otp);
    });
    return () => removeListener();
  }, [otpStatus]);
  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={otpStatus}
        //   onRequestClose={() => {
        //     setModalVisible(!modalVisible);
        //   }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View style={styles.modalContent}>
              <Image
                style={styles.logo}
                source={require("../assets/newLogo.png")}
              />
              <View style={styles.modalContent1}>
                <CustomText
                  // color={COLORS.black}
                  color={"black"}
                  size={18}
                  text={t("AccountVerification.verification")}
                  style={styles.textColored}
                />
                <CustomText
                  // color={COLORS.black}
                  color={"black"}
                  size={18}
                  text={t("AccountVerification.otp")}
                  style={styles.text}
                />
                <OTPInputView
                  style={styles.otp}
                  pinCount={6}
                  //editable={false}
                  code={otpCode}
                  onCodeChanged={(code) => {
                    setOtpCode(code);
                  }}
                  autoFocusOnLoad={true}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={(code) => {
                    console.log(`Code is ${code}, you are good to go!`);
                  }}
                />
              </View>
            </View>
            <TouchableOpacity
            //   onPress={
            //   sendOTPReq
            //   }
            >
              <CustomText
                //   color={COLORS.black}
                color={"black"}
                size={15}
                style={styles.text}
                text={
                  <CustomText>
                    {t("AccountVerification.didNotRecive")}
                    <CustomText style={styles.textColored}>
                      {" "}
                      {t("AccountVerification.resend")}
                    </CustomText>
                  </CustomText>
                }
              />
            </TouchableOpacity>

            <CustomButton
              color={COLORS.blue}
              onPress={handleValidateOTPReq}
              textSize={14}
              text={t("AccountVerification.verify")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
              loading={loading}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default OTPModaL;
