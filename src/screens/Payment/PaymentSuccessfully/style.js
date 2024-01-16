import {StyleSheet} from 'react-native';
import {hp, wp} from '../../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    container: {
      flex: 1,
      //paddingBottom: 30,
      backgroundColor: COLORS.backGround,
    },
    transactionsContainer: {
      paddingHorizontal: wp(3),
      marginVertical: hp(1),
      alignItems: 'center',
    },
    logo: {
      alignSelf: 'center',
      width: wp(45),
      height: hp(24),
      marginVertical: hp(3),
    },
    txtDetails: {
      backgroundColor: COLORS.details,
      width: wp(100),
      height: hp(7),
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingHorizontal: wp(10),
    },
    txtDetails2: {
      width: wp(100),
      //   height: hp(9),
      alignItems: 'flex-start',
      justifyContent: 'center',
      marginTop: hp(1),
      paddingBottom: hp(1),
      paddingHorizontal: wp(10),
      borderBottomColor: COLORS.description,
      borderBottomWidth: wp(0.3),
    },
    btnStyle: {width: '80%', alignSelf: 'center', marginTop: hp(10)},
  });
export default createStyles;
