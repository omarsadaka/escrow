import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      backgroundColor: COLORS.bg,
      flexGrow: 1,
      // paddingBottom: hp(15),
      // paddingVertical:hp(10)
    },
    scrollheight: {
      // height:hp(55),
      // width:wp(100),
    },
    scrollheight2: {
      // height: hp(50),
      // width:wp(100),
      paddingBottom: wp(5),
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "100%",
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      overflow: "hidden",
      backgroundColor: COLORS.header,
      height: 80,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    agreementTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: hp(2),
      marginLeft: wp(6),
    },
    icon: {
      marginHorizontal: 10,
    },
    iconMore: {
      // marginHorizontal: 10,
      alignSelf: "center",
    },
    text: {
      alignSelf: "center",
      textAlign: "left",
      height: hp(2),
      marginHorizontal: wp(1),
      marginVertical: hp(1),
    },
    more: {
      textAlignVertical: "center",
      textAlign: "center",
      marginTop: -3,
      // marginVertical: 10,
    },
    text2: {
      // fontWeight: 'bold',
      marginVertical: 10,
    },

    textColored: {
      color: COLORS.blue,
      // fontWeight: 'bold',
      marginVertical: 10,
    },
    title: {
      // fontWeight: 'bold',
    },
    agreeHeader: {
      height: hp(6),
      marginHorizontal: wp(1),
      // width: wp(70),
      justifyContent: "flex-start",
      alignItems: "flex-start",
      alignSelf: "flex-start",
    },
    title2: {
      marginLeft: wp(-55),
    },
    title4: {
      // marginLeft: wp(-48),
    },
    viewTitle: {
      width: wp(80),
      // marginVertical:hp(1),
    },
    agreeDesc: {
      width: wp(70),
      // marginVertical:hp(1),
    },
    addContainer: {
      height: hp(6),
      borderWidth: 1,
      marginHorizontal: hp(2),
      justifyContent: "center",
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 20,
      backgroundColor: COLORS.white,
      width: wp(20),
      flexDirection: "row",
      alignItems: "center",
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },

    underlineStyleBase: {
      width: 50,
      height: 50,
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: "white",
    },

    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: "80%",
      height: 80,
      alignSelf: "center",
    },
    subContainer: {
      width: "80%",
      alignSelf: "center",
      height: "64%",
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 8,
      marginVertical: 20,
      marginTop: 60,
      justifyContent: "center",
      alignItems: "center",
    },
    applicationPinSubContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },

    logo: {
      marginHorizontal: 10,
      alignSelf: "center",
      // width: 25,
      // height: 25,
    },
    keyboard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: 8,
    },
    bioContainer: {
      width: "80%",
      alignSelf: "center",
      borderColor: COLORS.blue,
      borderWidth: 0,
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 8,
      marginVertical: 20,
      paddingVertical: 8,
    },
    agreementItem: {
      width: "90%",
      alignSelf: "center",
      // alignItems: 'center',
      flexDirection: "row",
      backgroundColor: COLORS.aggColor,
      elevation: 1,
      // height: hp(20),
      borderRadius: 20,
      marginVertical: hp(1),
      paddingHorizontal: hp(1),
      paddingVertical: hp(1),
      minHeight:hp(12)

      // paddingBottom: 20,
    },
    agreementContent: {
      width: "75%",
      alignItems: "flex-start",
      justifyContent: "center",
      // flexDirection: "row",
      // marginLeft: wp(1),
    },
    description: {},
    moreSubContainer: {
      alignSelf: "flex-end",
      marginTop: 20,
      marginRight: 20,
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.babyBlue2,
      borderRadius: 20,
      paddingHorizontal: 5,

      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    moreContainer: {
      alignSelf: "flex-end",
      minWidth: "30%",
      minHeight: "8%",
    },

    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      height: "100%",
      backgroundColor: COLORS.white,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: hp(1),

      // marginTop:hp(-10)
    },
    centeredView2: {
      position: "absolute",
      // top: '15%',
    },
    agreementName: {
      width: "90%",
      marginTop: 40,
    },
    agreementInputName: {
      // height: hp(10),
      // textAlignVertical: "top",
      width: "85%",
    },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.grey,
    },
    closeButton2: {
      width: "70%",
      alignSelf: "center",
      marginTop: hp(12),
      borderWidth: 1,
      borderColor: COLORS.grey,
    },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
    },
    logo2: {
      alignSelf: "center",
      width: wp(45),
      height: hp(24),
      marginVertical: hp(0),
    },
    editCon: {
      // flexDirection: "row",
      alignItems: "center",
      height: hp(6),
      justifyContent: "center",
      width: "25%",
    },
    btn2: { width: "40%", alignSelf: "center", marginTop: 20, height: hp(5) },
    centeredView3: {
      backgroundColor: COLORS.white,
      // paddingHorizontal: 5,
      borderRadius: wp(5),
      paddingVertical: hp(5),
      width: wp(80),
      height: hp(65),
    },
    selectStyle: {
      width: wp(90),
      backgroundColor: COLORS.inputBackGround2,
      marginLeft: wp(5),
      borderRadius: wp(5),
      height: hp(6),
      alignItems: "center",
      flexDirection: "row",
      marginBottom: hp(1),
    },
    basicStyle: {
      width: wp(30),
      justifyContent: "space-evenly",
      alignItems: "center",
      flexDirection: "row",
    },
    selectedStyle: {
      flexDirection: "row",
      height: hp(5.5),
      width: wp(30),
      justifyContent: "space-evenly",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(5),
    },
    categoryLogo: {
      width: wp(7),
      height: wp(7),
      marginHorizontal: wp(1),
      borderRadius: wp(3),
    },
    BackTxt3: {
      // fontWeight: 'bold',
      // marginHorizontal: 10,
    },
    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: wp(78),
      height: hp(6),
      borderWidth: wp(0.25),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      marginRight: wp(5),
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
    dropDownRow: {
      borderBottomWidth: 1,
    },
    labledDes: {
      alignItems: "flex-start",
      marginHorizontal: wp(5),
      maxHeight: hp(5),

      bottom: -25,
    },
    labledDes2: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginHorizontal: wp(4),
      maxHeight: hp(5),
      marginVertical: hp(1),
    },
    labledDes4: {
      alignItems: "flex-start",
      marginHorizontal: wp(7),
      maxHeight: hp(5),
      bottom: hp(-6),
      marginTop: hp(-2.5),
    },
    CheckBoxContainer: {
      justifyContent: "center",
      minHeight: "65%",
      paddingTop: hp(1),
    },
    CheckBoxItem: {
      marginVertical: hp(1),
    },
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "88%",
      alignSelf: "center",
      marginBottom: hp(1),
      marginTop: hp(6),
      height: hp(16),
      paddingBottom: hp(2),
    },
    closeCont: {
      alignSelf: "flex-end",
      marginHorizontal: wp(2),
    },
  });
export default createStyles;
