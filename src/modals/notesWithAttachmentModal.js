import { useTheme } from "@react-navigation/native";
import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { hp, wp } from "../utilis/dimensions";
import CustomText from "../components/customText";
import { useTranslation } from "react-i18next";
import Textarea from "react-native-textarea";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import CommonStyles from "../constants/CommonStyles";
const NotesAlert = ({
  header,
  body,
  show,
  action1,
  action2,
  btn1,
  btn2,
  oneBtn,
  onChange,
  handleUploadCancelDocuments,
  uploadFiles,
  loading,
  notesLabel,
  onDeleteAttachment,
  maxUploadedFile,
  maxFileSize,
  fileExtensions,
}) => {
  // console.log("body", body);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const ref1 = useRef();
  const ref2 = useRef();
  //  console.log('uploadfiles',uploadFiles)

  return (
    <Modal visible={show} transparent animationType="slide">
      <KeyboardAvoidingView behavior="padding" style={styles.centered_view}>
        <ScrollView
          // contentContainerStyle={styles.centeredView}
          style={styles.centeredView2}
        >
          <View style={styles.modaltitle}>
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../assets/newLogo.png")}
                resizeMode={"contain"}
                style={styles.modalLogo}
              />
              <CustomText color={COLORS.header} size={20} text={header} />
            </View>

            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={oneBtn == false ? action2 : action1}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalbody}>
            <CustomText
              color={COLORS.lightGrey}
              size={15}
              style={{ textAlign: "center", marginLeft: wp(2) }}
            >
              {notesLabel}
            </CustomText>
            <Textarea
              required={true}
              inputRef={ref1}
              style={{
                fontFamily: "BahijTheSansArabic-Plain",
                textAlign: i18n.language == "ar" ? "right" : "left",
                color: COLORS.black,
                height:'100%',
                textAlignVertical:'top'
              }}
              containerStyle={[
                styles.textareaContainer,
                { borderColor: body ? COLORS.header : COLORS.red },
              ]}
              onChangeText={onChange}
              maxLength={200}
              placeholder={t("alertMessages.placeh2")}
              placeholderTextColor={"#c7c7c7"}
              underlineColorAndroid={"transparent"}
              value={body}
            />
            {!body && (
              <CustomText
                color={COLORS.red}
                size={13}
                style={{ textAlign: "center", width: "100%", }}
              >
                {t("requiredField")}
              </CustomText>
            )}
            <View
              style={{
                width: "90%",
                alignItems: "flex-start",
                marginLeft: hp(1),
              }}
            >
              <CustomText
                color={COLORS.header}
                size={12}
                text={t("maxNum") + maxUploadedFile}
              />
              <CustomText
                color={COLORS.header}
                size={12}
                text={t("maxsize") + maxFileSize + " " + t("mega")}
              />
              <CustomText
                color={COLORS.header}
                size={12}
                text={t("extensions") + fileExtensions}
              />
            </View>
            <TouchableOpacity
              style={styles.uploadButtonStyle}
              onPress={handleUploadCancelDocuments}
            >
              <CustomText
                color={COLORS.white}
                size={16}
                text={t("UploadFiles")}
              />
            </TouchableOpacity>
            {uploadFiles.length > 0 &&
              uploadFiles.map((el, index) => (
                <View
                  style={{
                    marginHorizontal: wp(5),
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: wp(70),
                    minHeight: hp(4),
                  }}
                >
                  <CustomText
                    containerStyle={{
                      width: wp(60),
                      justifyContent: "flex-start",
                    }}
                    color={COLORS.header}
                    size={14}
                    text={el.name}
                  />
                  <Entypo
                    onPress={() => {
                      const arr = uploadFiles.filter(
                        (ob) => ob.name != el.name
                      );
                      onDeleteAttachment(arr);
                    }}
                    name={"trash"}
                    size={20}
                    color={COLORS.red}
                  />
                </View>
              ))}
          </View>
          <View
            style={[
              styles.modalBtnCont,
              {
                bottom: hp(1),
              },
            ]}
          >
            <TouchableOpacity
              onPress={action1}
              disabled={loading}
              style={[styles.uploadButtonStyle, { borderRadius: hp(2) }]}
            >
              {loading ? (
                <ActivityIndicator size={"large"} color={"white"} />
              ) : (
                <CustomText color={"white"} size={16} text={btn1} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={action2}
              style={[
                styles.uploadButtonStyle,
                { borderRadius: hp(2), backgroundColor: COLORS.red },
              ]}
            >
              <CustomText color={"white"} size={16} text={t("ignore")} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default NotesAlert;

const createStyles = (COLORS) =>
  StyleSheet.create({
    modal: {
      width: "92%",
      backgroundColor: COLORS.white,
      borderRadius: hp(2),
      // minHeight: "80%",
    },
    modaltitle: {
      height: hp(7),
      flexDirection: "row",
      borderBottomColor: COLORS.header,
      borderBottomWidth: wp(0.1),
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: wp(1),
    },
    modalbody: {
      // minHeight: "60%",
      paddingVertical: hp(3),
      alignItems: "flex-start",
      // marginLeft: wp(5),
      // backgroundColor:'red'
    },
    modalbody2: {
      minHeight: hp(80),
      // paddingVertical: hp(3),
      alignItems: "flex-start",
      marginLeft: wp(-5),
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
    centered_view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
      borderRadius: hp(2),
    },
    modalLogo: {
      width: wp(16),
      height: wp(16),
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
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "98%",
      alignSelf: "center",
      marginBottom: hp(1),
    },
    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: 15,
      width: wp(90),
      alignSelf: "center",
    },
    centeredView2: {
      position: "absolute",
      height: hp(70),
      backgroundColor: COLORS.lightGrey2,
      width: wp(90),
      borderRadius: 15,
      // top: '15%',
    },
    uploadButtonStyle: {
      backgroundColor: COLORS.header,
      // marginHorizontal: wp(5),
      justifyContent: "center",
      marginVertical: hp(1),
      minWidth: wp(35),
      minHeight: hp(5),
      alignSelf: "center",
      borderRadius: hp(2),
    },
  });
