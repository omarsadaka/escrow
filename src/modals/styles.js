import { StyleSheet } from "react-native";
import { wp,hp } from "../utilis/dimensions";


const createStyles = (COLORS) =>
  StyleSheet.create({
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
      height: "80%",
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
    text: {
      marginVertical: hp(4),
      color: COLORS.black,
      // // fontWeight: 'bold',
    },

    //sendOTP
    otp: {
      width: "80%",
      height: 80,
      alignSelf: "center",
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

    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.blue,
    },
    closeButtonTxt: {
      color: COLORS.headerContent,

      // fontWeight: 'bold',
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      // marginVertical:53
    },
  });
export default createStyles;