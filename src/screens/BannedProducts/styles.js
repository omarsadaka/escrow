import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bannedContainer: {
      backgroundColor: COLORS.backGround,
      flex: 1,
    },
    header: {
      marginBottom: hp(2),
    },
    itemContainer: {
      width: "90%",
      alignItems: "flex-start",
      justifyContent: "center",
      backgroundColor: COLORS.white,
      alignSelf:'center',
      paddingHorizontal: wp(2),
      borderRadius:5
    },
    screen: {
      width: wp(98),
      alignItems: "center",
      justifyContent: "center",
    },
  });
export default createStyles;
