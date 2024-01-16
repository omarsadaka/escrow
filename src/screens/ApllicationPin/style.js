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
      marginTop: 0,
      // maxHeight: hp(47),
    },
    container: {
      marginHorizontal: wp(8),
    },
    title: {
      textAlign: "left",
      width: "80%",
      marginBottom: hp(5),
      // fontWeight: 'bold',
    },
    btn: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      marginBottom: hp(3),
    },
  });
export default createStyles;
