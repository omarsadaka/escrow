import {StyleSheet} from 'react-native';
import { hp, wp } from '../../utilis/dimensions';
const createStyles = COLORS =>
  StyleSheet.create({
   container:{
    paddingVertical:hp(3),
    paddingHorizontal:wp(5),
    flex:1,

   },
   withdrawNow:{
    alignSelf:'flex-start',         
    minWidth:'35%',
    marginVertical:hp(2),
    borederWidth:1,
    borderColor:'grey',
    elevation:1,
    minHeight:hp(5),
    justifyContent:'center',
    borderRadius:20
   },
   subCont:{
      minHeight:'40%',
      alignItems:'flex-start',
    
   },
   methodsCont:{
     alignItems:'flex-start',
     marginVertical:hp(2)
      
   },
   btn:{

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
   methodDetails:{
   
    marginBottom:hp(2),
    flexDirection:'row',
     width:'100%',
     justifyContent:'center'
   },
   methodsLabel:{
    marginVertical:hp(1)
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
   color: COLORS.black
  //  backgroundColor:'red'
  },
  textareaContainer:{
    borderColor: COLORS.header,
    borderWidth: wp(0.28),
    borderRadius: hp(1),
    // height:hp(20),
    

  }

  });
export default createStyles;
