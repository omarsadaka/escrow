import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utilis/dimensions';

const createStyles = (COLORS) =>
  StyleSheet.create({
    container:{
      paddingTop:10,
      width:'100%',
      alignItems:'center',
      paddingHorizontal: wp(3)
    },
    title:{
      width:'95%',
      textAlign:'left',
      marginTop:5,
    },
    body:{
      width:'95%',
      textAlign:'left',
      marginTop:3
    },
    image:{
      width:wp(5),
      height: wp(5),
    },
    circle:{
      width: wp(9),
      height: wp(9),
      alignItems:'center',
      justifyContent:'center',
      borderRadius: wp(9)/2,
      borderWidth:1,
      borderColor: COLORS.grey
    },
    line:{
      width:1,
      height: hp(6.8),
      backgroundColor: COLORS.grey
    },
    card:{
      width:'100%',
      backgroundColor: COLORS.white,
      elevation:3,
      shadowOpacity:0.3,
      shadowOffset:{width:2,height:2},
      borderRadius: 6,
      marginTop: hp(2),
      paddingHorizontal:5,
      paddingVertical:5
    },
    btn: { width: "70%", alignSelf: "center", marginTop: hp(3),marginBottom:hp(1) },

  });
export default createStyles;
