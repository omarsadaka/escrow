import {StyleSheet} from 'react-native';
import { hp } from '../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: 'black',
      justifyContent: 'space-between',
    },
    logo: {
      alignSelf: 'center',
    },
    text: {
      alignSelf: 'center',
      textAlign: 'center',
      marginVertical:hp(1)
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
    },
    quickSignContainer: {
      width: '80%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
    },
    btn: {width: '70%', alignSelf: 'center', marginTop: 20},
    skipContainer: {
      height: 50,
      justifyContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
    },
    translate: {
      width: '50%',
    },
    translateText: {
      textAlign: 'center',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical:10
    },
    social: {
      alignSelf: 'center',
      width: 30,
      height: 30,
      marginHorizontal:10,
      resizeMode:"contain"
    },
  });
export default createStyles;
