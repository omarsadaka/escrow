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
  PermissionsAndroid
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
import { showSimpleModal } from "../../redux/actions/modal";
import {
  handleLogoutValue,
  storeStackValue,
  storeUserImage,
} from "../../redux/actions/user";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from "react-native-device-info";
import Geolocation from 'react-native-geolocation-service';

const VerifyOtpFastLogin = ({ navigation, route }) => {
  const { Email,Phone,user } = route.params;
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

  const handleVerifyFA = async (c) => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    // var formdata = new FormData();
    // formdata.append("code", c);
    // formdata.append("email", Email);
    // formdata.append('device_info', deviceInfo)
    const data={
      code: c,
      email: Email,
      device_info: JSON.parse(deviceInfo)
    }
    setLoading(true)
    console.log('formdata', data)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.verifyFastSignIn,
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
     data: JSON.stringify({
      code: c,
      email: Email,
      device_info: JSON.parse(deviceInfo)
     })
    })
      .then(async (responseData) => {
        console.log("res disable : ", responseData.data);
        setLoading(false)
        if (responseData?.data?.messages?.success) {
          showMessage({
            message: responseData?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCode("");
          SendToken(responseData?.data?.data?.user?.id);          
          await AsyncStorage.setItem("TOKEN", responseData.data.data.access_token);
          await AsyncStorage.setItem(
            "LastLoginDate",
            responseData.data.data.user.last_login
          );
          await AsyncStorage.setItem(
            "CUSTOMER_ID",
            responseData.data.data.user.id.toString()
          );
          await AsyncStorage.setItem(
            "CUSTOMER_OBJECT",
            JSON.stringify(responseData?.data?.data.user)
          );
          dispatch(storeUserImage(responseData?.data?.data.user?.image));
          dispatch(storeStackValue(false));
          dispatch(handleLogoutValue(false));
          await AsyncStorage.setItem(
            "USER_PIN",
            responseData?.data?.data.user?.pv.toString()
          );
          await AsyncStorage.setItem(
            "USER_PIN_VALUE",
            responseData?.data?.data.user?.pin
              ? responseData?.data?.data.user?.pin.toString()
              : ""
          );
          await AsyncStorage.setItem(
            "API_LANGUAGE",
            responseData?.data?.data.user?.current_language
              ? responseData?.data?.data.user?.current_language.toString()
              : "ar"
          );
          // if (i18n.language != responseData?.data?.user?.current_language) {
          //   updateLanguage(i18n.language, responseData.data.access_token);
          // }
          await AsyncStorage.setItem(
            "CUSTOMER_LOGIN",
            JSON.stringify({
              email: responseData?.data?.data.email,
              password: user?.password,
              phone: responseData.data.data.user.mobile,
              // fcm: fcm,
              // uuid: uuid,
            })
          );
          await AsyncStorage.setItem("FIRSTLogin", "2");
          dispatch(Authentication.setWelcome());
          if(responseData.data.data.note&&responseData.data.data.note!=null){
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header: t('accountScreen.w'),
                  message: responseData.data.data.note,
                  action: "",
                  type:'error'
                },
              })
            );
          }
        } else {
          showMessage({
            message: responseData?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setLoading(false)
        console.log("er : ", er);
        showMessage({
          message: "something went wrong try again",
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  const getLocation=()=>{
    Geolocation.getCurrentPosition(
      position => {
        getDeviceInfo(position.coords.latitude,position.coords.longitude)
      },
      error => {
        getDeviceInfo('','')
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        // timeout: 20000,
        // maximumAge: 0,
      },
    );
  }

  const getDeviceInfo=async(lat, lon)=>{
    DeviceInfo.getDeviceName().then(async(deviceName) => {
      const deviceInfo={
        hardware: deviceName,
        os: Platform.OS,
        os_release: DeviceInfo.getSystemVersion(),
        lat: lat?lat.toString():'',
        long: lon?lon.toString():''
      }
      await AsyncStorage.setItem('DeviceInfo', JSON.stringify(deviceInfo))
      handleVerifyFA(code)
    });
  }

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <Image style={styles.logo} source={require("../../assets/newLogo.png")} />
      <CustomText
        text={t("loginScreen.vma")+Phone}
        size={16}
        // style={styles.modalText}
        color={COLORS.header}
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
          // handleVerifyFA(c);
        }}
      />

       <CustomButton
          color={COLORS.blue}
          onPress={async() => {
            const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
            const granted_ios = await request(
              Platform.select({
               ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
             }),
           );
           if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
            // handleVerifyFA(code)
             getLocation()
             }else {
               dispatch(
                 showSimpleModal({
                   status: true,
                   payload: {
                     header: t('accountScreen.w'),
                     message: t('allowLocationAlert'),
                     action: true,
                     type:'error'
                   },
                 })
               );
             }
          }}
          loading={loading}
          textSize={12}
          text={t("loginScreen.signIn")}
          containerStyle={styles.btn} 
        />
    </ScrollView>
  );
};
export default VerifyOtpFastLogin;
