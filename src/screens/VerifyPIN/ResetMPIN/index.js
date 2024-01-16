import React, { useEffect, useMemo, useState, useRef } from "react";
import { Image, ScrollView, View } from "react-native";

import CustomText from "../../../components/customText";
import { useDispatch } from "react-redux";
import createStyles from "./style";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2, getBaseURL } from "../../../constants/API";
import { showMessage } from "react-native-flash-message";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import axios from "axios";
import CustomButton from "../../../components/customButton";
import SelectDropdown from "react-native-select-dropdown";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { hp, wp } from "../../../utilis/dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomInput from "../../../components/customInput";

const ResetMPIN = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [code2, setCode2] = useState("");
  const [baseURL, setBaseURL] = useState("");
  const nationalRef = useRef();
  const [nationalId, setNationalId] = useState("");
  const { t, i18n } = useTranslation();
  const [counter, setCounter] = useState(0);
  const [isCounted, SetIsCounted] = useState(false);

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [navigation]);

  const [method, setMethod] = useState("");
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setCounter((lastTimerCount) => {
        lastTimerCount <= 1 &&
          (clearInterval(interval),
          SetIsCounted(false),
          setSelected(0),
          setCode(""),
          setCode2(""));
        return lastTimerCount < 1 ? lastTimerCount : lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  }, [isCounted]);
  const handleSelectMethod = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    console.log("is select method  : ", method);
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS2.resetpin + method,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
    })
      .then(async (res) => {
        setLoading(false);

        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setCounter(120);
          SetIsCounted(true);
          setSelected(1);
        } else {
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
  const handleVerifyCode = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("code", code);
    formdata.append("national_id", nationalId);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.resetpinCheck,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then(async (res) => {
        setLoading(false);
        if (res?.data?.messages?.success) {
          showMessage({
            message:
              i18n.language == "en"
                ? res?.data?.messages?.success
                : "تمت المطابقة",
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setSelected(2);
        } else if (res?.data?.messages?.error) {
          showMessage({
            message:
              i18n.language == "en"
                ? res?.data?.messages?.error
                : "الكود او الرقم القومى غير صالح",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
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
  const handleChangePIN = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log("in change code  : ", code, nationalId, code2);
    var formdata = new FormData();
    formdata.append("code", code);
    formdata.append("national_id", nationalId);
    formdata.append("new_pin", code2);
    formdata.append('device_info', deviceInfo)
    console.log("form data : ", formdata);
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.resetchangepin,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then(async (res) => {
        setLoading(false);
        // console.log("res status : ", res.data);
        if (res?.data?.messages?.success) {
          showMessage({
            message:
              i18n.language == "en"
                ? res?.data?.messages?.success
                : "تم التغيير بنجاح",
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("VerifyPIN");
        } else if (res?.data?.messages?.error) {
          showMessage({
            message:
              i18n.language == "en"
                ? res?.data?.messages?.error
                : "الكود غير صالح",
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
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
  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      containerStyle={styles.bg}
    >
      <Image
        style={styles.logo}
        source={require("../../../assets/newLogo.png")}
      />
      {selected == 0 ? (
        <>
          <CustomText
            text={t("resetMPIN.header")}
            size={20}
            // style={styles.modalText}
            color={COLORS.header}
          />
          <View
            style={{ width: wp(80), alignSelf: "center", marginLeft: wp(5) }}
          >
            <SelectDropdown
              data={[t("resetMPIN.email"), t("resetMPIN.sms")]}
              defaultButtonText={t("resetMPIN.h")}
              renderDropdownIcon={() => {
                return (
                  <FontAwesome5Icon
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
                index == 0 ? setMethod("email") : setMethod("sms");
                console.log("selected : ", val, index);
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
            loading={loading}
            disabled={loading}
            color={COLORS.header}
            onPress={() => {
              method
                ? handleSelectMethod()
                : showMessage({ message: t("resetMPIN.se"), type: "danger", titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
            }}
            textSize={18}
            text={t("resetMPIN.v1")}
            containerStyle={styles.closeButton}
          />
        </>
      ) : selected == 1 ? (
        <>
          <CustomText
            text={
              method == "sms"
                ? t("resetMPIN.entercode2")
                : t("resetMPIN.entercode")
            }
            size={20}
            color={COLORS.header}
          />
          <CustomText
            color={COLORS.header}
            size={15}
            text={t("AccountVerification.valid")}
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
            }}
          />
          <CustomInput
            inputRef={nationalRef}
            keyboardType="numeric"
            value={nationalId}
            onChangeText={setNationalId}
            error={nationalId.length > 0 ? false : true}
            errorMessage={t("updateProfile.err")}
            label={t("profileScreens.iqama")}
            icon={<Ionicons name="card" size={20} color={COLORS.babyBlue2} />}
          />
          <CustomButton
            loading={loading}
            disabled={loading}
            color={COLORS.header}
            onPress={() => {
              code.length == 6
                ? nationalId.length > 0
                  ? handleVerifyCode()
                  : nationalRef.current.focus()
                : showMessage({
                    message: t("resetMPIN.codeerr"),
                    type: "danger",
                    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                  });
            }}
            textSize={18}
            text={t("resetMPIN.v1")}
            containerStyle={styles.closeButton1}
          />
        </>
      ) : (
        <>
          <CustomText
            text={t("resetMPIN.cc")}
            size={20}
            color={COLORS.header}
          />
          <OTPInputView
            style={styles.otp}
            pinCount={6}
            code={code2}
            onCodeChanged={(c) => setCode2(c)}
            autoFocusOnLoad={false}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={(c) => {
              console.log("code : ", c);
            }}
          />
          <CustomButton
            loading={loading}
            disabled={loading}
            color={COLORS.header}
            onPress={() => {
              code2.length == 6
                ? handleChangePIN()
                : showMessage({
                    message: t("resetMPIN.codeerr"),
                    type: "danger",
                    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
                  });
            }}
            textSize={18}
            text={t("resetMPIN.v2")}
            containerStyle={styles.closeButton2}
          />
        </>
      )}
    </ScrollView>
  );
};
export default ResetMPIN;
