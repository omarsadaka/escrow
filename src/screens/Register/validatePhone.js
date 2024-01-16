import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from "react-native";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import CustomButton from "../../components/customButton";
import { useTranslation } from "react-i18next";
import CustomText from "../../components/customText";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";
import CommonStyles from "../../constants/CommonStyles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import DeviceNumber from 'react-native-device-number';

const RegisterValidateMobile = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [phoneValid, setPhoneValid] = useState(false);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpStatus, setOTPStatus] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const ref1 = useRef();


  // useEffect(()=>{
  //   if(Platform.OS == 'android'){
  //     requestPhoneNumberPermission()
  //     requestPhoneNumber()
  //   } else{
  //     setShowInput(true)
  //   }
  // },[])

  const handleSubmitPhone = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setLoading(true);
    var formdata = new FormData();
    formdata.append("mobile_code", "966");
    formdata.append("mobile", phone);
    formdata.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS2.submitPhoneRegister, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("responseData", responseData);
        setLoading(false);
        if (responseData?.messages?.error) {
          showMessage({
            message: responseData?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("VerifyRegisterMobile", { phone: phone });
        }
      })
      .catch((e) => {
        console.log(e);
        showMessage({
          message: t("accountScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };

  const requestPhoneNumber = async () => {
    try {
      DeviceNumber.get().then((res) => {
        console.log(res);
        const number= res?.mobileNumber
        if(number?.startsWith('+966')){
          const num= number?.replace('+966','')
          setPhone(num.trim())
          setShowInput(true) 
        }else if(number?.startsWith('00966')) {
          const num= number?.replace('00966','')
          setPhone(num.trim())
          setShowInput(true) 
        }else{
          const num = number
          setPhone(num.trim())
          setShowInput(true) 
        }  
      }).catch((error)=>{
        console.log('requestPhoneNumber error1', error.toString());
        setShowInput(true)
      })
    } catch (error) {
      console.log('requestPhoneNumber error',JSON.stringify(error));
      setShowInput(true)
    }
   };

  const requestPhoneNumberPermission = async () => {
    request(PERMISSIONS.ANDROID.READ_PHONE_STATE).then((result) => {
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
          break;
        case RESULTS.BLOCKED:
          console.log("The permission is denied and not requestable anymore");
          break;
      }
    });
  };
  

  return (
    <View style={styles.validateContainer}>
      <Image
        resizeMode="contain"
        style={CommonStyles.logo}
        source={require("../../assets/newLogo1.jpeg")}
      />
      {showInput?
       <CustomPhoneInputFinal
       onChangeText={setPhone}
       setIsValid={setPhoneValid}
       noContacts={true}
       inputRef={ref1}
       showQRCode={false}
       placeholder={phone?phone:''}
       valueToStore={phone?phone:''}
       draft={true}
       validateInput={true}
     />
      :null}
     
      <CustomText
        color={COLORS.black}
        size={13}
        text={t("RegisterScreen.mobileText")}
        style={styles.mobileText}
      />
      <CustomButton
        disabled={loading}
        color={COLORS.blue}
        onPress={() =>
          phoneValid ? handleSubmitPhone() : ref1.current.focus()
        }
        loading={loading}
        textSize={12}
        text={t("RegisterScreen.verifyMobileSubmit")}
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
                {t("RegisterScreen.signIn")}
              </Text>
            </Text>
          }
          style={styles.text}
        />
      </Pressable>
    </View>
  );
};
export default RegisterValidateMobile;
