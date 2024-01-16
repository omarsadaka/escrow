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
import CustomText from '../../../components/customText';
import CustomButton from '../../../components/customButton';
import {useTheme} from '@react-navigation/native';
import createStyles from './style';
import CommonStyles from '../../../constants/CommonStyles';
import {hp, wp} from '../../../utilis/dimensions';
import {useTranslation} from 'react-i18next';
import Lottie from 'lottie-react-native';
const PaymentSuccessfully = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();
  return (
    <View style={styles.container} nestedScrollEnabled={true}>
      {/* <Image
        style={styles.logo}
        source={require('../../../assets/check.png')}
      /> */}
      <Lottie
        style={styles.logo}
        source={require('../../../assets/lottie/paymentDoneLottie.json')}
        autoPlay
        loop={false}
      />
      <View style={styles.transactionsContainer}>
        <CustomText
          color={COLORS.primaryTxt}
          size={20}
          text={t('paymentSuccessfully.payment')}
          style={CommonStyles.titleTxt}
        />
      </View>
      <View style={styles.txtDetails}>
        <CustomText
          color={COLORS.primaryTxt}
          size={20}
          text={t('paymentSuccessfully.td')}
          style={CommonStyles.titleTxt}
        />
      </View>
      <View style={styles.txtDetails2}>
        <CustomText
          color={COLORS.description}
          size={12}
          text={t('paymentSuccessfully.tid')}
          style={CommonStyles.titleTxt}
        />
        <CustomText
          color={COLORS.primaryTxt}
          size={12}
          text={'456321025645565785'}
          style={CommonStyles.titleTxt}
        />
      </View>
      <View style={styles.txtDetails2}>
        <CustomText
          color={COLORS.description}
          size={12}
          text={t('paymentSuccessfully.date')}
          style={CommonStyles.titleTxt}
        />
        <CustomText
          color={COLORS.primaryTxt}
          size={12}
          text={'29-Nov-2022'}
          style={CommonStyles.titleTxt}
        />
      </View>
      <View style={styles.txtDetails2}>
        <CustomText
          color={COLORS.description}
          size={12}
          text={t('paymentSuccessfully.amount')}
          style={CommonStyles.titleTxt}
        />
        <CustomText
          color={COLORS.primaryTxt}
          size={12}
          text={'1865 SAR'}
          style={CommonStyles.titleTxt}
        />
      </View>
      <CustomButton
        color={COLORS.white}
        onPress={() => {
          navigation.navigate('Home');
        }}
        textSize={15}
        text={t('paymentSuccessfully.close')}
        textColor={COLORS.black}
        containerStyle={[
          styles.btnStyle,
          {
            borderWidth: wp(0.3),
            borderColor: COLORS.header,
            marginTop: hp(3),
          },
        ]}
      />
    </View>
  );
};
export default PaymentSuccessfully;
