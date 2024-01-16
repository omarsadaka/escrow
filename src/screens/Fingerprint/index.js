import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Image, Modal, Platform, Pressable, View, Linking, TouchableOpacity, ActivityIndicator} from 'react-native';
import CustomText from '../../components/customText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import createStyles from './styles';
import {useRoute, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import * as Authentication from '../../redux/actions/authentication';
import {BASE_URL, ENDPOINTS, getBaseURL} from '../../constants/API';
import {showMessage} from 'react-native-flash-message';
import AndroidOpenSettings from 'react-native-android-open-settings';
import CustomButton from '../../components/customButton';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';

import PropTypes from 'prop-types';
import { showSimpleModal } from '../../redux/actions/modal';

const Fingerprint = ({navigation}) => {
  const [baseURL, setBaseURL] = useState('https://escrow2d.meiladigital-sa.com/backend/api/');
  getBaseURL()?.then(res => setBaseURL(res));
  const route = useRoute();
  const {login, user, biometryType} = route?.params;
  const dispatch = useDispatch();
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const {t, i18n} = useTranslation();

  const optionalConfigObject = {
    imageColor: COLORS.blue, // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Show Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: false, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };
  
  // useEffect(() => {
  //   if (!baseURL) return;
  //   TouchID.authenticate(
  //     t('verifyMpin.usefinger'),
  //     optionalConfigObject,
  //   )
  //     .then(success => {
  //       console.log('in fingerPrint ', login);
  //       login
  //         ? handleLogin()
  //         : (dispatch(Authentication.setWelcome()), updateFinger());
  //     })
  //     .catch(error => {
  //       setModalVisible(true);
  //       showMessage({
  //         message: 'Authentication Failed',
  //         type: 'danger',
  //       });
  //     });
  // }, [retry, baseURL]);
 
useEffect(()=>{
  showAuthenticationDialog()
},[retry])

 const getMessage=()=>{
  if(biometryType=='Face ID')
  {
    return t('verifyMpin.useface')
  }
  else if(biometryType=='Touch ID')
  {
    return t('verifyMpin.usefinger')
  }else{
    return t('verifyMpin.usefingerOrFace')
  }
    }
  
  
  const showAuthenticationDialog =() => {
      if(biometryType!==null && biometryType!==undefined ){
      FingerprintScanner.authenticate({
        description: getMessage() , onAttempt: handleAuthenticationAttempted() 
      }).then((succes) => {
          //you can write your logic here to what will happen on successful authentication
          login
          ? handleLogin()
          : (dispatch(Authentication.setWelcome()), updateFinger());
        }).catch((error) => {
          console.log('Authentication error is => ', error);
          if(error?.toString().includes('FingerprintScannerNotEnrolled')){
             setModalVisible(true)
          }else if(error?.toString().includes('UserCancel')){
            showMessage({
              message:t('verifyMpin.canceledByUser') ,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }else if(error?.toString().includes('UserFallback')){
            showMessage({
              message:t('verifyMpin.canceledByUser') ,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }else{
            showMessage({
              message:error?.toString() ,
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }
        });
      }else{
      console.log('biometric authentication is not available');
      showMessage({
        message: t("verifyMpin.ronge"),
        type: "danger",
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
      setModalVisible(true)
      }
  };

 const handleAuthenticationAttempted = (error) => {
    FingerprintScanner.release()
  };

  const handleLogin =async () => {
    console.log('in handleLogin', user)
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    fetch(baseURL + ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Localization": i18n?.language
      },
      body: JSON.stringify({
        username: user.email,
        password: user.password,
        device_info: JSON.parse(deviceInfo)
        // fcmToken:' ',
        // deviceID: ' ',
      }),
    })
      .then(response => response.json())
      .then(async responseData => {
        console.log('resss ssdssdssss',responseData)
        setLoading(false);
        if (responseData.status != 'ok') {
          showMessage({
            message: responseData.messages.error,
            type: 'danger',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == 'ok') {
          console.log('in finger auth.....');
          showMessage({
            message: responseData.messages.success,
            type: 'success',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if(responseData.data.note&&responseData.data.note!=null){
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header: t('accountScreen.w'),
                  message: responseData.data.note,
                  action: "",
                  type:'error'
                },
              })
            );
          }
          await AsyncStorage.setItem("TOKEN", responseData.data.access_token);
          updateFinger(responseData.accessToken);
          dispatch(Authentication.setWelcome());
        } else {
          showMessage({
            message: responseData?.message,
            type: 'info',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch(e => {
        console.log('error', e);
        showMessage({
          message: e.toString(),
          type: 'danger',
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  const updateFinger = async token => {
    console.log('updateFinger')
    const token2 = token ? token : await AsyncStorage.getItem('TOKEN');
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    fetch(baseURL + ENDPOINTS.getSettings, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token2,
        'Content-Type': 'application/json',
        "X-Localization": i18n?.language
      },
    })
      .then(response => response.json())
      .then(responseData => {
        if (responseData.status == 'success') {
          fetch(baseURL + ENDPOINTS.saveSettings, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + token2,
              'Content-Type': 'application/json',
              "X-Localization": i18n?.language
            },
            body: JSON.stringify({
              faceId: responseData.data.faceId,
              language: responseData.data.language,
              theme: responseData.data.theme,
              notificationPreference: responseData.data.notificationPreference,
              fingerPrint: 1,
              applicationPin: responseData.data.applicationPin,
              device_info: deviceInfo
            }),
          })
            .then(response => response.json())
            .then(responseData => {
              if (responseData.status == 'success') {
              } else {
                console.log('error : ', responseData.message);
              }
            })
            .catch(e => {
              console.log('error : ', e);
            });
        } else {
          console.log('error : ', responseData.message);
        }
      })
      .catch(e => {
        console.log('error : ', e);
      });
  };
  const ModalComponent = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>
      <View style={styles.modalView}>
        <View style={styles.centeredView}>
          {/* <View
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
              width: '100%',
            }}></View> */}
          <CustomText
            text={t('addFinger')}
            style={styles.modalText}
            color={COLORS.grey}
          />

          <CustomButton
            color={COLORS.blue}
            onPress={() => {
              setModalVisible(!modalVisible);
              if(Platform.OS=='android') AndroidOpenSettings.securitySettings();
              else Linking.openURL('app-settings:')
            }}
            textSize={12}
            text={t('goSettings')}
            containerStyle={styles.btn}
          />
        </View>
      </View>
    </Modal>
  );
  const Loading = () => (
   <ActivityIndicator size={'large'} color={COLORS.blue} style={styles.loading}/>
  );

  return (
    <View style={styles.bg}>
      <ModalComponent />
      <View style={styles.row}>
        <Ionicons
          name={i18n.language=='ar'? "caret-forward-outline" : "caret-back-outline"}
          size={25}
          style={[styles.icon]}
          color={COLORS.blue}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <CustomText
          color={COLORS.black}
          size={18}
          text={'Verify With Finger Print'}
          style={styles.title}
        />
      </View>
      <TouchableOpacity onPress={() => {
        setRetry(!retry)
        }} style={styles.subContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/fingerprint.png')}
        />
      </TouchableOpacity>
      <CustomText
        color={COLORS.black}
        size={10}
        text={'Please Verify by using Finger Print'}
        style={styles.text2}
      />
       {loading? <Loading/>:null}
    </View>
  );
};
Fingerprint.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};
export default Fingerprint;
