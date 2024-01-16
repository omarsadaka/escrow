import React, {useState, useMemo} from 'react';
import {
  Text,
  ImageBackground,
  Button,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import CustomText from '../../components/customText';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro';
import {useTheme} from '@react-navigation/native';
import createStyles from './style';
import CommonStyles from '../../constants/CommonStyles';
import {hp} from '../../utilis/dimensions';
import CustomHeader from '../../components/customHeader';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const PaymentScreen = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();
  const handleChangeLang = async () => {
    await AsyncStorage.setItem("NAVIGATION_STATE_TIME", new Date().toString());
    if (i18n.language == 'ar') {
      await AsyncStorage.setItem('@CACHED_LANG', 'en');
      await i18n.changeLanguage('en');
    } else {
      await AsyncStorage.setItem('@CACHED_LANG', 'ar');
      await i18n.changeLanguage('ar');
    }
  };
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <CustomHeader
        navigation={navigation}
        handleChangeLang={handleChangeLang}
      />
      <View style={CommonStyles.transactionsContainer}>
        <CustomText
          color={COLORS.primaryTxt}
          size={20}
          text={t('payment.payment')}
          style={CommonStyles.titleTxt}
        />
        <View style={{flex: 1, marginTop: hp(2)}}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('CreditCard');
            }}
            style={styles.faceView}>
            <MaterialIcons
              name={'radio-button-unchecked'}
              size={20}
              style={styles.icon}
              color={COLORS.blue}
            />
            <Ionicons
              name="card"
              size={20}
              color={COLORS.babyBlue2}
              style={styles.icon}
            />
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={t('payment.p1')}
              //   style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.faceView}>
            <MaterialIcons
              name={'radio-button-unchecked'}
              size={20}
              style={styles.icon}
              color={COLORS.blue}
            />
            <FontAwesome5Pro
              name="apple-pay"
              size={20}
              color={COLORS.babyBlue2}
              style={styles.icon}
            />
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={t('payment.p2')}
              //   style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('wireTransafer')}
            style={styles.faceView}>
            <MaterialIcons
              name={'radio-button-unchecked'}
              size={20}
              style={styles.icon}
              color={COLORS.blue}
            />
            <MaterialCommunityIcons
              name="bank-transfer"
              size={20}
              color={COLORS.babyBlue2}
              style={styles.icon}
            />
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={t('payment.p3')}
              //   style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.faceView}>
            <MaterialIcons
              name={'radio-button-unchecked'}
              size={20}
              style={styles.icon}
              color={COLORS.blue}
            />
            <MaterialCommunityIcons
              name="qrcode-scan"
              size={20}
              color={COLORS.babyBlue2}
              style={styles.icon}
            />
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={t('payment.p4')}
              //   style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};
export default PaymentScreen;
