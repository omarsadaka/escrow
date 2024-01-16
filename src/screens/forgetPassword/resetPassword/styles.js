import {StyleSheet} from 'react-native';

const createStyles = COLORS =>
  StyleSheet.create({
    logo: {
      alignSelf: 'center',
    },
    // text: {
    //   alignSelf: 'center',
    //   textAlign: 'center',
    // },
    // text2: {
    //   // textAlign: 'left',
    //   // fontWeight: 'bold',
    // },
 
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
      marginVertical:53

      
    },
    btn: {width: '70%', alignSelf: 'center', marginTop: 20},
   
    translate: {
      width: '50%',
    },
    translateText: {
      textAlign: 'center',
    },
  });
export default createStyles;
