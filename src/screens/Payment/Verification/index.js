import React, {useState, useMemo} from 'react';
import {
  // Text,
  ImageBackground,
  Button,
  Image,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Modal,
} from 'react-native';
import Text from '../../../components/globalText';

import CustomText from '../../../components/customText';
import CustomButton from '../../../components/customButton';
import {useTheme} from '@react-navigation/native';
import createStyles from './style';
import CommonStyles from '../../../constants/CommonStyles';
import {hp, wp} from '../../../utilis/dimensions';
import CustomHeader from '../../../components/customHeader';
import {useTranslation} from 'react-i18next';
import OTPInputView from '@twotalltotems/react-native-otp-input';
const VerificationScreen = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();
  const [code, setCode] = useState(null);
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <CustomHeader
        navigation={navigation}
      />
      <View style={styles.transactionsContainer}>
        <CustomText
          color={COLORS.primaryTxt}
          size={22}
          text={t('verificationPayment.payment')}
          style={CommonStyles.titleTxt}
        />
        <View style={styles.selectStyle}>
          <View>
            <CustomText
              color={COLORS.header}
              size={20}
              text={t('verificationPayment.vp')}
              style={CommonStyles.titleTxt}
            />
          </View>
          <View style={{marginTop: hp(3)}}>
            <CustomText
              color={COLORS.statisticsTitle}
              size={13}
              text={t('verificationPayment.pin')}
              style={CommonStyles.titleTxt}
            />
          </View>
        </View>
        <OTPInputView
          style={styles.otp}
          pinCount={4}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          onCodeFilled={code => {
            setCode(code);
          }}
        />
        <Pressable onPress={() => {}} style={styles.skipContainer}>
          <CustomText
            color={COLORS.black}
            size={13}
            text={
              <Text>
                {t('verificationPayment.didNotRecive')}
                <Text style={styles.textColored}>
                  {t('verificationPayment.resend')}
                </Text>
              </Text>
            }
            style={styles.text}
          />
        </Pressable>
        <CustomButton
          color={COLORS.blue}
          onPress={() => {
            if (code == '1234') {
              navigation.navigate('PaymentSuccessfully');
            }
          }}
          textSize={15}
          text={t('verificationPayment.send')}
          containerStyle={styles.btnStyle}
        />
        <CustomButton
          color={COLORS.white}
          onPress={() => {
            navigation.goBack();
          }}
          textSize={15}
          text={t('verificationPayment.back')}
          textColor={COLORS.black}
          containerStyle={[
            styles.btnStyle,
            {
              borderWidth: wp(0.5),
              borderColor: COLORS.header,
              marginTop: hp(2),
            },
          ]}
        />
      </View>
    </ScrollView>
  );
};
export default VerificationScreen;
