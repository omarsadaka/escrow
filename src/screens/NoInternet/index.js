import React, { useEffect, useMemo } from "react";
import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import NetInfo from "@react-native-community/netinfo";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { hp, wp } from "../../utilis/dimensions";
import { useDispatch } from "react-redux";
import { handleLogoutValue, storeStackValue } from "../../redux/actions/user";
import { logOut } from "../../redux/actions/authentication";

const NoInternetScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  useEffect(() => {
    const clearData = async () => {
      await AsyncStorage.removeItem("CUSTOMER_ID");
      await AsyncStorage.removeItem("THEME");
      await AsyncStorage.removeItem("@CACHED_LANG");
      await AsyncStorage.removeItem("USER_PIN");
      await AsyncStorage.removeItem("USER_PIN_VALUE");
      await AsyncStorage.removeItem("ChangeLang");
      await AsyncStorage.removeItem("AUTHLANG");
      await AsyncStorage.removeItem("TOKEN");
      await AsyncStorage.removeItem("NAVIGATION_STATE_TIME");
      // await AsyncStorage.removeItem("CUSTOMER_LOGIN");
      await AsyncStorage.removeItem("API_LANGUAGE");
      // await AsyncStorage.removeItem("CUSTOMER_OBJECT");
      dispatch(storeStackValue(false));
      dispatch(handleLogoutValue(true));
      dispatch(logOut());
    };
    clearData();
  }, []);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (state.isConnected) {
        showMessage({
          message: t("noInternetScreen.succ"),
          type: "success",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);
  const refreshConnection = () => {
    NetInfo.refresh().then((state) => {
      if (state.isConnected) {
        showMessage({
          message: t("noInternetScreen.succ"),
          type: "success",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      } else {
        showMessage({
          message: t("noInternetScreen.err"),
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      }
    });
  };
  return (
    <View style={styles.screen}>
      <Image
        style={styles.image}
        source={require("../../assets/noInternetImage.jpg")}
      />
      <CustomText
        text={t("noInternetScreen.txt")}
        size={16}
        // style={styles.modalText}
        color={COLORS.black}
      />
      <CustomButton
        color={COLORS.blue}
        onPress={() => refreshConnection()}
        // loading={loading}
        // disabled={loading}
        textSize={15}
        text={t("noInternetScreen.retry")}
        containerStyle={styles.btn2}
      />
    </View>
  );
};
const createStyles = (COLORS) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    image: {
      width: wp(30),
      height: hp(30),
      resizeMode: "contain",
    },
    btn2: { width: "50%", alignSelf: "center", marginTop: hp(10) },
  });
export default NoInternetScreen;
