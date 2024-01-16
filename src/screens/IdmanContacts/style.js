import {Platform, StyleSheet} from 'react-native';
import {height, hp, wp} from '../../utilis/dimensions';

const createStyles = (COLORS) =>
  StyleSheet.create({
    contactContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      width: "90%",
      alignSelf: "center",
      borderRadius:8,
      backgroundColor: COLORS.white,
      elevation:2,
      shadowOpacity:0.2,
      shadowOffset:{height:1,width:1},
      marginVertical:hp(0.6),
      padding:4
    },
    contactSubContainer: {
      flex:1,
      alignItems:'flex-start',
      paddingHorizontal:wp(2)
    },
    contactSubContainer2: {
      alignItems:'center',
      paddingHorizontal:wp(2)
    },
    thumbNail: {
      width: wp(13),
      height: wp(13),
      borderRadius: wp(13)/2,
    },
    thumbNail3: {
      width: wp(12),
      height: wp(12),
      borderRadius: wp(12)/2,
      alignItems:'center',
      justifyContent:'center'
    },
    thumbNail2: {
      width: wp(16),
      height: wp(16),
      borderRadius: wp(16)/2,
    },
    contactTxt1: {},
    operationsItem: {
      backgroundColor: COLORS.operationsCard,
      flex:1,
      marginHorizontal: wp(2),
      borderRadius: 10,
      alignItems: "center",
      shadowColor: COLORS.blue,
      shadowOpacity: 0.2,
      shadowOffset: { width: 1, height: 2 },
      shadowRadius: 10,
      elevation: 3,
      paddingVertical:2
    },
    statisticsTxt: {
      textAlignVertical: "center",
    },
    transactionHistory:{
      marginTop:hp(3),
      width:'95%',height: height*0.45,
      alignItems:'center',
      shadowOpacity: 0.2,
      shadowOffset: { width: 1, height: 2 },
      elevation: 3,
      backgroundColor: COLORS.white,
      borderColor: COLORS.blue,
      borderWidth:0.6
    },
    line:{
      width:'100%',
      height:0.6,
      backgroundColor: COLORS.blue,
      marginVertical:hp(0.8)
    },
    containerStyle:{
      width:'90%',
      backgroundColor:'#E5E4E2',
      borderWidth:0,
      height: 40,
      alignItems:'center',
      paddingTop: Platform.OS=='ios'? hp(1) : 0
    },
    textContainerStyle:{
      
    }
   
  });
export default createStyles;
