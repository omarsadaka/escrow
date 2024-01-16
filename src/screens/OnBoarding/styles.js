import {Dimensions, StyleSheet} from 'react-native';
// import {COLORS} from '../../constants/colors';

const {width, height} = Dimensions.get('window');

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: COLORS.white,
    },
    skipContainer: {
      // position: 'absolute',
      height: 50,
      // top: 40,
      // right: 0,
      justifyContent: 'center',
      alignSelf:"center",
      textAlign:"center"
    },
    swiperDot: {
      width: 16,
      height: 16,
      borderRadius: 8,
      marginHorizontal: 7.5,
    },
    swiperDots: {
      flexDirection: 'row',
      alignSelf: 'center',
      marginTop:20
      // marginBottom: scaleHeightSize(38),
    },
    imageContainer: {
      width: width,
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      flexGrow: 1,
    },
    
    image: {
      width: '100%',
      height: '40%',
      resizeMode: 'contain',
    },
    bottomPart: {
      position: 'absolute',
      height: 200,
      bottom: 80,
      right: 0,
      left: 0,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    btn: {width: "70%"},
    text: {width: '90%', textAlign: 'center',marginBottom: 10},
  });

export default createStyles;
