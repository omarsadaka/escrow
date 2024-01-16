import React, {useEffect, useMemo, useState} from 'react';
import {Alert, Image, Pressable, View, ActivityIndicator,Modal} from 'react-native';
import CustomText from '../../components/customText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import createStyles from './styles';
import {useRoute, useTheme} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import * as Authentication from '../../redux/actions/authentication';
import {BASE_URL, ENDPOINTS, getBaseURL} from '../../constants/API';
import {showMessage} from 'react-native-flash-message';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import CustomButton from '../../components/customButton';
import PropTypes from 'prop-types';
import { showSimpleModal } from '../../redux/actions/modal';

const FaceID = ({navigation}) => {
  const [baseURL, setBaseURL] = useState('https://escrow2d.meiladigital-sa.com/backend/api/');
  getBaseURL()?.then(res => setBaseURL(res));
  const route = useRoute();
  const {login, user, biometryType} = route?.params;
  const dispatch = useDispatch();
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [retry, setRetry] = useState(false);
  const [loading, setLoading] = useState(false);
  const {t, i18n} = useTranslation();
  const [faceIDModalVisible, setFaceIDModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


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
  //   TouchID.isSupported(optionalConfigObject)
  //     .then(biometryType => {
  //       // Success code
  //       console.log('biometryType', biometryType)
  //       if (biometryType === 'FaceID') {
  //         console.log('FaceID is supported.');
  //         TouchID.authenticate(
  //           'Please Verify by using Finger Print',
  //           optionalConfigObject,
  //         )
  //           .then(success => {
  //             login
  //               ? handleLogin()
  //               : (dispatch(Authentication.setWelcome()), updateFinger());
  //           })
  //           .catch(error => {
  //             Alert.alert('Authentication Failed');
  //           });
  //       } else {
  //         Alert.alert('FaceID is not supported');
  //       }
  //     })
  //     .catch(error => {
  //       // Failure code
  //       console.log('face id error', error)
  //       Alert.alert('FaceID is not supported');
  //       console.log(error);
  //     });
  // }, [retry]);


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
    
   const showAuthenticationDialog = () => {
      
        if(biometryType!==null && biometryType!==undefined )
        {
        FingerprintScanner.authenticate({
          description: getMessage(), onAttempt: handleAuthenticationAttempted() 
        })
          .then(async() => {
            //you can write your logic here to what will happen on successful authentication
            login
            ? handleLogin()
            : (dispatch(Authentication.setWelcome()), updateFinger());
          })
          .catch((error) => {
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
        }
    };

    const handleAuthenticationAttempted = (error) => {
      FingerprintScanner.release()
    };

  const handleLogin = async() => {
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
        emailId: user.email,
        password: user.password,
        fcmToken: user.fcm,
        deviceID: user.uuid,
        device_info: JSON.parse(deviceInfo)
      }),
    })
      .then(response => response.json())
      .then(async responseData => {
        setLoading(false);
        console.log('responseData', responseData)
        if (responseData.status == 'failed') {
          showMessage({
            message: responseData.messages.error[0],
            type: 'danger',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == 'success' || responseData.status == 'ok') {
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
          updateFaceID(responseData.accessToken);
          dispatch(Authentication.setWelcome());
        } else {
          showMessage({
            message: responseData?.messages?.error[0],
            type: 'info',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch(e => {
        console.log(e);
        showMessage({
          message: e.toString(),
          type: 'danger',
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  const updateFaceID = async token => {
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
              faceId: 1,
              language: responseData.data.language,
              theme: responseData.data.theme,
              notificationPreference: responseData.data.notificationPreference,
              fingerPrint: responseData.data.fingerPrint,
              applicationPin: responseData.data.applicationPin,
              device_info: deviceInfo
            }),
          })
            .then(response => response.json())
            .then(responseData => {
              console.log('responseData updateFaceID', responseData)
              if (responseData.status == 'success') {
              } else {
              }
            })
            .catch(e => {
              console.log('error : ', e);
            });
        } else {
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
            text={t('addFace')}
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
          style={styles.icon}
          color={COLORS.blue}
          onPress={() => {
            navigation.goBack();
          }}
        />
        <CustomText
          color={COLORS.black}
          size={18}
          text={'Verify With Face ID'}
          style={styles.title}
        />
      </View>
      <Pressable onPress={() => {
         showAuthenticationDialog()
      }} style={styles.subContainer}>
        <Image
          style={styles.logo}
          source={require('../../assets/face_recognition2.png')}
        />
      </Pressable>
      <CustomText
        color={COLORS.black}
        size={10}
        text={'Please Verify by using face ID'}
        style={styles.text2}
      />
      {loading? <Loading/>:null}
    </View>
  );
};
FaceID.propTypes = {
  handlePopupDismissed: PropTypes.func.isRequired,
};
export default FaceID;
