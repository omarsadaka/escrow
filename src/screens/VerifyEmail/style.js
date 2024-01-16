import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.bg,
      // borderRadius: wp(3),
      justifyContent: "space-between",
      height: "100%",
      paddingBottom: 10,
      // maxHeight: hp(47),
    },
    container: {
      marginHorizontal: wp(8),
    },
    title: {
      textAlign: "center",
      width: "80%",
      // fontWeight: 'bold',
    },
    itemContainer: {
      backgroundColor: COLORS.white,
      width: "80%",
      alignSelf: "center",
      height: 60,
      flexDirection: "row",
      marginTop: 20,
      // borderRadius: 10,
      overflow: "hidden",
    },
    itemLeft: {
      width: "15%",
      paddingTop: 8,
      alignItems: "center",
    },
    itemCenter: {
      width: "70%",
      paddingTop: 10,
      alignItems: "flex-start",
      paddingHorizontal: 10,
    },
    itemText: {},
    itemSubText: {
      marginTop: 10,
    },
    itemRight: {
      width: "15%",
      justifyContent: "center",
      alignItems: "center",
    },
    passwordTitle: {
      textAlign: "left",
      width: "80%",
      // fontWeight: 'bold',
    },
    btn: { width: "70%", alignSelf: "center", marginTop: hp(1) },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: hp(2),
      borderWidth: 1,
      borderColor: COLORS.grey,
      marginBottom: hp(3),
    },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
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

      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
    },
    centeredView2: {
      position: "absolute",
      // top: '15%',
    },
    modalText: {
      paddingHorizontal: 20,
    },
    textColored: {
      // color: COLORS.blue,
      // fontWeight: '500',
      marginVertical: 10,
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
      height: 80,
      alignSelf: "center",
      backgroundColor: COLORS.bg,
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(1),
    },
    skipContainer: {
      height: 50,
      justifyContent: "center",
      alignSelf: "center",
      textAlign: "center",
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(15),
      borderRadius: wp(4),
      borderWidth: wp(0.5),
      borderColor: COLORS.header,
      marginLeft: wp(1),
      height: hp(5),
    },
  });
export default createStyles;
