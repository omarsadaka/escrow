import {StyleSheet} from 'react-native';
const createStyles = COLORS =>
 StyleSheet.create({
  bg: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'space-around',
    paddingHorizontal:"8%",
    paddingTop:"35%"
  },
  logo: {
    alignSelf: 'center',
  },
  text: {
    alignSelf: 'center',
    textAlign: 'center',
    // fontWeight:"bold"
  },
  text2: {
    alignSelf: 'center',
    textAlign: 'center',
    marginTop:30
  },
 
});
export default createStyles;
