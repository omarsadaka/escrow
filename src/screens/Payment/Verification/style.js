import {StyleSheet} from 'react-native';
import {hp, wp} from '../../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    container: {
      flex: 1,
      //paddingBottom: 30,
      backgroundColor: COLORS.backGround,
    },
    selectStyle: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'center',
      marginTop: hp(5),
      marginHorizontal: wp(8),
      borderRadius: wp(4),
    },
    transactionsContainer: {
      paddingHorizontal: 15,
      marginVertical: 7,
      alignItems: 'flex-start',
    },
    underlineStyleBase: {
      width: 50,
      height: 50,
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: COLORS.inputBackGround,
    },
    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: '80%',
      height: 80,
      alignSelf: 'center',
      //   backgroundColor: COLORS.white,
    },
    skipContainer: {
      height: 50,
      justifyContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
    },
    text: {
      alignSelf: 'center',
      textAlign: 'center',
      marginVertical: 10,
    },
    textColored: {
      color: COLORS.blue,
      fontSize: 14,
      // fontWeight: 'bold',
    },
    btnStyle: {width: '80%', alignSelf: 'center', marginTop: hp(7)},
  });
export default createStyles;
