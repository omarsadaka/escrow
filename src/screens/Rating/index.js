import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import { hp, wp } from "../../utilis/dimensions";
import CustomAlert from "../../components/CustomAlert";
import { getUniqueId } from "react-native-device-info";
import { Rating, AirbnbRating } from "react-native-ratings";
import Textarea from "react-native-textarea";
import CustomButton from "../../components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RatingScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [baseURL, setBaseURL] = useState("");
  const [selected, setSelected] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [uuid, setUuid] = useState(null);
  const [details, setDetails] = useState("");
  const [rate, setRate] = useState(3);
  const detailsRef = useRef(null);
  useEffect(() => {
    getUUID();
    getBaseURL()?.then((res) => setBaseURL(res));
  }, []);

  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    console.log("uuid value : ", uuidValue);
    setUuid(uuidValue);
  };

  useEffect(() => {
    if (!baseURL && !uuid) return;
    getRating();
  }, [baseURL]);
  const getRating = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setLoading(true);
    var formdata = new FormData();
    formdata.append("uuid", uuid);
    formdata.append('device_info', deviceInfo)
    try {
      fetch(baseURL + ENDPOINTS2.ratingCheck, {
        method: "POST",
        headers:{
          "X-Localization": i18n?.language
        },
        body: formdata,
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("resss  of rating check : ", responseData);
          if (responseData.messages.success) {
            //user can add rating
            setSelected(1);
            setLoading(false);
          } else {
            //user already add his rating
            setSelected(2);
            setLoading(false);
          }
        });
    } catch (error) {
      setSelected(null);
      setLoading(false);
      setErrMessage(t("accountScreen.err"));
      setErrShow(true);
    }
  };

  const handleSubmit = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    setLoading2(true);
    var formdata = new FormData();
    formdata.append("uuid", uuid);
    formdata.append("stars", rate.toString());
    formdata.append("description", details);
    formdata.append('device_info', deviceInfo)
    console.log("results : ", uuid, rate, details);
    try {
      fetch(baseURL + ENDPOINTS2.ratingAdd, {
        method: "POST",
        headers:{
          "X-Localization": i18n?.language
        },
        body: formdata,
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("resss  of rating submit : ", responseData);
          if (responseData.messages.success) {
            setErrMessage(t("rating.message"));
            setLoading2(false);
            setErrShow(true);
            setSelected(2);
          } else {
            setErrMessage(responseData.messages.error);
            setLoading2(false);
            setErrShow(true);
          }
        });
    } catch (error) {
      setLoading2(false);
      setErrMessage(t("accountScreen.err"));
      setErrShow(true);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.bannedContainer}>
      <CustomHeader navigation={navigation} />
      {loading ? (
        <ActivityIndicator color={COLORS.header} size={"large"} />
      ) : (
        <>
          {selected ? (
            <>
              <View style={styles.screen}>
                <CustomText
                  text={t("rating.title")}
                  color={COLORS.blue}
                  size={20}
                  style={styles.header}
                />
                {selected == 1 ? (
                  <>
                    <AirbnbRating
                      count={5}
                      reviews={[
                        t("rating.bad"),
                        t("rating.ok"),
                        t("rating.good"),
                        t("rating.veryGood"),
                        t("rating.amazing"),
                      ]}
                      defaultRating={rate}
                      size={40}
                      onFinishRating={(res) => setRate(res)}
                    />
                    <CustomText
                      color={COLORS.lightGrey}
                      size={14}
                      style={[styles.detailsHeader, { marginTop: hp(2),}]}
                    >
                      {t("changeRole.details")}
                    </CustomText>
                    <Textarea
                      required={true}
                      ref={detailsRef}
                      containerStyle={[
                        styles.textareaContainer,
                        { borderColor: details ? COLORS.header : COLORS.red,height:'35%' },
                      ]}
                      style={{
                        fontFamily: "BahijTheSansArabic-Plain",
                        textAlign:i18n.language=='ar'?'right': 'left',
                        color: COLORS.black,
                        textAlignVertical:'top',
                        paddingHorizontal: wp(2)
                      }}
                      onChangeText={(val) => setDetails(val)}
                      maxLength={200}
                      placeholder={t("changeRole.dp")}
                      placeholderTextColor={"#c7c7c7"}
                      underlineColorAndroid={"transparent"}
                      value={details}
                    />

                    {!details && (
                      <CustomText
                        color={COLORS.red}
                        size={13}
                        style={styles.detailsHeader}
                      >
                        {t("requiredField")}
                      </CustomText>
                    )}
                    <CustomButton
                      color={COLORS.blue}
                      loading={loading2}
                      disabled={loading2}
                      onPress={() => {
                        details && details.length > 0 ? handleSubmit() : "";
                      }}
                      textSize={16}
                      text={t("rating.submit")}
                      containerStyle={styles.submitStyle}
                    />
                  </>
                ) : (
                  <View style={styles.itemContainer}>
                    <CustomText
                      text={t("rating.reviewed")}
                      color={COLORS.black}
                      size={20}
                    />
                  </View>
                )}
              </View>
            </>
          ) : (
            <CustomText
              text={t("contactUs.qasno")}
              color={COLORS.blue}
              size={20}
            />
          )}
        </>
      )}

      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </ScrollView>
  );
};
export default RatingScreen;
