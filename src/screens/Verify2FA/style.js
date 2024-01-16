import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: "black",
      justifyContent: "space-between",
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
      marginVertical: hp(3),
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(15),
      borderRadius: wp(2),
      borderWidth: wp(0.3),
      borderColor: COLORS.header,
      margin: 2,
    },
  });
export default createStyles;
