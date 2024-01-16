import { StyleSheet } from "react-native";
import { height, hp, wp } from "../../utilis/dimensions";

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: "black",
      justifyContent: "space-between",
    },
   
    text: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(1),
    },
  
   
    textColored: {
      color: COLORS.blue,
      marginTop: hp(2)
      // fontWeight: '500',
    },
   
    btn: { width: "70%", alignSelf: "center", marginTop: hp(4),marginBottom:hp(1) },
   
    translate: {
      width: "50%",
    },
    translateText: {
      textAlign: "center",
    },
    readMore:{
        color: COLORS.blue,
        fontSize: wp(2.8),
    },
    fullHomeCont: {
      backgroundColor: COLORS.backGround,
    },
    headerProfileInfoContainer: {
      flexDirection: "row",
      marginTop: hp(5),
      // backgroundColor: 'red',
      width: "65%",
      justifyContent: "flex-start",
      height: "60%",
      // marginLeft: wp(4),
      alignItems: "center",
    },

    headerNotification: {
      width: "40%",
      height: "60%",
      paddingHorizontal: wp(5),
      justifyContent: "flex-start",
      marginTop: hp(5),
      flexDirection: "row-reverse",
      alignItems: "flex-start",
    },
    lang: {
      marginVertical: 5,
    },
    txtHeaderContainer: {
      alignItems: "flex-start",
      //  marginLeft:wp(2),
      // backgroundColor: 'red',
    },
    helloTxt: {
      opacity: 0.7,
    },
    nameCont: {
      flexDirection: "row",
    },
    userNameTxt: {},
    avatar: {
      width: "23%",
      height: "70%",
      borderRadius: wp(50),
    },
    titleTxt: {
      // fontWeight: 'bold',
      textAlign: "center",
    },
    container1: {
      justifyContent: "center",
      minHeight: hp(30),
      alignSelf: "center",
    },

    //curr section
    monContainer: {
      flexDirection: "row-reverse",
      marginVertical: 15,
      width: "100%",
      height: 62,
      alignSelf: "center",
    },
    currContainer: {
      backgroundColor: COLORS.header,
      width: "25%",
      borderTopEndRadius: 10,
      borderBottomEndRadius: 10,
      justifyContent: "center",
      height: "100%",
    },
    monValContainer: {
      borderTopStartRadius: 10,
      borderBottomStartRadius: 10,
      backgroundColor: COLORS.monbg,
      // justifyContent: "space-between",
      width: "75%",
      height: "100%",
      shadowColor: COLORS.blue,
      shadowOpacity: 0.8,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 5,
      elevation: 10,
      flexDirection: "row-reverse",
      alignItems: "center",
      marginHorizontal:5
    },

    currTxt: {
      opacity: 0.8,
    },
    monTxt: {
      width: "80%",
    },

    //dashboard

    dashboardItem: {
      backgroundColor: COLORS.operationsCard,
      borderRightColor: COLORS.header,
      borderRightWidth: 1,
      borderBottomColor: COLORS.header,
      borderBottomWidth: 1,
      height: hp(12),
      width: wp(24),
      borderRadius: hp(1),
      marginLeft: wp(2),
      justifyContent: "space-around",
    },
    dashboardCont: {
      // flexDirection: 'row',
      // justifyContent: 'space-around',
      // backgroundColor:'yellow',
      // paddingHorizontal:wp(10),
      // flexGrow: 1,
      // width: wp(90),
      // height: "10%",
      // alignItems: 'center',
      // flexWrap: "wrap",
      // marginVertical: 5,
    },
    statisticsTxt: {
      // fontWeight: 'bold',
      // height: 0,
      textAlignVertical: "center",
    },
    // dashboardSubItem: {
    //   borderRadius: 10,
    //   height: '76%',
    //   marginVertical: 7,
    //   alignItems: 'center',
    //   justifyContent: 'space-between',
    //   paddingVertical: 10,
    // },

    // operations
    operationsTitle: {
      marginVertical: 7,
      // marginHorizontal: 5,
    },
    operationsSection: {
      flexDirection: "row",
      justifyContent: "flex-start",
      // height: 300,
      width: "100%",
      flexWrap: "wrap",
      marginVertical: 10,
    },

    operationsItem: {
      backgroundColor: COLORS.operationsCard,
      height: 120,
      width: "28%",
      marginHorizontal: 6,
      marginVertical: 5,
      borderRadius: 15,
      alignItems: "center",
      justifyContent: "space-evenly",

      shadowColor: COLORS.blue,
      shadowOpacity: 0.2,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 15,
      elevation: 5,
    },
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: "hidden",

      paddingBottom: 15,
      width: "90%",
      alignSelf: "center",
      borderColor: COLORS.black,
      borderWidth: 1,
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
    verifyContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    notificationCounter: {
      backgroundColor: "red",
      height: hp(2.2),
      width: hp(2.2),
      top: hp(1.5),
      left: hp(0.5),
      zIndex: 2000,
      position: "relative",
      borderRadius: hp(2),
    },
    tooltipText: {
      color: COLORS.grey,
      fontSize:14
    },
    iconBg:{
      position:'absolute',
      bottom:0,
      flexDirection:'row',
      width:'100%',
      justifyContent:'space-between',
      alignSelf:'center',
      paddingHorizontal:10,
      paddingVertical:7,
      backgroundColor: COLORS.white,
      elevation:4,
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
    marginTop: height*0.36,
    shadowOffset:{width:0, height:0},
    backgroundColor: COLORS.blue,
    elevation:3,
    paddingVertical: hp(1),
  }
   
   
   
  });
export default createStyles;
