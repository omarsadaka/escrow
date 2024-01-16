import React, { useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  Alert,
  TouchableOpacity,
  Linking
} from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomInput from "../../components/customInput";
import { useDispatch } from "react-redux";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ChangeLanguageModal from "../../modals/ChangeLanguageModal";
import Textarea from "react-native-textarea/src/Textarea";
import { hp } from "../../utilis/dimensions";
import { showMessage } from "react-native-flash-message";
import { showSimpleModal } from "../../redux/actions/modal";
const TechnicalSupport = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [modalVisible1, setModalVisible1] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [message, setmessage] = useState('');
  const [loading, setLoading] = useState('');


  const handleResetApi = async () => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    console.log(email, code);

    fetch(baseURL + ENDPOINTS.resetPassword, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        token: code,
        email: email,
        password: newPassword,
        password_confirmation: confirmPassword,
        device_info: deviceInfo
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res asd", res);

        if (res.messages.success) {
          Alert.alert(
             res.messages.success
          );
          navigation.navigate("Login");
        } else {
          Alert.alert(
            res.messages.error
          );
        }
      });
  };

  const handleLang = async (value) => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    if (i18n.language == "ar") {
      try {
        await i18n.changeLanguage("en");
        await AsyncStorage.setItem("@CACHED_LANG", "en");
      } catch (e) {
        // saving error
      }
    } else {
      try {
        await i18n.changeLanguage("ar");
        await AsyncStorage.setItem("@CACHED_LANG", "ar");
      } catch (e) {
        // saving error
      }
    }
  };

  const onSubmit= async()=>{
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true)
    fetch(baseURL + ENDPOINTS.contactUs, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        name: name,
        email: email,
        subject: title,
        message: message,
        device_info: deviceInfo
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("res asd", res);
        setLoading(false)
        if (res.messages.success) {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'),   //responseData2?.status,
                message: res.messages.success,
                action: "",
              },
            })
          );
          setName('')
          setEmail('')
          setTitle('')
          setmessage('')
        } 
      }).catch((error)=>{
        setLoading(false)
      })
  }
  return (
    <ScrollView style={{ backgroundColor: COLORS.white }}>
      {/* <Image
        style={styles.logo}
        source={require("../../assets/newLogo.png")}
      /> */}
      <ChangeLanguageModal
        show={modalVisible1}
        setShow={setModalVisible1}
        handleLang={handleLang}
      />
      <CustomText
        color={COLORS.black}
        size={18}
        style={{marginTop:hp(2)}}
        text={t("technicalSupport")}
      />

      <View>
        <CustomInput
          containerStyle={{width:'90%'}}
          label={i18n.t("profileScreens.name")}
          placeholder={t('profileScreens.name')}
          value={name}
          onChangeText={(val) => setName(val)}
          error={name?.length < 6}
          errorMessage={t("profileScreens.usernameRules")}
          icon={
            <Ionicons name="person-sharp" size={20} color={COLORS.babyBlue2} />
          }
        />
        <CustomInput
          containerStyle={{width:'90%'}}
          label={t("settingsScreen.Email")}
          placeholder={t('settingsScreen.Email')}
          value={email}
          onChangeText={(val)=> setEmail(val)}
          error={email?.length < 3}
          errorMessage={t("profileScreens.emailRules")}
          icon={
            <Ionicons name="mail" size={20} color={COLORS.babyBlue2} />
          }
        />
         <CustomInput
          containerStyle={{width:'90%'}}
          label={t("profileScreens.subject")}
          placeholder={t('profileScreens.subject')}
          value={title}
          onChangeText={(val)=> setTitle(val)}
          error={title?.length < 6}
          errorMessage={t("profileScreens.subjectRules")}
          icon={
            <Ionicons name="phone-portrait-sharp" size={20} color={COLORS.babyBlue2} />
          }
        />

        <Textarea
          style={{
              fontFamily: "BahijTheSansArabic-Plain",
              textAlign: i18n.language == "ar" ? "right" : "left",
              color: COLORS.black,
              height:'100%',
              textAlignVertical:'top'
            }}
          containerStyle={[styles.textareaContainer,{ borderColor: COLORS.header },]}
          onChangeText={(val) => setmessage(val)}
          maxLength={200}
          placeholder={t("message")}
          placeholderTextColor={"#c7c7c7"}
          underlineColorAndroid={"transparent"}
          value={message}/>

        <CustomButton
          color={COLORS.blue}
          onPress={()=>{
            if(name && email && title && message){
              onSubmit()
            }else{
              showMessage({
                message: t('enterAllData'),
                type: "danger",
                titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
              });
            }
          }}
          textSize={12}
          text={t("resetPassword.confirm")}
          containerStyle={styles.btn}
          loading={loading}
        />

       <View style={styles.rowContainer}>
        <TouchableOpacity style={[styles.icon,{backgroundColor: COLORS.blue}]}
        onPress={()=>{
          Linking.openURL(`tel:${'966506329858'}`)
        }}>
          <FontAwesome name="phone" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.icon,{backgroundColor: COLORS.green}]}
        onPress={()=>{
          Linking.openURL('whatsapp://send?text=&phone=+966506329858')
          .then(data => {
            console.log("WhatsApp Opened");
          })
          .catch(() => {
            alert("Make sure WhatsApp installed on your device");
          });
        }}>
          <Ionicons name="logo-whatsapp" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.icon,{backgroundColor: COLORS.blue}]}
        onPress={()=>{
          Linking.openURL('https://www.tiktok.com')
          .then(data => {
            console.log("Tiktok Opened");
          })
          .catch(() => {
            alert("Make sure Tiktok installed on your device");
          });
        }}>
          <FontAwesome5 name="tiktok" size={20} color={COLORS.white} />
        </TouchableOpacity>
       </View>
       
        <Pressable onPress={() => setModalVisible1(true)}>
          <CustomInput
            containerStyle={styles.translate}
            inputStyle={styles.translateText}
            leftIcon={
              <FontAwesome5 name="caret-down" size={20} color={COLORS.blue} />
            }
            icon={
              <MaterialIcons name="g-translate" size={20} color={COLORS.blue} />
            }
            editable={false}
            value={t("loginScreen.lang")}
          />
        </Pressable>
      </View>
    </ScrollView>
  );
};
export default TechnicalSupport;
