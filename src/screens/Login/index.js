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
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../components/customInput";
import { useDispatch } from "react-redux";
import createStyles from "./styles";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";
import CommonStyles from "../../constants/CommonStyles";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import DeviceInfo from "react-native-device-info";
import Geolocation from 'react-native-geolocation-service';

import {
  BASE_URL,
  ENDPOINTS,
  ENDPOINTS2,
  getBaseURL,
} from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import { getUniqueId } from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import * as Authentication from "../../redux/actions/authentication";
import CheckBox from "@react-native-community/checkbox";
import { hp, wp } from "../../utilis/dimensions";
import {
  handleLogoutValue,
  storeStackValue,
  storeUserImage,
} from "../../redux/actions/user";
import { showSimpleModal } from "../../redux/actions/modal";
import RNRestart from "react-native-restart";

const LoginScreen = ({ navigation }) => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState(""); // ibrahim123  9shadi
  const [password, setPassword] = useState(""); // 123456
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [fcm, setFcm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [code, setCode] = useState("");
  const [remember, setRemember] = useState(false);
  const dispatch = useDispatch();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [env, setEnv] = useState("2");
  const [selected, setSelected] = useState(1);
  const [baseURL, setBaseURL] = useState("");
  const [version, setVersion] = useState("");
  const [isProdModalVisible, setIsProdModalVisible] = useState(false);
  const [prodPassword, setProdPassword] = useState(""); 
  const [theometricEffect, setTheometricEffect] = useState(null);

  const isFocused = useIsFocused();
  const getVersion = () => {
    let pkg = require("../../../package.json");
    setVersion(pkg.version);
  };
  const handleRemember = async () => {
    let isRemember = await AsyncStorage.getItem("REMEMBER");
    isRemember && (setEmail(isRemember), setRemember(true));
  };
  useEffect(() => {
    handleRemember();
    getVersion();
  }, [isFocused]);

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [env]);

  const getSavedEnv = async () => {
    try {
      const value = await AsyncStorage.getItem("ENVIROMENT");
      if (value !== null) {
        // value previously stored
        setEnv(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const handleEnv = async (value) => {
    setEnv(value);
    let env = await AsyncStorage.getItem("ENVIROMENT");
    if(value== '1'){
      if(env&&env!=1) setIsProdModalVisible(true)
      }else {
      await AsyncStorage.setItem("ENVIROMENT", value);
      if(env&&env!=2){
        RNRestart.Restart();
        showMessage({
          message: t('success'),
          type: "success",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      }
     
    }
  };
  const getTheometricEffect = async () => {
    const sound = await AsyncStorage.getItem("TheometricEffect");
    setTheometricEffect(() => (sound=='off' ? false : true));
  };

  useEffect(() => {
    getSavedEnv();
    getTheometricEffect()
  }, []);

  const handlePin = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    if (code.length < 4) return;
    const jsonValue = await AsyncStorage.getItem("CUSTOMER_LOGIN");
    const value = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (value !== null) {
      let token = await AsyncStorage.getItem("TOKEN");
      setLoading(true);
      let url = baseURL + ENDPOINTS.validateMpin;
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
          "X-Localization": i18n?.language,
        },
        body: JSON.stringify({
          mpin: code,
          phone: value.phone,
          device_info: deviceInfo
        }),
      })
        .then((response) => response.json())
        .then(async (responseData) => {
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
            await AsyncStorage.setItem("CUSTOMER_PIN", code);
            handleLogin(true, value);
            updatePin();
          } else {
            showMessage({
              message: responseData.message,
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
          setLoading(false);
        });
    } else {
      Alert.alert("You need to login at least once ");
    }
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
              "X-Localization": i18n?.language,
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

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      let fcm1 = await messaging().getToken();
      console.log(fcm1);
      setFcm(fcm1);
    }
  }
  
  const handleLang = async (value) => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    await AsyncStorage.setItem("AUTHLANG", "1");

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
  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    setUuid(uuidValue);
  };
  useEffect(() => {
    requestUserPermission();
    getUUID();
  }, [navigation]);
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
  const updateLanguage = async (lann, token) => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    fetch(baseURL + ENDPOINTS2.changeLanguage, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify({ language: lann, }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("change lang response : ", responseData);
        if (responseData?.messages?.success) {
          await AsyncStorage.setItem("API_LANGUAGE", lann);
        } else {
          console.log("language change error : ", responseData.messages);
        }
      })
      .catch((e) => {
        console.log("language change error : ", e);
      });
  };
  const handleLogin = async (pin, value) => {
   const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
   const granted_ios = await request(
     Platform.select({
      ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    }),
  );
  if (Platform.OS=='android'? granted_android:granted_ios =='granted'){
    getLocation(false)
 
    }else{
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
  };

  const login= async(deviceInfo)=>{
    const deviceInfo2= await AsyncStorage.getItem('DeviceInfo')
    console.log('omar deviceInfo', deviceInfo)
    if (email.length == 0 || email.length < 6) {
      emailRef.current.focus();
      return;
    }
    if (!password.length > 0) {
      passwordRef.current.focus();
      return;
    }

    setLoading(true);
    let body = JSON.stringify({
      username: email,
      password: password,
      device_info: deviceInfo ? deviceInfo : JSON.parse(deviceInfo2) 
    });
   
    console.log("body", body);
    fetch(baseURL + ENDPOINTS.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      body: body,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("res from login : ", responseData);

        setLoading(false);
        if (responseData.code == 401) {
          showMessage({
            message: responseData.messages.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.code == 200) {
          SendToken(responseData?.data?.user?.id);
          console.log("done");

          // dispatch(Authentication.rememberMe(remember));
          // console.log('res',responseData.accessToken)

          const isFirstLogin = await AsyncStorage.getItem("FIRSTLogin");
          showMessage({
            message: responseData.messages.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          //warm message here. 
          if(responseData.data.note&&responseData.data.note!=null){
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header: t('accountScreen.w'),
                  message: responseData.data.note,
                  action: "",
                  type:'error'
                },
              })
            );
          }
          await AsyncStorage.setItem("TOKEN", responseData.data.access_token);
          //  await AsyncStorage.setItem("LastLoginDate", Date.now());
          // const now = new Date().toString();
          // console.log('now data',responseData.data.user.last_login);
          await AsyncStorage.setItem(
            "LastLoginDate",
            responseData.data.user.last_login
          );
          await AsyncStorage.setItem(
            "CUSTOMER_ID",
            responseData.data.user.id.toString()
          );
          remember
            ? await AsyncStorage.setItem(
                "REMEMBER",
                responseData?.data?.user?.username.toString()
              )
            : await AsyncStorage.removeItem("REMEMBER");
          await AsyncStorage.setItem(
            "CUSTOMER_OBJECT",
            JSON.stringify(responseData?.data?.user)
          );
          dispatch(storeUserImage(responseData?.data?.user?.image));
          dispatch(storeStackValue(false));
          dispatch(handleLogoutValue(false));
          await AsyncStorage.setItem(
            "USER_PIN",
            responseData?.data?.user?.pv.toString()
          );
          await AsyncStorage.setItem(
            "USER_PIN_VALUE",
            responseData?.data?.user?.pin
              ? responseData?.data?.user?.pin.toString()
              : ""
          );
          await AsyncStorage.setItem(
            "API_LANGUAGE",
            responseData?.data?.user?.current_language
              ? responseData?.data?.user?.current_language.toString()
              : "ar"
          );
          if (i18n.language != responseData?.data?.user?.current_language) {
            updateLanguage(i18n.language, responseData.data.access_token);
          }
          if (
            responseData?.data?.user?.ts == 1 &&
            responseData?.data?.user?.tsc != null
          ) {
            navigation.navigate("Verify2FA", {
              email: email,
              password: password,
              phone: responseData.data.user.mobile,
              firstlog: isFirstLogin,
            });
            // } else if (pin || isFirstLogin == "2") {
            //   dispatch(Authentication.setWelcome());
          } else {
            await AsyncStorage.setItem(
              "CUSTOMER_LOGIN",
              JSON.stringify({
                email: email,
                password: password,
                phone: responseData.data.user.mobile,
                // fcm: fcm,
                // uuid: uuid,
              })
            );
            await AsyncStorage.setItem("FIRSTLogin", "2");
            dispatch(Authentication.setWelcome());
            // navigation.navigate("AccountAuthentication", {
            //   phone: responseData.data.user.mobile,
            // });
          }
        } else {
          showMessage({
            message: "somethingelse",
            type: "info",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
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
  }

  const getLocation=(isSensor)=>{
    Geolocation.getCurrentPosition(
      position => {
        getDeviceInfo(position.coords.latitude,position.coords.longitude, isSensor)
      },
      error => {
        getDeviceInfo('','',null)
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        // timeout: 20000,
        // maximumAge: 0,
      },
    );
  }

  const getDeviceInfo=async(lat, lon,isSensor)=>{
    DeviceInfo.getDeviceName().then(async(deviceName) => {
      const deviceInfo={
        hardware: deviceName,
        os: Platform.OS,
        os_release: DeviceInfo.getSystemVersion(),
        lat: lat?lat.toString():'',
        long: lon?lon.toString():''
      }
      await AsyncStorage.setItem('DeviceInfo', JSON.stringify(deviceInfo))
      if(isSensor) handleBiometricAuthentication()
      else login(deviceInfo)
    });
  }

  const handleBiometricAuthentication = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("CUSTOMER_LOGIN");
      const value = jsonValue != null ? JSON.parse(jsonValue) : null;
      navigation.navigate("AccountAuthentication", {
        login: true,
        phone: value.phone,
        user: value,
      });
      // if (value!== null) {
      //   navigation.navigate("AccountAuthentication", {
      //     login: true,
      //     phone: value.phone,
      //     user: value,
      //   });
      // } else {
      //   Alert.alert("You need to login at least once ");
      // }
    } catch (e) {
      // error reading value
    }
  };
  const ModalComponent = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible1}
      onRequestClose={() => {
        setModalVisible1(!modalVisible1);
      }}
    >
      <View style={styles.modalView}>
        <View
          style={[
            styles.centeredView,
            {
              paddingBottom: 10,
              paddingHorizontal: 0,
              overflow: "hidden",
              borderColor: COLORS.black,
              paddingVertical: 0,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              // paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: hp(2),
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  alignSelf: "center",
                  marginHorizontal: 10,
                  height: 50,
                  width: 50,
                }}
                source={require("../../assets/newLogo.png")}
              />

              <CustomText
                text={t("settingsScreen.changeLang")}
                color={COLORS.blue}
                size={12}
                style={styles.passwordTitle}
              />
            </View>
            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() => {
                  setModalVisible1(!modalVisible1);
                }}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <CustomText
            text={t("settingsScreen.changeLangConfirm")}
            style={styles.modalText}
            color={COLORS.grey}
          />
          <CustomButton
            color={COLORS.blue}
            onPress={() => {
              setModalVisible1(!modalVisible1);
              handleLang();
            }}
            textSize={12}
            text={t("quickLogin.yes")}
            containerStyle={styles.btn}
          />
          {/* <CustomButton
            color={COLORS.white}
            onPress={() => {
              setModalVisible1(!modalVisible1);
            }}
            textSize={12}
            text={t("accountScreen.closeAccount")}
            containerStyle={styles.closeButton}
            textStyle={styles.closeButtonTxt}
          /> */}
        </View>
      </View>
    </Modal>
  );

  const ModalIsProd = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isProdModalVisible}
      onRequestClose={() => {
        setIsProdModalVisible(!isProdModalVisible);
      }}
    >
      <View style={styles.modalView}>
        <View
          style={[
            styles.centeredView,
            {
              paddingBottom: 10,
              paddingHorizontal: 0,
              overflow: "hidden",
              borderColor: COLORS.black,
              paddingVertical: 0,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              // paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: hp(2),
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <Image
                style={{
                  alignSelf: "center",
                  marginHorizontal: 10,
                  height: 50,
                  width: 50,
                }}
                source={require("../../assets/newLogo.png")}
              />

              <CustomText
                text={t("loginScreen.changeServer")}
                color={COLORS.blue}
                size={12}
                style={styles.passwordTitle}
              />
            </View>
            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() => {
                  setIsProdModalVisible(!isProdModalVisible);
                  setEnv('2')
                }}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <CustomText
            text={t("loginScreen.changeSerPass")}
            style={styles.modalText}
            color={COLORS.grey}
          />
          <CustomInput
          label={t("loginScreen.password")}
          placeholder={"*********"}
          password={true}
          value={prodPassword}
          onChangeText={setProdPassword}
          errorMessage=""
          icon={
            <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
          }
        />
          <CustomButton
            color={COLORS.blue}
            onPress={async() => {
              if(prodPassword=='qq23d'){
                setIsProdModalVisible(!isProdModalVisible);
                await AsyncStorage.setItem("ENVIROMENT", '1');
                RNRestart.Restart();
                showMessage({
                  message: t('success'),
                  type: "success",
                  titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                });
              }else{
                showMessage({
                  message: t('loginScreen.wrongProdPass'),
                  type: "danger",
                  titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                });
              }
            }}
            textSize={12}
            text={t("quickLogin.continue")}
            containerStyle={styles.btn}
          />
        </View>
      </View>
    </Modal>
  );
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <ModalComponent />
      {ModalIsProd()}
      <Image
        resizeMode="contain"
        style={CommonStyles.logo}
        source={require("../../assets/newLogo1.jpeg")}
      />
      <TouchableOpacity style={styles.supportIcon}
      onPress={()=> navigation.navigate("TechnicalSupport")}>
       <MaterialIcons name="support-agent" size={25} color={COLORS.blue}/>
      </TouchableOpacity>
      {/* <CustomText
        color={COLORS.black}
        size={18}
        text={
          <Text>
            <Text style={styles.textColored}>{t("loginScreen.buyer")}</Text>{" "}
            {t("loginScreen.and")}
            <Text style={styles.textColored}> {t("loginScreen.seller")}</Text>
            {t("loginScreen.agree") + t("loginScreen.conditions")}
          </Text>
        }
        style={styles.text}
      /> */}
        <TouchableOpacity onPress={() => navigation.navigate("TourScreen1")}>
            <CustomText
              color={COLORS.blue}
              size={16}
              text={t("loginScreen.introTour")}
              style={styles.text2}/>
            </TouchableOpacity>
      <View style={styles.selectStyle}>
        <TouchableOpacity
          onPress={() => setSelected(1)}
          style={selected == 1 ? styles.selectedStyle : styles.basicStyle}
        >
          <CustomText
            color={selected == 1 ? COLORS.black : COLORS.loginTab}
            size={14}
            text={t("loginScreen.log")}
            style={styles.BackTxt3}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setSelected(2)}
          style={selected == 2 ? styles.selectedStyle : styles.basicStyle}
        >
          <CustomText
            color={selected == 2 ? COLORS.black : COLORS.loginTab}
            size={14}
            text={t("loginScreen.fa")}
            style={styles.BackTxt3}
          />
        </TouchableOpacity>
      </View>
      <View>
        {selected == 1 ? (
          <>
            <CustomInput
              inputRef={emailRef}
              label={t("loginScreen.username")}
              placeholder={"test"}
              value={email}
              onChangeText={(e) =>
                setEmail(e.replace(/[\u0621-\u064A\u0660-\u0669 ]*/g, ""))
              }
              // error={email.length ? !validateEmail(email) : false}
              error={email?.length >= 0 && email?.length < 6}
              errorMessage={t("profileScreens.usernameRules")}
              icon={<Ionicons name="mail" size={20} color={COLORS.babyBlue2} />}
            />
            <CustomInput
              inputRef={passwordRef}
              label={t("loginScreen.password")}
              placeholder={"********"}
              password={true}
              value={password}
              onChangeText={setPassword}
              error={!password?.length > 0} // && password?.length < 8
              errorMessage={t("loginScreen.passErr")}
              icon={
                <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
              }
            />
            <View style={styles.quickSignContainer}>
              <TouchableOpacity
                onPress={() => navigation.navigate("quickLogin",{Type:'fastSignUp'})}
              >
                <CustomText
                  color={COLORS.blue}
                  size={12}
                  text={t("loginScreen.quickSignIn")}
                  style={styles.text2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async() => {
                  const jsonValue = await AsyncStorage.getItem("CUSTOMER_LOGIN");
                  const value = jsonValue != null ? JSON.parse(jsonValue) : null;
                  if (value !== null) {
                    navigation.navigate("quickLogin",{
                      Type:'fastSignIn',
                      user: value,
                    })

                  }else{
                    Alert.alert('You need to login at least one')
                  }
                }}
              >
                <CustomText
                  color={COLORS.blue}
                  size={12}
                  text={t("loginScreen.quickSignIn2")}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.rememberContainer}>
              <View style={{alignItems:'center',flexDirection:'row'}}>
              <CheckBox
              style={{marginLeft:-wp(1.5)}}
                disabled={loading == true ? true : false}
                value={remember}
                onValueChange={(newValue) => {
                  setRemember(newValue);
                }}
              />
              <CustomText
                color={COLORS.black}
                size={12}
                text={t("loginScreen.remember")}
              />
             </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("forgetPassword")}
              >
                <CustomText
                  color={COLORS.blue}
                  size={12}
                  text={t("loginScreen.forgetPassword")}
                />
              </TouchableOpacity>

            </View>

            <CustomButton
              color={COLORS.blue}
              onPress={() => handleLogin(false)
                // handleStaticLogin
              }
              loading={loading}
              textSize={12}
              text={t("loginScreen.signIn")}
              containerStyle={styles.btn} 
            />
            <Pressable
              onPress={() => {
                navigation.navigate("RegisterValidateMobile");
              }}
              style={styles.skipContainer}
            >
              <CustomText
                color={COLORS.black}
                size={13}
                text={
                  <Text>
                    {t("loginScreen.noAccount")}
                    <Text style={styles.textColored}>
                      {" "}
                      {t("loginScreen.signUp")}
                    </Text>
                  </Text>
                }
                style={styles.text}
              />
            </Pressable>
            {/* <Pressable onPress={() => setModalVisible1(true)}>
              <CustomInput
                containerStyle={styles.translate}
                inputStyle={styles.translateText}
                leftIcon={
                  <FontAwesome5
                    name="caret-down"
                    size={20}
                    color={COLORS.blue}
                  />
                }
                icon={
                  <MaterialIcons
                    name="g-translate"
                    size={20}
                    color={COLORS.blue}
                  />
                }
                editable={false}
                value={t("loginScreen.lang")}
              />
            </Pressable> */}
            <TouchableOpacity onPress={() => setModalVisible1(true)} style={styles.langContainer}>
            <MaterialIcons name="g-translate" size={20} color={COLORS.blue}/>
              <CustomText
                color={COLORS.black}
                size={13}
                text={t("loginScreen.lang")}
                style={styles.translateText}
              />
               <FontAwesome5 name="caret-down" size={20} color={COLORS.blue}/>    
            </TouchableOpacity>
            <Pressable
              onPress={async() =>{
                const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
                const granted_ios = await request(
                  Platform.select({
                   ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                 }),
               );
               if (Platform.OS=='android'? granted_android:granted_ios=='granted'){
                  // handleBiometricAuthentication()
                  getLocation(true)
                }else{
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
              style={styles.socialContainer}
            >
              {theometricEffect?
              <>
               <Image
                style={styles.social}
                source={require("../../assets/fingerprint.png")}
              />
              <Image
                style={styles.social}
                source={require("../../assets/face_recognition2.png")}
              />
              <Pressable
                disabled
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Image
                  style={styles.social}
                  source={require("../../assets/pin.png")}
                />
              </Pressable>
              </>
              :null}
             
            </Pressable>
            
            <View style={{ flexDirection: "row", alignSelf: "center" }}>
              <Pressable onPress={() => handleEnv("1")} style={styles.row}>
                <MaterialIcons
                  name={
                    env == "1"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  size={25}
                  style={styles.icon}
                  color={COLORS.blue}
                />
                <CustomText
                  color={COLORS.black}
                  size={16}
                  text={t("loginScreen.production")}
                  style={styles.textColored}
                />
              </Pressable>
              <Pressable
                onPress={() => handleEnv("2")}
                style={[styles.row2, { marginLeft: wp(24) }]}
              >
                <MaterialIcons
                  name={
                    env == "2"
                      ? "radio-button-checked"
                      : "radio-button-unchecked"
                  }
                  size={25}
                  style={styles.icon}
                  color={COLORS.blue}
                />
                <CustomText
                  color={COLORS.black}
                  size={16}
                  text={t("loginScreen.staging")}
                  style={styles.textColored}
                />
              </Pressable>
            </View>
            <CustomText
              color={COLORS.black}
              size={12}
              text={t("copyRights")}
              style={styles.text}
            />
            <View style={styles.versionStyle}>
              <CustomText color={COLORS.black} size={14} text={t("version")} />
              <CustomText color={COLORS.black} size={14} text={version} />
            </View>
          </>
        ) : (
          <CustomText
            color={COLORS.black}
            size={15}
            text={t("loginScreen.fam")}
            style={styles.text3}
            containerStyle={styles.conSty}
          />
        )}
      </View>
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
            <View style={styles.modalContent}>
              <View style={styles.applicationPin}>
                <>
                  <OTPInputView
                    style={styles.otp}
                    pinCount={6}
                    editable={false}
                    code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                    onCodeChanged={(code) => {
                      setCode(code);
                    }}
                    autoFocusOnLoad={false}
                    codeInputFieldStyle={styles.underlineStyleBase}
                    codeInputHighlightStyle={styles.underlineStyleHighLighted}
                    onCodeFilled={(code) => {
                      console.log(`Code is ${code}, you are good to go!`);
                    }}
                  />
                  <View style={styles.keyboard}>
                    <Pressable
                      onPress={() => {
                        setCode(code + "1");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"1"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "2");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"2"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "3");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"3"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.keyboard}>
                    <Pressable
                      onPress={() => {
                        setCode(code + "4");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"4"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "5");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"5"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "6");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"6"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.keyboard}>
                    <Pressable
                      onPress={() => {
                        setCode(code + "7");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"7"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "8");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"8"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        setCode(code + "9");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"9"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.keyboard}>
                    <Pressable
                      onPress={() => {
                        setCode(code + "0");
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={"0"}
                        style={styles.keyboardText}
                      />
                    </Pressable>
                  </View>
                  <View style={styles.keyboardDelete}>
                    <Pressable
                      onPress={() => {
                        if (!code.length) return;
                        setCode(code.slice(0, -1));
                      }}
                    >
                      <CustomText
                        color={COLORS.blue}
                        size={16}
                        text={t("AccountVerification.delete")}
                        style={styles.textColored}
                      />
                    </Pressable>
                  </View>
                </>
              </View>
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  handlePin();
                }}
                textSize={14}
                text={t("RegisterScreen.Continue")}
                containerStyle={styles.pinButton}
                textStyle={styles.closeButtonTxt}
                loading={loading}
              />
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
                textSize={14}
                text={t("accountScreen.closeAccount")}
                containerStyle={styles.closeButton}
                textStyle={styles.closeButtonTxt}
              />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
export default LoginScreen;
