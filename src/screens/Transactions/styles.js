import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {hp, wp} from '../../utilis/dimensions';

const {width, height} = Dimensions.get('window');

const createStyles = (COLORS) =>
  StyleSheet.create({
    fullPageCont: {
      backgroundColor: COLORS.backGround,
      flexGrow: 1,
    },

    //card

    transactionsCardContainer: {
      backgroundColor: COLORS.white,
      width: "100%",
      alignSelf: "center",
      marginVertical: 7,
      shadowColor: COLORS.blue,
      shadowOpacity: 0.8,
      shadowOffset: { width: 5, height: 5 },
      shadowRadius: 30,
      elevation: 5,
      borderRadius: 15,
      paddingHorizontal: 12,
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
    cardSubCont2: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 7,
    },
    cardSubCont3: {
      alignSelf: "flex-end",
      marginVertical: 10,
    },
    avatar: {
      marginHorizontal: 10,
    },
    transactionInfo: {
      backgroundColor: COLORS.transactionsInfoBg,
      // fontWeight: 'bold',
      minWidth: "28%",
      minHeight: 30,
      borderRadius: 10,
      marginVertical: 2,
      paddingVertical: 5,
    },
    transactionsCurrTxt: {
      // fontWeight: 'bold',
    },
    txtSubCont1: {
      alignItems: "flex-start",
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

    loadingStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    //filter
    dropDownContainer: {
      marginVertical: hp(0.5),
      marginHorizontal: wp(4),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      backgroundColor: COLORS.transactionsInfoBg,
      paddingVertical: hp(1),
    },
    filterIcons: {
      alignItems: "center",
      justifyContent: "center",
    },
    CheckBoxItem: {
      marginVertical: hp(1),
      flexDirection: "column",
      width: "48%",
      // backgroundColor:'red'
    },
    CheckBoxContainer: {
      // justifyContent: 'center',
      height: "100%",
      // paddingTop: hp(1),
    },
    dropDownBtn: {
      backgroundColor: COLORS.transactionsInfoBg,
      maxWidth: "35%",
    },
    dropDownBtnTxt: {
      color: COLORS.black,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    dropDownRow: {
      backgroundColor: COLORS.transactionsInfoBg,
    },
    dropDownTxt: {
      color: COLORS.black,
      fontFamily: "BahijTheSansArabic-Plain",
      fontSize: 14,
    },
    filterContainer:{
      flexDirection:'row', 
      alignItems:'center',
      justifyContent:'space-between', 
      width:'98%',
      backgroundColor: '#d3d3d3',
      borderRadius:8,paddingVertical:hp(0.8),
      paddingHorizontal: wp(1),
      marginBottom:hp(1)
    },
    filterClicked:{
      flex:1,
      backgroundColor: COLORS.white,
      borderRadius: 8,
      paddingVertical:hp(0.5),
    },
    filterUnClicked:{
      flex:1,
      borderRadius: 8,
      paddingVertical:hp(0.5),
    }
  });

export default createStyles;
