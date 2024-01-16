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
      width: wp(90),
      borderRadius: wp(5),
      // paddingLeft: wp(2),
      borderWidth: wp(0.5),
      // borderColor: COLORS.header,
      minHeight: hp(10),
    },
    innerContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "flex-start",
    },
    innerText: {
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
    selectStyle: {
      width: wp(90),
      height: hp(5.5),
      backgroundColor: COLORS.inputBackGround2,
      justifyContent: "flex-start",
      alignItems: "center",
      alignSelf: "center",
      flexDirection: "row",
      marginVertical: hp(2),
      marginHorizontal: wp(8),
      borderRadius: wp(4),
    },
    basicStyle: {
      flexDirection: "row",
      width: wp(45),
      justifyContent: "center",
      alignItems: "center",
    },
    selectedStyle: {
      flexDirection: "row",
      height: hp(5.5),
      width: wp(45),
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: COLORS.header,
      borderRadius: wp(4),
    },
  });
export default createStyles;
