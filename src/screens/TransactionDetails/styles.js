import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { COLORS } from "../../constants/colors";
import { hp, wp } from "../../utilis/dimensions";
import { color } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flex: 1,
      //paddingBottom: 30,
      backgroundColor: COLORS.backGround,
    },
    tabCont: {
      width: "100%",
      height: height*0.06,
      marginVertical: 10,
      justifyContent: "space-around",
      flexDirection: "row",
      borderRadius: hp(2),
      backgroundColor: COLORS.transactionsCard,
    },

    detailsCont: {
      flexGrow: 1,
      minHeight: hp(25),
      // maxHeight: hp(48),
      borderRadius: hp(2),
      width: wp(95),
      alignSelf: "center",
      // paddingHorizontal:wp(1)
    },

    chatCont: {
      width: "100%",
      height: "77%",
      backgroundColor: COLORS.transactionsCard,
    },
    //accordion
    cardSubCont2: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 7,
    },

    accordionTitleContainer: {
      flexDirection: "row",
      // justifyContent: "space-between",
      // backgroundColor: COLORS.red,
    },
    accordionTitle: {
      opacity: 0.9,
      marginVertical: 1,
      marginHorizontal: wp(1),
    },
    accordionTitleEdit: {
      marginHorizontal: wp(1),
    },

    accordionFinalTitle: {
      marginHorizontal: wp(1),
    },
    aggIcon: { flexDirection: "row", alignItems: "center" },
    accordionBodyTitleCont: {
      alignItems: "center",
      marginVertical: 2,
      flexDirection: "row",
    },
    agreementBodyCont: {
      paddingHorizontal: 10,
      backgroundColor: COLORS.agreementBg,
      paddingVertical: 10,
      marginHorizontal:wp(1),
      elevation:2,
      borderRadius:8,
      shadowOpacity:0.2,
      marginTop:2,
    },
    btnContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      paddingVertical: 20,
      backgroundColor: COLORS.transactionsCard,
      marginTop:10
    },
    btnContainer2: {
      justifyContent: "space-around",
      flexDirection: "row",
      backgroundColor: COLORS.transactionsCard,
      marginVertical: hp(1),
      shadowColor: COLORS.blue,
      borderRadius: 6,
      paddingHorizontal: wp(3),
      marginHorizontal:1
    },
    btnContainer3: {
      backgroundColor: COLORS.transactionsCard,
      marginVertical: hp(1),
      shadowColor: COLORS.blue,
      borderRadius: 6,
    },
    btn: {
      width: "40%",
      marginVertical:10
      // alignSelf: 'center',
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
      paddingHorizontal: 5,
      borderRadius: 10,
      paddingVertical: 15,
      height: 550,
      width: "90%",
      position: "absolute",
      top: "3%",
    },
    modalContent1: {
      height: "70%",
    },

    settlementDes: {
      padding: 10,
      borderRadius: 7,
      width: "95%",
      alignSelf: "center",
      // textAlignVertical: 'top',
      backgroundColor: COLORS.settlementDes,
    },
    closeButton: {
      width: "80%",
      alignSelf: "center",
      marginTop: 20,
      borderWidth: 1,
      borderColor: COLORS.grey,
    },
    couponButton: {
      width: "30%",
      height: hp(6),
      // alignSelf: "center",
      marginTop: hp(1),
      // borderWidth: 1,
      // borderColor: COLORS.grey,
    },
    closeButtonTxt: {
      color: "black",
      // fontWeight: 'bold',
    },
    initiateBtnTxt: {
      // fontWeight: 'bold',
    },

    title: {
      // fontWeight: 'bold',
      marginVertical: 6,
      paddingHorizontal: 2,
    },
    DisputeTitleCont: {
      alignItems: "flex-start",
    },
    couponContainer: {
      flexDirection: "row",
      width: "95%",
      alignItems: "center",
      justifyContent: "space-between",
      // backgroundColor: "red",
      marginLeft: wp(2),
    },
    tabItem: {
      flex:1,
      paddingHorizontal:width*0.02,
      height: "100%",
      borderRadius: hp(1.6),
      justifyContent: "center",
      alignItems: "center",
    },
    TimeLineContainer: {
      width: "100%",
      flex: 1,
      borderRadius: hp(2),
      backgroundColor: COLORS.transactionsCard,
      paddingVertical: wp(2),
    },
    indicator: {
      width: wp(90),
      height: hp(50),
      alignItems: "center",
      justifyContent: "center",
    },
    //accordion
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
      borderRadius:6
      // minHeight:400,
    },
    transactionInfo2: {
      backgroundColor: COLORS.transactionsCard,
      // paddingVertical: hp(1),
      paddingHorizontal: 10,
      borderWidth: 0.2,
      borderColor: COLORS.babyBlue3,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    accordionContainer: {
      borderWidth: 0.5,
      paddingHorizontal: 10,
      borderColor: COLORS.babyBlue,
      backgroundColor: COLORS.transactionsCard,
    },

    accordionAgreementTitle: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: COLORS.agreementBg,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginHorizontal:wp(1),
      elevation:2,
      borderRadius:8,
      shadowOpacity:0.2,
    },
    settDescTitle: {
      alignSelf: "flex-start",
      marginHorizontal: 10,
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      alignContent:'center',
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    modalView2: {
      width:'88%',
      height: height*0.4,
      justifyContent:'center',
      alignItems: "center",
      alignContent:'center',
      alignSelf:'center',
      backgroundColor: COLORS.lightGrey2,
      borderRadius:10,
      elevation:3,
      shadowOpacity:0.3,
      shadowOffset:{width:1, height:1},
      marginTop: height*0.3
    },
    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 10,
      overflow: "hidden",

      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
      //backgroundColor:'red',
      paddingVertical: hp(2),
      minHeight: hp(45),
      paddingHorizontal: hp(2),
    },
    centeredView2: {
      position: "absolute",
      // top: '15%',
    },
    labledDes2: {
      alignItems: "flex-start",
      marginHorizontal: wp(4),
      maxHeight: hp(5),
      marginVertical: hp(1),
    },
    viewTitle: {
      width: wp(80),
      // marginVertical:hp(1),
    },
    modalText: {
      paddingHorizontal: 20,
    },
    modalSubView: {
      backgroundColor: COLORS.white,
      paddingVertical: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 10,
      width: "100%",
    },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
    },
    textColored3: {
      // backgroundColor: "red",
      width: wp(14),
      borderRadius: wp(4),
      borderWidth: wp(0.4),
      borderColor: COLORS.header,
      marginLeft: wp(1),
    },

    textInputContainer: { alignSelf: "flex-start", width: "90%" },
    //dropdown

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
      marginVertical: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
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
    messageContainer:{
      paddingVertical:5,
      paddingHorizontal: wp(3),
      backgroundColor: COLORS.lightGrey2,
      borderTopEndRadius:14,
      borderTopStartRadius:14,
      borderBottomEndRadius:14,
      borderBottomStartRadius:5,
      marginHorizontal:5
    },
    wave: {
      fontSize: 60,
      paddingBottom: 25,
      paddingRight: 25
  },
  containerView:{
   backgroundColor: COLORS.white,
   elevation:3,
   shadowOpacity: 0.3,
   borderRadius:6,
   padding:5
  },
  label:{
    marginHorizontal: wp(1)
  },
  value:{
    flex:1,
    backgroundColor: '#FBFAFA',
    textAlign:'left',
    paddingHorizontal: wp(1),
    paddingVertical:2,
    elevation:2,
    borderRadius:8,
    shadowOpacity:0.2,
    shadowOffset:{width:1, height:1},
  },
  avatar: {
    width: wp(17),
    height: hp(7),
  },
  chatOption:{
    flexDirection:'row', 
    alignItems:'center',
    marginHorizontal:wp(6),
    marginVertical:hp(1)
  },
  nextStepContainer:{
    borderRadius:8, 
    borderColor:COLORS.blue, 
    borderWidth:1,alignItems:'center',
    marginTop: hp(2),
    paddingVertical:3,
    
  },
  cardContainer:{
    alignItems:'center',
    flexDirection:'row',
    backgroundColor:COLORS.white,
    borderRadius:8,
    elevation:2,
    shadowOpacity:0.2,
    paddingHorizontal:wp(2),
    marginVertical:hp(1),
    shadowOffset:{height:1,width:1}
  },
  digitTxtStyle_ar:{
    color: COLORS.header,
    transform: [{rotateY: '180deg'}] 
  },
  digitTxtStyle_en:{
    color: COLORS.header
  },
  timeLabelStyle_ar:{
    color: "red", 
    fontWeight: "bold", 
    transform: [{rotateY: '180deg'}]
  },
  timeLabelStyle_en:{
    color: "red", 
    fontWeight: "bold", 
  }
  });
export default createStyles;
