import { StyleSheet } from "react-native";
import { hp, wp } from "../../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      paddingVertical: hp(3),
      paddingHorizontal: wp(5),
      flex: 1,
    },
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      // justifyContent: 'space-around',
    },
    withdrawNow: {
      alignSelf: "flex-start",
      minWidth: "35%",
      marginVertical: hp(2),
      borederWidth: 1,
      borderColor: "grey",
      elevation: 1,
      minHeight: hp(5),
      justifyContent: "center",
      borderRadius: 20,
    },
    subCont: {
      minHeight: "40%",
      alignItems: "flex-start",
    },
    methodsCont: {
      alignItems: "flex-start",
      marginVertical: hp(2),
    },
    btn: {},
    previewContainer1: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginVertical: hp(10),
    },
    previewSubContainer1: {
      alignItems: "flex-start",
    },
    previewSubContainer2: {
      alignItems: "flex-end",
    },
  });
export default createStyles;
