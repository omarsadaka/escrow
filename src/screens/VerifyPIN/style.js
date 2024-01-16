import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flex: 1,
      backgroundColor: "black",
      justifyContent: "space-between",
    },
    logo: {
      alignSelf: "center",
      width:wp(45),
      height:hp(33)
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
      marginVertical: hp(3),
    },
    authTypeCon:{
      // width:'83%',
     flexDirection:'row',
     alignItems:'center',
     alignSelf:'center',
     marginTop: hp(10),
    //  justifyContent:'space-between',
    },
    fingerCon: {
      flexDirection: "row",
      alignItems: 'center',
      justifyContent: "center",
      // marginTop: hp(15),
    },
    faceCon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      // marginTop: hp(3),
    },
    social: {
      alignSelf: "center",
      width: 30,
      height: 30,
      // marginHorizontal: 10,
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
      paddingVertical: 15,
      width: "90%",
      alignSelf: "center",
    },
    modalText: {
      paddingHorizontal: 20,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },
    btn2: { width: "50%", alignSelf: "center", marginBottom: hp(3) },
  });
export default createStyles;
