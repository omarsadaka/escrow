import React, {useMemo, useState,useEffect} from 'react';
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import CustomText from '../../components/customText';
import CustomButton from '../../components/customButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import createStyles from './styles';
import {useRoute, useTheme} from '@react-navigation/native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import * as Authentication from '../../redux/actions/authentication';
import {useDispatch} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {BASE_URL, ENDPOINTS, getBaseURL} from '../../constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {showMessage} from 'react-native-flash-message';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { showSimpleModal } from '../../redux/actions/modal';

const AccountAuthentication = ({navigation}) => {
  const [baseURL, setBaseURL] = useState('');
  getBaseURL()?.then(res => setBaseURL(res));
  const route = useRoute();
  // const {phone, login, user} = route?.params;
  const login = route?.params?.login;
  const user = route?.params?.user;
  const phone = route?.params?.phone;
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [code, setCode] = useState('');
  const [selected, setSelected] = useState(1);
  const [loading, setLoading] = useState(false);
  const [biometryType, setBiometryType] = useState('');

  useEffect(()=>{
    FingerprintScanner.isSensorAvailable()
    .then((biometryType) => {
      setBiometryType(biometryType)
    })
    .catch((error) =>{});
  },[])


  const handleLogin = async() => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    fetch(baseURL + ENDPOINTS.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        "X-Localization": i18n.language
      },
      body: JSON.stringify({
        emailId: user.email,
        password: user.password,
        fcmToken: user.fcm,
        deviceID: user.uuid,
        device_info: JSON.parse(deviceInfo)
      }),
    })
      .then(response => response.json())
      .then(async responseData => {
        console.log('aaddssasdffdf',responseData)
        setLoading(false);
        if (responseData.status == 'failed') {
          showMessage({
            message: responseData.message,
            type: 'danger',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == 'success') {
          showMessage({
            message: responseData.message,
            type: 'success',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          if(responseData.note&&responseData.note!=null){
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header: t('accountScreen.w'),
                  message: responseData.note,
                  action: "",
                  type:'error'
                },
              })
            );
          }
          updatePin(responseData.accessToken);
          dispatch(Authentication.setWelcome());
        } else {
          showMessage({
            message: responseData.message,
            type: 'info',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch(e => {
        console.log(e);
        showMessage({
          message: e,
          type: 'danger',
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };
  const handlePin = async () => {
    if (code.length < 4) return;
    let token = await AsyncStorage.getItem('TOKEN');
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    setLoading(true);
    let url = baseURL + (!login ? ENDPOINTS.saveMpin : ENDPOINTS.validateMpin);
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token,
        "X-Localization": i18n.language
      },
      body: JSON.stringify({
        mpin: code,
        phone: route?.params?.phone,
        device_info: deviceInfo
      }),
    })
      .then(response => response.json())
      .then(async responseData => {
        setLoading(false);
        if (responseData.status == 'failed') {
          showMessage({
            message: responseData.message,
            type: 'danger',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else if (responseData.status == 'success') {
          showMessage({
            message: responseData.message,
            type: 'success',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          await AsyncStorage.setItem('CUSTOMER_PIN', code);
          login
            ? handleLogin()
            : (dispatch(Authentication.setWelcome()), updatePin());
        } else {
          showMessage({
            message: responseData.message,
            type: 'info',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch(e => {
        console.log(e);
        showMessage({
          message: e,
          type: 'danger',
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(true);
      });
  };

  const handleSignIn = () => {
    if (selected == 1) {
      handlePin();
    } else if (selected == 2) {
      navigation.navigate('FaceID', {login: login, user: user, biometryType: biometryType});
    } else if (selected == 3) {
      navigation.navigate('Fingerprint', {login: login, user: user, biometryType: biometryType});
    }
  };
  const updatePin = async token => {
    const token2 = token ? token : await AsyncStorage.getItem('TOKEN');
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    fetch(baseURL + ENDPOINTS.getSettings, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + token2,
        'Content-Type': 'application/json',
        "X-Localization": i18n.language
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
              "X-Localization": i18n.language
            },
            body: JSON.stringify({
              faceId: responseData.data.faceId,
              language: responseData.data.language,
              theme: responseData.data.theme,
              notificationPreference: responseData.data.notificationPreference,
              fingerPrint: responseData.data.fingerPrint,
              applicationPin: 1,
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

  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <CustomText
        color={COLORS.headerText}
        size={18}
        text={t('AccountVerification.authentication')}
        style={styles.textColored}
      />
      <View style={{flex: 1}}>
        {!login && (
          <View style={styles.applicationPin}>
            <View style={styles.applicationPinSubContainer}>
              <Pressable onPress={() => setSelected(1)} style={styles.row}>
                <MaterialIcons
                  name={
                    selected == 1
                      ? 'radio-button-checked'
                      : 'radio-button-unchecked'
                  }
                  size={25}
                  style={styles.icon}
                  color={COLORS.blue}
                />
                <CustomText
                  color={COLORS.blue}
                  size={14}
                  text={t('AccountVerification.pin')}
                  style={styles.textColored}
                />
              </Pressable>
            </View>
            {selected == 1 && (
              <>
                <OTPInputView
                  style={styles.otp}
                  pinCount={4}
                  editable={false}
                  code={code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
                  onCodeChanged={code => {
                    setCode(code);
                  }}
                  autoFocusOnLoad={false}
                  codeInputFieldStyle={styles.underlineStyleBase}
                  codeInputHighlightStyle={styles.underlineStyleHighLighted}
                  onCodeFilled={code => {
                    console.log(`Code is ${code}, you are good to go!`);
                  }}
                />
                <View style={styles.keyboard}>
                  <Pressable
                    onPress={() => {
                      setCode(code + '1');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'1'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '2');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'2'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '3');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'3'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                </View>
                <View style={styles.keyboard}>
                  <Pressable
                    onPress={() => {
                      setCode(code + '4');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'4'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '5');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'5'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '6');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'6'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                </View>
                <View style={styles.keyboard}>
                  <Pressable
                    onPress={() => {
                      setCode(code + '7');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'7'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '8');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'8'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      setCode(code + '9');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'9'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                </View>
                <View style={styles.keyboard}>
                  <Pressable
                    onPress={() => {
                      setCode(code + '0');
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={'0'}
                      style={styles.keyboardText}
                    />
                  </Pressable>
                </View>
                <View style={styles.keyboardDelete}>
                  <Pressable
                    onPress={() => {
                      if (!code.length) return;
                      setCode(code.slice(0, -1));
                    }}>
                    <CustomText
                      color={COLORS.blue}
                      size={16}
                      text={t('AccountVerification.delete')}
                      style={styles.textColored}
                    />
                  </Pressable>
                </View>
              </>
            )}
          </View>
        )}
        <View style={styles.bioContainer}>
          <Pressable
            onPress={() => setSelected(2)}
            style={styles.applicationPinSubContainer}>
            <View style={styles.row}>
              <MaterialIcons
                name={
                  selected == 2
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={25}
                style={styles.icon}
                color={COLORS.blue}
              />
              <CustomText
                color={COLORS.blue}
                size={14}
                text={t('AccountVerification.faceId')}
                style={styles.textColored}
              />
            </View>
            <Image
              style={styles.logo}
              source={require('../../assets/face_recognition.png')}
            />
          </Pressable>
        </View>

        <View style={styles.bioContainer}>
          <Pressable
            onPress={() => setSelected(3)}
            style={styles.applicationPinSubContainer}>
            <View style={styles.row}>
              <MaterialIcons
                name={
                  selected == 3
                    ? 'radio-button-checked'
                    : 'radio-button-unchecked'
                }
                size={25}
                style={styles.icon}
                color={COLORS.blue}
              />
              <CustomText
                color={COLORS.blue}
                size={14}
                text={t('AccountVerification.finger')}
                style={styles.textColored}
              />
            </View>
            <MaterialIcons
              name="fingerprint"
              size={25}
              style={styles.icon}
              color={COLORS.headerText}
            />
          </Pressable>
        </View>
        <CustomButton
          color={COLORS.blue}
          loading={loading}
          onPress={() => {
            handleSignIn();
          }}
          textSize={12}
          text={t('loginScreen.signIn')}
          containerStyle={styles.btn}
        />
      </View>
      {!login && (
        <Pressable onPress={() => dispatch(Authentication.setWelcome())}>
          <CustomText
            color={COLORS.black}
            size={14}
            text={t('AccountVerification.later')}
            style={styles.text2}
          />
        </Pressable>
      )}
    </ScrollView>
  );
};
export default AccountAuthentication;
