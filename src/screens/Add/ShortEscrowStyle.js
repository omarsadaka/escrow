import { Dimensions, StyleSheet } from "react-native";
import { height, hp, width, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    head: {
      alignSelf: "flex-start",
      //   marginVertical: hp(1),
      marginLeft: hp(2),
    },
    stepIndicator: {
      marginVertical: hp(0.5),

      maxHeight: hp(12),
    },
    stepLabel: {
      fontSize: 10,
      //   maxWidth: wp(13),
      //   bottom: hp(0.3),
      textAlign: "center",
      lineHeight: hp(2),
      color: COLORS.header,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
    },
    stepLabelSelected: {
      fontSize: 10,
      textAlign: "center",
      lineHeight: hp(2),
      color: COLORS.header,
      //   maxWidth: wp(13),
      //   bottom: hp(0.3),
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
    },
    unFinishedLable: {
      fontSize: 10,
      lineHeight: hp(2),
      //   bottom: hp(0.3),
      //   maxWidth: wp(12),
      textAlign: "center",
      color: COLORS.black,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
    },
    formWrapper: {
      flex: 1,
      backgroundColor: COLORS.white,
      marginTop: hp(1),
      elevation: 3,
      // minHeight: height*0.4,
      borderRadius: hp(2),
      width: wp(95),
      alignSelf: "center",
      paddingLeft: wp(2),
      paddingBottom: hp(3),
      marginBottom: hp(1),
    },
    btnContainer: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
      alignItems: "center",
      width: wp(90),
      alignContent: "center",
      marginVertical: hp(1),
    },
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
      // marginVertical: hp(2),
      marginBottom: hp(2),
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
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "90%",
      alignSelf: "flex-start",
      marginBottom: hp(1),
    },
    textInputContainer: { alignSelf: "flex-start", width: "90%" },
    accordionBodyTitleCont: {
      alignItems: "flex-start",
      marginVertical: 2,
    },
    transactionInfo2: {
      backgroundColor: COLORS.transactionsCard,
      paddingVertical: hp(0.2),
      paddingHorizontal: 10,
      borderWidth: 0.2,
      borderColor: COLORS.babyBlue3,
      flexDirection: "row",
      justifyContent: "space-between",
      width: "97%",
    },
    accordionFinalTitle: {
      // fontWeight: '900',
    },
    accordionTitle: {
      // opacity: 0.9,
      // marginVertical: 1,
    },
    checkBox: {
      width: wp(80),
      height: hp(6),
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
      backgroundColor: COLORS.white,
      // alignSelf: "center",
    },
    iconBg: {
      position: "absolute",
      bottom: 0,
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      alignSelf: "center",
      paddingHorizontal: 10,
      paddingVertical: 7,
      backgroundColor: COLORS.white,
      elevation: 4,
    },
    showescrowPeriodStyle: {
      marginLeft: wp(2),
      minWidth: wp(15),
      height: hp(6),
      borderRadius: 5,
      borderWidth: wp(0.4),
      borderColor: COLORS.blue,
      paddingHorizontal: 3,
    },
    checkBoxCon: {
      alignItems: "center",
      flexDirection: "row",
      marginVertical: 4,
    },
    left:{
      left: width*0.05,
      top: height*0.01
    },
    right:{
      right: width*0.05,
      top: height*0.01
    },
    home: {
      width: wp(15),
      height: wp(15),
      backgroundColor: COLORS.blue,
      borderRadius: wp(15) / 2,
      elevation: 3,
      justifyContent: "center",
      alignItems: "center",
      shadowOpacity: 0.2,
      shadowOffset: { height: 1, width: 1 },
    },
    homeCon: {
      width: wp(18),
      height: wp(18),
      backgroundColor: "#f5f5f5",
      marginTop: -hp(5),
      borderRadius: wp(18) / 2,
      justifyContent: "center",
      alignItems: "center",
    },
    modelContainer:{
      width:'90%', 
      height:height*0.55, 
      alignSelf:'center',
      alignItems:'center',
    },
    contentContainer:{
      width:'80%', 
      alignItems:'center',
      shadowOpacity:0.5,
      borderRadius:10, 
      marginTop: height*0.15,
      shadowOffset:{width:0, height:0},
      backgroundColor: COLORS.blue,
      elevation:3,
      paddingVertical:hp(1),
    },
    addImageContainer:{
      width: wp(23),
      height: hp(13),
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10,
      borderColor: COLORS.blue,
      borderWidth:1,
      borderStyle: 'dashed',
      marginTop: hp(1),
      marginBottom:hp(1)
    },
    imageStyle:{
      width: wp(23),
      height: hp(13),
      alignSelf:'center',
      marginHorizontal:2,
      borderRadius:10,
    },
    imageContainer:{
      width:'100%',flexDirection:'row',alignItems:'center',height: hp(15)
    }
  });
export default createStyles;
