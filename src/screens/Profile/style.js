import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utilis/dimensions';

const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      marginVertical: hp(-3),
      backgroundColor: COLORS.white,
      borderRadius: wp(3),
      marginHorizontal: wp(3),
      // maxHeight: hp(47),
    },
    container: {
      marginHorizontal: wp(8),
    },
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
      // fontWeight: 'bold',
      marginHorizontal: 10,
    },
    headerStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: hp(3),
      marginHorizontal: wp(4),
      width: wp(120),
    },
    QRStyle: {
      marginHorizontal: wp(48),
    },
    userViewStyle: {
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "row",
      marginVertical: hp(-3),
      marginHorizontal: wp(8),
    },
    addImageContainer:{
      width: wp(25),
      height: hp(15),
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10,
      borderColor: COLORS.blue,
      borderWidth:1,
      borderStyle: 'dashed',
    },
    imageStyle:{
      width: wp(23),
      height: hp(14),
      alignItems:'center',
      borderRadius:10,
    },
    BackTxt2: {
      // fontWeight: 'bold',
      marginHorizontal: wp(10),
    },
    profileStyle: {
      borderWidth: wp(1),
      borderColor: COLORS.header,
      borderRadius: wp(20)/2,
      width: wp(20),
      height: wp(20),
      justifyContent:'center'
    },
    selectStyle: {
      width: wp(84),
      height: hp(6),
      backgroundColor: COLORS.inputBackGround2,
      justifyContent: 'space-between',
      alignItems: "center",
      flexDirection: "row",
      marginVertical: hp(5),
      marginHorizontal: wp(8),
      borderRadius: wp(5),
    },
    basicStyle: {
      flex:1,
      // width: wp(28),
      justifyContent: "center",
      alignItems: "center",
    },
    selectedStyle: {
      flex:1,
      height: hp(6),
      // width: wp(28),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(5),
    },
    BackTxt3: {
      // fontWeight: 'bold',
      // marginHorizontal: 10,
      marginVertical: hp(1),
    },
    docTxt: {
      textDecorationLine: "underline",
      marginVertical: hp(1),
    },
    docLable: {
      color: COLORS.header,
      textDecorationLine: "underline",
    },
    docCont: {
      minHeight: hp(12),
      alignItems: "flex-start",
      marginHorizontal: wp(9),
      // backgroundColor:'red'
    },
    BackTxt4: {
      marginVertical: hp(1),
      marginRight: hp(1),
    },
    BackTxt5: {
      marginVertical: hp(0.5),
      marginLeft: wp(3),
    },
    BackTxt6: {
      marginVertical: hp(0.5),
      marginLeft: wp(3),
    },
    regisCon: {
      alignItems: "flex-start",
      justifyContent: "center",
      marginLeft: wp(8),
    },
    verifCon: {
      // backgroundColor: 'red',
      width: "90%",
      alignItems: "flex-start",
      justifyContent: "center",
      marginVertical: hp(1),
      // marginRight: hp(1),
      borderWidth: wp(0.4),
      borderBottomColor: COLORS.proTxt,
      borderColor: COLORS.white,
    },
    innercon: {
      marginBottom: hp(2),
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
    },
    buttonStyle: {
      height: hp(7),
      width: "84%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(5),
      marginHorizontal: wp(8),
      marginBottom: hp(4),
    },
    documentContainer: {
      height: hp(23),
      width: wp(75),
      borderWidth: wp(0.3),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      backgroundColor: COLORS.white,
      marginHorizontal: wp(8),
      marginBottom: hp(2),
      alignSelf: "center",
    },
    close: {
      width: "100%",
      justifyContent: "center",
      alignItems: "flex-end",
      marginLeft: wp(-1),
      marginTop: hp(0.7),
    },
    close2: {
      marginLeft: wp(40),
    },
    uploadContainer: {
      justifyContent: "center",
      alignItems: "center",
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
      height: hp(70),
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
    qrImage: {
      marginHorizontal: wp(12),
      // width: wp(70),
      // height: hp(60),
    },
    camera: {
      backgroundColor: COLORS.header,
      alignItems: "center",
      justifyContent: "center",
      width: wp(6),
      height: hp(3.5),
      borderRadius: hp(50),
      marginLeft: wp(-5),
      marginTop: hp(6),
    },
    btn2: {
      width: "70%",
      alignSelf: "center",
      marginTop: hp(1),
      marginBottom: hp(2),
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
      marginBottom: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      // marginHorizontal: wp(5),
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
    row:{
      width:'60%', alignItems:'center',
      marginTop:hp(4),
      justifyContent:'space-between',
      flexDirection:'row'
    }
  });
export default createStyles;
