import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      justifyContent: "space-between",
      padding: "5%",
      paddingVertical: "20%",
    },
    logo: {
      alignSelf: "center",
      backgroundColor: COLORS.white,
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: 10,
      // // fontWeight: 'bold',
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
      marginVertical: 10,
    },
    quickSignContainer: {
      width: "80%",
      alignSelf: "center",
      flexDirection: "row",
      justifyContent: "space-between",
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      marginVertical: 10,
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(18),
      borderRadius: wp(5),
      borderWidth: wp(0.5),
      borderColor: COLORS.header,
      marginLeft: wp(1),
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },
    skipContainer: {
      height: 50,
      justifyContent: "center",
      alignSelf: "center",
      textAlign: "center",
    },
    translate: {
      width: "50%",
    },
    translateText: {
      textAlign: "center",
    },
    underlineStyleBase: {
      width: wp(13),
      height: hp(8),
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: COLORS.inputBackGround,

      // borderBottomWidth: 1,
    },

    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: "95%",
      height: 80,
      alignSelf: "center",
      backgroundColor: COLORS.white,
    },
  });
export default createStyles;
