import {StyleSheet} from 'react-native';
import { hp,wp } from '../../utilis/dimensions';

const createStyles = COLORS =>
  StyleSheet.create({
    bg: {
      flexGrow: 1,
      backgroundColor: 'black',
      justifyContent: 'space-between',
    },
    logo: {
      alignSelf: "center",
      width:wp(70),
      height:hp(33)
    },
    text: {
      alignSelf: 'center',
      textAlign: 'center',
      marginVertical:hp(1)
    },
    text2: {
      // textAlign: 'left',
      // fontWeight: 'bold',
    },
    quickSignContainer: {
      width: '80%',
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    textColored: {
      color: COLORS.blue,
      // fontWeight: '500',
    },
    btn: {width: '70%', alignSelf: 'center', marginTop: 20},
    skipContainer: {
      height: 50,
      justifyContent: 'center',
      alignSelf: 'center',
      textAlign: 'center',
    },
    translate: {
      width: '50%',
    },
    translateText: {
      textAlign: 'center',
    },
    socialContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical:10
    },
    social: {
      alignSelf: 'center',
      width: 30,
      height: 30,
      marginHorizontal:10,
      resizeMode:"contain"
    },
    modalView: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(52, 52, 52, 0.6)',
      flex: 1,
    },
    
    centeredView: {
      backgroundColor: COLORS.lightGrey2,
      borderRadius: 15,
      overflow: 'hidden',
    
      paddingBottom: 15,
      width: '90%',
      alignSelf: 'center',
    },
    centeredView2: {
      position: 'absolute',
      // top: '15%',
    },
    modalText: {
      paddingHorizontal: 20,
    },
    modalSubView: {
      backgroundColor: COLORS.white,
      paddingVertical: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
      width: '100%',
    },
    closeButtonTxt: {
      color: COLORS.grey,
        // fontWeight: 'bold',
      },
      closeButton: {
        width: '80%',
        alignSelf: 'center',
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.grey,
      
        
      },
      passRulesContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
        backgroundColor:COLORS.babyBack,
        width:"80%",
        alignSelf:"center",
        padding:10,
        borderRadius:9
      },
      conditionsContainer:{
        flexDirection:"row",
        justifyContent:"flex-start",
        width:"80%",
        alignSelf:"center",
        padding:10,
        borderRadius:9
      },
      termsHeader:{
        borderBottomColor:COLORS.lightGrey,
        borderBottomWidth:0.8,
        marginVertical:10,
        paddingVertical:15,
        width:'100%'
      }    ,
      centeredView2: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        backgroundColor: 'white',
        paddingHorizontal:"8%"
    
      },
  });
export default createStyles;
