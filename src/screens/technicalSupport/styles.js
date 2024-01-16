import {Dimensions, StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import {hp, wp} from '../../utilis/dimensions';

const {width, height} = Dimensions.get('window');

const createStyles = (COLORS) =>
  StyleSheet.create({
    logo: {
      alignSelf: 'center',
    },
    btn: {width: '70%', alignSelf: 'center', marginTop: 20},
    textareaContainer: {
      borderColor: COLORS.header,
      borderWidth: wp(0.28),
      borderRadius: hp(1),
      width: "90%",
      alignSelf: "center",
      marginBottom: hp(1),
    },
    rowContainer:{
      width:'100%',
      alignItems:'center',
      flexDirection:'row',
      justifyContent:'center',
      marginTop: hp(3)
    },
    icon:{
      marginHorizontal:wp(3),
      width:40, height:40,
      borderRadius: 40/2,
      alignItems:'center',
      justifyContent:'center'
    }
  });

export default createStyles;
