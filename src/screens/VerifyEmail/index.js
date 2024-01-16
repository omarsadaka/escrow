import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  TouchableOpacity,
  // Text,
  ScrollView,
  Modal,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Text from "../../components/globalText";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { wp, hp } from "../../utilis/dimensions";
import { useRoute, useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomButton from "../../components/customButton";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { showMessage } from "react-native-flash-message";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import axios from "axios";
import {
  getHash,
  startOtpListener,
  removeListener,
} from "react-native-otp-verify";
import { showSimpleModal } from "../../redux/actions/modal";
import { useDispatch } from "react-redux";

const VerifyEmail = ({ navigation }) => {
  const dispatch = useDispatch();
  const [baseURL, setBaseURL] = useState("");
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [counter, setCounter] = useState(121);
  const [isCounted, SetIsCounted] = useState(true);
  const [isResend, setIsResend] = useState(false);
  const route = useRoute();
  const { path, value } = route?.params;
  const [code, setCode] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!isCounted) return;
    getHash()
      .then((hash) => {
        // use this hash in the message.
      })
      .catch(console.log);
    startOtpListener((message) => {
      const otpExtract = /(\d{6})/g.exec(message)[1];
      setCode(otpExtract?otpExtract:'');
    });
    return () => removeListener();
  }, [isCounted]);

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 && 
          (clearInterval(interval) ,SetIsCounted(false)); //navigation.goBack()
          lastTimerCount <= 1 && isResend && navigation.goBack()
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));

    return () => {
      setBaseURL("");
    };
  }, []);

  const handleVerifyEmail = async () => {
    setLoadingVerify(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "POST",
      // url:
      //   path == "phone"
      //     ? baseURL + ENDPOINTS.verifySMS
      //     : baseURL + ENDPOINTS.verifyEmail,
      url: baseURL + ENDPOINTS.verifyCode,
      headers: {
        // "Content-Type": "application/;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      data: { code: code, value: value, type: path , device_info: deviceInfo},
    })
      .then((responseData) => {
        console.log('handleVerifyEmail',responseData )
        // console.log('handleVerifyEmail',responseData.data?.messages?.error )
        setLoadingVerify(false);
        if (responseData?.data?.messages?.error) {
          if(responseData?.data?.messages?.error?.type){
            showMessage({
              message: responseData?.data?.messages?.error?.type[0],
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }else{
            showMessage({
              message: responseData?.data?.messages?.error,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }
        } else {
          showMessage({
            message: responseData?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });

          navigation.push("UpdateBasicInfo");
        }
      })

      .catch((e) => {
        setLoadingVerify(false);
        showMessage({
          message: e,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  const handleChangeEmailOrPhone = async () => {
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    const info = JSON.parse(userInfo);
    console.log("info", userInfo);
    let obj = {
      value: value,
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
    setResendLoading(true);
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
        setResendLoading(false);
        if (responseData.data.messages.success) {
          setIsResend(true)
          setCounter(120)
          SetIsCounted(true)
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("success"),
                message: path == "mobile"?t('profileScreens.phoneVerificationMessage')+' '+ value.substring(5)+'*****' : responseData.data.messages.success,
                action: "",
                type: "success",
              },
            })
          );
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
      setResendLoading(false);
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
          <View
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
              width: "100%",
            }}
          >
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
              navigation.navigate("Profile");
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
                : t("profileScreens.ChangePhone")
            }
            color={COLORS.black}
            size={20}
            style={styles.title}
          />
          <View style={{ marginTop: hp(1), paddingHorizontal: 10 }}>
            <CustomText
              color={COLORS.black}
              size={18}
              text={
                path == "email"
                  ? t("profileScreens.verificationEmail")
                  : t("profileScreens.verificationPhone")
              }
              style={styles.textColored}
            />
            <CustomText
              color={COLORS.black}
              size={18}
              text={
                <Text>
                  {path == "email"
                    ? t("profileScreens.enterOtpEmail")
                    : t("profileScreens.enterOtpPhone")}
                  <Text style={{ color: COLORS.header }}> {value}</Text>
                </Text>
              }
              style={styles.text}
            />
            <OTPInputView
              style={styles.otp}
              pinCount={6}
              code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              onCodeChanged={(code) => {
                setCode(code);
              }}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.underlineStyleHighLighted}
              onCodeFilled={(code) => {}}
            />

            <CustomText
              color={COLORS.black}
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
                  size={20}
                  text={parseInt(counter / 60)} //counter >= 120 ? 2 : counter >= 60 ? 1 : 0
                  style={styles.textColored3}
                />
                <CustomText
                  color={COLORS.header}
                  size={14}
                  text={t("AccountVerification.minute")}
                />
              </View>
              <View>
                <CustomText
                  color={COLORS.header}
                  size={20}
                  text={counter % 60}
                  style={styles.textColored3}
                />
                <CustomText
                  color={COLORS.header}
                  size={14}
                  text={t("AccountVerification.second")}
                />
              </View>
            </View>
            {/* <Pressable onPress={() => handleChangeEmailOrPhone()} 
             style={styles.skipContainer} disabled={counter>0}>
              <CustomText
                color={COLORS.black}
                size={13}
                text={
                  <Text>
                    {t("AccountVerification.didNotRecive")}
                    <Text style={[styles.textColored,{color: counter>0?COLORS.grey:COLORS.blue}]}>
                      {" "}
                      {t("AccountVerification.resend")}
                    </Text>
                  </Text>
                }
                style={styles.text}
              />
            </Pressable> */}

            <View style={[styles.skipContainer,{flexDirection:'row',alignItems:'center'}]}>
            <CustomText
                color={COLORS.black}
                size={13}
                text={
                  <Text>
                    {t("AccountVerification.didNotRecive")}
                  </Text>
                }
                style={styles.text}
              />
              {resendLoading?
              <ActivityIndicator size={'small'} color={COLORS.blue} style={{marginHorizontal: wp(3)}}/>
              :
              <TouchableOpacity onPress={() => handleChangeEmailOrPhone()}  disabled={counter>0}>
               <Text style={[styles.textColored,{color: counter>0?COLORS.grey:COLORS.blue}]}>
                 {" "}
                 {t("AccountVerification.resend")}
               </Text>
              </TouchableOpacity>
              }
            </View>


          </View>
        </View>
        <View>
          <CustomButton
            color={COLORS.blue}
            loading={loadingVerify}
            // onPress={() => {
            //  // setModalVisible(true);

            // }}
            onPress={handleVerifyEmail}
            textSize={12}
            text={t("newTransactions.Save")}
            containerStyle={styles.btn}
          />
          <CustomButton
            color={COLORS.white}
            onPress={() => {
              navigation.navigate("Profile");
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
              ? t("profileScreens.emailVerified")
              : t("profileScreens.phoneVerified")
          }
        />
      </ScrollView>
    </>
  );
};
export default VerifyEmail;
