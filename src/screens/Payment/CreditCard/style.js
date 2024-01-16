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
      width: wp(75),
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
    // accountItem: {
    //   width: '90%',
    //   alignSelf: 'center',
    //   alignItems: 'center',
    //   backgroundColor: COLORS.inputBackGround3,
    //   // height:200,
    //   borderRadius: 20,
    //   marginVertical: hp(1),
    // },
    // accountItem2: {
    //   width: '90%',
    //   alignSelf: 'center',
    //   alignItems: 'center',
    //   backgroundColor: COLORS.inputBackGround3,
    //   // height:200,
    //   borderRadius: 20,
    //   marginVertical: hp(1),
    //   borderWidth: wp(0.5),
    //   borderColor: COLORS.header,
    // },
    // row100: {
    //   flexDirection: 'row',
    //   alignItems: 'center',
    //   justifyContent: 'space-between',
    //   width: '90%',
    //   alignSelf: 'center',
    //   marginVertical: 10,
    //   marginBottom: 20,
    // },
    title: {
      // fontWeight: 'bold',
    },
    agreementName: {
      width: '90%',
      marginTop: hp(3),
      backgroundColor: COLORS.backInput,
    },
    agreementName2: {
      width: '44%',
      marginTop: hp(3),
      backgroundColor: COLORS.backInput,
    },
    agreementName3: {
      width: '44%',
      marginTop: hp(3),
    },
    font: {
      // fontWeight: 'bold',
    },
    visa: {justifyContent: 'center', alignItems: 'center', width: '100%'},
    containerStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
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
      //   flexDirection: 'row',
      justifyContent: 'space-around',
      //   width: '100%',
    },
    cardItem: {
      width: '90%',
      alignSelf: 'center',
      alignItems: 'center',
      backgroundColor: COLORS.blue,
      // height:200,
      borderRadius: 10,
      marginVertical: 10,
      paddingLeft: 20,
      paddingVertical: 10,
    },
    sim: {
      width: 40,
      height: 30,
      borderRadius: 5,
    },
    cardTitle: {},
    cardSubTitle: {
      // fontWeight: 'bold'
    },
    cardBottomContainer: {
      width: '35%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '90%',
      alignSelf: 'center',
      marginVertical: 10,
    },
  });
export default createStyles;
