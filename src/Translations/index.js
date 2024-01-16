import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";
import { ar, en } from "./resources/index";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2 } from "../constants/API";
import { isChangeLanguage } from "../redux/actions/authentication";
import { useDispatch } from "react-redux";
import { showMessage } from "react-native-flash-message";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources: {
    ar,
    en,
  },
  lng: 'ar',
  fallbackLng: "ar",
  react: {
    bindI18n: "languageChanged",
    useSuspense: false,
  },
  debug: true,
});

i18n.languages = [ar, en];
export const updateLanguage = async (lann) => {
  // const token = await AsyncStorage.getItem("TOKEN");
  showMessage({
    message:
      i18n.language == "ar"
        ? "جارى تغيير اللغة..."
        : "Changing the language...",
    type: "success",
    duration: 3000,
    titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
  });

  await AsyncStorage.setItem("API_LANGUAGE", lann);
  if (lann === "ar") {
    if (!I18nManager.isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(true);
      RNRestart.Restart();
    }
  } else {
    if (I18nManager.isRTL) {
      I18nManager.allowRTL(false);
      I18nManager.forceRTL(false);
      RNRestart.Restart();
    }
  }
};

i18n.on("languageChanged", async (lng) => {
  const isShawLang = await AsyncStorage.getItem("@SHOWLANG");
  if(isShawLang && isShawLang!=null){
    await AsyncStorage.setItem("ChangeLang", "1");
    await AsyncStorage.setItem("@CACHED_LANG", lng);
    const api_lang = await AsyncStorage.getItem("API_LANGUAGE");
    // updateLanguage(lng);
    if (api_lang && api_lang != lng) {
      await AsyncStorage.setItem("ChangeLang", "1");
      updateLanguage(lng);
    } else {
      await AsyncStorage.setItem("ChangeLang", "1");
      if (lng === "ar") {
        if (!I18nManager.isRTL) {
          I18nManager.allowRTL(true);
          I18nManager.forceRTL(true);
          RNRestart.Restart();
        }
      } else {
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        }
      }
    }
  }

 
});

export default i18n;
