import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      // justifyContent: 'space-around',
      marginVertical: hp(1),
    },
    logo: {
      alignSelf: "center",
      backgroundColor: COLORS.white,
    },
    loadingStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    BackTxt: {
      marginHorizontal: wp(2),
      marginVertical: hp(1),
    },
    errStyle: {
      marginHorizontal: wp(5),
      marginTop: hp(4),
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
    btn2: {
      width: "70%",
      alignSelf: "center",
      marginTop: hp(1),
      marginBottom: hp(2),
    },
    BackTxt3: {
      marginVertical: hp(1),
    },
    imageContainer: {
      height: hp(30),
      width: wp(50),
      // backgroundColor: "red",
      alignSelf: "center",
      alignItems: "center",
      justifyContent: "center",
      marginVertical: hp(2),
      borderWidth: wp(0.2),
      borderColor: COLORS.black,
      borderRadius: wp(3),
    },
    profileStyle: {
      borderWidth: wp(0.3),
      borderColor: COLORS.header,
      alignSelf: "center",
      borderRadius: wp(50),
      width: wp(42),
      height: hp(22),
      marginBottom: hp(5),
    },
    camera: {
      backgroundColor: COLORS.header,
      alignItems: "center",
      justifyContent: "center",
      width: wp(8),
      height: hp(4),
      borderRadius: hp(50),
      marginLeft: wp(-30),
      marginTop: hp(-10),
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
        marginBottom: hp(2),
        borderWidth: wp(0.28),
        borderColor: COLORS.header,
        borderRadius: wp(2),
        // marginHorizontal: wp(5),
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
  });
export default createStyles;
