import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      backgroundColor: COLORS.backGround,
      flex: 1,
    },
    screen: {
      flex: 0.95,
      paddingHorizontal: wp(4),
      paddingTop: hp(0),
      backgroundColor: COLORS.backGround,
    },
    itemFormContainer: {
      backgroundColor: COLORS.transactionsCard,
      borderRadius: wp(3),
      borderWidth: 1,
      marginVertical: hp(0.5),
      borderColor: COLORS.bg,
      padding: wp(1),
      elevation: 2,
    },
    //DROPdOWN
    dropdownCont: {
      alignItems: "flex-start",
    },
    dropDownRow: {
      borderBottomWidth: 1,
    },

    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: "89%",
      height: hp(6),
      elevation: 2,
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      // marginHorizontal: wp(5),
    },
    dropDownBtn2: {
      backgroundColor: COLORS.inputBackGround,
      width: "89%",
      height: hp(6),
      elevation: 2,
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(0),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      marginHorizontal: wp(5),
    },
    dropDownBtnTxt: {
      writingDirection: "rtl",
      textAlign: "left",
      opacity: 0.7,
      color: COLORS.black,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDownTxt: {
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
    collapsBodyCont: {
      backgroundColor: COLORS.transactionsCard,
      marginBottom: hp(1),
      borderRadius: wp(2),
    },
    textInputContainer: { alignSelf: "flex-start", width: "90%" },
    showescrowPeriodStyle: {
      marginLeft: wp(2),
      minWidth: wp(15),
      height: hp(6),
      borderRadius: 5,
      borderWidth: wp(0.4),
      borderColor: COLORS.blue,
      paddingHorizontal: 3,
    },
    transactionInfo2: {
      backgroundColor: COLORS.transactionsCard,
      paddingVertical: hp(0.2),
      paddingHorizontal: 10,
      borderWidth: 0.2,
      borderColor: COLORS.babyBlue3,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    accordionBodyTitleCont: {
      alignItems: "flex-start",
      marginVertical: 2,
    },
  });
export default createStyles;
