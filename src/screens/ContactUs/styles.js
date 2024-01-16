import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    FAQScreen: {
      backgroundColor: COLORS.backGround,
      flex: 1,
      paddingBottom: hp(4),
    },
    answerSection: {
      // backgroundColor:'red'
    },

    dropDownContainer: {},
    title: {
      //fontWeight:'bold',
      marginVertical: hp(0.5),
    },
    viewAllTxt: {
      textDecorationLine: "underline",
    },
    body: {
      minHeight: "78%",
      paddingHorizontal: wp(6),
      //backgroundColor:'red'
    },

    //DROPdOWN
    dropdownCont: {
      alignItems: "flex-start",
    },
    dropDownRow: {
      borderBottomWidth: 1,
      backgroundColor: COLORS.inputBackGround,
    },

    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: "100%",
      height: hp(6),
      elevation: 2,
      borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
    },
    dropDownBtnTxt: {
      writingDirection: "rtl",
      textAlign: "left",
      opacity: 0.7,
      //  color:COLORS.headerContent
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDownTxt: {
      //   color:COLORS.headerContent,
      textAlign: "left",
      opacity: 0.7,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDown: {
      borderColor: COLORS.white,
      maxHeight: hp(22),
      elevation: 7,
    },
    //oneQuestion
    oneQContainer: {
      minHeight: "40%",
      // alignItems:'flex-start',
      // justifyContent:'flex-start',
      // textAlign:'flex-start'
    },
    itemFormContainer: {},

    itemFormHeaderContainer: {
      backgroundColor: COLORS.white,
      width: "100%",
      minHeight: hp(6),
      elevation: 2,
      borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
      justifyContent: "center",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp(2),
    },
    answerCont: {
      backgroundColor: COLORS.white,
      paddingVertical: hp(1),
    },
    supportTicket: {
      alignSelf: "flex-end",

      padding: hp(0.5),
      width: wp(35),
      marginVertical: hp(1),
      elevation: 1,
      borderBottomColor: COLORS.bg,
    },
  });
export default createStyles;
