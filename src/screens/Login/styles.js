import { StyleSheet } from "react-native";
import { hp, width, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: "black",
      justifyContent: "space-between",
    },
    logo: {
      alignSelf: "center",
      width:wp(70),
      height:hp(33)
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(1),
    },
    versionStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: hp(2),
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
    },
    text3: {},
    conSty: {
      height: hp(30),
    },
    quickSignContainer: {
      width: "80%",
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    rememberContainer: {
      width: '80%',
      alignSelf: "center",
      alignItems:'center',
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: hp(1),
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
    },
    keyboardText: {
      color: COLORS.blue,
      // fontWeight: '500',
      padding: 15,
      paddingHorizontal: 25,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: hp(6),marginBottom:hp(1) },
    skipContainer: {
      height: 50,
      justifyContent: "center",
      alignSelf: "center",
      textAlign: "center",
    },
    translate: {
      width: "50%",
    },
    langContainer: {
      width: "50%",
      alignSelf:'center',
      alignItems:'center',
      paddingVertical:3,
      paddingHorizontal:2,
      flexDirection:'row',
      borderRadius:5,
      borderColor: COLORS.blue,
      borderWidth:1
    },
    translateText: {
      textAlign: "center",
      width: "83%",
    },
    socialContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
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
      backgroundColor: COLORS.backGround, //change
      paddingHorizontal: wp(5),
      borderRadius: 15,
      width: "90%",
      paddingVertical: 50,
      // height:'80%',
      position: "absolute",
    },
    modalContent: {
      minHeight: "70%",
      justifyContent: "center",
      alignItems: "center",
    },
    modalContent1: {
      minHeight: "30%",
    },
    applicationPin: {
      width: "100%",
      alignSelf: "center",
      // height:"74%",
      borderColor: COLORS.blue,
      borderWidth: 1,
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 8,
      // marginVertical: 10,
    },
    applicationPinSubContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    underlineStyleBase: {
      width: 50,
      height: 50,
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: COLORS.white,
    },

    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: "90%",
      height: 80,
      alignSelf: "center",
    },
    keyboard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginVertical: 10,
    },
    keyboardDelete: {
      position: "absolute",
      bottom: 8,
      right: 25,
    },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.grey,
      backgroundColor: COLORS.white,
    },
    pinButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.grey,
      // backgroundColor:COLORS.white,
    },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
    },
    row2: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: wp(20),
    },
    icon: {
      marginHorizontal: 10,
    },
    selectStyle: {
      width: wp(100),
      height: hp(6),
      // backgroundColor: 'red',//COLORS.inputBackGround2
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: hp(1),
      // marginHorizontal: wp(8),
      // borderRadius: wp(5),
      // borderTopWidth: wp(0.5),
      // borderTopColor: COLORS.header,
    },
    basicStyle: {
      width: wp(50),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: wp(0.1),
      borderColor: COLORS.loginTab,
      // borderRadius: wp(5),
    },
    selectedStyle: {
      width: wp(50),
      justifyContent: "center",
      alignItems: "center",
      borderTopWidth: wp(0.5),
      borderTopColor: COLORS.loginTab,
      // backgroundColor: COLORS.header,
      // borderRadius: wp(5),
    },
    BackTxt3: {
      // fontWeight: 'bold',
      // marginHorizontal: 10,
      marginVertical: hp(1),
    },
    supportIcon:{
      position:'absolute',
      top: hp(7),
      right: wp(4),
      padding:8
    }
  });
export default createStyles;
