import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import CustomText from "../../../components/customText";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomHeader from "../../../components/customHeader";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { ENDPOINTS, getBaseURL } from "../../../constants/API";
import axios from "axios";
import CustomAlert from "../../../components/CustomAlert";
import { RefreshControl } from "react-native";

const LoadDepositMethods = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState(null);
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [refresh, setRefresh] = useState(false);
  const loadMethods = async () => {
    setLoading(true);
    console.log("in load methods list...");
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.loadDepositMethods,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        console.log("res methods : ", res?.data);
        if (res?.data?.status == "ok") {
          setMethods(res?.data?.data?.methods);
          setLoading(false);
        } else {
          setErrMess(t("deposit.error"));
          setLoading(false);
          setWarning(true);
        }
      })
      .catch((er) => {
        setErrMess(t("deposit.error"));
        setWarning(true);
        console.log("er : ", er);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!baseURL) return;
    loadMethods();
  }, [navigation, baseURL]);
  const onRefresh = () => {
    loadMethods();
  };

  const MethodComponent = ({ el }) => (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("CreateDepositRequest", {
            methodCode: el.method_code,
            currency: el.currency,
            data: el,
          })
        }
        style={styles.itemContainer}
      >
        <View style={styles.innerContainer}>
          <Ionicons name="person" size={16} color={COLORS.darkBlue} />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.name")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.name}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.loginTab}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.min")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.min_amount}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.loginTab}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.max")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.max_amount}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <MaterialCommunityIcons
            name="currency-sign"
            size={15}
            color={COLORS.loginTab}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.currency")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.currency}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.loginTab}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.rate")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.rate}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <FontAwesome5 name="percent" size={15} color={COLORS.loginTab} />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.percCharge")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.percent_charge}
            style={styles.innerText}
          />
        </View>
        <View style={styles.innerContainer}>
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.loginTab}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={t("deposit.fixCharge")}
            style={styles.innerText}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={el.fixed_charge}
            style={styles.innerText}
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <CustomHeader navigation={navigation} />
      <ScrollView
        contentContainerStyle={styles.bg}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator
            style={styles.loadingStyle}
            size={"large"}
            color={COLORS.header}
          />
        ) : (
          <>
            <View style={styles.headerStyle}>
              <CustomText
                color={COLORS.black}
                size={20}
                text={t("deposit.header")}
                style={styles.BackTxt}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate("DepositHistory")}
                style={{ flexDirection: "row", alignItems: "center" }}
              >
                <CustomText
                  color={COLORS.header}
                  size={14}
                  text={t("deposit.depositH")}
                  style={styles.BackTxt}
                />
                <FontAwesome name="history" color={COLORS.header} size={14} />
              </TouchableOpacity>
            </View>

            {methods ? (
              methods.length > 0 ? (
                methods.map((el, index) => (
                  <MethodComponent el={el} key={index} />
                ))
              ) : (
                <View style={styles.errStyle}>
                  <CustomText
                    color={COLORS.header}
                    size={20}
                    text={t("deposit.empty")}
                  />
                </View>
              )
            ) : (
              <View style={styles.errStyle}>
                <CustomText
                  color={COLORS.header}
                  size={20}
                  text={t("deposit.error")}
                />
              </View>
            )}
          </>
        )}
        <CustomAlert
          type={'error'}
          show={warning}
          header={t("accountScreen.w")}
          body={errmess}
          action1={() => {
            setWarning(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
      </ScrollView>
    </>
  );
};
export default LoadDepositMethods;
