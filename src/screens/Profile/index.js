import React, { useMemo, useState, useRef, useEffect, useLayoutEffect,useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
  Linking,
  Dimensions,
  Alert
} from "react-native";
import createStyles from "./style";
// import {COLORS} from '../../constants/colors';
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { wp, hp } from "../../utilis/dimensions";
import CustomInput from "../../components/customInput";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangePassword from "../../components/changePassword";
import RBSheet from "react-native-raw-bottom-sheet";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { showMessage } from "react-native-flash-message";
import ImageView from "react-native-image-viewing";
import CustomPhoneInputFinal from "../../components/customPhoneInput";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import CustomButton from "../../components/customButton";
import { storeStackValue, storeUserImage, handleLogoutValue } from "../../redux/actions/user";
import SelectDropdown from "react-native-select-dropdown";
import { getCitiesAndStates } from "../../utilis/apis";
import FastImage from "react-native-fast-image";
import RNFS from "react-native-fs";
import CameraRoll from "@react-native-community/cameraroll";
import Share from "react-native-share";
import ViewShot, { captureRef } from "react-native-view-shot";
import ImageResizer from '@bam.tech/react-native-image-resizer';
import { useFocusEffect } from '@react-navigation/native';
import * as Authentication from "../../redux/actions/authentication";

const Profile = ({ navigation }) => {
  const refRBSheet = useRef();
  const ref1 = useRef();
  const dispatch = useDispatch();
  const [section, setSection] = useState(1);
  const [visible, setVisible] = useState(false);
  const [viewImage, setViewImage] = useState(false);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [visibleDate, setVisibleDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [data, setData] = useState();
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [userName, setUserName] = useState("");
  const [baseURL, setBaseURL] = useState("https://escrow2d.meiladigital-sa.com/backend/api/");
  getBaseURL()?.then((res) => setBaseURL(res));
  const [imageUri, setImageUri] = useState(null);
  const [reload, setReload] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [citiesAndStates, setCitiesAndStates] = useState([]);
  const ref = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const [imageObj, setImageObj] = useState(null);
  const [viewModal, setViewModal] = useState(false);
  const { t, i18n } = useTranslation();
  const [productQRref, setProductQRref] = useState();
  const viewRef = useRef();
  const NameToshow = "Escrow";
  const organisation = "Escrow";
  const qrCode = data?.mobile ? data?.mobile : "";
  const [imageLoad, setImageLoad] = useState(true);
  let qrCodeEncoded =
    Platform.OS === "ios" ? qrCode : encodeURIComponent(qrCode);

  let qrCodeImage =
    "https://chart.googleapis.com/chart?cht=qr&chl=" +
    qrCodeEncoded +
    `&chs=${i18n.language == "en" ? "285" : "500"}&choe=UTF-8&chld=L|2`;

  const handleTakeImage = async () => {
    try {
      refRBSheet.current.close();
      const options = {
        // maxWidth: 500,
        // maxHeight: 500,
        noData: true,
        saveToPhotos: false,
        mediaType: "photo",
        includeBase64: true,
      };
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "App Camera Permission",
          message: "App needs access to your camera ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (
        granted === PermissionsAndroid.RESULTS.GRANTED ||
        Platform.OS === "ios"
      ) {
        console.log("Camera permission given");
        launchCamera(options, (res) => {
          if (res.assets) {
            // setImageObj({
            //   base64: res.assets[0].base64,
            //   extension: "." + res.assets[0].type.split("/")[1],
            // });
            resizeUserImage(res.assets[0].uri)
          }
        });
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const handleOpenGallery = async () => {
    const options = {
      // maxWidth: 500,
      // maxHeight: 500,
      noData: true,
      saveToPhotos: false,
      mediaType: "photo",
      includeBase64: true,
    };
    launchImageLibrary(options, (res) => {
      console.log('res.assets[0].type', res.assets[0].type)
      if (res.assets) {
        // setImageObj({
        //   base64: res.assets[0].base64,
        //   extension: "." + res.assets[0].type.split("/")[1],
        // });
        resizeUserImage(res.assets[0].uri)
      }
    });
  };
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    setLoading(true);
    fetch(baseURL + ENDPOINTS.getUserDetails, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setLoading(false);
        setTimeout(() => {
          setImageLoad(false)
        }, 2000); 
        if (responseData.data) {
          console.log('responseData.data.user', responseData.data.user)
          let dd = responseData.data.user;
          setData(dd);
          setUserName(dd?.username);
          setImageUri(dd?.image);
          setSelectedDate(dd?.date_of_birth);
          setFirstName(dd?.firstname);
          setLastName(dd?.lastname);
          setAddress(dd?.address?.address);
          setState(dd?.address?.state);
          setZip(dd?.address?.zip);
          setCity(dd?.address?.city);
          setCountry(dd?.address?.country);
          setNationalId(dd?.national_id.toString());
          await AsyncStorage.setItem(
            "CUSTOMER_OBJECT",
            JSON.stringify(responseData?.data?.user)
          );
          if(dd?.image){
            await AsyncStorage.setItem('UserImage', responseData?.data?.user?.image)
          }
          dispatch(storeUserImage(responseData?.data?.user?.image));
        } else {
          console.log("responseData ", responseData.message);
          handleLogout()
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoading(false);
      });
  };

  const handleLogout = async () => {
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
  };

  const resizeUserImage= async(image)=>{
    try {
      let result = await ImageResizer.createResizedImage(
        image,
        800,
        800,
        'JPEG',
        100,
        0,
        undefined,
        false,
        {
          mode: 'contain',
          onlyScaleDown: false,
        }
      );
      console.log('resizeUserImage', result)
      setImageUri(result.uri);
      convertToBase64(result.path)
    } catch (error) {
      console.log('resizeUserImage error', error)
    }
  };

  const convertToBase64=(url)=>{
    RNFS.readFile(url, 'base64')
    .then(res =>{
      setImageObj({
        base64: res,
        extension: ".jpeg",
      });
      updateUserImage({ base64: res,extension: ".jpeg",})});
  }

  // useEffect(()=>{
  //   getUserInfo();
  // },[navigation, baseURL, reload])

  useEffect(() => {
    if (!baseURL) return;
    getCitiesAndStates(baseURL, "sa").then((res) => {
      setCitiesAndStates(res.data);
    });
    
  }, [navigation, baseURL, reload]);

  useFocusEffect(
   useCallback(() => {
    getUserInfo();
    }, [])
  );

  const updateInformation = async () => {
    setLoading2(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    let bodyData = imageObj
      ? {
          firstname: firstName,
          lastname: lastName,
          national_id: nationalId,
          date_of_birth: selectedDate,
          address: address,
          state: state,
          zip: zip,
          city: city,
          country: country,
          profile_image: imageObj,
          device_info: deviceInfo
        }
      : {
          firstname: firstName,
          lastname: lastName,
          national_id: nationalId,
          date_of_birth: selectedDate,
          address: address,
          state: state,
          zip: zip,
          city: city,
          country: country,
          device_info: deviceInfo
        };

    fetch(baseURL + ENDPOINTS.updateUserProfile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log('responseData update user', responseData)
        if (responseData?.messages?.success) {
          setLoading2(false);
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setReload(!reload);
        } else {
          setErrMessage(responseData?.messages?.error);
          setLoading2(false);
          setErrShow(true);
        }
      })
      .catch((e) => {
        setErrMessage(t("deposit.error"));
        setErrShow(true);
        console.log("er : ", e);
        setLoading2(false);
      });
  };
  const updateUserImage = async (imageObj) => {
    setImageLoad(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let bodyData = {
          firstname: firstName,
          lastname: lastName,
          national_id: nationalId,
          date_of_birth: selectedDate,
          address: address,
          state: state,
          zip: zip,
          city: city,
          country: country,
          profile_image: imageObj,
          device_info: deviceInfo
        }
    fetch(baseURL + ENDPOINTS.updateUserProfile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify(bodyData),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log('responseData update user', responseData)
        if (responseData?.messages?.success) {
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setReload(!reload);
        } else {
          setErrMessage(responseData?.messages?.error);
          setImageLoad(false);
          setErrShow(true);
        }
        setImageLoad(false);
      })
      .catch((e) => {
        setErrMessage(t("deposit.error"));
        setErrShow(true);
        console.log("er : ", e);
        setImageLoad(false);
      });
  };
  const handleUpdate = () => {
    firstName?.length > 0
      ? lastName?.length > 0
        ? selectedDate?.length > 0
          ? address?.length > 0
            ? state?.length > 0
              ? zip?.length > 0
                ? city?.length > 0
                  ? country?.length > 0
                    ? updateInformation()
                    : ref7.current.focus()
                  : ref6.current.focus()
                : ref5.current.focus()
              : ref4.current.focus()
            : ref3.current.focus()
          : ""
        : ref2.current.focus()
      : ref.current.focus();
  };

  async function saveQr() {
    if (Platform.OS === "android" && !(await hasAndroidPermission())) {
      return;
    }
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.8,
    });

    CameraRoll.save(uri)
      .then((res) => {
        if (res.length) {
          showMessage({
            message: t("profileScreens.qrCodeSaved"),
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: t("profileScreens.qrCodeNotSaved"),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        showMessage({
          type: "danger",
          message: t("profileScreens.permissionRequired"),
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  }

  const shareImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      const shareResponse = await Share.open({ url: uri });
    } catch (error) {
      //console.log("error", error);
    }
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === "granted";
  };

  return (
    <ScrollView
      scrollEnabled={true}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <View style={{ paddingBottom: hp(5) }}>
        <CustomHeader navigation={navigation} />
        <Modal
          transparent={true}
          animationType="slide"
          visible={visible}
          onRequestClose={() => setVisible(!visible)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal2}>
              <View style={styles.modalHeader}>
                <TouchableOpacity
                  onPress={() => setVisible(false)}
                  style={styles.close2}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={28}
                    color={COLORS.babyBlue2}
                  />
                </TouchableOpacity>
              </View>
              <View style={{}}>
              <CustomText
                  color={COLORS.black}
                  size={20}
                  text={`${data?.username} ${" QR Code"}\n${data?.mobile}`}
                  style={styles.BackTxt}
                />
              
              </View>
              <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.9 }}>
                <Image
                  source={{
                    uri: qrCodeImage,
                  }}
                  style={{
                    alignSelf: "center",
                    width: 250,
                    height: 250,

                    // flex: 1,
                  }}
                  resizeMode="cover"
                />
              </ViewShot>
              <View style={styles.row}>
                <TouchableOpacity onPress={() => shareImage()}>
                  <Feather name="share-2" size={23} color={COLORS.babyBlue2} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => saveQr()}>
                  <Feather name="download" size={23} color={COLORS.babyBlue2} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          transparent={true}
          animationType="slide"
          visible={viewModal}
          onRequestClose={() => setViewModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modal2}>
              <View style={styles.modalHeader}>
                <CustomText
                  color={COLORS.black}
                  size={20}
                  text={"your Image"}
                  style={styles.BackTxt}
                />
                <TouchableOpacity
                  onPress={() => setViewModal(false)}
                  style={styles.close2}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={28}
                    color={COLORS.babyBlue2}
                  />
                </TouchableOpacity>
              </View>
              <Image
                source={{
                  uri: imageUri + "?date=" + moment().valueOf(),
                  cache: "reload",
                  headers: { Pragma: "no-cache" },
                }}
                style={styles.qrImage}
              />
            </View>
          </View>
        </Modal>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <>
            <View style={styles.headerStyle}>
              <CustomText
                color={COLORS.black}
                size={20}
                text={t("profileScreens.profile")}
                style={styles.BackTxt}
              />
              <TouchableOpacity
                onPress={() => setVisible(true)}
                style={{
                  marginHorizontal: i18n.language == "ar" ? wp(40) : wp(55),
                }}
              >
                <AntDesign name="qrcode" size={40} color={COLORS.headerText} />
              </TouchableOpacity>
            </View>
            {imageUri?
             <View style={styles.userViewStyle}>
              <View style={styles.addImageContainer}>
              {imageLoad?
              <View style={[styles.profileStyle,{display:imageLoad?'flex':'none'}]}>
              <ActivityIndicator size={'small'} color={COLORS.blue}/>
              </View>
              :
              <FastImage
              style={[styles.imageStyle,{display:imageLoad?'none':'flex'}]}
              source={{uri: imageUri,}}/>
              }
             
             </View>
             <TouchableOpacity
               onPress={() => {
                 refRBSheet.current.open();
               }} //
               style={styles.camera}
             >
               <Ionicons name="ios-camera" size={18} color={"white"} />
             </TouchableOpacity>
             <CustomText
               color={COLORS.headerText}
               num={2}
               size={20}
               text={data?.username}
               style={styles.BackTxt2}
             />
           </View>
            :
            <TouchableOpacity style={[styles.addImageContainer,{marginHorizontal: wp(3)}]}
            onPress={()=> refRBSheet.current.open()}>
               <MaterialCommunityIcons name="image-plus" size={27} color={COLORS.blue} />
            </TouchableOpacity>
            }
            
            
            <View style={styles.selectStyle}>
              <TouchableOpacity
                onPress={() => setSection(1)}
                style={section == 1 ? styles.selectedStyle : styles.basicStyle}
              >
                <CustomText
                  color={section == 1 ? COLORS.white : COLORS.headerText}
                  size={14}
                  text={t("profileScreens.info")}
                  style={styles.BackTxt3}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSection(2)}
                style={section == 2 ? styles.selectedStyle : styles.basicStyle}
              >
                <CustomText
                  color={section == 2 ? COLORS.white : COLORS.headerText}
                  size={14}
                  text={t("profileScreens.pass")}
                  style={styles.BackTxt3}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity
              onPress={() => setSection(3)}
              style={section == 3 ? styles.selectedStyle : styles.basicStyle}
            >
              <CustomText
                color={section == 3 ? COLORS.white : COLORS.headerText}
                size={14}
                text={t("profileScreens.natiId")}
                style={styles.BackTxt3}
              />
            </TouchableOpacity> */}
            </View>

            <View
              // contentContainerStyle={{justifyContent: 'space-evenly', flexGrow: 1}}
              style={styles.bg}
            >
              {section == 1 ? (
                <>
                  <View style={styles.regisCon}>
                    <CustomText
                      color={COLORS.proTxt}
                      size={16}
                      text={t("profileScreens.cr")}
                      style={styles.BackTxt3}
                    />
                    <CustomText
                      color={COLORS.proTxt}
                      size={10}
                      text={t("profileScreens.acc")}
                      style={styles.BackTxt4}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("IDVerification", {
                          type: "IDVerification",
                          kv: data?.kv,
                        })
                      }
                      style={styles.verifCon}
                    >
                      <CustomText
                        color={COLORS.proTxt}
                        size={16}
                        text={t("profileScreens.idv")}
                        style={styles.BackTxt4}
                      />
                      <View style={styles.innercon}>
                        <AntDesign
                          name={data?.kv == 1 ? "checkcircleo" : "closecircleo"}
                          size={20}
                          color={
                            data?.kv == 0
                              ? COLORS.red
                              : data?.kv == 2
                              ? COLORS.yellow
                              : COLORS.green
                          }
                        />
                        <CustomText
                          color={
                            data?.kv == 0
                              ? COLORS.red
                              : data?.kv == 2
                              ? COLORS.yellow
                              : COLORS.green
                          }
                          size={16}
                          text={
                            data?.kv == 0
                              ? t("profileScreens.pv")
                              : data?.kv == 2
                              ? t("profileScreens.awaitingKv")
                              : t("profileScreens.com")
                          }
                          style={[
                            styles.BackTxt5,
                            {
                              minWidth: "80%",
                            },
                          ]}
                        />
                        <AntDesign
                          name={
                            i18n.language == "ar" ? "leftcircle" : "rightcircle"
                          }
                          size={20}
                          color={COLORS.proTxt}
                        />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("IDVerification", {
                          type: "CustomerInformation",
                        })
                      }
                      style={styles.verifCon}
                    >
                      <CustomText
                        color={COLORS.proTxt}
                        size={16}
                        text={t("profileScreens.cif")}
                        style={styles.BackTxt4}
                      />
                      <View style={styles.innercon}>
                        <AntDesign
                          name="checkcircleo"
                          size={20}
                          color={COLORS.green}
                        />
                        <CustomText
                          color={COLORS.green}
                          size={16}
                          text={t("profileScreens.com")}
                          style={[
                            styles.BackTxt6,
                            {
                              minWidth: "80%",
                            },
                          ]}
                        />
                        <AntDesign
                          name={
                            i18n.language == "ar" ? "leftcircle" : "rightcircle"
                          }
                          size={20}
                          color={COLORS.proTxt}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                  <CustomInput
                    editable={false}
                    label={t("profileScreens.name")}
                    placeholder={t("profileScreens.title")}
                    value={userName}
                    onChangeText={setUserName}
                    // error={userName.length ? !validateUserName(userName) : true}
                    // errorMessage={t("accountScreen.m1")}
                    icon={
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <CustomInput
                    editable={false}
                    label={t("profileScreens.email")}
                    value={data?.email}
                    icon={
                      <Ionicons
                        name="mail"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <CustomPhoneInputFinal
                    //onChangeText={setPhone}
                    placeholder={data?.mobile} //.substring(3, 12)
                    validateInput={false}
                    editable={false}
                    smaller={true}
                    containerStyle={{ width: "70%" }}
                    dropDownContainerStyle={{ width: "29%" }}
                    noContacts={true}
                    showQRCode={false}
                  />
                  <CustomInput
                    keyboardType="numeric"
                    editable={false}
                    value={nationalId}
                    // containerStyle={{width:'80%'}}
                    label={t("profileScreens.iqama")}
                    icon={
                      <Ionicons
                        name="card"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  {/* editable true */}
                  <CustomInput
                    label={t("updateProfile.fn")}
                    placeholder={t("updateProfile.fnp")}
                    value={firstName}
                    onChangeText={setFirstName}
                    error={firstName?.length > 0 ? false : true}
                    errorMessage={t("updateProfile.err")}
                    keyboardType="default"
                    inputRef={ref}
                    icon={
                      <FontAwesome5
                        name="user"
                        size={15}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <CustomInput
                    label={t("updateProfile.ln")}
                    placeholder={t("updateProfile.fnp")}
                    value={lastName}
                    onChangeText={setLastName}
                    error={lastName?.length > 0 ? false : true}
                    errorMessage={t("updateProfile.err")}
                    keyboardType="default"
                    inputRef={ref2}
                    icon={
                      <FontAwesome5
                        name="user-plus"
                        size={15}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <CustomInput
                    onPress={() => setVisibleDate(true)}
                    dateInput={true}
                    label={t("profileScreens.dob")}
                    value={selectedDate}
                    onChangeText={(val) => {
                      // console.log('val : ', val);
                      setSelectedDate(val);
                    }}
                    icon={
                      <Ionicons
                        name="calendar"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <DatePicker
                    locale={i18n.language}
                    mode="date"
                    modal
                    open={visibleDate}
                    date={new Date()}
                    onConfirm={(date) => {
                      setSelectedDate(
                        moment(date).locale("en").format("DD-MM-YYYY")
                      );
                      setVisibleDate(false);
                    }}
                    // minimumDate={new Date()}
                    onCancel={() => {
                      setVisibleDate(false);
                    }}
                    confirmText={i18n.language == "en" ? "confirm" : "تأكيد"}
                    cancelText={i18n.language == "en" ? "cancle" : "إلغاء"}
                    title={
                      i18n.language == "en" ? "select date" : "اختر التاريخ"
                    }
                  />
                  <CustomInput
                    label={t("updateProfile.add")}
                    placeholder={t("updateProfile.addp")}
                    value={address}
                    onChangeText={setAddress}
                    error={address?.length > 0 ? false : true}
                    errorMessage={t("updateProfile.err")}
                    inputRef={ref3}
                    icon={
                      <FontAwesome5
                        name="search-location"
                        size={15}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <CustomInput
                    label={t("updateProfile.zip")}
                    placeholder={t("updateProfile.zipp")}
                    value={zip}
                    onChangeText={setZip}
                    keyboardType={"numeric"}
                    error={zip?.length > 0 ? false : true}
                    errorMessage={t("updateProfile.err")}
                    inputRef={ref5}
                    icon={
                      <MaterialCommunityIcons
                        name={"email-send-outline"}
                        color={COLORS.babyBlue2}
                        size={15}
                      />
                    }
                  />
                  {/* <CustomInput
                  label={t("updateProfile.state")}
                  placeholder={t("updateProfile.statep")}
                  value={state}
                  onChangeText={setState}
                  error={state?.length > 0 ? false : true}
                  errorMessage={t("updateProfile.err")}
                  inputRef={ref4}
                  icon={
                    <MaterialCommunityIcons
                      name={"city-variant"}
                      color={COLORS.babyBlue2}
                      size={18}
                    />
                  }
                />
                <CustomInput
                  label={t("updateProfile.city")}
                  placeholder={t("updateProfile.cityp")}
                  value={city}
                  onChangeText={setCity}
                  error={city?.length > 0 ? false : true}
                  errorMessage={t("updateProfile.err")}
                  inputRef={ref6}
                  icon={
                    <MaterialCommunityIcons
                      name={"home-city"}
                      color={COLORS.babyBlue2}
                      size={15}
                    />
                  }
                /> */}
                  {/* region dropdown */}
                  <View
                    style={[
                      styles.dropdownCont,
                      {
                        marginLeft: wp(10),
                      },
                    ]}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("updateProfile.state")}
                    />

                    <SelectDropdown
                      data={citiesAndStates?.map((el) =>
                        i18n.language == "ar" ? el.name_ar : el.name_en
                      )}
                      value={state}
                      defaultButtonText={state}
                      renderDropdownIcon={() => {
                        return (
                          <FontAwesome5
                            name="caret-down"
                            size={20}
                            color={COLORS.babyBlue2}
                          />
                        );
                      }}
                      buttonTextStyle={styles.dropDownBtnTxt}
                      buttonStyle={styles.dropDownBtn}
                      rowStyle={styles.dropDownRow}
                      rowTextStyle={styles.dropDownTxt}
                      onSelect={(val, index) => {
                        setState(val);
                        ref1?.current.reset();
                        setCity(null);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                  </View>
                  {/* //city dropdown*/}
                  <View
                    style={[
                      styles.dropdownCont,
                      {
                        marginLeft: wp(10),
                      },
                    ]}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("updateProfile.city")}
                    />
                    <SelectDropdown
                      data={citiesAndStates
                        .filter((el) =>
                          i18n.language == "ar"
                            ? el.name_ar == state
                            : el.name_en == state
                        )[0]
                        ?.states?.map((el) =>
                          i18n.language == "ar" ? el.name_ar : el.name_en
                        )}
                      ref={ref1}
                      defaultButtonText={city}
                      renderDropdownIcon={() => {
                        return (
                          <FontAwesome5
                            name="caret-down"
                            size={20}
                            color={COLORS.babyBlue2}
                          />
                        );
                      }}
                      buttonTextStyle={styles.dropDownBtnTxt}
                      buttonStyle={styles.dropDownBtn}
                      rowStyle={styles.dropDownRow}
                      rowTextStyle={styles.dropDownTxt}
                      onSelect={(val, index) => {
                        setCity(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                  </View>
                  {/* <CustomInput
                  label={t("updateProfile.country")}
                  placeholder={t("updateProfile.countryp")}
                  value={country}
                  onChangeText={setCountry}
                  error={country?.length > 0 ? false : true}
                  errorMessage={t("updateProfile.err")}
                  inputRef={ref7}
                  icon={
                    <MaterialCommunityIcons
                      name={"city"}
                      color={COLORS.babyBlue2}
                      size={15}
                    />
                  }
                /> */}
                  {/* country dropdown */}
                  <View
                    style={[
                      styles.dropdownCont,
                      {
                        marginLeft: wp(10),
                      },
                    ]}
                  >
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("updateProfile.country")}
                    />
                    <SelectDropdown
                      data={[t("updateProfile.sa")]}
                      defaultButtonText={country}
                      renderDropdownIcon={() => {
                        return (
                          <FontAwesome5
                            name="caret-down"
                            size={20}
                            color={COLORS.babyBlue2}
                          />
                        );
                      }}
                      buttonTextStyle={styles.dropDownBtnTxt}
                      buttonStyle={styles.dropDownBtn}
                      rowStyle={styles.dropDownRow}
                      rowTextStyle={styles.dropDownTxt}
                      onSelect={(val, index) => {
                        setCountry(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                  </View>
                  <CustomButton
                    loading={loading2}
                    disabled={loading2}
                    color={COLORS.blue}
                    onPress={() => handleUpdate()}
                    text={t("updateProfile.update")}
                    containerStyle={styles.buttonStyle}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("UpdateBasicInfo");
                    }}
                    style={styles.buttonStyle}
                  >
                    <CustomText
                      color={"white"}
                      size={16}
                      text={t("profileScreens.update")}
                      style={styles.BackTxt3}
                    />
                  </TouchableOpacity>
                </>
              ) : section == 2 ? (
                <ChangePassword />
              ) : (
                <>
                  <CustomInput
                    label={t("profileScreens.natiId")}
                    keyboardType="numeric"
                    placeholder={t("profileScreens.natiId")}
                    icon={
                      <Ionicons
                        name="person"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    }
                  />
                  <TouchableOpacity style={styles.buttonStyle}>
                    <CustomText
                      color={"white"}
                      size={16}
                      text={t("profileScreens.updateNationalId")}
                      style={styles.BackTxt3}
                    />
                  </TouchableOpacity>
                </>
              )}
            </View>
          </>
        )}
        <CustomAlert
          type={"error"}
          show={errShow}
          header={t("accountScreen.w")}
          body={errMessage}
          action1={() => {
            setErrShow(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "#00000060",
            },
            container: {
              backgroundColor: COLORS.bg,
              height: "22%",
              borderTopLeftRadius: wp(8),
              borderTopRightRadius: wp(8),
              justifyContent: "space-evenly",
            },
          }}
        >
          {/* <TouchableOpacity
          onPress={() => {
            console.log("iamge uri : ", imageUri);
            setViewModal(true);
          }}
        >
          <CustomText
            color={COLORS.header}
            size={20}
            text={t("profileBS.v")}
            style={styles.BackTxt3}
          />
        </TouchableOpacity> */}
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              handleTakeImage();
            }}
          >
            <CustomText
              color={COLORS.header}
              size={20}
              text={t("profileBS.takep")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              refRBSheet.current.close();
              handleOpenGallery();
            }}
          >
            <CustomText
              color={COLORS.header}
              size={20}
              text={t("profileBS.gallery")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
        </RBSheet>
        <ImageView
          images={[
            {
              uri: imageUri + "?date=" + moment().valueOf(),
              cache: "reload",
              headers: { Pragma: "no-cache" },
            },
          ]}
          imageIndex={0}
          visible={viewImage}
          onRequestClose={() => {
            refRBSheet.current.close();
            setViewImage(false);
          }}
          // backgroundColor="red"
          presentationStyle="pageSheet"
        />
      </View>
    </ScrollView>
  );
};
export default Profile;
