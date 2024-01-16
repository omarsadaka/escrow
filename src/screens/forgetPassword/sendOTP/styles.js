import {StyleSheet} from 'react-native';
import { hp, wp } from '../../../utilis/dimensions';

const createStyles = (COLORS) =>
  StyleSheet.create({
    logo: {
      alignSelf: "center",
    },
    // text: {
    //   alignSelf: 'center',
    //   textAlign: 'center',
    // },
    // text2: {
    //   // textAlign: 'left',
    //   // fontWeight: 'bold',
    // },

    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      marginVertical: 53,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },

    translate: {
      width: "50%",
    },
    translateText: {
      textAlign: "center",
    },
    borderStyleBase: {
      width: 30,
      height: 45,
    },

    borderStyleHighLighted: {
      borderColor: "#03DAC6",
    },

    underlineStyleBase: {
      width: 30,
      height: 45,
      borderWidth: 0,
      borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
      borderColor: "#03DAC6",
    },
    //modal
    //modal

    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.ModalBg, //change
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: hp(1),
      height: "90%",
      width: "90%",
      position: "absolute",

      // top: '%',
      //
    },
    modalContent1: {
      justifyContent: "center",
      height: "75%",
    },

    //sendOTP
    otp: {
      width: "90%",
      height: "30%",
      alignSelf: "center",
      //  marginHorizontal :hp(5)
      // marginBottom:hp(10)
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
      borderColor: COLORS.grey,
    },
    closeButtonTxt: {
      color: COLORS.white,
      // fontWeight: 'bold',
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(15),
      borderRadius: wp(2),
      borderWidth: wp(0.3),
      borderColor: COLORS.header,
      margin:2
    },
  });
export default createStyles;
