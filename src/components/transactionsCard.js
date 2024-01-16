import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import CustomText from "./customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { hp, width, wp } from "../utilis/dimensions";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { storeStackValue } from "../redux/actions/user";
import { useDispatch } from "react-redux";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

const TransactionCard = ({
  navigation,
  route,
  acceptReturn = false,
  details,
  link = "TransactionDetails",
  photo = "userAvatar.png",
  el,
  categoryName,
  isClickable
}) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [customerID, setCustomerID] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    const getID = async () => {
      const CUSTOMER_ID = await AsyncStorage.getItem("CUSTOMER_ID");
      setCustomerID(CUSTOMER_ID);
    };
    getID();
  }, []);

  // console.log('dd',details,el.escrow_number,customerID,el.buyer_id)
  // const el = route?.params
  // console.log("elll : ", el);

  const rowItem=(icon1, label1, value1, icon2, label2, value2)=>{
    return(
      <View style={{width:'100%', flexDirection:'row', alignItems:'center',padding:4}}> 
        <View style={{flex:1, alignItems:'flex-start'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <FontAwesome5 name={icon1} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label1}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={12}
              text={value1}
              style={styles.value}/>
        </View>
        <View style={{width: wp(2)}}/>
        <View style={{flex:1, alignItems:'flex-start'}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <FontAwesome5 name={icon2} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label2}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={12}
              text={value2}
              style={styles.value}/>
        </View>
      </View>
    )
  }
  const columItem=(icon, label, value)=>{
    return(
        <View style={{flex:1, alignItems:'flex-start',padding:4}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <FontAwesome5 name={icon} size={15} color={COLORS.loginTab}/>
            <CustomText
              color={COLORS.loginTab}
              size={11}
              text={label}
              style={styles.label}/>
          </View>
          <CustomText
              color={COLORS.black}
              size={13}
              text={value}
              style={styles.value}/>
        </View>
    )
  }
  return (
    <>
      {details ? (
        <View style={styles.transactionsCardContainer}>
          <View style={styles.cardCont1}>
            <View style={styles.cardSubCont1}>
              <View>
                <Image
                  style={styles.avatar}
                  resizeMode="contain"
                  source={
                    el?.buyer_id == customerID
                      ? el?.partner_api == 0
                        ? require(`../assets/buy_hires.png`)
                        : require(`../assets/buy_hiresP.jpeg`)
                      : el?.partner_api == 0
                      ? require(`../assets/sell_hires.png`)
                      : require(`../assets/sell_hiresP.jpeg`)
                  }
                />
                <CustomText
                  color={COLORS.primaryTxt}
                  size={12}
                  text={
                    el?.buyer_id == customerID
                      ? t("transactionsScreen.bu")
                      : t("transactionsScreen.sel")
                  }
                  style={styles.nameTxt}
                />
              </View>
              <View style={styles.txtSubCont1}>
                <CustomText
                  color={COLORS.black}
                  size={13}
                  text={t("transactionsScreen.escrowTitle")}
                  style={styles.nameTxt}
                />
                <CustomText
                  color={COLORS.primaryTxt}
                  size={14}
                  text={`${el?.title}`}
                  style={styles.nameTxt}
                />
                {el.escrow_type != 1 && (
                  <View style={styles.typeContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.header}
                    />

                    <CustomText
                      color={COLORS.header}
                      size={14}
                      text={`${
                        el?.agreement ||
                        t("transactionsScreen.Agreement_Linked")
                      }`}
                      style={styles.typeTxt}
                    />
                  </View>
                )}
              </View>
            </View>
            <CustomText
              color={COLORS.primaryTxt}
              size={16}
              text={parseFloat(el?.escrow_amount).toFixed(2) + " SAR"}
              style={styles.transactionsCurrTxt}
            />
          </View>

          <View style={styles.cardSubCont2}>
            <View>
              <CustomText
                color={COLORS.transactionsTitle}
                size={12}
                text={t("transactionsScreen.TransactionNo")}
              />
              <CustomText
                color={COLORS.statisticsTitle}
                size={10}
                text={el?.escrow_number}
                style={styles.transactionInfo}
              />
            </View>

            {el?.escrow_type == 0 && (
              <View>
                <CustomText
                  color={COLORS.transactionsTitle}
                  size={12}
                  text={t("transactionsScreen.ItemContains")}
                />
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={10}
                  text={el?.products?.length}
                  style={styles.transactionInfo}
                />
              </View>
            )}

            <View>
              <CustomText
                color={COLORS.transactionsTitle}
                size={12}
                text={t("transactionsScreen.TransactionDate")}
              />
              <CustomText
                color={COLORS.statisticsTitle}
                size={10}
                text={`${moment(el?.created_at)
                  .locale("en")
                  .format("DD-MM-YYYY  HH:mm:ss a")}`}
                style={styles.transactionInfo}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "flex-start",
              alignItems: "center",
              flexDirection: "row",
              marginLeft: wp(3),
            }}
          >
            <CustomText
              color={COLORS.transactionsTitle}
              size={12}
              text={
                el?.buyer_id == customerID
                  ? el?.invitation_mail
                    ? t("transactionsScreen.sphone")
                    : t("transactionsScreen.sname")
                  : el?.invitation_mail
                  ? t("transactionsScreen.bphone")
                  : t("transactionsScreen.bname")
              }
            />
            <CustomText
              color={COLORS.statisticsTitle}
              size={10}
              text={
                el?.buyer_id == customerID ? el?.seller_name : el?.buyer_name
              }
              style={styles.transactionInfo2}
            />
          </View>

          <View style={styles.cardSubCont3}>
            <View style={styles.cardSubCont4}>
              <Image
                style={styles.categoryLogo}
                source={{ uri: categoryName?.image }}
              />
              <CustomText
                color={COLORS.transactionsSuccessStatus}
                size={12}
                text={
                  i18n.language == "ar"
                    ? categoryName?.name_ar
                    : categoryName?.name_en
                }
                style={[styles.nameTxt]}
              />
            </View>
            
            <View style={{ flexDirection: "row" }}>
              <CustomText
                color={COLORS.transactionsTitle}
                size={12}
                text={t("transactionsScreen.status")}
              />
              <CustomText
                color={
                  el?.status != "paid"
                    ? COLORS.red
                    : COLORS.transactionsSuccessStatus
                }
                size={13}
                text={el.status.value}
                style={[
                  styles.nameTxt,
                  acceptReturn && { color: "green" },
                  { marginLeft: 5 },
                ]}
              />
            </View>
          </View>
        </View>
      ) : (
        <>
        <TouchableOpacity
          style={[isExpanded? styles.transactionsCardContainer2: styles.transactionsCardContainer]}
          onPress={() =>{ 
            setIsExpanded(!isExpanded)
              }}
        >
          <View style={styles.cardCont1}>
            <View style={styles.cardSubCont1}>
              <View style={{width:'25%',alignItems:'center'}}>
                <Image
                  style={styles.avatar}
                  resizeMode="contain"
                  source={
                    el?.buyer_id == customerID
                      ? el?.partner_api == 0
                        ? require(`../assets/buy_hires.png`)
                        : require(`../assets/buy_hiresP.jpeg`)
                      : el?.partner_api == 0
                      ? require(`../assets/sell_hires.png`)
                      : require(`../assets/sell_hiresP.jpeg`)
                  }
                />
                <CustomText
                  color={COLORS.primaryTxt}
                  size={12}
                  text={
                    el?.buyer_id == customerID
                      ? t("transactionsScreen.bu")
                      : t("transactionsScreen.sel")
                  }
                  style={styles.nameTxt}
                />
              </View>
              <View style={styles.txtSubCont1}>
                <CustomText
                  color={COLORS.black}
                  size={13}
                  text={t("transactionsScreen.escrowTitle")+': '+ el?.title}
                  style={styles.nameTxt}
                />
                {/* <CustomText
                  color={COLORS.primaryTxt}
                  size={15}
                  text={`${el?.title}`}
                  style={styles.nameTxt}
                /> */}
                 <CustomText
                 color={COLORS.primaryTxt}
                 size={15}
                 text={parseFloat(el?.escrow_amount).toFixed(2) + t("reviewTransaction.sar")}/>
                

                {el?.escrow_type == 0 && (
                  <View style={styles.typeContainer}>
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={COLORS.header}
                    />
                    <CustomText
                      color={COLORS.header}
                      size={15}
                      text={`${
                        el?.agreement ||
                        t("transactionsScreen.Agreement_Linked")
                      }`}
                      style={styles.typeTxt}
                    />
                  </View>
                )}
              </View>
            </View>

            <TouchableOpacity onPress={()=>{
              if(isClickable){
                !route?.params && el?.is_draft == 1
                ? (navigation.navigate("plus", {
                    screen: "ShortEscrow",
                    params: {
                      draftData: el,
                      sellerOrBuyer:
                        el?.buyer_id == customerID ? "Buyer" : "Seller",
                    },
                  }),
                  dispatch(storeStackValue(true)))
                : navigation.navigate(link, {
                    success: el?.success,
                    status: el?.status,
                    el: el,
                    from:'Transactions'
                  })
               }
            }}>
             <CustomText
              color={COLORS.blue}
              size={15}
              text={t('transactionsScreen.details')}
              style={styles.transactionsCurrTxt2}
            />
            </TouchableOpacity>
            <Ionicons name={isExpanded?"caret-up-outline":"caret-down-outline"}  size={18} color={COLORS.header} style={{position:'absolute',top: hp(1.7), right: wp(2)}}/>
          </View>
        </TouchableOpacity>

        {isExpanded?
         <View style={styles.childContainer}>
          {rowItem('clipboard-list',t("transactionsScreen.TransactionNo"),el?.escrow_number,
          'clipboard-list',t("transactionsScreen.TransactionDate"),moment(el?.created_at).locale("en").format("DD-MM-YYYY  HH:mm:ss a"))}
        
         
          {rowItem('clipboard-list',el?.buyer_id == customerID
                  ? el?.invitation_mail
                    ? t("transactionsScreen.sphone")
                    : t("transactionsScreen.sname")
                  : el?.invitation_mail
                  ? t("transactionsScreen.bphone")
                  : t("transactionsScreen.bname"),el?.buyer_id == customerID
                  ? el?.seller?.username
                    ? el?.seller?.username
                    : el?.invitation_mail
                  : el?.buyer?.username
                  ? el?.buyer?.username
                  : el?.invitation_mail,
          'clipboard-list',t("transactionsScreen.status"),el.status.value)}

          {rowItem('clipboard-list',t("RegisterScreen.Category"),i18n.language == "ar"? el?.category?.name_ar: el?.category?.name_en,
          'clipboard-list',t("transactionDetails.productType"), i18n.language == "en"? el?.product_condition: el?.product_condition == "new"? "جديد": "مستعمل")}

        
           {el?.escrow_type == 0 && (
            columItem('clipboard-list',t("transactionsScreen.ItemContains"), el?.products?.length)
            )}
            <View style={{marginHorizontal: wp(1),marginVertical:hp(1)}}>
              <View style={[styles.value,{flexDirection:'row'}]}>
                <CustomText
                  color={COLORS.red}
                  size={13}
                  text={
                    el?.escrow_type == 1
                      ? t("transactionsScreen.shortEscrow")
                      : t("transactionsScreen.longEscrow")
                  }
                />
                {el?.escrow_type == 1 && el?.is_draft == 1 && (
                  <CustomText
                    color={COLORS.red}
                    size={13}
                    text={t("transactionsScreen.draft")}
                    style={[{ marginLeft: 5 }]}
                  />
                )}
              </View>
            </View>
           
          
         </View>
        :null}
        </>
      )}
    </>
  );
};

export default TransactionCard;
const createStyles = (COLORS) =>
  StyleSheet.create({
    transactionsCardContainer: {
      backgroundColor: COLORS.transactionsCard,
      minWidth: "99%",
      alignSelf: "center",
      marginVertical: hp(1),
      shadowColor: COLORS.blue,
      shadowOpacity: 0.3,
      shadowOffset: { width: 1, height: 1 },
      // shadowRadius: 30,
      elevation: 5,
      borderRadius: 15,
      paddingHorizontal: wp(3),
    },
    transactionsCardContainer2: {
      backgroundColor: COLORS.transactionsCard,
      minWidth: "99%",
      alignSelf: "center",
      marginVertical: hp(1),
      shadowColor: COLORS.blue,
      shadowOpacity: 0.3,
      shadowOffset: { width: 1, height: 1 },
      elevation: 5,
      borderTopLeftRadius:15,
      borderTopRightRadius:15,
      paddingHorizontal: wp(3),
    },
    cardCont1: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginVertical: 10,
    },
    cardSubCont1: {
      flexDirection: "row",
      alignItems: "center",
      width: "70%",
    },
    cardSubCont2: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 7,
    },
    cardSubCont3: {
      marginVertical: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardSubCont4: {
      flexDirection: "row",
    },

    avatar: {
      marginHorizontal: wp(3),
      width: wp(20),
      height: hp(7),
    },

    transactionInfo: {
      backgroundColor: COLORS.transactionsInfoBg,
      // fontWeight: 'bold',
      minWidth: "22%",
      minHeight: 33,
      borderRadius: 10,
      marginVertical: 2,
      padding: 7,
    },
    transactionInfo2: {
      backgroundColor: COLORS.transactionsInfoBg,
      minWidth: "22%",
      minHeight: 33,
      borderRadius: 10,
      marginVertical: 2,
      padding: 7,
      marginLeft: wp(2),
    },
    transactionsCurrTxt: {
      marginTop: 30,
      marginLeft: -50,
      // fontWeight: 'bold',
    },
    transactionsCurrTxt2:{
      marginTop: hp(6),
      marginLeft: -50,
      textDecorationLine:'underline'
    },
    txtSubCont1: {
      alignItems: "flex-start",
      width: "100%",
    },
    nameTxt: {
      textAlign: "left",
      // fontWeight: 'bold',
    },
    typeContainer: {
      flexDirection: "row",
    },
    typeTxt: {
      marginHorizontal: 5,
    },
    categoryLogo: {
      width: wp(10),
      height: wp(10),
      marginHorizontal: wp(3),
      borderRadius: wp(10),
    },
    escrowTypeCont: {
      // alignSelf:'flex-start',
      flexDirection: "row",
      justifyContent: "space-between",
      // alignItems:'center',
    },
    escrowTypeSubCont: {
      flexDirection: "row",
      marginVertical: hp(0.5),
      marginHorizontal: wp(2),
    },
    childContainer:{
      backgroundColor: COLORS.white,
      borderBottomLeftRadius:15,
      borderBottomRightRadius:15,
      paddingHorizontal:3,
      borderColor: '#f3f3f3',
      borderWidth:2,
    },
     label:{
       marginHorizontal: wp(1)
     },
     value:{
       flex:1,
       backgroundColor: '#FBFAFA',
       textAlign:'left',
       paddingHorizontal: wp(1),
       paddingVertical:2,
       elevation:2,
       borderRadius:8,
       shadowOpacity:0.2,
       shadowOffset:{width:1, height:1},
     },
  });
