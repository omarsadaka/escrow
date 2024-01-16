import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      backgroundColor: COLORS.backGround,
      flex: 1,
    },
    screen: {
      flex: 1,
      paddingHorizontal: wp(8),
      paddingVertical: hp(1),
      backgroundColor: COLORS.backGround,
    },
    itemFormContainer: {
      backgroundColor: COLORS.transactionsCard,
      borderRadius: wp(3),
      borderWidth: 1,
      marginVertical: hp(1),
      borderColor: COLORS.bg,
      // padding: wp(1),
      elevation: 2,
    },
    btn: {
      width: "100%",
      borderWidth: 0,
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 1,
    },
    btnC: {
      width: "45%",
      marginVertical: hp(2),
    },
    shoppingFeeBox: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: hp(2),
      //marginHorizontal:wp(4),
      borderWidth: 0.5,
      borderColor: COLORS.grey,
      paddingHorizontal: wp(5),
      minHeight: hp(5),
      borderRadius: 10,
    },

    //DROPdOWN
    dropdownCont: {
      alignItems: "flex-start",
    },
    dropDownRow: {
      borderBottomWidth: 1,
    },

    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: "89%",
      height: hp(6),
      elevation: 2,
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      // marginHorizontal: wp(5),
    },
    dropDownBtn2: {
      backgroundColor: COLORS.inputBackGround,
      width: "89%",
      height: hp(6),
      elevation: 2,
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(0),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      marginHorizontal: wp(5),
    },
    dropDownBtnTxt: {
      writingDirection: "rtl",
      textAlign: "left",
      opacity: 0.7,
      color: COLORS.black,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDownTxt: {
      textAlign: "left",
      opacity: 0.7,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDown: {
      borderColor: COLORS.white,
      maxHeight: hp(22),
      elevation: 7,
    },
    //view
    itemFormHeaderContainer: {
      flexDirection: "row-reverse",
      alignItems: "center",
      minHeight: hp(5),
    },
    btnsContainer: {
      flexDirection: "row",
      maxWidth: "100%",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    plusCont: {
      backgroundColor: COLORS.blue,
      borderRadius: wp(10),
      marginVertical: hp(5),
      alignItems: "center",
      justifyContent: "center",
      width: wp(13),
      height: wp(13),
      alignSelf: "flex-end",
    },
    iconsCont: {
      paddingHorizontal: wp(5),
      marginRight: wp(10),
      // backgroundColor: 'red',
    },
    iconsCont2: {
      paddingHorizontal: wp(2),
      marginRight: wp(1),
      // backgroundColor: 'red',
      width: wp(62),
    },
    name: {
      marginLeft: wp(-20),
      // width: wp(40),
      // backgroundColor: 'red',
      // alignSelf: 'center',
    },
    selectedAgreements: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    //changeRole

    centeredViewAdd: {
      backgroundColor: COLORS.lightGrey2,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: hp(1),
      width: "95%",
      alignSelf: "center",
    },
    centeredView2Add: {
      position: "absolute",
      height: hp(61),
    },
    headerCon: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: wp(3),
    },
    //view
    btnsContainer: {
      // flexDirection: "row",
      width: "100%",
      // flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp(2),
    },
    plusCont: {
      backgroundColor: COLORS.blue,
      borderRadius: wp(10),
      marginVertical: hp(5),
      alignItems: "center",
      justifyContent: "center",
      width: wp(13),
      height: wp(13),
      alignSelf: "flex-end",
    },
    iconsCont: {
      paddingHorizontal: wp(1),
    },
    name: {
      width: "100%",
      // backgroundColor:'red',
      alignSelf: "center",
    },
    selectedAgreements: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    //changeRole

    bg: {
      flexGrow: 0.8,
      //flex:1
      // backgroundColor: COLORS.backGround,
      // justifyContent: 'space-around',
    },
    loadingStyle: {
      height: hp(10),
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
    },

    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
    },
    btn2: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
    translate: {
      width: "50%",
    },
    translateText: {
      textAlign: "center",
    },

    //modal
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.ModalBg, //change
      paddingHorizontal: wp(3),
      borderRadius: 15,
      paddingBottom: hp(3),
      paddingTop: hp(1),
      height: "30%",
      width: "90%",

      position: "absolute",

      // top: '%',
      //
    },
    centeredView2: {
      backgroundColor: COLORS.ModalBg, //change
      paddingHorizontal: wp(3),
      borderRadius: 10,
      paddingBottom: hp(3),
      paddingTop: hp(1),
      // height: "40%",
      width: "90%",
      position: "absolute",
      // top: '%',
      //
    },
    termsModal: {
      position: "absolute",
      height: "95%",
    },
    scrollModal: {
      backgroundColor: COLORS.lightGrey2,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: 15,
      width: "95%",
      alignSelf: "center",
    },
    title: {
      // fontWeight: 'bold',
    },
    agreementName: {
      width: "88%",
      marginTop: hp(4),
    },
    title2: {
      // marginLeft: wp(-62),
      alignSelf: "flex-start",
      width: "90%",
      textAlign: "left",
    },
    labledDes: {
      alignItems: "flex-start",
      marginHorizontal: wp(3),
      maxHeight: hp(5),
      bottom: -25,
    },
    agreementDes: {
      // paddingVertical: hp(2),
      // height: hp(10),
      marginTop: hp(6),
      width: "88%",
      // paddingHorizontal: wp(1),
    },
    agreementInputDes: {
      // paddingVertical: hp(4),
      height: hp(10),
      // // maxHeight: '60%',
      textAlignVertical: "top",
      // marginHorizontal: wp(2),
      width: "85%",
      // // backgroundColor:'red',
      // // flex: 1,
      // flexWrap: "wrap",
    },
    closeButton: {
      width: "70%",
      alignSelf: "center",
      marginTop: 10,
      borderWidth: 1,
      borderColor: COLORS.grey,
    },
    closeButtonTxt: {
      alignSelf: "center",
      // fontWeight: 'bold',
      // marginLeft: wp(-18),
    },
    btnAG: { width: "70%", alignSelf: "center", marginTop: 20 },
    modalContent1: {
      height: "70%",
    },
    headerModalCont: {
      minHeight: "20%",
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 0.5,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    bodyModalCont: {
      paddingVertical: hp(2),
      marginBottom: hp(2),
    },
    modalBtnsCont: { alignSelf: "center" },
    modalBtn: {
      width: "45%",
    },
    modalBtn2: {
      width: "70%",
      alignSelf: "center",
      marginBottom: hp(2),
    },
    modalTxtCont: {
      minHeight: "30%",
      // justifyContent:'flex-start'
    },
    centeredViewAg: {
      backgroundColor: COLORS.lightGrey2,
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: hp(2),
      width: "90%",
      alignSelf: "center",
    },
    centeredView2Ag: {
      position: "absolute",
      height: hp(80),
    },
    addModalCon: {
      backgroundColor: COLORS.lightGrey2,
      width: "90%",
      height: hp(80),
      borderRadius: wp(3),
      paddingVertical: hp(2),
    },
    checkBox: {
      width: wp(40),
      marginLeft: wp(10),
      height: hp(5),
    },
    buttonStyle: {
      height: hp(6),
      width: "60%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(3),
      alignSelf: "center",
      marginTop: hp(1),
    },
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "80%",
      alignSelf: "center",
      marginBottom: hp(1),
    },
    progressCon: {
      height: hp(1),
      width: "95%",
      alignSelf: "center",

      // backgroundColor: "red",
      marginTop: hp(0.5),
      marginBottom: hp(0.5),
    },
    progressCounter: {
      marginLeft: wp(5),
      width: wp(20),
      height: hp(1),
      // backgroundColor: "green",
    },
    //terms modal
    termsHeader: {
      borderBottomColor: COLORS.lightGrey,
      borderBottomWidth: 0.8,
      marginVertical: 2,
      // paddingVertical: 15,
      width: "100%",
    },
    termsHeader: {
      borderBottomColor: COLORS.lightGrey,
      borderBottomWidth: 0.8,
      marginVertical: 2,
      // paddingVertical: 15,
      width: "100%",
    },
    selectStyle: {
      width: wp(100),
      height: hp(6),
      justifyContent: "space-around",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: hp(1),
    },
    basicStyle: {
      width: wp(50),
      justifyContent: "center",
      alignItems: "center",
      borderWidth: wp(0.1),
      borderColor: COLORS.loginTab,
    },
    selectedStyle: {
      width: wp(50),
      justifyContent: "center",
      alignItems: "center",
      borderTopWidth: wp(0.5),
      borderTopColor: COLORS.loginTab,
    },
    BackTxt3: {
      marginVertical: hp(1),
    },
    conSty: {
      height: hp(25),
    },
    startBtn: {
      width: "30%",
      alignSelf: "center",
      marginTop: hp(1),
    },
    head: {
      alignSelf: "flex-start",
      marginVertical: hp(1),
      marginLeft: hp(2),
    },
  });
export default createStyles;
