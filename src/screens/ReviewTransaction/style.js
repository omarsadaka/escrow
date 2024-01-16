import { Dimensions, StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flexGrow: 0.9,
      //paddingBottom: 30,
      backgroundColor: COLORS.backGround,
      height: hp(80),
    },
    accordionContainer: {
      borderWidth: 0.5,
      paddingHorizontal: 10,
      borderColor: COLORS.babyBlue,
      backgroundColor: COLORS.transactionsCard,
    },

    accordionAgreementTitle: {
      width: wp(90),
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: COLORS.agreementBg,
      // paddingHorizontal: 10,
      paddingVertical: hp(1),
    },
    detailsCont: {
      // width:'100%',
      flex: 1,
      marginVertical: 15,
      backgroundColor: COLORS.transactionsCard,
      borderRadius: wp(2),
    },
    accordionContainer: {
      borderWidth: 0.5,
      paddingHorizontal: 10,
      marginVertical: 5,
      borderColor: COLORS.babyBlue,
      backgroundColor: COLORS.transactionsCard,
      borderRadius: wp(2),
    },
    accordionTitleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    accordionTitle: {
      // opacity: 0.9,
      // marginVertical: 1,
    },
    accordionTitle2: {
      opacity: 0.9,
      marginVertical: 1,
      width: "70%",
      marginLeft: wp(-25),
    },
    cardSubCont2: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 7,
      // marginHorizontal:wp(2),
      borderRadius: wp(2),
    },
    transactionInfo: {
      backgroundColor: COLORS.transactionsInfoBg, //
      // fontWeight: 'bold',
      minWidth: "28%",
      // minHeight:30,
      borderRadius: 10,
      marginVertical: 2,
      paddingVertical: 5,
    },
    collapsBodyCont: {
      backgroundColor: COLORS.transactionsCard,
      paddingBottom: 15,
      // minHeight:400,
    },
    accordionBody: {
      width: "67%",
      alignSelf: "center",
    },
    accordionHeader: {
      flexDirection: "row",
    },
    accordionHeaderCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: hp(2),
      paddingVertical: hp(1),
      elevation: 1,
      borderBottomColor: COLORS.grey,
      width: wp(90),
      paddingHorizontal: wp(2),
      borderRadius: hp(2),
      alignSelf: "center",
    },
    transactionInfo2: {
      backgroundColor: COLORS.transactionsCard,
      paddingVertical: 7,
      paddingHorizontal: 10,
      borderWidth: 0.2,
      borderColor: COLORS.babyBlue3,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
    },
    accordionBodyTitleCont: {
      alignItems: "flex-start",
      marginVertical: 2,
    },
    accordionFinalTitle: {
      // fontWeight: '900',
    },
    agreementBodyCont: {
      width: wp(91.6),
      paddingHorizontal: 10,
      backgroundColor: COLORS.proTxt,
      paddingVertical: 10,
      borderBottomLeftRadius: wp(5),
      borderBottomRightRadius: wp(5),
    },
    containerStyle: {
      width: wp(80),
      marginLeft: wp(-2),
    },
    notifycon: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: wp(90),
      marginLeft: wp(1),
      marginVertical: hp(2),
    },
    notifycon2: {
      justifyContent: "center",
      alignItems: "flex-start",
      width: wp(88),
      // marginLeft: wp(1),
      marginVertical: hp(2),
    },
    switch: {
      marginLeft: wp(20),
    },
    cardCont1: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
    },
    cardSubCont1: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      marginHorizontal: 10,
      height: hp(7),
      width: wp(13),
      borderRadius: wp(50),
      borderColor: COLORS.header,
      // borderWidth: wp(0.3),
    },
    txtSubCont1: {
      alignItems: "flex-start",
      justifyContent: "flex-start",
      height: hp(8),
    },
    nameTxt: {
      // fontWeight: 'bold',
    },
    typeContainer: {
      flexDirection: "row",
    },
    typeTxt: {
      marginHorizontal: 5,
    },
    transactionsCurrTxt: {
      // fontWeight: 'bold',
      marginRight: wp(5),
      marginTop: hp(3),
    },
    headerStyle2: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: hp(12),
      marginHorizontal: wp(4),
    },
    BackTxt3: {
      // fontWeight: 'bold',
      width: wp(90),
      marginVertical: hp(3),
      textAlign:'left'
    },
    logo: {
      alignSelf: "center",
      width: wp(45),
      height: hp(24),
    },
    btn2: {
      width: "80%",
      alignSelf: "center",
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.8)",
      flex: 1,
    },
    centeredView2Ag: {
      borderRadius: hp(3),
      height: hp(75),
      backgroundColor: COLORS.white,
      width: wp(80),
    },
    buttonStyle: {
      height: hp(6),
      width: "60%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(3),
      marginBottom: hp(4),
      alignSelf: "center",
      marginBottom: hp(2),
    },
    qrStyle: {
      width: wp(80),
    },
    buttonTouchable: {
      marginTop: 15,
    },
    progressCon: {
      height: hp(1),
      width: wp(100),
      // backgroundColor: "red",
      marginTop: hp(0.5),
      marginBottom: hp(0.5),
    },
    progressCounter: {
      height: hp(1),
      width: "100%",
      backgroundColor: "green",
    },
    shareContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent:'space-between',
      width: wp(90),
      marginHorizontal: wp(5),
      marginBottom: hp(3),
      // marginLeft: wp(5),
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
      borderRadius: hp(2),
    },
    modal2: {
      width: "90%",
      height: hp(55),
      backgroundColor: COLORS.white,
      borderRadius: hp(2),
      alignItems:'center'
    },
    modalHeader: {
      width:'94%',
      flexDirection: "row",
      marginVertical: hp(3),
      justifyContent:'flex-end'
    },
    close2: {
      marginLeft: wp(40),
    },
    row:{
      width:'60%', alignItems:'center',
      marginTop:hp(6),
      justifyContent:'space-between',
      flexDirection:'row'
    }
  });
export default createStyles;
