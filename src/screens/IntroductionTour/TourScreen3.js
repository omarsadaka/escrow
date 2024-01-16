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
  FlatList,
  RefreshControl
} from "react-native";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { hp, width, wp } from "../../utilis/dimensions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TransactionCard from "../../components/transactionsCard";
import CommonStyles from "../../constants/CommonStyles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Modal } from "react-native-paper";

const {height}= Dimensions.get('window')
const TourScreen3 = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const [loading, setLoading] = useState(false);
  const code = route?.params?.code;
  const email = route?.params?.email;
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [showTip, setShowTip] = useState(true);
  const scrollViewRef = useRef();
  const transactionsList=[
    {
      amount: "81.57", 
      api_id: null, 
      attachments: [],
      buyer: {
        "address": [Object],
        "balance": "10000.00000000",
        "ban_reason": null,
        "country_code": "SA",
        "created_at": "2023-05-24T14:27:16.000000Z",
        "current_language": "ar",
        "date_of_birth": "24-05-1995",
        "email": "omar@g.com", 
        "ev": 0, "firstname":
        "omar2", 
        "id": 79, 
        "image": "https://escrow2d.meiladigital-sa.com/backend/core/storage/profileimg/1686232226f490ae764c0668c3767acc5ffea7ba6e.jpeg", 
        "kv": 1, "kyc_data": [Array], 
        "last_login": "2023-06-12 20:43:30", 
        "lastname": "sadaka", 
        "mobile": "966502222222", 
        "national_id": 0, 
        "pin": 123456, "profile_complete": 1, 
        "pv": 0, "ref_by": 0, "status": 1, "sv": 1, "ts": 0, 
        "tsc": null, "tv": 1, "updated_at": "2023-06-12T14:43:30.000000Z", 
        "username": "omar123", "ver_code_send_at": "2023-05-28T20:18:16.000000Z",
        "buyer_charge": "23.10", "buyer_id": 79, 
      },
       "category": {
          "created_at": "2023-01-19T11:27:05.000000Z", "id": 1, 
          "image": "https://escrow2d.meiladigital-sa.com/backend/core/storage/categories/1678195371.png", 
          "name_ar": "ألكترونيات", "name_en": "Electronics", "status": 1, 
          "updated_at": "2023-03-07T10:22:51.000000Z"
        }, 
        "category_id": 1, 
        "charge": "23.10", "charge_payer": 2, "charge_shipping": null, 
        "coupon_code": null, "coupon_discount": null, 
        "created_at": "2023-06-07T17:33:28.000000Z", 
        "creator_id": 85, "delivery_confirmation": 3, 
        "delivery_confirmation_type": "hour", "delivery_time": null, 
        "details": "Sfg hghhg", "discount_amount": null, "discount_type": null, 
        "dispute_charge": "0.00", "dispute_note": null, "dispute_time": null, 
        "disputer_id": 0, "escrow_amount": 55, "escrow_confirmation": 3, 
        "escrow_confirmation_type": "hour", "escrow_number": "96QEH7BGC134", 
        "escrow_short_name": "Gggg", "escrow_type": 1, "expiry_date": null, 
        "extended_vat": "0.00", "extended_vat_pre": 0, "id": 66, "inspection_period": 3, 
        "inspection_period_type": "hour", "invitation_mail": null, "is_draft": 0, 
        "paid_amount": "0.00", "partner_api": 0, "product_condition": "new", 
        "seller": {
            "address": [Object], "balance": "9924.70000000", 
            "ban_reason": null, "country_code": "SA", 
            "created_at": "2023-06-01T14:31:02.000000Z", 
            "current_language": "ar", "date_of_birth": "01-06-1995", 
            "email": "omar2@gmail.com", "ev": 0, "firstname": "Omar", 
            "id": 85, "image": "https://escrow2d.meiladigital-sa.com/backend/core/storage/profileimg/16861686900b086c2f39f48138ab5f30b4b9eeb0d1.jpeg", 
            "kv": 1, "kyc_data": null, "last_login": "2023-06-08 19:19:28", 
            "lastname": "Sadaka", "mobile": "966501234123", "national_id": 0, 
            "pin": 123456, "profile_complete": 1, "pv": 0, "ref_by": 0, 
            "status": 1, "sv": 1, "ts": 0, "tsc": null, "tv": 1, 
            "updated_at": "2023-06-08T13:19:28.000000Z", "username": "Omar987", 
            "ver_code_send_at": "2023-06-01T14:31:03.000000Z"
          }, 
        "seller_charge": "0.00", "seller_charged": null, "seller_id": 85, 
        "shipping_cost": null, "short_agreement_confirmation": 1, 
        "status": {
           "code": 9, "filter": "canceled", "value": "ملغي"
        }, 
        "title": "Ona you", "updated_at": "2023-06-08T08:24:32.000000Z", 
        "vat_amount": "3.47", "vat_percentage": 15
          
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


  const toolTip=()=>{
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
                        size={13}
                        text={t('introductionTour.escrowDetailsText')}
                      />
                     
                  </View>
                }
                onClose={() => { 
                  navigation.navigate('TourScreen4')
                }}
                placement='bottom'
                // childrenWrapperStyle={{ width: "100%", }}
                tooltipStyle={{marginTop: height*0.45}}
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
                   value={30}
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
    onPress={()=> navigation.replace('TourScreen4')}>
      <MaterialCommunityIcons
      name={i18n.language=='ar'?"arrow-left-bold": "arrow-right-bold"}
      size={wp(16)}
      color={COLORS.blue} style={{position:'absolute'}}/>
      <CircularProgressBase
      value={30}
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
    <Ionicons name={"caret-up-outline"} size={wp(10)} color={COLORS.blue} style={{marginTop:height*0.2}}/>   
    <View style={[styles.contentContainer,{marginTop: -height*0.022,}]}> 
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
    <View style={{height:'100%',backgroundColor: COLORS.white}}>
      {/* {toolTip()} */}
      <View style={CommonStyles.transactionsContainer}>
            <CustomText
              color={COLORS.primaryTxt}
              size={20}
              text={t("transactionsScreen.transactions")}
              style={CommonStyles.titleTxt}
            />
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {}}
                  />
                }
                data={transactionsList}
                renderItem={({ item: el }) => (
                  <TransactionCard
                    key={el.id}
                    navigation={navigation}
                    el={el}
                    isClickable={false}
                  />
                )}
                keyExtractor={(item, index) => index}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                onEndReachedThreshold={0.1}
               
              />
            
      </View>
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
export default TourScreen3;
