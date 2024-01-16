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
    itemContainer: {
      alignSelf: "center",
      justifyContent: "center",
      marginVertical: hp(1),
      width: wp(95),
      borderRadius: wp(3),
      borderWidth: wp(0.2),
      minHeight: hp(10),
    },
    innerText: {
        marginLeft: wp(1),
        textAlign:'left'
    },
    dateText: {
      marginLeft: wp(1),
      textAlign:'left'
  },
    errorMessages: {},
    errStyle: {
      marginHorizontal: wp(5),
      marginTop: hp(4),
      width: "90%",
      alignItems: "center",
      justifyContent: "center",
    },
    image:{
      width: wp(20),
      height: wp(20),
      borderRadius: wp(3),
      margin:2
    }
  });
export default createStyles;
