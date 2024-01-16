import {StyleSheet} from 'react-native';
const createStyles = COLORS =>
StyleSheet.create({
  bg: {
    flexGrow: 1,
    backgroundColor: COLORS.white,
    // justifyContent: 'space-between',
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
    color: COLORS.blue,
    // fontWeight: 'bold',
    marginVertical: 10,
  },
  title: {
    color: COLORS.blue,
    // fontWeight: 'bold',
    marginVertical: 10,
    alignSelf: 'center',
    width: '80%',
  },
  btn: {width: '70%', alignSelf: 'center', marginTop: 20},

  underlineStyleBase: {
    width: 50,
    height: 50,
    borderWidth: 1,
    color: COLORS.black,
    borderColor: COLORS.blue,
    borderRadius: 8,
    backgroundColor: 'white',
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
  subContainer: {
    width: '80%',
    alignSelf: 'center',
    height:"64%",
    backgroundColor: COLORS.lightGrey2,
    borderRadius: 8,
    marginVertical: 20,
    marginTop:60,
    justifyContent:"center",
    alignItems:"center"
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
    alignSelf:"center"
    // width: 25,
    // height: 25,
  },
  keyboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginVertical: 8,
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
    width: '100%',
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    flex: 1,
  },

  centeredView: {
    backgroundColor: COLORS.lightGrey2,
    borderRadius: 15,
    overflow: "hidden",
    paddingVertical: 15,
    width: "90%",
    alignSelf: "center",
  },
  modalText: {
    paddingHorizontal: 20,
  },
  loading:{
    position:'absolute',
    alignSelf:'center',
    top:'30%'
  }
});
export default createStyles;
