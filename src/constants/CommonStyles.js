import { StyleSheet } from "react-native";
import { COLORS } from "./colors";
import { height, hp, wp } from "../utilis/dimensions";

export default StyleSheet.create({
  bg: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 5,
    alignItems: "flex-start",
    width: "100%",
    // height: height*0.77
  },
  header: {
    flexDirection: "row",
    backgroundColor: COLORS.header,
    width: "100%",
    height: 127,
    borderBottomEndRadius: 15,
    borderBottomStartRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBg: {
    width: wp(103.6),
    marginTop: hp(-4.5),
    height: hp(20),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: wp(7),
    marginLeft: wp(-3.6),
  },
  headerBgEnglish: {
    width: wp(103.6),
    marginTop: hp(-4.5),
    height: hp(20),
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.bg,
    borderRadius: wp(7),
    marginRight: wp(-3.6),
  },
  titleTxt: {
    // fontWeight: 'bold',
    marginVertical: 5,
  },
  filterTxt: {
    // fontWeight: 'bold',
  },
  transactionsContainer: {
    paddingHorizontal: wp(2),
    marginVertical: 7,
    alignItems: "center",
    flex: 1,
    paddingBottom:hp(2),
  },
  //DROPdOWN
  dropdownCont: {
    alignItems: "flex-start",
  },
  dropDownRow: {
    borderBottomWidth: 1,
  },

  dropDownBtn: {
    backgroundColor: COLORS.inputBackGround,
    width: "90%",
    height: hp(6),

    // borderBottomColor: COLORS.bg,
    marginVertical: hp(2),
    borderWidth: wp(0.28),
    borderColor: COLORS.header,
    borderRadius: wp(2),
    // marginRight:wp(-1),
  },
  dropDownBtnTxt: {
    writingDirection: "rtl",
    textAlign: "left",
    opacity: 0.7,
    color: COLORS.black,
    fontFamily: "BahijTheSansArabic-Plain",
    fontSize: 14,
  },
  dropDownTxt: {
    textAlign: "left",
    opacity: 0.7,
    fontFamily: "BahijTheSansArabic-Plain",
    fontSize: 14,
  },
  dropDown: {
    borderColor: COLORS.white,
    maxHeight: hp(22),
    elevation: 7,
  },
  textareaContainer: {
    borderColor: COLORS.header,
    borderWidth: wp(0.28),
    borderRadius: hp(1),
    width: "90%",
    alignSelf: "center",
    marginBottom: hp(2),
    marginTop: hp(2),
    height: hp(16),
    paddingBottom: hp(2),
  },
  // CLOSE MODAL ICON
  closeCont: {
    marginHorizontal: wp(3),
  },
  logo: {
    alignSelf: "center",
    width: wp(70),
    height: hp(32),
  },
});
