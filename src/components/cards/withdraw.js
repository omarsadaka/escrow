import React, { useMemo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import CustomText from "./../customText";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../../utilis/dimensions";
import moment from "moment";
import { useDispatch } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { showSimpleModal } from "../../redux/actions/modal";
const WithdrawCard = ({ navigation, route, data, deposit }) => {
  const { colors: COLORS } = useTheme();
  const dispatch = useDispatch()
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  // console.log("data from card", data.id);
  const handleDetailsModal = ({admin_feedback,status}) => {
   // console.log('data',admin_feedback,status)
   status != 2 && 
   dispatch( showSimpleModal({
      status: true,
      payload: {
        header: i18n.language == 'ar'? 'ملاحظات المشرف' :'admin feedback' ,
        message:admin_feedback ? admin_feedback:t('withdraw.noFeedBack') ,
        action: "",
        type:'success'
      },}))
  }





  return (
    <TouchableOpacity
      style={styles.transactionsCardContainer}
       onPress={()=>handleDetailsModal(data)}
     // onPress={()=>{}}
    >
      <View style={styles.cardCont1}>
        <View style={styles.cardSubCont1}>
          <View style={styles.txtSubCont1}>
            <CustomText
              color={COLORS.primaryTxt}
              size={17}
              text={`${deposit ? data?.gateway?.name : data?.method?.name}`}
              style={styles.nameTxt}
            />
           {data?.admin_feedback &&(
             <View style={styles.typeContainer}>
              <CustomText
                color={COLORS.header}
                size={14}
                text={`${
                  deposit ? data?.admin_feedback : data?.admin_feedback
                }`}
                style={styles.typeTxt}
              />
            </View>)}
          </View>
          <View style={styles.txtSubCont2}>
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={`${deposit ? data?.final_amo : data?.final_amount} `}
              style={styles.nameTxt}
            />
            <View style={styles.typeContainer}>
              <CustomText
                color={COLORS.header}
                size={19}
                text={`${deposit ? data?.method_currency : data?.currency}`}
                style={styles.typeTxt}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardSubCont2}>
        <View>
          <CustomText
            color={COLORS.transactionsTitle}
            size={12}
            text={
              deposit ? t("depositHistory.stat") : t("withdraw.withdrawStatus")
            }
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={
              
               data?.status == "1"
                  ? "Approved"
                  : data?.status == "2"
                  ? "pending"
                  : data?.status == "3"
                  ? "Rejected"
                  : ""
            }
            style={styles.transactionInfo}
          />
        </View>

        <View>
          <CustomText
            color={COLORS.transactionsTitle}
            size={12}
            text={deposit ? t("depositHistory.depN") : t("withdraw.withdrawNo")}
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={`${data?.trx}`}
            style={styles.transactionInfo}
          />
        </View>
      </View>
      <View style={styles.dateIconCont} >
      <View style={styles.dateStyle}>
        <CustomText
          color={COLORS.transactionsTitle}
          size={12}
          text={deposit ? t("depositHistory.depD") : t("withdraw.withdrawDate")}
        />
        <CustomText
          color={COLORS.statisticsTitle}
          size={12}
          text={`${moment(data?.created_at)
            .locale('en')
            .format("DD-MM-YYYY, hh:mm:ss A")}`}
          style={styles.transactionInfo2}
        />
      </View>
      {  data?.status != 2 &&
      <TouchableOpacity onPress = {()=>{}}>
      <FontAwesome
            onPress={()=>handleDetailsModal(data)}
            name={"pencil-square-o"}
            style={styles.lang}
            size={25}
            color={COLORS.header}
          />
      </TouchableOpacity>
            } 
      </View> 
    </TouchableOpacity>
  );
};

export default WithdrawCard;
const createStyles = (COLORS) =>
  StyleSheet.create({
    transactionsCardContainer: {
      backgroundColor: COLORS.transactionsCard,
      width: "100%",
      alignSelf: "center",
      marginVertical: hp(1),
      shadowColor: COLORS.blue,
      shadowOpacity: 0.8,
      shadowOffset: { width: 5, height: 5 },
      shadowRadius: 30,
      elevation: 5,
      borderRadius: 15,
      paddingHorizontal: wp(4),
    },
    cardCont1: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginVertical: 10,
    },

    cardSubCont2: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginVertical: 7,
    },
    dateStyle: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      marginBottom:hp(1)
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
      height: hp(9),
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
      // fontWeight: 'bold',
      minWidth: "22%",
      minHeight: 33,
      borderRadius: 10,
      // marginVertical: 2,
      padding: 7,
      marginLeft: wp(2),
    },
    transactionsCurrTxt: {
      // fontWeight: 'bold',
    },
    cardSubCont1: {
      flexDirection: "row-reverse",
      justifyContent: "space-between",
    },
    txtSubCont1: {
      alignItems: "flex-end",
      minWidth: "50%",
    },
    txtSubCont2: {
      alignItems: "flex-start",
      minWidth: "50%",
      flexDirection: "row-reverse",
      alignItems: "center",
      justifyContent: "center",
    },
    nameTxt: {
      // fontWeight: 'bold',
    },
    typeContainer: {
      flexDirection: "row",
    },
    typeTxt: {
      // marginHorizontal: 5,
    },
    categoryLogo: {
      width: wp(10),
      height: wp(10),
      marginHorizontal: wp(3),
    },
    dateIconCont:{
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
    }
  });
