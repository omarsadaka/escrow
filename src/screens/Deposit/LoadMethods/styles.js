import { StyleSheet } from "react-native";
import { hp, wp } from "../../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      // justifyContent: 'space-around',
    },
    loadingStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    BackTxt: {
      marginHorizontal: wp(2),
      marginVertical: hp(1),
    },
    errStyle: {
      marginHorizontal: wp(5),
      marginTop: hp(4),
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
    itemContainer: {
      //   flex: 1,
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginVertical: hp(1),
      width: "90%",
      borderRadius: wp(5),
      paddingLeft: wp(2),
      borderWidth: wp(0.5),
      borderColor: COLORS.header,
    },
    innerContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    innerText: {
        marginLeft: wp(1),
    },
    headerStyle: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: wp(5),
    },
  });
export default createStyles;
