import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    itemContainer: {
      width: wp(90),
      backgroundColor: COLORS.white,
      elevation:3,
      shadowOpacity:0.3,
      shadowOffset:{height:1,width:1},
      alignSelf:'center',
      paddingHorizontal: wp(2),
      paddingVertical: hp(1),
      borderRadius:12,
      marginVertical:4
    },
    walletCharge: {
      width: wp(90),
      flexDirection:'row',
      alignItems: "center",
      alignSelf:'center',
      marginVertical:hp(2),
      borderRadius:12,
      backgroundColor: '#B4C5E460',
      paddingVertical:hp(1)
    },
  });
export default createStyles;
