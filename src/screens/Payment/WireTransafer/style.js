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
      width: wp(84),
      height: hp(5.5),
      backgroundColor: COLORS.inputBackGround2,
      justifyContent: 'flex-start',
      alignItems: 'center',
      alignSelf: 'center',
      flexDirection: 'row',
      marginVertical: hp(2),
      marginHorizontal: wp(8),
      borderRadius: wp(4),
    },
    selectStyle2: {
      width: wp(84),
      height: hp(6),
      alignSelf: 'center',
    },
    selectStyle3: {
      width: wp(34),
      height: hp(6),
      alignSelf: 'center',
    },
    basicStyle: {
      width: wp(42),
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedStyle: {
      height: hp(5.5),
      width: wp(42),
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.header,
      borderRadius: wp(4),
    },
    accountItem: {
      width: '90%',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.inputBackGround3,
      // height:200,
      borderRadius: 20,
      marginVertical: hp(1),
    },
    accountItem2: {
      width: '90%',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.inputBackGround3,
      // height:200,
      borderRadius: 20,
      marginVertical: hp(1),
      borderWidth: wp(0.5),
      borderColor: COLORS.header,
    },
    row100: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      alignSelf: 'center',
      marginVertical: 10,
      marginBottom: 20,
    },
    title: {
      // fontWeight: 'bold',
    },
    agreementName: {
      width: '90%',
      marginTop: 20,
      // backgroundColor: '#8f959f',
    },
    confirmContainer: {
      width: '90%',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.inputBackGround3,
      // height:200,
      borderRadius: 20,
      marginVertical: hp(1),
      paddingTop: hp(2),
      paddingBottom: hp(2),
    },
    buttonsStyle: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
  });
export default createStyles;
