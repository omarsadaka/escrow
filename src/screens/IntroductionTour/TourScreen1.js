import React, { useMemo, useState, useRef } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { hp, width, wp } from "../../utilis/dimensions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import CommonStyles from "../../constants/CommonStyles";
import { Modal } from "react-native-paper";

const {height}= Dimensions.get('window')
const TourScreen1 = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const [newPassword, setNewPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const code = route?.params?.code;
  const email = route?.params?.email;
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const scrollViewRef = useRef();

  const DashboardData = [
    {
      txt: i18n.language=='ar'? 'إجمالي الصفقات': 'ee' ,
      currVal: 10,
      link: "Transactions",
      param: "",
    },
    {
      txt:  i18n.language=='ar'? 'متنازع علية': 'ee' ,
      currVal: 4,
      link: "Transactions",
    //   param: data?.data?.dashboard?.disputed?.filter,
    },
    {
      txt:  i18n.language=='ar'? 'تمت الموافقه': 'ee' ,
      currVal: 3,
      link: "Transactions",
    //   param: data?.data?.dashboard?.accepted?.filter,
    },
    {
      txt: i18n.language=='ar'? 'بانتظار القبول': 'ee' ,
      currVal: 140,
      link: "Transactions",
    //   param: data?.data?.dashboard?.notAccepted?.filter,
    },
    {
      txt: i18n.language=='ar'? 'مكتمل': 'ee' ,
      currVal: 5,
      link: "Transactions",
    //   param: data?.data?.dashboard?.completed?.filter,
    },
    {
      txt: i18n.language=='ar'? 'ملغي': 'ee' ,
      currVal:5,
      link: "Transactions",
    //   param: data?.data?.dashboard?.cancelled.filter,
    },
    {
      txt: i18n.language=='ar'? 'تم التوصيل': 'ee' ,
      currVal: 2,
      link: "Transactions",
    //   param:data?.data?.dashboard?.delivered?.filter,
    },
    {
      txt: i18n.language=='ar'? 'تم الاستلام': 'ee' ,
      currVal: 7,
      link: "Transactions",
    //   param: data?.data?.dashboard?.deliveryConfirm?.filter,
    },
    {
      txt: i18n.language=='ar'? 'مرفوض ومرتجع': 'ee' ,
      currVal: 4,
      link: "Transactions",
    //   param: data?.data?.dashboard?.rejected?.filter,
    },
    {
      txt: i18n.language=='ar'? 'مرتجع مقبول': 'ee' ,
      currVal: 1,
      link: "Transactions",
    //   param:data?.data?.dashboard?.accept_reject?.filter,
    },
    {
      txt: i18n.language=='ar'? 'تمت الموافقه والدفع': 'ee' ,
      currVal: 2,
      link: "Transactions",
    //   param:data?.data?.dashboard?.accepted_paid?.filter,
    },
    {
      txt: i18n.language=='ar'? 'موقوف': 'ee' ,
      currVal: 2,
      link: "Transactions",
    //   param:data?.data?.dashboard?.on_hold?.filter,
    },
    {
      txt: i18n.language=='ar'? 'مسودة': 'ee' ,
      currVal: 1,
      link: "Transactions",
    //   param:data?.data?.dashboard?.drafted?.filter,
    },
  ];
  const OperationsData = [
    {
      txt: t("Transaction"),
      icon: (
        <Fontisto name="arrow-swap" size={30} color={COLORS.operationsIcons} />
      ),
      link: "Transactions",
    },
    {
      txt: t("statement"),
      icon: (
        <AntDesign name="printer" size={30} color={COLORS.operationsIcons} />
      ),
      link: "Statement",
    },
    {
      txt: t("Account & card"),
      icon: (
        <MaterialCommunityIcons
          name="cash"
          size={40}
          color={COLORS.operationsIcons}
        />
      ),
      link: "Accounts",
    },
    // {
    //   txt: t("Withdraw"),
    //   icon: (
    //     <AntDesign name="printer" size={30} color={COLORS.operationsIcons} />
    //   ),
    //   link: "WithdrawLog",
    // },
    // {
    //   txt: t("Agreement"),
    //   icon: (
    //     <Ionicons
    //       name="card-outline"
    //       size={30}
    //       color={COLORS.operationsIcons}
    //     />
    //   ),
    //   link: "Agreement",
    // },
    // {
    //   txt: t("deposit.de"),
    //   icon: (
    //     <Ionicons
    //       name="cash-outline"
    //       size={30}
    //       color={COLORS.operationsIcons}
    //     />
    //   ),
    //   link: "LoadDepositMethods",
    // },
    // {
    //   txt: t("Settings"),
    //   icon: (
    //     <Ionicons name="stats-chart" size={30} color={COLORS.operationsIcons} />
    //   ),
    //   link: "Settings",
    // },
  ];


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


  const toolTip1=()=>{
    return(
      <View style={{width: "100%",alignItems: "center",position:'absolute'}}
            >
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
                        size={12}
                        text={t('introductionTour.addEscrowText')}
                      />
                  </View>
                }
                onClose={() => { 
                    navigation.replace('TourScreen2')
                }}
                placement='top'
                // childrenWrapperStyle={{ width: "100%", }}
                tooltipStyle={{marginTop: height*0.73}}
                topAdjustment={0}
                contentStyle={{width:'100%', height:'100%', paddingVertical:0}}
               >
                  {showTip?
                  <View style={{}}>
                   <MaterialCommunityIcons
                   name={i18n.language=='ar'?"arrow-left-circle": "arrow-right-circle"}
                   size={wp(20)}
                   color={"#DDE3E8"} style={{position:'absolute'}}/>
                   <CircularProgressBase
                   value={10}
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
    onPress={()=> navigation.replace('TourScreen2')}>
      <MaterialCommunityIcons
      name={i18n.language=='ar'?"arrow-left-bold": "arrow-right-bold"}
      size={wp(16)}
      color={COLORS.blue} style={{position:'absolute'}}/>
      <CircularProgressBase
      value={10}
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
    <View style={styles.contentContainer}> 
    <CustomText
          color={COLORS.white}
          size={12}
          text={t('introductionTour.addEscrowText')}
        />
    </View> 
    <Ionicons name={"caret-down-outline"} size={wp(10)} color={COLORS.blue} style={{marginTop:-height*0.022}}/>    
    </View>
  </Modal>
    )
  }


  return (
    <View style={{ height:'100%',alignItems:'center',backgroundColor: COLORS.white}}>
       <View style={CommonStyles.bg}>
          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("transactions")}
            style={styles.titleTxt}
          />

          {/* Curr Section */}
          <View style={styles.container1}>
              <>
                <View style={styles.monContainer}>
                  <View style={styles.currContainer}>
                    <CustomText
                      color={COLORS.monCurr}
                      size={20}
                      text={t('dashboard.SAR')}
                      style={styles.currTxt}
                    />
                  </View>
                  <View style={styles.monValContainer}>
                  <Feather
                      name={"eye-off"}
                      size={25}
                      color={COLORS.operationsIcons}
                      onPress={()=> {}}
                    />
                    <CustomText
                      color={COLORS.monText}
                      size={20}
                      text={'********'}
                      style={styles.monTxt}
                    />
                    <Fontisto
                      name="wallet"
                      size={25}
                      color={COLORS.operationsIcons}
                    />
                  </View>
                </View>
               
                <View style={{alignItems:'flex-start'}}>
                <CustomText
                  color={COLORS.primaryTxt}
                  size={16}
                  text={t("iam")}
                  style={styles.titleTxt}/>
                  <View style={{alignItems:'center', flexDirection:'row'}}>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                     
                     }}>
                     <Ionicons name="cart-outline" size={33} color={COLORS.operationsIcons} />
                     <TouchableOpacity onPress={()=> setVisible(true)}>
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("buyer")}
                      style={[styles.statisticsTxt,{textDecorationLine: 'underline'}]}/>
                      </TouchableOpacity>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                      
                     }}>
                     <Ionicons name="basket-outline" size={33} color={COLORS.operationsIcons} />
                     <TouchableOpacity onPress={()=> setVisible(true)}>
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("seller")}
                      style={[styles.statisticsTxt,{textDecorationLine: 'underline'}]}/>
                      </TouchableOpacity>
                   </TouchableOpacity>
                  </View>

                </View>
              </>
           
          </View>
          {/* Operations */}
          
          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("operations")}
            style={styles.operationsTitle}
          />
          <View style={styles.operationsSection}>
            {OperationsData.map((el, index) => (
              <TouchableOpacity
                key={index}
                style={styles.operationsItem}
                onPress={() => {}}
              >
                {el.icon}
                <CustomText
                  color={COLORS.operationsItemTxt}
                  size={14}
                  text={el.txt}
                  style={styles.statisticsTxt}
                />
              </TouchableOpacity>
            ))}
          </View>

         

        </View>
       
      {/* {toolTip1()} */}
      {content()}
        <View style={styles.iconBg}> 
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
export default TourScreen1;
