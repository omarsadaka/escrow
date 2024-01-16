import React, { useEffect, useState, useMemo } from 'react';
import {
  Linking,
  StyleSheet, TouchableOpacity, View,
  PermissionsAndroid,
  Platform
} from 'react-native';
import {useRoute, useTheme} from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomText from '../../components/customText';
import { useTranslation } from "react-i18next";
import { useDrawerStatus } from "@react-navigation/drawer";
import {getBaseURL} from '../../constants/API';
import { showSimpleModal } from '../../redux/actions/modal';
import { useDispatch } from "react-redux";
import { COLORS } from '../../constants/colors';
import CustomButton from '../../components/customButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import DeviceInfo from "react-native-device-info";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import { makeReloadTransactions } from '../../redux/actions/user';
import CustomAlert from '../../components/CustomAlert';
import {
  createNavigationContainerRef,
} from "@react-navigation/native";
const NotificationPermission = ({navigation}) => {
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const [onBoarding, setOnBoarding] = useState(false);
  const [notificationAlert, setNotificationAlert] = useState({
    show: false,
    title: "",
    body: "",
    escrowId: "",
  });
   const navigationRef = createNavigationContainerRef();

  useEffect(() => {
    requestUserPermission()
    getSavedOnBoarding()
  }, []);

  const getSavedOnBoarding = async () => {
    try {
      const value = await AsyncStorage.getItem("ONBOARDING");
      if (value !== null) {
        // value previously stored
        setOnBoarding(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  const handleNotification=async()=> {
    messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessage', remoteMessage)
      PushNotification.localNotification({
        channelId: remoteMessage.ttl,
        messageId: remoteMessage.messageId,
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body,
        vibrate: true,
        playSound: true,
        smallIcon:  "no_icon", 
        largeIcon: Platform.OS=='android'?remoteMessage.notification?.android?.smallIcon:'',
        soundName:'sound.mp3'
        // soundName: Platform.OS=='android'?remoteMessage.notification?.android?.sound:'',
      });
      setNotificationAlert({
        show: true,
        title: t("notificationAlertHeader"),
        body: `${remoteMessage.notification.title} \n ${remoteMessage.notification.body}`,
        escrowId: remoteMessage.data.escrowId,
      });
      dispatch(makeReloadTransactions());
    });
    PushNotification.setApplicationIconBadgeNumber(0)
  }

  async function requestUserPermission() {
    if(Platform.OS=='android'){
      if(DeviceInfo.getSystemVersion()>=13){
        let granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
       );
        const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS );
        if (granted_android) {
          if(!onBoarding) navigation.navigate('ChooseLanguage')  //Onboarding
          else navigation.navigate('Login')
        }
      }
    }else{
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      if (enabled) {
        if(!onBoarding) navigation.navigate('ChooseLanguage')  //Onboarding
        else navigation.navigate('Login')
      }
     
    }
   
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let fcm1 = await messaging().getToken();
      console.log('fcm token', fcm1);
    }
    handleNotification()
  }
  return (
    <>
    <View style={styles.container}>
      <CustomText
        color={COLORS.white}
        size={25}
        text={t('permissionTitle')}
        style={styles.text}/>
      <View style={styles.line}/>
    <View style={{marginTop:'3%'}}>
      <View style={{flexDirection:'row',alignSelf:'center'}}>
        <MaterialIcons name='grade' size={17} color={COLORS.green}/>
        <MaterialIcons name='grade' size={17} color={COLORS.green}/>
        <MaterialIcons name='grade' size={17} color={COLORS.green}/>
        <MaterialIcons name='grade' size={17} color={COLORS.green}/>
        <MaterialIcons name='grade' size={17} color={COLORS.green}/>
      </View>
      <CustomText
        color={COLORS.white}
        size={18}
        text={t('PaymentsInSeconds')}
        style={styles.title}/>
      <CustomText
        color={COLORS.white}
        size={18}
        text={t('iamInLove')}
        style={styles.title}/>
    </View>
    <View style={styles.btnContainer}>
    <CustomButton
      color={COLORS.blue}
      onPress={() => {
        if(!onBoarding) navigation.navigate('Onboarding')  //Onboarding
        else navigation.navigate('Login')
      }}
      textSize={15}
      text={t('skip')}
      containerStyle={{width:'30%',}} 
      />
       <CustomButton
      color={COLORS.blue}
      onPress={() => {
        Linking.openSettings()
      }}
      textSize={15}
      text={t('goSettings')}
      containerStyle={{width:'45%',}} 
      />
    </View>
    <CustomAlert
        type={'success'}
        show={notificationAlert.show}
        header={notificationAlert.title}
        body={notificationAlert.body}
        action1={() => {
          setNotificationAlert({
            show: false,
            title: "",
            body: "",
            escrowId: "",
          });
          notificationAlert.escrowId.length > 0 &&
            navigationRef.navigate("TransactionDetails", {
              el: { id: notificationAlert.escrowId },
            });
          }}
          btn2={t("OK")}
          btn1={t("view")}
          action2={() => {
            setNotificationAlert({
              show: false,
              title: "",
              body: "",
              escrowId: "",
            });
          }}
          oneBtn={false}
        />
    </View>
    </>
  );
};
const styles = StyleSheet.create({
  container:{
    paddingTop:'5%',
    flex:1,backgroundColor: COLORS.black,
    alignItems:'center'
  },
  text:{
    fontWeight:'600',
    marginVertical:10,
    marginHorizontal:8
  },
  line:{
    width:'90%',
    height:0.5,
    backgroundColor: COLORS.white
  },
  title:{
    
  },
  btnContainer:{
    width:'80%',
    justifyContent:'space-between',
    flexDirection:'row',
    position:'absolute',
    bottom:'4%'
  }
});
export default NotificationPermission;
