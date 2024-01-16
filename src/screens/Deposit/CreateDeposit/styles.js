import { StyleSheet } from "react-native";
import { hp, wp } from "../../../utilis/dimensions";
const createStyles = (COLORS) =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      // justifyContent: 'space-around',
    },
    loadingStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    BackTxt: {
      marginHorizontal: wp(2),
      marginVertical: hp(1),
    },
    errStyle: {
      marginHorizontal: wp(5),
      marginTop: hp(4),
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
    btn2: {
      width: "70%",
      alignSelf: "center",
      marginTop: 20,
    },
    //dynamic form

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
    minHeight:'40%',
    fontFamily: "BahijTheSansArabic-Plain",
  },
  textareaContainer:{
    borderColor: COLORS.header,
    borderWidth: wp(0.28),
    borderRadius: hp(1),
  },
  previewContainer1:{
    flexDirection:'row',
    justifyContent:'space-around',
    marginVertical:hp(10),
    width:'95%'
   },
   previewSubContainer1:{
    alignItems:'flex-start'

   },
   previewSubContainer2:{
    alignItems:'flex-end'

   },

  });
export default createStyles;


