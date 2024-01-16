import {StyleSheet} from 'react-native';
import {hp, wp} from '../../../utilis/dimensions';
const createStyles = COLORS =>
  StyleSheet.create({

    ticketsScreen:{
      backgroundColor:COLORS.backGround,
     //flex:1,
      paddingHorizontal:wp(8),
      alignItems:'center'
},
newTicketBtn:{
  alignSelf:'flex-start',         
  minWidth:'35%',
  marginVertical:hp(2),
  borederWidth:1,
  borderColor:COLORS.blue,
  elevation:1,
  minHeight:hp(5),
  justifyContent:'center',
  borderRadius:20
 },
 inputContainer:{
   width: "90%" ,
  // alignSelf: 'flex-start',
  },
  dropdownCont:{
    alignItems:'flex-start'
  },
  btn:{
    marginVertical:hp(2),
    width:'93%'
  },
  detailsCont:{
    backgroundColor:COLORS.white,
    borderColor:COLORS.blue,
    elevation:1,
    borederWidth:1,
    alignItems:'flex-start',
    width:'98%',
    paddingHorizontal:wp(2),
    paddingVertical:hp(1),
    marginTop:hp(5),
   



  },
  statusTxt:{
    marginHorizontal:wp(2)
  },
  statusCont:{
    alignSelf:'flex-end',
    flexDirection:'row-reverse',
    alignItems:'center'
  }



  });
export default createStyles;
