import { Dimensions, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { COLORS } from "../../constants/colors";
import { hp, wp } from "../../utilis/dimensions";

const { width, height } = Dimensions.get("window");

const createStyles = (COLORS) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: COLORS.backGround,
    },
    logo: {
      alignSelf: "center",
      width: 100,
      height: 100,
    },
    loadingStyle: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    phoneTxt: {
      //fontWeight:'bold'
    },
    descTxt: {
      maxWidth: "90%",
    },
    statementItem: {
      flexDirection: "row",
      borderBottomWidth: 0.3,
      paddingHorizontal: wp(4),
      paddingVertical: hp(2),
      justifyContent: "space-between",
    },
    infoCont: {
      flexDirection: "row",
      alignItems: "center",
      width: wp(50),
    },
    descCont: {
      alignItems: "center",
    },
    Icon: {
      marginHorizontal: wp(3),
      //alignSelf:'center'
    },
    // filter:{
    //   //alignSelf:'flex-end',

    // },
    filterIconsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginHorizontal: wp(5),
      marginVertical: hp(1),
    },
    headerFilter: {
      backgroundColor: COLORS.white,
      paddingVertical: 10,
      marginBottom: 10,
      paddingHorizontal: wp(5),
    },
    dateItem: {
      marginVertical: hp(0.5),
      paddingVertical: hp(0.3),
      minWidth: "40%",
      marginHorizontal: wp(5),
      borderWidth: 0.5,
    },
    flatlistFilterContent: {
      alignItems: "center",
      marginVertical: hp(2),
    },
    //modal

    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.ModalBg, //change
      paddingHorizontal: 5,
      borderRadius: 15,
      paddingVertical: 2,
      // height:550,
      width: "90%",
      position: "absolute",
      top: "3%",
    },
    modalContent1: {
      height: "70%",
    },

    termsHeader: {
      borderBottomColor: COLORS.lightGrey,
      borderBottomWidth: 0.8,
      marginVertical: hp(1),
      paddingVertical: hp(1),
      width: "100%",
    },
    modalSubView: {
      paddingHorizontal: wp(1),
    },
    modalSubView1: {
      // alignItems:'center',
      flexDirection: "row",
      justifyContent: "space-between",
      //  backgroundColor:'red',
      // minHeight:'10%'
    },

    descTitle: {
      marginVertical: hp(2),
      //fontWeight:'bold',
    },
    closeIcon: {
      alignSelf: "flex-end",
      marginHorizontal: wp(2),
    },
    detailsButton: {
      width: "65%",
      alignSelf: "center",
      marginVertical: hp(1),
    },
  });
export default createStyles;
