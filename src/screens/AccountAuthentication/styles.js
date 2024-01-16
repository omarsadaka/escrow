import {StyleSheet} from 'react-native';
const createStyles = COLORS =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
      justifyContent: 'space-between',
      paddingBottom:30
    },
    text: {
      alignSelf: 'center',
      textAlign: 'center',
      marginVertical: 10,
    },
    text2: {
      // fontWeight: 'bold',
      marginVertical: 10,
    },

    textColored: {
      color: COLORS.headerText,
      // fontWeight: 'bold',
      marginVertical: 10,
    },
    keyboardText:{
      color: COLORS.blue,
      // fontWeight: '500',
      padding:15,
      paddingHorizontal:25,
    },
    btn: {width: '70%', alignSelf: 'center', marginTop: 20},

    underlineStyleBase: {
      width: 50,
      height: 50,
      borderWidth: 1,
      color: COLORS.black,
      borderColor: COLORS.blue,
      borderRadius: 8,
      backgroundColor: COLORS.white,
    },

    underlineStyleHighLighted: {
      borderColor: COLORS.blue,
      borderRadius: 8,
    },
    otp: {
      width: '80%',
      height: 80,
      alignSelf: 'center',
    },
    applicationPin: {
      width: '80%',
      alignSelf: 'center',
      // height:"64%",
      borderColor: COLORS.blue,
      borderWidth: 1,
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 8,
      marginVertical: 20,
    },
    applicationPinSubContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    icon: {
      marginHorizontal: 10,
    },
    logo: {
      marginHorizontal: 10,
      width: 25,
      height: 25,
      // backgroundColor: COLORS.headerText,
    },
    keyboard: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      marginVertical: 10,
    },
    keyboardDelete: {
      position: 'absolute',
      bottom: 8,
      right: 25,
    },
    bioContainer: {
      width: '80%',
      alignSelf: 'center',
      borderColor: COLORS.blue,
      borderWidth: 0,
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 8,
      marginVertical: 20,
      paddingVertical: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
export default createStyles;
