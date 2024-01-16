import React, { useMemo, useState, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet
} from "react-native";
import CustomText from "../../components/customText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Tooltip from "react-native-walkthrough-tooltip";
import CircularProgressBase from 'react-native-circular-progress-indicator';
import { hp, width, wp } from "../../utilis/dimensions";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import TransactionCard from "../../components/transactionsCard";
import CommonStyles from "../../constants/CommonStyles";
import { COLORS } from "../../constants/colors";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import { Modal } from "react-native-paper";

const {height}= Dimensions.get('window')
const TourScreen4 = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const code = route?.params?.code;
  const email = route?.params?.email;
  // const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [acceptReturn, setAcceptReturn] = useState(false);

  const [showTip, setShowTip] = useState(true);
  const scrollViewRef = useRef();
  const transactionsItem=
    {
      amount: "81.57", 
      api_id: null, 
      attachments: [],
      seller_name:'seller name',
      buyer_name:'seller name',
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
                        text={t('introductionTour.transactionsDetailsText')}
                      />
                     
                  </View>
                }
                onClose={() => { 
                  navigation.navigate('TourScreen5')
                }}
                placement='bottom'
                // childrenWrapperStyle={{ width: "100%", }}
                tooltipStyle={{marginTop: height*0.32}}
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
                   value={40}
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
    onPress={()=> navigation.replace('TourScreen5')}>
      <MaterialCommunityIcons
      name={i18n.language=='ar'?"arrow-left-bold": "arrow-right-bold"}
      size={wp(16)}
      color={COLORS.blue} style={{position:'absolute'}}/>
      <CircularProgressBase
      value={40}
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
    <View style={[styles.contentContainer,{marginTop: height*0.2,backgroundColor: COLORS.blue}]}> 
    <CustomText
          color={COLORS.white}
          size={12}
          text={t('introductionTour.transactionsDetailsText')}
        />
    </View> 
    <Ionicons name={"caret-down-outline"} size={wp(10)} color={COLORS.blue} style={{marginTop:-height*0.022}}/>   
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
      <View style={[CommonStyles.transactionsContainer,{marginTop: hp(6)}]}>
            <CustomText
              color={COLORS.primaryTxt}
              size={20}
              text={t("transDetailsScreen.transDet")}
              style={CommonStyles.titleTxt}
            />
             <View style={styles.tabCont}>
            {[
              { name: t("transDetailsScreen.transInfo"), icon: "details" },
              { name: t("transDetailsScreen.pay"), icon: "timeline-text" },
              { name: t("transDetailsScreen.chat"), icon: "chat" },
            ].map((el, i) => (
              <TouchableOpacity
                disabled={transactionsItem ? false : true}
                onPress={() => {
                  // i == 1 && onRefresh();
                  // setSelected(i);
                }}
                key={i}
                style={
                  i == false
                    ? [styles.tabItem, { backgroundColor: COLORS.header }]
                    : styles.tabItem
                } //in case of active]:''}
              >
                <MaterialCommunityIcons
                  name={el.icon}
                  color={i == false ? "white" : COLORS.loginTab}
                  size={20}
                />
                <CustomText
                  color={i == false ? COLORS.activeTabTxt : COLORS.tabTxt} //state=el white
                  size={width*0.025}
                  text={`${el.name}`}
                  // style={styles.tabTxt}
                />
              </TouchableOpacity>
            ))}
          </View>
            <TransactionCard
                key={transactionsItem.id}
                navigation={navigation}
                el={transactionsItem}
                details={true}
                isClickable={false}
                route={route}
                categoryName={i18n.language=='ar'? transactionsItem?.category.name_ar: transactionsItem?.category.name_en}
                acceptReturn={acceptReturn}
            />
             <View style={styles.collapsBodyCont}>
            {/* items actual price */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <FontAwesome5
                  name="money-bill-wave-alt"
                  size={15}
                  color={COLORS.loginTab}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transDetailsScreen.itemP")}
                  style={styles.accordionTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={13}
                  text={
                    transactionsItem?.escrow_amount + t("reviewTransaction.sar")
                  }
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {/* short name */}
            {transactionsItem?.escrow_short_name &&
              transactionsItem?.escrow_type == 1 && (
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="stamp"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("shortEscrow.shortName")}
                      style={styles.accordionTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={transactionsItem?.escrow_short_name}
                    />
                  </View>
                </View>
              )}
            {transactionsItem?.discount_amount != 0 &&
              transactionsItem?.escrow_type == 0 && (
                <>
                  {/* discount type */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.discountType")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          transactionsItem?.discount_type == 1
                            ? t("transDetailsScreen.percen")
                            : t("transDetailsScreen.fix")
                        }
                      />
                    </View>
                  </View>
                  {/* discount amount */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <FontAwesome5
                        name="money-bill-wave-alt"
                        size={15}
                        color={COLORS.loginTab}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.discountAmount")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={13}
                        text={
                          transactionsItem?.discount_type == 1
                            ? transactionsItem?.discount_amount + " %"
                            : transactionsItem?.discount_amount +
                              t("reviewTransaction.sar")
                        }
                      />
                    </View>
                  </View>
                </>
              )}
            {/* charge payer */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <Ionicons name="person" size={15} color={COLORS.loginTab} />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transDetailsScreen.chargePayer")}
                  style={styles.accordionTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={
                    transactionsItem?.charge_payer == 1
                      ? t("transDetailsScreen.seller")
                      : transactionsItem?.charge_payer == 2
                      ? t("transDetailsScreen.bayer")
                      : "50%/%50"
                  }
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {/* charge */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <FontAwesome5
                  name="money-bill-wave-alt"
                  size={15}
                  color={COLORS.loginTab}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transDetailsScreen.charge")}
                  style={styles.accordionTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={transactionsItem?.charge + t("reviewTransaction.sar")}
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {/* buyer charge */}
            {transactionsItem?.escrow_type == 0 && (
              <>
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.chargeBuyer")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        transactionsItem?.buyer_charge +
                        " " +
                        t("reviewTransaction.sar")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
                {/* seller charge */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.sellerCharge")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        transactionsItem?.seller_charge +
                        t("reviewTransaction.sar")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
              </>
            )}

            {transactionsItem?.shipping_cost != 0 &&
              transactionsItem?.escrow_type == 0 && (
                <>
                  {/* shipping payer */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <Ionicons
                        name="person"
                        size={15}
                        color={COLORS.loginTab}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.shipingPayer")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          transactionsItem?.charge_shipping == 1
                            ? t("transDetailsScreen.seller")
                            : t("transDetailsScreen.bayer")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* shipping Cost */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <FontAwesome5
                        name="money-bill-wave-alt"
                        size={15}
                        color={COLORS.loginTab}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.shippingCost")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          transactionsItem?.shipping_cost +
                          t("reviewTransaction.sar")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                </>
              )}
            {/* vat percentage */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <FontAwesome5
                  name="money-bill-wave-alt"
                  size={15}
                  color={COLORS.loginTab}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transDetailsScreen.vatPercen")}
                  style={styles.accordionFinalTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={transactionsItem?.vat_percentage + " %"}
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {/* vat Amount */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <FontAwesome5
                  name="money-bill-wave-alt"
                  size={15}
                  color={COLORS.loginTab}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transDetailsScreen.vatAmount")}
                  style={styles.accordionFinalTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={
                    transactionsItem?.vat_amount + t("reviewTransaction.sar")
                  }
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {transactionsItem?.escrow_type == 0 && (
              <>
                {/* Expiry date */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <Ionicons
                      name="calendar"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.exp")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={moment(transactionsItem?.expiry_date)
                        .locale("en")
                        .format("DD-MM-YYYY")}
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
                {/* inspection period */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <Ionicons
                      name="calendar"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.insPer")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        transactionsItem?.extended_vat == 0
                          ? transactionsItem?.inspection_period +
                            t("transDetailsScreen.day") +
                            t("transDetailsScreen.standard")
                          : transactionsItem?.inspection_period +
                            t("transDetailsScreen.day")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
              </>
            )}

            {transactionsItem?.extended_vat != 0 && (
              <>
                {/* vat extended percentage */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.extended")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={transactionsItem?.extended_vat_pre + " %"}
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
                {/* vat extended Amount */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.extendedamount")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        transactionsItem?.extended_vat +
                        t("reviewTransaction.sar")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
              </>
            )}
            {transactionsItem?.escrow_type == 0 && (
              <>
                {/* payed Amount */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <FontAwesome5
                      name="money-bill-wave-alt"
                      size={15}
                      color={COLORS.loginTab}
                    />
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={t("transDetailsScreen.payedAmount")}
                      style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        transactionsItem?.paid_amount +
                        t("reviewTransaction.sar")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
              </>
            )}

            {/* reset Amount */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <FontAwesome5
                  name="money-bill-wave-alt"
                  size={15}
                  color={COLORS.loginTab}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={
                    transactionsItem?.paid_amount == 0
                      ? t("transDetailsScreen.resetAmount")
                      : t("transDetailsScreen.payedAmount")
                  }
                  style={styles.accordionFinalTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={
                    transactionsItem?.paid_amount == 0
                      ? transactionsItem?.amount
                      : transactionsItem?.paid_amount +
                        t("reviewTransaction.sar")
                  }
                  style={styles.accordionTitle}
                />
              </View>
            </View>
            {/*  files*/}
            {transactionsItem?.escrow_type == 0 ? (
              <>
                <Collapse>
                  <CollapseHeader>
                    <View style={styles.accordionAgreementTitle}>
                      <View style={styles.aggIcon}>
                        <Ionicons
                          name="ios-documents"
                          size={18}
                          color={COLORS.loginTab}
                        />
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={t("transDetailsScreen.agg")}
                          style={styles.accordionTitle}
                        />
                      </View>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={30}
                        color={COLORS.header}
                      />
                    </View>
                  </CollapseHeader>
                  <CollapseBody style={styles.agreementBodyCont}>
                    {details?.agreements.map((el) => (
                      <TouchableOpacity
                        onPress={() => {
                          // setAgreementDetails(el);
                          // setShowAgreementDetails(true);
                        }}
                      >
                        <CustomText
                          color={COLORS.header}
                          size={14}
                          text={'el?.title'}
                          style={styles.accordionTitle}
                        />
                      </TouchableOpacity>
                    ))}
                  </CollapseBody>
                </Collapse>
              </>
            ) : (
              <>
                {transactionsItem?.attachments.length > 0 && (
                  <Collapse>
                    <CollapseHeader>
                      <View style={styles.accordionAgreementTitle}>
                        <View style={styles.aggIcon}>
                          <Ionicons
                            name="ios-documents"
                            size={18}
                            color={COLORS.loginTab}
                          />
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.attachments")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <MaterialIcons
                          name="arrow-drop-down"
                          size={30}
                          color={COLORS.header}
                        />
                      </View>
                    </CollapseHeader>
                    <CollapseBody style={styles.agreementBodyCont}>
                      {transactionsItem?.attachments.map((el, index) => (
                        <TouchableOpacity
                          onPress={() => {
                            // navigation.navigate("PDFViewer", {
                            //   link: el,
                            //   attachment: true,
                            // });
                          }}
                        >
                          <CustomText
                            color={COLORS.header}
                            size={14}
                            text={
                              t("transDetailsScreen.attachment") + (index + 1)
                            }
                            style={styles.accordionTitle}
                          />
                        </TouchableOpacity>
                      ))}
                    </CollapseBody>
                  </Collapse>
                )}
                <TouchableOpacity
                  onPress={() => {
                    // navigation.navigate("PDFViewer", {
                    //   link: details?.agreements[0]?.attachment_path,
                    // });
                  }}
                >
                  <CustomText
                    color={COLORS.header}
                    size={14}
                    text={t("shortEscrow.previewAgg")}
                    style={styles.accordionTitle}
                  />
                </TouchableOpacity>
              </>
            )}
          </View>
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

const styles =StyleSheet.create({
  container: {
    flex: 1,
    //paddingBottom: 30,
    backgroundColor: COLORS.backGround,
  },
  tabCont: {
    width: "100%",
    height: 45,
    marginVertical: 10,
    justifyContent: "space-around",
    flexDirection: "row",
    borderRadius: hp(2),
    backgroundColor: COLORS.transactionsCard,
  },

  detailsCont: {
    flexGrow: 1,
    minHeight: hp(25),
    // maxHeight: hp(48),
    borderRadius: hp(2),
    width: wp(90),
    alignSelf: "center",
  },

  chatCont: {
    width: "100%",
    height: "75%",
    backgroundColor: COLORS.transactionsCard,
  },
  //accordion
  cardSubCont2: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 7,
  },

  accordionTitleContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    // backgroundColor: COLORS.red,
  },
  accordionTitle: {
    opacity: 0.9,
    marginVertical: 1,
    marginHorizontal: wp(1),
  },
  accordionTitleEdit: {
    marginHorizontal: wp(1),
  },

  accordionFinalTitle: {
    marginHorizontal: wp(1),
  },
  aggIcon: { flexDirection: "row", alignItems: "center" },
  accordionBodyTitleCont: {
    alignItems: "center",
    marginVertical: 2,
    flexDirection: "row",
  },
  agreementBodyCont: {
    paddingHorizontal: 10,
    backgroundColor: COLORS.agreementBg,
    paddingVertical: 10,
  },
  btnContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    backgroundColor: COLORS.transactionsCard,
  },
  btn: {
    width: "40%",
    // alignSelf: 'center',
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
    borderRadius: 10,
    paddingVertical: 15,
    height: 550,
    width: "90%",
    position: "absolute",
    top: "3%",
  },
  modalContent1: {
    height: "70%",
  },

  settlementDes: {
    padding: 10,
    borderRadius: 7,
    width: "95%",
    alignSelf: "center",
    // textAlignVertical: 'top',
    backgroundColor: COLORS.settlementDes,
  },
  closeButton: {
    width: "80%",
    alignSelf: "center",
    marginTop: 20,
    borderWidth: 1,
    borderColor: COLORS.grey,
  },
  couponButton: {
    width: "30%",
    height: hp(6),
    // alignSelf: "center",
    marginTop: hp(1),
    // borderWidth: 1,
    // borderColor: COLORS.grey,
  },
  closeButtonTxt: {
    color: "black",
    // fontWeight: 'bold',
  },
  initiateBtnTxt: {
    // fontWeight: 'bold',
  },

  title: {
    // fontWeight: 'bold',
    marginVertical: 6,
    paddingHorizontal: 2,
  },
  DisputeTitleCont: {
    alignItems: "flex-start",
  },
  couponContainer: {
    flexDirection: "row",
    width: "95%",
    alignItems: "center",
    justifyContent: "space-between",
    // backgroundColor: "red",
    marginLeft: wp(2),
  },
  tabItem: {
    width: "33.3%",
    height: "100%",
    borderRadius: hp(2),
    justifyContent: "center",
    alignItems: "center",
  },
  TimeLineContainer: {
    width: "100%",
    flex: 1,
    borderRadius: hp(2),
    backgroundColor: COLORS.transactionsCard,
    paddingVertical: wp(2),
  },
  indicator: {
    width: wp(90),
    height: hp(50),
    alignItems: "center",
    justifyContent: "center",
  },
  //accordion
  transactionInfo: {
    backgroundColor: COLORS.transactionsInfoBg, //
    // fontWeight: 'bold',
    minWidth: "28%",
    // minHeight:30,
    borderRadius: 10,
    marginVertical: 2,
    paddingVertical: 5,
  },
  collapsBodyCont: {
    width:'100%',
    backgroundColor: COLORS.transactionsCard,
    paddingBottom: 15,
  },
  transactionInfo2: {
    backgroundColor: COLORS.transactionsCard,
    // paddingVertical: hp(1),
    paddingHorizontal: 10,
    borderWidth: 0.2,
    borderColor: COLORS.babyBlue3,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  accordionContainer: {
    borderWidth: 0.5,
    paddingHorizontal: 10,
    borderColor: COLORS.babyBlue,
    backgroundColor: COLORS.transactionsCard,
  },

  accordionAgreementTitle: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.agreementBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  settDescTitle: {
    alignSelf: "flex-start",
    marginHorizontal: 10,
  },
  modalView: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(52, 52, 52, 0.6)",
    flex: 1,
  },

  centeredView: {
    backgroundColor: COLORS.lightGrey2,
    borderRadius: 10,
    overflow: "hidden",

    paddingBottom: 15,
    width: "90%",
    alignSelf: "center",
    //backgroundColor:'red',
    paddingVertical: hp(2),
    minHeight: hp(53),
  },
  centeredView2: {
    position: "absolute",
    // top: '15%',
  },
  labledDes2: {
    alignItems: "flex-start",
    marginHorizontal: wp(4),
    maxHeight: hp(5),
    marginVertical: hp(1),
  },
  viewTitle: {
    width: wp(80),
    // marginVertical:hp(1),
  },
  modalText: {
    paddingHorizontal: 20,
  },
  modalSubView: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    width: "100%",
  },
  closeButtonTxt: {
    color: COLORS.black,
    // fontWeight: 'bold',
  },
  textColored3: {
    // backgroundColor: "red",
    width: wp(14),
    borderRadius: wp(4),
    borderWidth: wp(0.4),
    borderColor: COLORS.header,
    marginLeft: wp(1),
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
  }
})
export default TourScreen4;
