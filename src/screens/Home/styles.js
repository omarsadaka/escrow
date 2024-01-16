import { StyleSheet } from "react-native";
import { COLORS } from "../../constants/colors";
import { height, hp, width, wp } from "../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
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
      // minHeight: hp(30),
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
      width: "23%",
      borderTopEndRadius: 10,
      borderBottomEndRadius: 10,
      justifyContent: "center",
      height: "100%",
    },
    monValContainer: {
      borderTopStartRadius: 10,
      borderBottomStartRadius: 10,
      justifyContent:'center',
      backgroundColor: COLORS.monbg,
      // justifyContent: "space-between",
      width: "75%",
      height: "100%",
      shadowColor: COLORS.blue,
      shadowOpacity: 0.2,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 5,
      elevation: 2,
      flexDirection: "row-reverse",
      alignItems: "center",
    },

    currTxt: {
      opacity: 0.8,
    },
    monTxt: {
      width: "75%",
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
      marginHorizontal: 5,
    },
    operationsSection: {
      flexDirection: "row",
      justifyContent: "flex-start",
      // height: 300,
      width: "100%",
      flexWrap: "wrap",
    },

    operationsItem: {
      backgroundColor: COLORS.operationsCard,
      height: 120,
      // width: "28%",
      flex:1,
      marginHorizontal: 6,
      // marginVertical: 5,
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
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },
    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 10,
      overflow: "hidden",
      paddingBottom: 15,
      width: "95%",
      alignSelf: "center",
      paddingVertical: hp(2),
      minHeight: hp(85),
    },
    closeButton: {
      width: "80%",
      alignSelf: "center",
      backgroundColor: COLORS.blue,
      position:'absolute',
      bottom: hp(2)
    },
    closeButtonTxt: {
      color: COLORS.white,
    },
    youtubeContainer:{
      width:'95%', flexDirection:'row',alignItems:'center',marginTop: hp(1)
    },
    youtubeImage:{
      width: '100%',
      height: hp(22),
      borderRadius:6,
      marginVertical: hp(1),
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wrapper:{},
    btnFilter:{
      flex:1,
      flexDirection:'row',width:'100%', justifyContent:'center',borderRadius:5,
      marginHorizontal:2,paddingHorizontal:3,
      alignItems:'center'
    },
    analyticsCon:{
      width:'96%', 
      borderRadius:8,
      alignSelf:'center',
      // borderColor: COLORS.blue,
      // borderWidth:1,
      backgroundColor: COLORS.white,
      elevation:3,
      shadowOpacity:0.2,
      shadowOffset:{height:1, width:1},
      paddingHorizontal:3,
      marginVertical:5,
      paddingVertical:3,
    },
    graphCon:{
      width:'100%',
      height:height*0.4, 
      alignItems:'flex-end',
      backgroundColor:'#C5C6C7',borderRadius:10,
      marginVertical:5,
    },
    graphCon3:{
      width:'100%',
      alignItems:'flex-end',
      backgroundColor:'#C5C6C7',borderRadius:5,
      marginVertical:hp(1),
      paddingHorizontal:wp(2),
      paddingVertical:4
    },
    colum:{
      width: width*0.17,
      marginHorizontal: width*0.05,
      borderTopStartRadius:15,
      borderTopEndRadius:15,
      // borderWidth:1,
      // borderColor: COLORS.blue,
      maxHeight: height*0.3,
      minHeight: height*0.03
   },
   image_bg:{
    marginTop: hp(2),
    flex:1,
    height: hp(27),
   },
   state_details:{
    width:'93%',
    height: hp(30),
    backgroundColor: COLORS.white,
    borderRadius:10,
    marginTop:hp(3),
    alignSelf:'center',
    paddingHorizontal: wp(2)
   },
   lottieContainer:{
    width: wp(10),
    height: wp(10),
    borderRadius: 3, 
    elevation:2,
    shadowOpacity:0.2,
    shadowOffset: {width:1, height:1},
    backgroundColor: COLORS.white,
    alignItems:'center'
   }
  });
export default createStyles;
