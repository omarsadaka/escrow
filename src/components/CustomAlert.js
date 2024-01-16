import { useTheme } from "@react-navigation/native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { hp, wp } from "../utilis/dimensions";
import CustomText from "./customText";
import CustomInput from "./customInput";
import { useTranslation } from "react-i18next";
import { COLORS } from "../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  handleSaveAsDraftValue,
  handleSaveAsDraftWhere,
} from "../redux/actions/user";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
const CustomAlert = ({
  header,
  body,
  inspection,
  onchangeInspection,
  show,
  action1,
  action2,
  action3,
  btn1,
  btn2,
  btn3,
  oneBtn,
  disputeReason,
  onChange,
  loading,
  draftLoading,
  rejectAndReturn,
  inspectionPeriod,
  saveAsDraft,
  saveDraftText,
  type
}) => {
  // const { colors: COLORS } = useTheme();
  const { saveDraftValue, saveDraftEnded } = useSelector((state) => state.user);
  const styles = useMemo(() => createStyles(COLORS), []);
  const [colorTheme, setColorTheme] = useState("#09518E");
  const [theme, setTheme] = useState("light");
  const { t, i18n } = useTranslation();
  const ref1 = useRef();
  const ref2 = useRef();
  const dispatch = useDispatch();
  const handleSaveAsDraft = () => {
    dispatch(handleSaveAsDraftValue(true));
    dispatch(handleSaveAsDraftWhere(saveDraftText));
    console.log("where : ", saveDraftText);
  };


  useEffect(()=>{
    getSavedColorTheme()
    getSavedTheme()
  },[])

  const getSavedColorTheme = async () => {
    try {
      const value = await AsyncStorage.getItem("COLORTHEME");
      if (value !== null) {
        // value previously stored
        setColorTheme(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  const getSavedTheme = async () => {
    try {
      const value = await AsyncStorage.getItem("THEME");
      if (value !== null) {
        // value previously stored
        setTheme(value);
      }
    } catch (e) {
      // error reading value
    }
  };

  return (
    <Modal visible={show} transparent animationType="slide">
      <View style={styles.centered_view}>
        <View style={styles.modal}>
          <View style={styles.modaltitle}>
            <View style={{ flexDirection: "row" }}>
              {type=='error'?
               <Image
                 source={require("../assets/warning.png")}
                 resizeMode={"contain"}
                 style={styles.warningLogo}/>
              :
               <Image
                 source={require("../assets/newLogo.png")}
                 resizeMode={"contain"}
                 style={styles.modalLogo}/>
              }
              <CustomText color={COLORS.header} size={20} text={header} />
            </View>
            <TouchableOpacity style={styles.closeCont}>
              <AntDesign
                onPress={oneBtn == false ? action2 : action1}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <View style={disputeReason ? styles.modalbody2 : styles.modalbody}>
            {rejectAndReturn ? (
              <CustomInput
                label={
                  rejectAndReturn
                    ? t("alertMessages.label2")
                    : t("alertMessages.label")
                }
                inputRef={ref1}
                placeholder={
                  rejectAndReturn
                    ? t("alertMessages.placeh2")
                    : t("alertMessages.placeh")
                }
                value={body}
                onChangeText={onChange}
                error={body.length == 0}
                errorMessage={t("alertMessages.err")}
                textInputStyle={{ height: hp(10), textAlignVertical: "top" }}
                multiline
                scrollEnabled
                returnDispute
              />
            ) : disputeReason ? (
              <>
                <CustomInput
                  label={
                    rejectAndReturn
                      ? t("alertMessages.label2")
                      : t("alertMessages.label")
                  }
                  inputRef={ref1}
                  placeholder={
                    rejectAndReturn
                      ? t("alertMessages.placeh2")
                      : t("alertMessages.placeh")
                  }
                  value={body}
                  onChangeText={onChange}
                  error={body.length == 0}
                  errorMessage={t("alertMessages.err")}
                  textInputStyle={{ height: hp(10), textAlignVertical: "top" }}
                  multiline
                  scrollEnabled
                  returnDispute
                />
                <CustomInput
                  label={t("alertMessages.insp")}
                  inputRef={ref2}
                  placeholder={t("alertMessages.inspction")}
                  value={inspection}
                  onChangeText={onchangeInspection}
                  error={inspection.length == 0}
                  errorMessage={t("alertMessages.insErr")}
                  returnDispute
                  keyboardType="numeric"
                />
              </>
            ) : (
              <CustomText color={COLORS.black} size={15} text={body} />
            )}
          </View>
          <View
            style={[
              styles.modalBtnCont,
              {
                bottom: disputeReason ? hp(-12) : hp(3),
              },
            ]}
          >
            <TouchableOpacity
              onPress={action1}
              disabled={loading}
              style={[
                styles.modalbutton,
                {
                  width:
                    saveAsDraft == true
                      ? "30%"
                      : oneBtn == true
                      ? "50%"
                      : "42%",
                  borderRadius: hp(2),
                  backgroundColor: theme=='light'? colorTheme : COLORS.blue
                },
              ]}
            >
              {loading ? (
                <ActivityIndicator size={"large"} color={"white"} />
              ) : (
                <CustomText
                  color={"white"}
                  size={saveAsDraft ? 12 : 16}
                  text={btn1}
                />
              )}
            </TouchableOpacity>
            {oneBtn == false && (
              <TouchableOpacity
                onPress={action2}
                style={[
                  styles.modalbutton,
                  {
                    borderRadius: hp(2),
                    width: saveAsDraft == true ? "30%" : "42%",
                    backgroundColor: theme=='light'? colorTheme : COLORS.blue
                  },
                ]}
              >
                <CustomText
                  color={"white"}
                  size={saveAsDraft ? 12 : 16}
                  text={btn2}
                />
              </TouchableOpacity>
            )}
            {saveAsDraft == true && (
              <TouchableOpacity
                onPress={handleSaveAsDraft}
                disabled={saveDraftValue}
                style={[
                  styles.modalbutton,
                  {
                    width: "30%",
                    borderRadius: hp(2),
                    backgroundColor: theme=='light'? colorTheme : COLORS.blue
                  },
                ]}
              >
                {saveDraftValue ? (
                  <ActivityIndicator size={"large"} color={"white"} />
                ) : (
                  <CustomText
                    color={"white"}
                    size={12}
                    text={t("saveAsDraft")}
                  />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const createStyles = (COLORS) =>
  StyleSheet.create({
    centered_view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      borderRadius: hp(2),
    },
    modal: {
      // width: "92%",
      // backgroundColor: COLORS.white,
      borderRadius: hp(2),
      // height: hp(32),
      backgroundColor: COLORS.white, //change
      // paddingHorizontal: wp(5),
      // borderRadius: 15,
      width: "90%",
      // paddingVertical: 50,
      // height:'80%',
      position: "absolute",
    },

    closeCont: {},
    modaltitle: {
      height: hp(7),
      flexDirection: "row",
      justifyContent: "space-between",
      borderBottomColor: COLORS.header,
      borderBottomWidth: wp(0.1),
      alignItems: "center",
      marginHorizontal: wp(2),
    },
    modalbody: {
      // minHeight: '25%',
      height: hp(18),
      paddingVertical: hp(3),
      alignItems: "center",
      // marginLeft: wp(5),
      // backgroundColor:'red'
    },
    modalbody2: {
      height: hp(25),
      // paddingVertical: hp(3),
      alignItems: "flex-start",
      marginLeft: wp(-5),
    },
    modalbutton: {
      // backgroundColor: COLORS.blue,
      color: COLORS.white,
      height: hp(7),
      width: "42%",
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitleTxt: {
      color: COLORS.header,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
    },
    modalBodyTxt: {
      color: COLORS.black,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
      marginHorizontal: wp(4),
      lineHeight: hp(3),
    },
    modalBodyTxt2: {
      textAlign: "center",
      color: COLORS.blue,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
      marginHorizontal: wp(4),
      lineHeight: hp(3),
    },
    modalBtnCont: {
      flexDirection: "row",
      justifyContent: "space-around",
      // width:'100%'
    },
    modalBtnTxt: {
      color: "white",
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
    },

    modalLogo: {
      width: wp(16),
      height: wp(16),
    },
    warningLogo: {
      width: wp(9),
      height: wp(9),
      marginHorizontal:wp(2)
    },
    landingTextStyle: {
      width: wp(85),
      borderBottomColor: COLORS.primary,
      borderBottomWidth: wp(0.5),
      marginTop: hp(-2),
      marginHorizontal: wp(4),
      justifyContent: "flex-end",
      height: hp(6),
    },
    widthErrorStyle: {
      justifyContent: "flex-start",
      color: COLORS.red,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
    },
    widthErrorStyle2: {
      // justifyContent: 'space-around',
      color: COLORS.red,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
      marginLeft: wp(17),
    },
    lottie: {
      width: wp(20),
      height: hp(12),
      marginTop: hp(-2.5),
      marginBottom: hp(-3.5),
      marginLeft: wp(18),
    },
  });
