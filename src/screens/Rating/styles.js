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
      // backgroundColor: COLORS.white,
    },
    screen: {
      alignItems: "center",
      justifyContent: "center",
    },
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "85%",
      alignSelf: "center",
      // marginBottom: hp(1),
    },
    detailsHeader: { textAlign: "left", width: "85%" },
    submitStyle: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
  });
export default createStyles;
