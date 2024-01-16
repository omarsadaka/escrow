import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    screen: { flex: 1, alignItems: "center", justifyContent: "center" },
    transactionsHeader: {
      flexDirection: "row",
      //backgroundColor:'red',
      width: "50%",
      //  justifyContent:'space-evenly',
      height: "60%",
      alignItems: "center",
      paddingHorizontal: 20,
    },
    headerNotification: {
      // backgroundColor:'red',
      width: "50%",
      height: "60%",
      alignItems: "flex-end",
      justifyContent: "center",
      paddingHorizontal: 18,
    },
    txtHeaderContainer: {
      flexDirection: "row",
    },
    BackTxt: {
      textAlign:'left',
      flex:1,
    },
    mainStyle: {
      width:'100%',
      // backgroundColor: COLORS.red,
      justifyContent: "center",
      alignSelf: "center",
      // marginVertical: 15,
      // marginHorizontal: 15,
      paddingBottom: 50,
    },
    switch: {
      // marginRight: wp(20),
    },
    faceView: {
      height: hp(8),
      backgroundColor: COLORS.inputBackGround2,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: hp(1),
      borderRadius: 10,
      width: wp(90),
    },
    languageView: {
      height: hp(15),
      backgroundColor: COLORS.inputBackGround2,
      // flexDirection: 'row',
      alignItems: "flex-start",
      justifyContent: "flex-start",
      marginVertical: hp(1),
      borderRadius: 10,
      width: wp(90),
    },
    textView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    textView2: {
      marginVertical: 15,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    faceStyle: {
      // fontWeight: '500',
      marginHorizontal: 10,
    },
    logo: {
      marginHorizontal: 10,
      width: 25,
      height: 25,
      // resizeMode: "contain",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
    },
    row2: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: wp(20),
    },
    icon: {
      marginHorizontal: 10,
    },
    notificationStyle: {
      flexDirection: "row",
      justifyContent: "space-around",
      width: wp(70),
      alignItems: "center",
      marginLeft: wp(6),
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flexGrow: 1,
    },

    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: "hidden",
      borderColor: COLORS.black,
      borderWidth: 1,
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
    loadingStyle: {
      justifyContent: "center",
      alignItems: "center",
      flex: 1,
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
      width: "90%",
      height: hp(12),
      alignSelf: "center",
      backgroundColor: COLORS.white,
    },
    colorItem:{
      width: wp(7),
      height: wp(7),
      borderRadius: wp(7)/2
    },
    colorThemeCon:{
      width:'90%', alignItems:'center', alignSelf:'center', flexDirection: "row"
    },
    colorItemCon:{
      width: wp(9),
      height: wp(9),
      borderRadius: wp(9)/2,
      borderColor: COLORS.blue,
      alignItems:'center',
      justifyContent:'center',
      marginHorizontal:5
    }
  });
export default createStyles;
