import {StyleSheet} from 'react-native';
import {hp, wp} from '../../utilis/dimensions';

const createStyles = (COLORS) =>
  StyleSheet.create({
    mainStyle: {
      justifyContent: "flex-start",
      alignItems: "flex-start",
      marginVertical: hp(1),
      marginHorizontal: wp(3),
    },
    BackTxt: {
      marginHorizontal: wp(2),
      marginVertical: hp(1),
    },
    container:{
      paddingTop:10,
      width:'100%',
      alignItems:'center',
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
      width:'95%',
      height: hp(25),
      borderRadius:12,
    }
  });
export default createStyles;
