import React, { useMemo, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet
} from "react-native";
import CustomText from "../../components/customText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { hp, width, wp } from "../../utilis/dimensions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CommonStyles from "../../constants/CommonStyles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { COLORS } from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Modal } from "react-native-paper";

const {height}= Dimensions.get('window')
const TourScreen5 = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const [loading, setLoading] = useState(false);
  const code = route?.params?.code;
  const email = route?.params?.email;
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);

  const [showTip, setShowTip] = useState(true);
  const scrollViewRef = useRef();
  const transactionsList=[
   {
    detail:'تم سحبهم مقابل إنشاء صفقة',
    id:'HG34RTY667009UX',
    amount:'100.00',
    date:'26-05-2023, 8:19:33 pm',
    trx_type:'+'
   },
   {
    detail:'مقابل قيمه شراء الصفقة',
    id:'EX04RWY667909UX',
    amount:'-80.00',
    date:'12-06-2023, 8:19:33 pm',
    trx_type:'-'
   }
  ]


  const handleLang = async (value) => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    if (i18n.language == "ar") {
      try {
        await i18n.changeLanguage("en");
        await AsyncStorage.setItem("@CACHED_LANG", "en");
      } catch (e) {
        // saving error
      }
    } else {
      try {
        await i18n.changeLanguage("ar");
        await AsyncStorage.setItem("@CACHED_LANG", "ar");
      } catch (e) {
        // saving error
      }
    }
  };


  const renderItem = ({ item }) => {
    // console.log('item',item)
    return (
      <TouchableOpacity
        style={styles.statementItem}
        // onPress={() => setShowDetailsModal({ status: true, item: item })}
      >
        <View style={styles.infoCont}>
          <View style={styles.Icon}>
            <FontAwesome5
              name="money-bill-wave"
              size={25}
              color={COLORS.blue}
            />
          </View>
          <View style={styles.descCont}>
            <CustomText
              color={COLORS.black}
              size={12}
              text={item.detail}
              style={styles.descTxt}
            />
            <CustomText
              color={COLORS.black}
              size={12}
              text={item.id}
              style={styles.descTxt}
            />
          </View>
        </View>
        <View style={styles.infoCont2}>
          <CustomText
            color={item?.trx_type == "-" ? COLORS.red : COLORS.green}
            size={17}
            text={item.amount}
            style={styles.phoneTxt}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={item.date}
            style={styles.userNameTxt}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const toolTip=()=>{
    return(
      <View style={{width: "100%",alignItems: "center",position:'absolute'}}>
              <Tooltip
                isVisible={showTip}
                // accessible={false}
                allowChildInteraction={false}
                // closeOnChildInteraction={false}
                // closeOnContentInteraction={false}
                content={
                  <View>
                    <CustomText
                        color={COLORS.black}
                        size={13}
                        text={t('introductionTour.statments')}
                      />
                     
                  </View>
                }
                onClose={() => { 
                  navigation.navigate('TourScreen6')
                }}
                placement='bottom'
                // childrenWrapperStyle={{ width: "100%", }}
                tooltipStyle={{marginTop: height*0.25}}
                // below is for the status bar of react navigation bar
                topAdjustment={0}
                contentStyle={{width:'100%', paddingVertical:10, justifyContent:'center'}}
                >
                  {showTip?
                  <View style={{}}>
                   <MaterialCommunityIcons
                   name={i18n.language=='ar'?"arrow-left-circle": "arrow-right-circle"}
                   size={wp(20)}
                   color={"#DDE3E8"} style={{position:'absolute'}}/>
                   <CircularProgressBase
                   value={50}
                   maxValue={60}
                   radius={40}
                   title=""
                   showProgressValue={false}
                   activeStrokeColor={'#007598'}
                   inActiveStrokeColor={'#788995'} />
                   </View>
                  :null}
              </Tooltip>
            </View>
    )
  }
  const controlBtn=()=>{
    return(
    <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}}
    onPress={()=> navigation.replace('TourScreen6')}>
      <MaterialCommunityIcons
      name={i18n.language=='ar'?"arrow-left-bold": "arrow-right-bold"}
      size={wp(16)}
      color={COLORS.blue} style={{position:'absolute'}}/>
      <CircularProgressBase
      value={50}
      maxValue={60}
      radius={40}
      title=""
      showProgressValue={false}
      activeStrokeColor={COLORS.blue}
      inActiveStrokeColor={'#788995'} />
    </TouchableOpacity>
    )
  }
  const content=()=>{
    return(
    <Modal
    animationType='fade'
    transparent={true}
    visible={true}
    onRequestClose={() => {
      setVisible(false);
    }}
  >
    <View style={styles.modelContainer}>
      {controlBtn()}
    <Ionicons name={"caret-up-outline"} size={wp(10)} color={COLORS.blue} style={{marginTop:height*0.1}}/>   
    <View style={[styles.contentContainer,{marginTop: -height*0.022,backgroundColor: COLORS.blue}]}> 
    <CustomText
          color={COLORS.white}
          size={12}
          text={t('introductionTour.escrowDetailsText')}
        />
    </View> 
    </View>
  </Modal>
    )
  }


  return (
    <View style={{ height:'100%',backgroundColor: COLORS.white}}>
    <ScrollView ref={scrollViewRef} style={{ }}>
      {/* <ChangeLanguageModal
        show={modalVisible1}
        setShow={setModalVisible1}
        handleLang={handleLang}
      /> */}
 
     
      {/* {toolTip()} */}
      <View style={[CommonStyles.transactionsContainer,{marginTop: hp(1)}]}>
           
        <View style={styles.filterIconsContainer}>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => {}}
          >
            <AntDesign name="filter" size={28} color={COLORS.header} />
          </TouchableOpacity>
          <TouchableOpacity
            //style ={styles.filter}
            onPress={() => {}}
          >
            <AntDesign name="search1" size={25} color={COLORS.header} />
          </TouchableOpacity>
        </View>
        <FlatList
            style={{marginTop: hp(5)}}
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => {}}
              />
            }
            data={transactionsList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            onEndReachedThreshold={0.1}
          />
          </View>
         
    </ScrollView>
    {content()}
    <View style={[styles.iconBg,{backgroundColor: COLORS.white,}]}> 
            <View style={{alignItems:'center'}}>
             <MaterialCommunityIcons
                name="home-variant-outline"
                size={33}
                color={COLORS.footerIcon}
              />  
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("home")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
                <EvilIcons
                name="user"
                size={40}
                color={ COLORS.footerIcon}
              />
               <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("profile")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
              <View style={styles.homeCon}>
              <View style={[styles.home,{backgroundColor: COLORS.blue}]}>
              <FontAwesome
                name="plus"
                size={30}
                color={ COLORS.white}
              />   
              </View>
              </View>
              <CustomText
                  color={COLORS.blue}
                  size={width*0.022}
                  text={t("add")}
                  style={styles.statisticsTxt}
                />
            </View>
            <View style={{alignItems:'center'}}>
             <Ionicons
                name="settings-outline"
                size={26}
                color={ COLORS.footerIcon}
              /> 
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("setting")}
                  style={styles.statisticsTxt}
                />  
            </View>
            <View style={{alignItems:'center'}}>
             <EvilIcons
                name="navicon"
                size={30}
                color={ COLORS.footerIcon}
              />   
              <CustomText
                  color={COLORS.footerIcon}
                  size={width*0.022}
                  text={t("more")}
                  style={styles.statisticsTxt}
                />
            </View>    
    </View>
    </View>
  );
};
const styles=  StyleSheet.create({
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
    paddingHorizontal: wp(1),
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
    width:'100%',
    flexDirection: "row",
    alignItems: "center",
    alignSelf:'center',
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
  iconBg:{
    position:'absolute',
    bottom:0,
    flexDirection:'row',
    width:'100%',
    justifyContent:'space-between',
    alignSelf:'center',
    paddingHorizontal:10,
    paddingVertical:7,
    elevation:4
  },
  modelContainer:{
    width:'90%', 
    height:height*0.55, 
    alignSelf:'center',
    alignItems:'center',
  },
  contentContainer:{
    width:'80%', 
    alignItems:'center',
    shadowOpacity:0.5,
    borderRadius:10, 
    marginTop: height*0.4,
    shadowOffset:{width:0, height:0},
    elevation:3,
    paddingVertical:hp(1),
  },
  home: {
    width: wp(15),
    height: wp(15),
    backgroundColor: COLORS.blue,
    borderRadius: wp(15) / 2,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 1 },
  },
  homeCon: {
    width: wp(18),
    height: wp(18),
    backgroundColor: "#f5f5f5",
    marginTop: -hp(5),
    borderRadius: wp(18) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default TourScreen5;
