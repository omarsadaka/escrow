import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      justifyContent: "space-around",
    },
    logo: {
      alignSelf: "center",
      width: wp(45),
      height: hp(33),
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
    },
    mobileText: {
      alignSelf: "flex-start",
      textAlign: "left",
      marginHorizontal: "6%",
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
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
    passRulesContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      backgroundColor: COLORS.babyBack,
      width: "80%",
      alignSelf: "center",
      padding: 10,
      borderRadius: 9,
    },
    conditionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-start",
      width: "80%",
      alignSelf: "center",
      padding: 10,
      borderRadius: 9,
    },
    centeredView4: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: "hidden",
      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
    },
    termsHeader: {
      borderBottomColor: COLORS.lightGrey,
      borderBottomWidth: 0.8,
      marginVertical: 2,
      // paddingVertical: 15,
      width: "100%",
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },
    scrollModal: {
      backgroundColor: COLORS.lightGrey2,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: 15,
      width: "95%",
      alignSelf: "center",
    },
    centeredView2: {
      position: "absolute",
      height: "95%",
    },
    modalText: {
      paddingHorizontal: 20,
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      marginVertical: 10,
    },
    btn: { width: "70%", alignSelf: "center", marginTop: 20 },

    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.blue,
    },
    closeButtonTxt: {
      color: COLORS.grey,

      // fontWeight: 'bold',
    },
    validateContainer: {
      flex: 1,
      alignItems: "center",
      // justifyContent: "center",
      marginTop: "10%",
    },
  });

export default createStyles;
