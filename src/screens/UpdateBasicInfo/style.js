import { StyleSheet } from "react-native";
import { height, hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      marginVertical: hp(-3),
      backgroundColor: COLORS.white,
      borderRadius: wp(3),
      marginHorizontal: wp(8),
      // maxHeight: hp(47),
    },
    container: {
      marginHorizontal: wp(8),
    },
    title: {
      textAlign: "left",
      width: "80%",
      // fontWeight: 'bold',
    },
    itemContainer: {
      backgroundColor: COLORS.white,
      width: "80%",
      alignSelf: "center",
      height: height * 0.075,
      flexDirection: "row",
      marginTop: 20,
      borderRadius: 10,
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
      marginTop: hp(0.2),
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
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.grey,
    },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
    },
  });
export default createStyles;
