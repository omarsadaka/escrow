import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import CustomText from "./../customText";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../../utilis/dimensions";
import moment from "moment";
import { useDispatch } from "react-redux";
const TicketsCard = ({ navigation, route, data }) => {
  const { colors: COLORS } = useTheme();
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  // console.log("data from card", data.id);

  return (
    <TouchableOpacity
      style={styles.transactionsCardContainer}
      onPress={() => {
        navigation.navigate("SupportTicketDetails", { data: data });
      }}
    >
      <View style={styles.cardCont1}>
        <View style={styles.cardSubCont1}>
          <View style={styles.txtSubCont1}>
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={data?.name}
              // style={styles.nameTxt}
            />
            <View style={styles.typeContainer}>
              <CustomText
                color={COLORS.header}
                size={14}
                text={data?.subject}
                // style={styles.typeTxt}
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
            text={t("supportTickets.ticketStatus")}
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={
              data?.status == "0"
                ? t("supportTickets.ticketstatus0")
                : data?.status == "1"
                ? t("supportTickets.ticketstatus1")
                : data?.status == "2"
                ? t("supportTickets.ticketstatus2")
                : data?.status == "3"
                ? t("supportTickets.ticketstatus3")
                : ""
            }
            style={styles.transactionInfo}
          />
        </View>

        <View>
          <CustomText
            color={COLORS.transactionsTitle}
            size={12}
            text={t("supportTickets.ticketNo")}
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={`${data?.ticket}`}
            style={styles.transactionInfo}
          />
        </View>
        <View>
          <CustomText
            color={COLORS.transactionsTitle}
            size={12}
            text={t("supportTickets.ticketPriority")}
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={
              data?.priority == "1"
                ? t("supportTickets.ticketPriority1")
                : data?.priority == "2"
                ? t("supportTickets.ticketPriority2")
                : t("supportTickets.ticketPriority3")
            }
            style={styles.transactionInfo}
          />
        </View>
      </View>
      <View style={styles.dateIconCont}>
        <View style={styles.dateStyle}>
          <CustomText
            color={COLORS.transactionsTitle}
            size={12}
            text={t("supportTickets.lastReply")}
          />
          <CustomText
            color={COLORS.statisticsTitle}
            size={12}
            text={`${moment(data?.last_reply)
              .locale("en")
              .format("DD-MM-YYYY, hh:mm:ss A")}`}
            style={styles.transactionInfo2}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TicketsCard;

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
      justifyContent: "flex-start",
      alignItems: "center",
      marginVertical: hp(1),
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
      marginBottom: hp(1),
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
    cardSubCont1: {},
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
    dateIconCont: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
