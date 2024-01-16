import { StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { hp, wp } from "../../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      // flex: 1,
      backgroundColor: "red",
      //   justifyContent: "space-between",
      //   alignSelf: "center",
      //   width: wp(100),
      //   height: hp(30),
    },
    logo: {
      alignSelf: "center",
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(1),
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
    },
    underlineStyleBase: {
      width: wp(12),
      height: hp(6),
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: COLORS.inputBackGround,
    },
    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: "80%",
      height: hp(12),
      alignSelf: "center",
      backgroundColor: COLORS.white,
      // marginVertical: hp(1),
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(15),
      borderRadius: wp(2),
      borderWidth: wp(0.3),
      borderColor: COLORS.header,
      margin: 2,
    },
    fingerCon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: hp(30),
    },
    social: {
      alignSelf: "center",
      width: 30,
      height: 30,
      marginHorizontal: 10,
      resizeMode: "contain",
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: "hidden",

      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
    },
    modalText: {
      paddingHorizontal: 20,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },
    dropDownRow: {
      borderBottomWidth: 1,
    },

    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: "95%",
      height: hp(6),
      // elevation: 2,
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      // marginRight:wp(-1),
    },
    dropDownBtnTxt: {
      writingDirection: "rtl",
      textAlign: "left",
      opacity: 0.7,
      color: COLORS.black,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: RFValue(14),
    },
    dropDownTxt: {
      textAlign: "left",
      opacity: 0.7,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: RFValue(14),
    },
    dropDown: {
      borderColor: COLORS.white,
      maxHeight: hp(22),
      elevation: 7,
    },
    closeButton: {
      width: wp(50),
      alignSelf: "center",
      marginTop: hp(30),
    },
    closeButton1: {
      width: wp(50),
      alignSelf: "center",
      marginTop: hp(5),
    },
    closeButton2: {
      width: wp(50),
      alignSelf: "center",
      marginTop: hp(10),
    },
  });
export default createStyles;
