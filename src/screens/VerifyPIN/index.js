import React, { useEffect, useMemo, useState, useRef } from "react";
import { Alert, Image, Platform, ScrollView, View, PermissionsAndroid } from "react-native";

import CustomText from "../../components/customText";
import { useDispatch } from "react-redux";
import createStyles from "./style";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";
import { isValidMpin, setWelcome } from "../../redux/actions/authentication";
import { TouchableOpacity } from "react-native";
import TouchID from "react-native-touch-id";
import { Modal } from "react-native";
import CustomButton from "../../components/customButton";
import AndroidOpenSettings from "react-native-android-open-settings";
import { storeStackValue, handleLogoutValue } from "../../redux/actions/user";
import CommonStyles from "../../constants/CommonStyles";
import FingerprintScanner from 'react-native-fingerprint-scanner';
import PropTypes from 'prop-types';
import { getUniqueId } from "react-native-device-info";
import { height, hp, width, wp } from "../../utilis/dimensions";
import * as Authentication from "../../redux/actions/authentication";
import Lottie from "lottie-react-native";
import { showSimpleModal } from "../../redux/actions/modal";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const VerifyPIN = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const dispatch = useDispatch();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const [code, setCode] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [uuid, setUUID] = useState(null);
  const [showFinger, setShowFinger] = useState(false);
  const { t, i18n } = useTranslation();
  const [theometricEffect, setTheometricEffect] = useState(null);

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    getUUID()
    getTheometricEffect()
  }, [navigation]);

  const [retry, setRetry] = useState(false);
  const [biometryType, setBiometryType] = useState('');

  const optionalConfigObject = {
    title: t("verifyMpin.title"),
    imageColor: COLORS.blue, // Android
    imageErrorColor: "#ff0000", // Android
    sensorDescription: t("verifyMpin.touch"), // Android
    sensorErrorDescription: t("verifyMpin.fail"), // Android
    cancelText: t("verifyMpin.cancel"), // Android
    fallbackLabel: "Show Passcode", // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };
  const handleFingerprint = () => {
    TouchID.isSupported()
      .then((supported) => {
        if (supported) {
          TouchID.authenticate( t("verifyMpin.logfin"), optionalConfigObject)
            .then(async (success) => {
              if (success === "TouchID" || success === "FaceID") {
                if (TouchID.isSupported().enabled) {
                  console.log(
                    "TouchID.isSupported().enabled ",
                    TouchID.isSupported().enabled
                  );
                } else {
                  console.log("in fingerPrint not enabled ");
                }
              } else {
                console.log("in fingerPrintin else ", success);
              }
              console.log("in fingerPrint ", success);
              dispatch(isValidMpin(false));
              dispatch(setWelcome());
              dispatch(storeStackValue(false));
              await AsyncStorage.setItem("ChangeLang", "2");
              showMessage({
                message: t("verifyMpin.succ"),
                type: "success",
                titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
              });
            })
            .catch((error) => {
              console.log("in error ", error);
              showMessage({
                message: t("verifyMpin.ronge"),
                type: "danger",
                titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
              });
            });
        } else {
          setModalVisible(true);
        }
      })
      .catch((error) => {
        console.log("Error checking for Touch ID support", error);
        showMessage({
          message: t("verifyMpin.ronge"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  useEffect(()=>{
    FingerprintScanner.isSensorAvailable()
    .then((biometryType) => {
      setBiometryType(biometryType)
    })
    .catch((error) => {
      showMessage({
        message:error.message ,
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
    });
  },[])


  const getMessage=()=>{
    console.log(biometryType)
      if(biometryType=='Face ID')
      {
        return t('verifyMpin.useface')
      }
      else if(biometryType=='Touch ID')
      {
        return t('verifyMpin.usefinger')
      }else{
        return t('verifyMpin.usefingerOrFace')
      }
    }
  
  const showAuthenticationDialog = () => {
      if(biometryType!==null && biometryType!==undefined )
      {
      FingerprintScanner.authenticate({
        description: getMessage(), onAttempt: handleAuthenticationAttempted(),
      })
        .then(async() => {
          //you can write your logic here to what will happen on successful authentication
          dispatch(isValidMpin(false));
          dispatch(setWelcome());
          dispatch(storeStackValue(false));
          await AsyncStorage.setItem("ChangeLang", "2");
          showMessage({
            message: t("verifyMpin.succ"),
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        })
        .catch((error) => {
          console.log('Authentication error is => ', error);
          if(error?.toString().includes('FingerprintScannerNotEnrolled')){
            setModalVisible(true)
          }else if(error?.toString().includes('UserCancel')){
           showMessage({
             message:t('verifyMpin.canceledByUser') ,
             type: "danger",
             titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
           });
         }else if(error?.toString().includes('UserFallback')){
          showMessage({
            message:t('verifyMpin.canceledByUser') ,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }else{
           showMessage({
             message:error?.toString() ,
             type: "danger",
             titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
           });
         }
        });
      }else{
      console.log('biometric authentication is not available');
      showMessage({
        message: t("verifyMpin.ronge"),
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
      setModalVisible(true)
      }
    };

    const handleAuthenticationAttempted = (error) => {
      FingerprintScanner.release()
    };


  const handleVerifyFA = async (c) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("is valid pin value  : ", c);
    var formdata = new FormData();
    formdata.append("pin", c);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.checkPin,
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
        if (res?.data?.status == true) {
          setCode("");
          showMessage({
            message: t("verifyMpin.succ"),
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          dispatch(isValidMpin(false));
          dispatch(setWelcome());
          dispatch(storeStackValue(false));
          await AsyncStorage.setItem("ChangeLang", "2");
        } else {
          setCode("");
          showMessage({
            message: t("verifyMpin.err"),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        setLoading(false);
        showMessage({
          message: t("verifyMpin.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    setUUID(uuidValue);

  };
  
  const getTheometricEffect = async () => {
    const sound = await AsyncStorage.getItem("TheometricEffect");
    setTheometricEffect(() => (sound=='off' ? false : true));
  };
  const handleLogout = async () => {
    setLoadingLogout(true);
    await AsyncStorage.removeItem("CUSTOMER_ID");
    await AsyncStorage.removeItem("USER_PIN");
    await AsyncStorage.removeItem("USER_PIN_VALUE");
    await AsyncStorage.removeItem("ChangeLang");
    await AsyncStorage.removeItem("AUTHLANG");
    await AsyncStorage.removeItem("TOKEN");
    await AsyncStorage.removeItem("NAVIGATION_STATE_TIME");
    // await AsyncStorage.removeItem("CUSTOMER_LOGIN");
    await AsyncStorage.removeItem("API_LANGUAGE");
    // await AsyncStorage.removeItem("CUSTOMER_OBJECT");
    dispatch(storeStackValue(false));
    dispatch(handleLogoutValue(true));
    dispatch(Authentication.logOut());
    showMessage({
      message: t("sideMenu.signOutSuccessfully"),
      type: "success",
      titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
    });
    setLoadingLogout(false);
  };

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <Image
        resizeMode="contain"
        style={CommonStyles.logo}
        source={require("../../assets/newLogo1.jpeg")}
      />
      <CustomText
        text={t("verifyMpin.header")}
        size={16}
        // style={styles.modalText}
        color={COLORS.header}
      />
      <OTPInputView
        style={styles.otp}
        pinCount={6}
        code={code}
        onCodeChanged={(code) => setCode(code)}
        autoFocusOnLoad={false}
        codeInputFieldStyle={styles.underlineStyleBase}
        codeInputHighlightStyle={styles.underlineStyleHighLighted}
        onCodeFilled={async(c) => {
          setCode(c);
          if (c.length != 6) {
            setCode("");
            showMessage({
              message: t("verifyMpin.err"),
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          } else {
            const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
            const granted_ios = await request(
              Platform.select({
               ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
             }),
           );
           if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
            handleVerifyFA(c);
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
            
          }
        }}
      />
      <CustomButton
        color={COLORS.blue}
        onPress={async() => {
          console.log("codeeee : ", code);
          if (code.length != 6) {
            setCode("");
            showMessage({
              message: t("verifyMpin.err"),
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          } else {
            const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
            const granted_ios = await request(
              Platform.select({
               ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
             }),
           );
           if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
            handleVerifyFA(code);
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
          }
        }}
        loading={loading}
        disabled={loading}
        textSize={15}
        text={t("verifyMpin.log")}
        containerStyle={styles.btn2}
      />
      <TouchableOpacity onPress={() => navigation.navigate("ResetMPIN")}>
        <CustomText
          text={t("verifyMpin.forget")}
          size={13}
          // style={styles.modalText}
          color={COLORS.header}
        />
      </TouchableOpacity>
     
      <CustomButton
        color={COLORS.blue}
        onPress={() => {
          handleLogout()
        }}
        loading={loadingLogout}
        textSize={15}
        text={t("loginScreen.log")}
        containerStyle={[styles.btn2,{marginTop: hp(3)}]}
      />
      {theometricEffect?
      <View style={styles.authTypeCon}>
      <TouchableOpacity
        onPress={async() => {
          const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
          const granted_ios = await request(
            Platform.select({
             ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
           }),
         );
         if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
           showAuthenticationDialog()
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
        style={styles.fingerCon}
      >
        <CustomText
          text={t("verifyMpin.finger")}
          size={13}
          color={COLORS.header}
        />
        <View>
          <Image
            style={styles.social}
            source={require("../../assets/fingerprint.png")}
          />
        </View>
      </TouchableOpacity>

      <CustomText
          text={t("verifyMpin.or")}
          size={13}
          color={COLORS.header}
          style={{marginHorizontal:'5%'}}
        />

      <TouchableOpacity
        onPress={async() => {
          const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
          const granted_ios = await request(
            Platform.select({
             ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
           }),
         );
         if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
             showAuthenticationDialog()
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
        style={styles.faceCon}
      >
        <CustomText
          text={t("verifyMpin.face")}
          size={13}
          color={COLORS.header}
        />
        <View>
          <Image
            style={styles.social}
            source={require("../../assets/face_recognition2.png")}
          />
        </View>
      </TouchableOpacity>
      </View>
      :null}
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
            {/* <View
              style={{
                backgroundColor: COLORS.white,
                paddingVertical: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
                width: "100%",
              }}
            ></View> */}
            <CustomText
              text={biometryType=='Face ID'? t("addFace") : t("addFinger")}
              style={styles.modalText}
              color={COLORS.grey}
            />

            <CustomButton
              color={COLORS.blue}
              onPress={() => {
                setModalVisible(!modalVisible);
                if(Platform.OS=='android'){
                  AndroidOpenSettings.securitySettings();
                }else{
                  Linking.openURL('app-settings:')
                }
              }}
              textSize={12}
              text={t("goSettings")}
              containerStyle={styles.btn}
            />
          </View>
        </View>
      </Modal>
      
    </ScrollView>
  );
};
VerifyPIN.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};
export default VerifyPIN;
