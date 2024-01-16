import { StyleSheet } from "react-native";
import { hp, wp } from "../../utilis/dimensions";
import Profile from "../Profile";
const createStyles = (COLORS) =>
  StyleSheet.create({
    socialMediaContainer: {
      flexDirection: "row-reverse",
      justifyContent: "center",
      marginBottom: hp(2),
      marginTop: hp(2),
    },
    socialMediaItem: {
      marginHorizontal: wp(2),
    },
    drawerHeaderContent: {
      backgroundColor: COLORS.blue,
      height: hp(9),
      justifyContent: "center",
      paddingHorizontal: wp(3),
    },
    ProfileContainer: {
      flexDirection: "row",
      // backgroundColor:'red',
      width: "90%",
      justifyContent: "flex-start",
      height: "12%",
      alignItems: "center",
      
    },
    avatar: {
      width:wp(16),
      height: wp(16),
      borderRadius: wp(16)/2,
      marginLeft: wp(2),
    },
    headerTxt: {
      alignItems: "flex-start",
      paddingHorizontal: wp(5),
    },
    accountSettingsContainer: {
      justifyContent: "center",
      alignItems: "flex-start",
      paddingHorizontal: wp(2),
      minHeight: hp(8),
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 1,
    },
    contactUsTitleCont: {
      justifyContent: "center",
      alignItems: "flex-start",
      marginVertical: hp(1),
      paddingHorizontal: wp(2),
      minHeight: hp(6),
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 1,
    },
    accountSettingsTxt: {
      //fontWeight:'bold'
    },
    accountSettingsSideMenueDatacont: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: wp(2),
      minHeight: hp(5.3),
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 1,
    },

    txtCont: {
      minWidth: "80%",
      alignItems: "flex-start",
      paddingHorizontal: wp(5),
    },
    drawer: {
      backgroundColor: COLORS.white,
      width: "80%",
    },
    text: {
      alignSelf: "center",
      textAlign: "center",
    },
    versionStyle: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: hp(3),
    },
  });
export default createStyles;
