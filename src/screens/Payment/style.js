import {Dimensions, StyleSheet} from 'react-native';
import {hp, wp} from '../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    container: {
      flex: 1,
      //paddingBottom: 30,
      backgroundColor: COLORS.backGround,
    },
    faceView: {
      height: hp(8),
      backgroundColor: COLORS.inputBackGround2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginVertical: hp(1),
      borderRadius: 10,
      width: wp(90),
      //   marginHorizontal:wp(3)
    },
    titleTxt: {
      // fontWeight: 'bold',
      marginVertical: 5,
    },
    icon: {
      marginHorizontal: 10,
    },
  });
export default createStyles;
