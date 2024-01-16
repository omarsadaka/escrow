import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Image,
  View,
  I18nManager,
  Platform,
} from "react-native";
import Text from "../../components/globalText";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import RNRestart from "react-native-restart";
import Styles from "./styles";
import { COLORS } from "../../constants/colors";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getBaseURL2, ENDPOINTS2 } from "../../constants/API";
import { getUniqueId } from "react-native-device-info";
import messaging from "@react-native-firebase/messaging";
import {i18n} from "../../Translations";

const SplashScreen = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  let value;

  const { t } = useTranslation();
  const getSavedOnBoarding = async () => {
    try {
      value = await AsyncStorage.getItem("ONBOARDING");
      console.log("valuevalue", value);
      if (value !== null) {
        // value previously stored
      } else {
        if (I18nManager.isRTL) {
          I18nManager.allowRTL(false);
          I18nManager.forceRTL(false);
          RNRestart.Restart();
        }
      }
    } catch (e) {
      // error reading value
    }
  };
  const SendToken = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log(await messaging().getToken());
    fetch(baseURL + ENDPOINTS2.addToken, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        uuid: await getUniqueId(),
        user_id: null,
        device_token: await messaging().getToken(),
        type: Platform.OS,
        device_info: deviceInfo
      }),
    });
  };
  useEffect(() => {
    getBaseURL2()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    SendToken();
    return () => {
      setBaseURL(null); // This worked for me
    };
  }, [baseURL]);

  useEffect(() => {
    getSavedOnBoarding();
    return () => {
      // This worked for me
      value = null;
    };
  }, []);
  return (
    <>
      <ImageBackground
        source={require("../../assets/splash.png")}
        style={Styles.bg}
      >
        <Image
          style={Styles.logo}
          source={require("../../assets/newLogo.png")}
        />
        <View style={Styles.container}>
          <View>
            <CustomText
              color="white"
              size={21}
              text={
                <Text>
                  {t("control")}{" "}
                  <Text style={Styles.textPayment}>{t("payment.payment")}</Text>
                </Text>
              }
              style={Styles.text}
            />
            <CustomText
              color="white"
              size={21}
              text={t("easier")}
              style={Styles.text}
            />
          </View>

          <CustomButton
            onPress={() => {
              I18nManager.allowRTL(false);
              I18nManager.forceRTL(false);
              // navigation.navigate("Onboarding");
              navigation.navigate("ChooseLanguage");
            }}
            width={"80%"}
            // text={t("getStarted")}
            text={'Start now إبدأ الآن'}
            color={COLORS.blue}
            containerStyle={Styles.button}
          />
          <CustomText
            color="white"
            size={9}
            text={t("copyRights")}
            style={Styles.text}
          />
        </View>
      </ImageBackground>
    </>
  );
};
export default SplashScreen;
