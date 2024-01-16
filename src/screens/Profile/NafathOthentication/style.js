import {StyleSheet} from 'react-native';
import {hp, wp} from '../../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      marginVertical: hp(-3),
      backgroundColor: COLORS.white,
      borderRadius: wp(3),
      marginHorizontal: wp(8),
    },
    BackTxt: {
      // fontWeight: 'bold',
      marginVertical: hp(3),
      marginHorizontal: wp(4),
    },
    BackTxt3: {
      // fontWeight: 'bold',
      marginVertical: hp(3),
    },
    BackTxt2: {
      // fontWeight: 'bold',
    },
    logo: {
      alignSelf: 'center',
      width: wp(45),
      height: hp(24),
    },
    btn2: {
      width: '80%',
      alignSelf: 'center',
      marginTop: hp(18),
    },
    headerStyle: {
      justifyContent: 'center',
      alignItems: 'flex-start',
      // marginVertical: hp(3),
      marginHorizontal: wp(4),
      // width: wp(120),
    },
    headerStyle2: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp(18),
      marginHorizontal: wp(4),
    },
    container: {
      // flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      borderColor: COLORS.header,
      borderWidth: wp(0.4),
      marginVertical: hp(1),
      marginHorizontal: wp(3),
      width: wp(84),
      padding: wp(2),
      borderRadius: wp(3),
    },
    Txt: {
      marginVertical: hp(0.6),
    },
    Txt3: {
      marginTop: hp(2),
      // fontWeight: 'bold',
    },
    Txt2: {
      // fontWeight: 'bold',
    },
    dynamicFormContainer:{
      paddingHorizontal:wp(5),
      flex:1,
      marginVertical:hp(5),
      marginHorizontal:wp(3),
      backgroundColor:COLORS.white
      
    },

    radioCont:{
      flexDirection:'row-reverse',
      alignItems:'center',
      justifyContent:'flex-end'
    },
    checkboxCont:{
    //  // flexDirection:'row-reverse',
    width:'30%',
    marginVertical:hp(1)
    

    },
    dropDownBtn: {
      backgroundColor: COLORS.inputBackGround,
      width: '100%',
      height: hp(6),
      // borderBottomColor: COLORS.bg,
      marginVertical: hp(2),
      borderWidth: wp(0.28),
      borderColor: COLORS.header,
      borderRadius: wp(2),
      // marginRight:wp(-1),
    },
    uploadBtn:{
      backgroundColor: COLORS.header,
      marginHorizontal: wp(5),
      justifyContent: "center",
      marginVertical: hp(1),
      width: '100%',
      minHeight: hp(6),
      alignSelf: "center",
      borderRadius: hp(1),
    },
    textarea:{
     paddingHorizontal:6,
     fontFamily: "BahijTheSansArabic-Plain",
     color: COLORS.black
    },
    textareaContainer:{
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
    }

    
  });
export default createStyles;
