import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  I18nManager
} from "react-native";
import Styles from "./style";
import CustomText from "../../components/customText";
import { useTheme, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/customButton";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";

const ChooseLanguage = ({ navigation }) => {
  const { i18n } = useTranslation();
  const { colors: COLORS } = useTheme();
  const [baseURL, setBaseURL] = useState("");
  
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
  }, [navigation, baseURL]);

  const handleLang = async (lang) => {
    await AsyncStorage.setItem("ChangeLang", "1");
    await AsyncStorage.setItem("HideChooseLang", "1");
    try {
        await i18n.changeLanguage(lang);
        await AsyncStorage.setItem("@CACHED_LANG", lang);
        RNRestart.Restart();
    } catch (e) {
      // saving error
    }
  };


  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <View style={{alignItems:'center',justifyContent:'center', flex: 1}}>
      <CustomText
            color={COLORS.blue}
            size={21}
            text={'إختر اللغة'}/>
       <CustomText
            color={COLORS.blue}
            size={21}
            text={'Choose language'}/>      

      <CustomButton
            onPress={() => {
              handleLang('ar')
            }}
            width={"80%"}
            text={'العربية'}
            color={COLORS.blue}
            containerStyle={Styles.button}
          />

      <CustomButton
            onPress={() => {
              handleLang('en')
            }}
            width={"80%"}
            text={'English'}
            color={COLORS.blue}
            containerStyle={Styles.button}
          />
      </View>
    </View>
  );
};
export default ChooseLanguage;
