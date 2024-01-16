import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../../components/customHeader";
import CustomText from "../../../components/customText";
import TicketsCard from "../../../components/cards/support-tickets";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SupportTicketsHistory = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [TicketsLog, setTicketsLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState("2");
  const [baseURL, setBaseURL] = useState("");
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [env]);
  const getSavedEnv = async () => {
    try {
      const value = await AsyncStorage.getItem("ENVIROMENT");
      if (value !== null) {
        // value previously stored
        setEnv(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getSavedEnv();
  }, []);

  useEffect(() => {
    if (!baseURL) return;
    fetchTicketsList();
  }, [baseURL]);

  const onRefresh = () => {
    fetchTicketsList();
  };

  const fetchTicketsList = async () => {
    setLoading(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      fetch(baseURL + ENDPOINTS.ticketsList, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data;",
          "X-Localization": i18n?.language
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.supports.data) {
            setTicketsLog(responseData.supports.data);
            setLoading(false);
          } else {
            setLoading(false);
          }
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHeader navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.ticketsScreen}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        <CustomText
          text={t("supportTickets.ticketsLog")}
          color={COLORS.cardBlue}
          // style={styles.title}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate("NewSupportTicket")}
          style={styles.newTicketBtn}
        >
          <CustomText
            text={t("supportTickets.newTicket")}
            color={COLORS.cardBlue}
          />
        </TouchableOpacity>

        {!loading ? (
          TicketsLog?.length > 0 ? (
            TicketsLog.map((el) => (
              <TicketsCard key={el.id} data={el} navigation={navigation} />
            ))
          ) : (
            <CustomText
              text={t("supportTickets.noData")}
              color={COLORS.cardBlue}
              // style={styles.title}
            />
          )
        ) : (
          <ActivityIndicator color={COLORS.header} />
        )}
      </ScrollView>
    </>
  );
};

export default SupportTicketsHistory;
