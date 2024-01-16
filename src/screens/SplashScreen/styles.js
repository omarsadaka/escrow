import {StyleSheet} from 'react-native';
import {COLORS} from '../../constants/colors';
import { hp, wp } from '../../utilis/dimensions';
export default StyleSheet.create({
  bg: {
    flex: 1,
  },
  logo: {
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
  },
  textPayment: {
    color: COLORS.babyBlue,
  },
  button: {
    alignSelf: 'center',
    borderRadius: 10,
  },
  container: {
    height: '30%',
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    justifyContent:"space-between",
    padding:20
  },

  //style of navigation file
  plusTabContainer:{
    backgroundColor:COLORS.header,
    width:wp(13),
    height:wp(13),
    alignItems:'center',
    justifyContent:'center',

    borderRadius:50
  }
});
