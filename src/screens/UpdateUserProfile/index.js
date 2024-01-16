import React, { useMemo, useRef, useState, useEffect } from "react";
import { Image, View, ScrollView } from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomInput from "../../components/customInput";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import { showMessage } from "react-native-flash-message";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import { TouchableOpacity } from "react-native";
import RBSheet from "react-native-raw-bottom-sheet";
import { hp, wp } from "../../utilis/dimensions";
import { PermissionsAndroid } from "react-native";
import { Platform } from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { getCitiesAndStates } from "../../utilis/apis";
import SelectDropdown from "react-native-select-dropdown";
const UpdateUserProfile = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [citiesAndStates, setCitiesAndStates] = useState([]);
  const ref = useRef();
  const ref2 = useRef();
  const ref3 = useRef();
  const ref4 = useRef();
  const ref5 = useRef();
  const ref6 = useRef();
  const ref7 = useRef();
  const nationalRef = useRef();
  const refRBSheet = useRef();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [dob, setDob] = useState("");
  const [visibleDate, setVisibleDate] = useState(false);
  const [imageObj, setImageObj] = useState(null);
  const [imageUri, setImageUri] = useState("");

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
            setImageUri(res.assets[0].uri);
            setImageObj({
              base64: res.assets[0].base64,
              extension: "." + res.assets[0].type.split("/")[1],
            });
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
      if (res.assets) {
        setImageUri(res.assets[0].uri);
        setImageObj({
          base64: res.assets[0].base64,
          extension: "." + res.assets[0].type.split("/")[1],
        });
      }
    });
  };

  useEffect(() => {
    baseURL &&  getCitiesAndStates(baseURL, 'sa').then((res) => {
      setCitiesAndStates(res.data)

    })
  }, [baseURL])


  const updateInformation = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("in update user information ...");

    fetch(baseURL + ENDPOINTS.updateUserProfile, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        firstname: firstName,
        lastname: lastName,
        national_id: nationalId,
        date_of_birth: dob,
        address: address,
        state: state,
        zip: zip,
        city: city,
        country: country,
        profile_image: imageObj,
        device_info: deviceInfo
      }),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        // console.log("res request : ", responseData);
        if (responseData?.messages?.success) {
          setLoading(false);
          showMessage({
            message: responseData?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("AccountCreated");
        } else {
          setErrMess(responseData?.messages?.error);
          setLoading(false);
          setWarning(true);
        }
      })
      .catch((e) => {
        setErrMess(t("deposit.error"));
        setWarning(true);
        console.log("er : ", e);
        setLoading(false);
      });
  };
  const handleUpdate = () => {
    firstName?.length > 0
      ? lastName?.length > 0
        ? nationalId?.length > 0
          ? dob?.length > 0
            ? address?.length > 0
              ? state?.length > 0
                ? zip?.length > 0
                  ? city?.length > 0
                    ? country?.length > 0
                      ? imageObj
                        ? updateInformation()
                        : (setErrMess(t("updateProfile.imageErr")),
                          setWarning(true))
                      : ref7.current.focus()
                    : ref6.current.focus()
                  : ref5.current.focus()
                : ref4.current.focus()
              : ref3.current.focus()
            : setVisibleDate(true)
          : nationalRef.current.focus()
        : ref2.current.focus()
      : ref.current.focus();
  };

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <Image style={styles.logo} source={require("../../assets/nafaz.png")} />
      <CustomText
        color={COLORS.black}
        size={20}
        text={t("updateProfile.header")}
        style={styles.BackTxt}
      />
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
            name="money-bill-wave-alt"
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
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />
      <CustomInput
        label={t("updateProfile.national")}
        placeholder={t("updateProfile.nationalp")}
        value={nationalId}
        onChangeText={setNationalId}
        keyboardType={"numeric"}
        error={nationalId?.length > 0 ? false : true}
        errorMessage={t("updateProfile.err")}
        inputRef={nationalRef}
        icon={
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />
      <CustomInput
        onPress={() => setVisibleDate(true)}
        placeholder={t("updateProfile.dobp")}
        dateInput={true}
        label={t("updateProfile.dob")}
        value={dob}
        onChangeText={(val) => {
          setDob(val);
        }}
        icon={<Ionicons name="calendar" size={20} color={COLORS.babyBlue2} />}
      />
      <DatePicker
        locale={i18n.language}
        mode="date"
        modal
        open={visibleDate}
        date={new Date()}
        onConfirm={(date) => {
          setDob(moment(date).locale("en").format("DD-MM-YYYY"));
          setVisibleDate(false);
        }}
        onCancel={() => {
          setVisibleDate(false);
        }}
        maximumDate={new Date()}
        confirmText={i18n.language == "en" ? "confirm" : "تأكيد"}
        cancelText={i18n.language == "en" ? "cancle" : "إلغاء"}
        title={
          i18n.language == "en" ? "select date of birth" : "اختر تاريخ الميلاد"
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
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />
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
          data={citiesAndStates?.map((el => i18n.language == 'ar' ? el.name_ar : el.name_en))}

          value={state}

          defaultButtonText={t("updateProfile.state")}
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
          buttonStyle={{
            backgroundColor: COLORS.inputBackGround,
            width: "89%",
            height: hp(6),
            elevation: 2,
            marginBottom: hp(2),
            borderWidth: wp(0.28),
            borderRadius: wp(2),
            borderColor:  state?.length>0 ? COLORS.header : COLORS.red }}
        
          rowStyle={styles.dropDownRow}
          rowTextStyle={styles.dropDownTxt}
          onSelect={(val, index) => {
            setState(val);
            ref6?.current.reset()
            setCity('')
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
            {
        state?.length == 0 &&
        (<CustomText
          containerStyle={{ alignSelf: 'center' }}
          color={COLORS.red}
          text={t('requiredField')}
          size={12}
        />
        )}
      </View>
  
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
          data={citiesAndStates.filter((el =>
            i18n.language == 'ar'
              ? el.name_ar == state
              : el.name_en == state
          ))[0]?.states?.map((el) => i18n.language == 'ar' ? el.name_ar : el.name_en)
          }
          ref={ref6}
          defaultButtonText={t("updateProfile.city")}
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
          buttonStyle={{
            backgroundColor: COLORS.inputBackGround,
            width: "89%",
            height: hp(6),
            elevation: 2,
            marginBottom: hp(2),
            borderWidth: wp(0.28),
            borderRadius: wp(2),
            borderColor:  city?.length>0 ? COLORS.header : COLORS.red }}
        
          rowStyle={styles.dropDownRow}
          rowTextStyle={styles.dropDownTxt}
          onSelect={(val, index) => {
            console.log('hi')

            setCity(val);

          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            return item;
          }}
        />
         {
        city?.length == 0 &&
        (<CustomText
          containerStyle={{ alignSelf: 'center' }}
          color={COLORS.red}
          text={t('requiredField')}
          size={12}
        />
        )}
      </View>
     


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
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />

      <CustomInput
        label={t("updateProfile.country")}
        placeholder={t("updateProfile.countryp")}
        value={country}
        onChangeText={setCountry}
        error={country?.length > 0 ? false : true}
        errorMessage={t("updateProfile.err")}
        inputRef={ref7}
        icon={
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />
      <View style={styles.imageContainer}>
        <Image
          style={styles.profileStyle}
          source={{
            uri: imageUri + "?date=" + moment().valueOf(),
            cache: "reload",
            headers: { Pragma: "no-cache" },
          }}
        />
        <TouchableOpacity
          onPress={() => refRBSheet.current.open()}
          style={styles.camera}
        >
          <Ionicons name="ios-camera" size={22} color={"white"} />
        </TouchableOpacity>
      </View>
      <CustomButton
        loading={loading}
        disabled={loading}
        color={COLORS.blue}
        onPress={() => handleUpdate()}
        text={t("updateProfile.update")}
        containerStyle={styles.btn2}
      />
      <CustomAlert
        type={'error'}
        show={warning}
        header={t("accountScreen.w")}
        body={errmess}
        action1={() => {
          setWarning(false);
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
    </ScrollView>
  );
};
export default UpdateUserProfile;
