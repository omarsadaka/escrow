import React, {useState, useMemo, useEffect} from 'react';
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
import CustomHeader from '../../../components/customHeader';
import {useTranslation} from 'react-i18next';
import CustomInput from '../../../components/customInput';
const CreditCard = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();
  const [section, setSection] = useState(1);
  const [cvv, setCvv] = useState('');
  const [valid, setValid] = useState(false);
  useEffect(() => {
    validateCVV(cvv) ? setValid(true) : setValid(false);
  }, [cvv]);
  const validateCVV = cvvValue => {
    if (cvvValue.length == 3) {
      return true;
    } else {
      return false;
    }
  };
  const CardItem = ({title}) => {
    return (
      <TouchableOpacity
        onPress={() => setSection(2)}
        style={[
          styles.cardItem,
          {
            backgroundColor:
              title == 'MASTERCARD' ? COLORS.cardBlue : COLORS.cardGreen,
          },
        ]}>
        <View style={styles.cardRow}>
          <CustomText
            color={COLORS.white}
            size={14}
            text={title}
            style={styles.title}
          />
        </View>
        <View style={styles.cardRow}>
          <Image
            style={styles.sim}
            source={require('../../../assets/sim.png')}
          />
        </View>
        <View style={styles.cardRow}>
          <CustomText
            color={COLORS.white}
            size={14}
            text={'5412  7512  3412  3456'}
            style={styles.title}
          />
        </View>
        <View style={styles.cardRow}>
          <View>
            <CustomText
              color={COLORS.white}
              size={8}
              text={'Cardholder Name'}
              style={styles.cardTitle}
            />
            <CustomText
              color={COLORS.white}
              size={14}
              text={'Amir Ayub'}
              style={styles.cardSubTitle}
            />
          </View>

          <View style={styles.cardBottomContainer}>
            <View>
              <CustomText
                color={COLORS.white}
                size={8}
                text={'Valid Till'}
                style={styles.cardTitle}
              />
              <CustomText
                color={COLORS.white}
                size={14}
                text={'24-25'}
                style={styles.cardSubTitle}
              />
            </View>
            <Image
              style={styles.sim}
              source={require('../../../assets/mastercard.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <ScrollView style={styles.container} nestedScrollEnabled={true}>
      <CustomHeader
        navigation={navigation}
      />
      <View style={CommonStyles.transactionsContainer}>
        <CustomText
          color={COLORS.primaryTxt}
          size={20}
          text={t('payment.payment')}
          style={CommonStyles.titleTxt}
        />
        <View style={styles.selectStyle}>
          <Pressable
            onPress={() => setSection(1)}
            style={section == 1 ? styles.selectedStyle : styles.basicStyle}>
            <CustomText
              color={section == 1 ? COLORS.white : COLORS.header}
              size={14}
              text={t('creditCard.card')}
              style={styles.BackTxt3}
            />
          </Pressable>
          <Pressable
            // onPress={() => setSection(2)}
            style={section == 2 ? styles.selectedStyle : styles.basicStyle}>
            <CustomText
              color={section == 2 ? COLORS.white : COLORS.header}
              size={14}
              text={t('creditCard.confirm')}
              style={styles.BackTxt3}
            />
          </Pressable>
        </View>
        {section == 1 && (
          <>
            <CardItem title="MASTERCARD" number="1" />
            <CardItem title="VISA" number="2" />
          </>
        )}
        {section == 2 && (
          <>
            <View style={styles.visa}>
              <Image
                style={{width: wp(65), height: hp(10)}}
                source={require('../../../assets/visaAndMaster.png')}
              />
            </View>
            <View style={styles.confirmContainer}>
              <CustomInput
                editable={false}
                label={t('creditCard.cn')}
                inputStyle={styles.font}
                placeholder={'*****************4589'}
                containerStyle={styles.agreementName}
              />
              <View style={styles.containerStyle}>
                <CustomInput
                  editable={false}
                  label={t('creditCard.ed')}
                  placeholder={'06 / 24'}
                  inputStyle={styles.font}
                  containerStyle={styles.agreementName2}
                />
                <CustomInput
                  label={'CVV'}
                  isCvv={true}
                  keyboardType={'numeric'}
                  inputStyle={styles.font}
                  placeholder={'***'}
                  value={cvv}
                  onChangeText={setCvv}
                  error={cvv.length ? !validateCVV(cvv) : false}
                  errorMessage="you must enter valid CVV!"
                  containerStyle={styles.agreementName3}
                />
              </View>
              <CustomInput
                editable={false}
                label={t('creditCard.ch')}
                inputStyle={styles.font}
                placeholder={'Amir Ayub'}
                containerStyle={styles.agreementName}
              />
              <CustomButton
                color={COLORS.blue}
                disabled={valid ? false : true}
                onPress={() => {
                  navigation.navigate('VerificationScreen');
                }}
                textSize={16}
                text={t('creditCard.cp')}
                containerStyle={styles.selectStyle3}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};
export default CreditCard;
