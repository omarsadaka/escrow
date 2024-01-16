import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
const BannedProducts = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");
  const [data, setData] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, []);

  useEffect(() => {
    if (!baseURL) return;
    getBannedProducts();
  }, [baseURL]);
  const getBannedProducts = async () => {
    setLoading(true);
    try {
      fetch(baseURL + ENDPOINTS2.banned_products, {
        method: "GET",
        headers:{
          "X-Localization": i18n?.language
        }
      })
        .then((response) => response.json())
        .then((responseData) => {
          //   console.log("resss  of banned : ", responseData);
          if (responseData.messages.success) {
            if (i18n.language == "ar") {
              if (
                responseData.banned_products.data &&
                responseData.banned_products.data.length > 0
              ) {
                let arr = [];
                responseData.banned_products.data.map((el) => {
                  arr.push(el.name_ar); //name_ar
                });
                setData(arr);
              } else {
                setData(null);
              }
            } else {
              if (
                responseData.banned_products.data &&
                responseData.banned_products.data.length > 0
              ) {
                let arr = [];
                responseData.banned_products.data.map((el) => {
                  arr.push(el.name_en);
                });
                setData(arr);
              } else {
                setData(null);
              }
            }
            setLoading(false);
          } else {
            setData(null);
            setLoading(false);
            setErrMessage(t("accountScreen.error"));
            setErrShow(true);
          }
        });
    } catch (error) {
      setData(null);
      setLoading(false);
      setErrMessage(t("accountScreen.err"));
      setErrShow(true);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.bannedContainer}>
      <CustomHeader navigation={navigation} />
      {loading ? (
        <ActivityIndicator color={COLORS.header} size={"large"} />
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              <View style={styles.screen}>
                <CustomText
                  text={t("bannedProducts.title")}
                  color={COLORS.blue}
                  size={20}
                  style={styles.header}
                />
                {data.map((el, index) => (
                  <View style={styles.itemContainer}>
                    <CustomText
                      key={index}
                      text={el}
                      color={COLORS.black}
                      size={20}
                    />
                  </View>
                ))}
              </View>
            </>
          ) : (
            <CustomText
              text={t("contactUs.qasno")}
              color={COLORS.blue}
              size={20}
            />
          )}
        </>
      )}

      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </ScrollView>
  );
};
export default BannedProducts;
