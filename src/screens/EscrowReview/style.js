import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    screen: { flex: 1, alignItems: "center", justifyContent: "center" },
    BackTxt: {
      // fontWeight: 'bold',
      marginBottom: hp(3),
    },
    modalText: {
      // paddingHorizontal: 0,
      marginLeft: wp(10),
      marginBottom: hp(2),
    },
    textInputStyle: {
      height: hp(10),
      textAlignVertical: "top",
      width: wp(55),
    },
    mainStyle: {
      // backgroundColor: COLORS.backGround,
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginVertical: 15,
      marginHorizontal: wp(2),
      paddingBottom: 50,
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flexGrow: 1,
    },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.blue,
    },
    closeButton2: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
    closeButtonTxt: {
      color: COLORS.grey,
    },
    thunk: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignContent: "center",
      height: hp(8),
      width: wp(80),
      marginHorizontal: wp(4),
      marginBottom: hp(2),
    },
    notselected: {
      justifyContent: "center",
      alignItems: "center",
      // borderWidth: wp(1),
      // borderColor: COLORS.bg,
      // borderRadius: wp(5),
      height: hp(8),
      width: wp(25),
    },
    selected: {
      justifyContent: "center",
      alignItems: "center",
      height: hp(8),
      width: wp(25),
      borderWidth: wp(0.5),
      borderColor: COLORS.header,
      borderRadius: wp(5),
    },
  });
export default createStyles;
