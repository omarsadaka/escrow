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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useTheme} from '@react-navigation/native';
import createStyles from './style';
import CommonStyles from '../../../constants/CommonStyles';
import {hp, wp} from '../../../utilis/dimensions';
import CustomHeader from '../../../components/customHeader';
import {useTranslation} from 'react-i18next';
import CustomInput from '../../../components/customInput';
const WireTransafer = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();
  const [section, setSection] = useState(1);
  const [selected, setSelected] = useState(null);
  
  const AccountItem = ({title, number}) => {
    const [more, setMore] = useState(false);
    return (
      <TouchableOpacity
        onPress={() => setSelected(number)}
        style={selected == number ? styles.accountItem2 : styles.accountItem}>
        <View style={styles.row100}>
          <CustomText
            color={COLORS.darkBlue}
            size={14}
            text={title}
            style={styles.title}
          />
          <CustomText
            color={COLORS.blue}
            size={9}
            text={`Account ${number}`}
            style={styles.title}
          />
        </View>
        <CustomInput
          editable={false}
          label={'IBAN'}
          placeholder={'SA5180000284608011234589'}
          icon={<Ionicons name="card" size={20} color={COLORS.babyBlue2} />}
          containerStyle={styles.agreementName}
        />
        <CustomInput
          editable={false}
          label={t('accountScreen.n')}
          placeholder={t('accountScreen.name')}
          icon={<Ionicons name="person" size={20} color={COLORS.babyBlue2} />}
          containerStyle={styles.agreementName}
        />
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
          size={22}
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
              text={t('wireTransafer.accounts')}
              style={styles.BackTxt3}
            />
          </Pressable>
          <Pressable
            // onPress={() => setSection(2)}
            style={section == 2 ? styles.selectedStyle : styles.basicStyle}>
            <CustomText
              color={section == 2 ? COLORS.white : COLORS.header}
              size={14}
              text={t('wireTransafer.confirm')}
              style={styles.BackTxt3}
            />
          </Pressable>
        </View>
        {section == 1 && (
          <>
            <AccountItem title={t('accountScreen.b1')} number="1" />
            <AccountItem title={t('accountScreen.b2')} number="2" />
            <CustomButton
              color={COLORS.blue}
              onPress={() => {
                selected != null && setSection(2);
              }}
              textSize={12}
              text={t('wireTransafer.next')}
              containerStyle={styles.selectStyle2}
            />
          </>
        )}
        {section == 2 && (
          <View style={styles.confirmContainer}>
            <CustomInput
              editable={false}
              label={t('wireTransafer.n')}
              placeholder={t('wireTransafer.name')}
              icon={
                <Ionicons name="person" size={20} color={COLORS.babyBlue2} />
              }
              containerStyle={styles.agreementName}
            />
            <CustomInput
              editable={false}
              label={t('wireTransafer.swift')}
              placeholder={'AGFTTY45678899876'}
              icon={<Ionicons name="mail" size={20} color={COLORS.babyBlue2} />}
              containerStyle={styles.agreementName}
            />
            <CustomInput
              editable={false}
              label={t('wireTransafer.AN')}
              placeholder={'0512378954'}
              icon={
                <Ionicons
                  name="ios-phone-portrait-outline"
                  size={20}
                  color={COLORS.babyBlue2}
                />
              }
              containerStyle={styles.agreementName}
            />
            <CustomInput
              editable={false}
              label={'IBAN'}
              placeholder={'SA5180000284608011234589'}
              icon={<Ionicons name="card" size={20} color={COLORS.babyBlue2} />}
              containerStyle={styles.agreementName}
            />
            <CustomInput
              editable={false}
              label={t('wireTransafer.benef')}
              placeholder={t('wireTransafer.benefA')}
              icon={
                <Ionicons
                  name="ios-lock-open"
                  size={20}
                  color={COLORS.babyBlue2}
                />
              }
              containerStyle={styles.agreementName}
            />
            <View style={styles.buttonsStyle}>
              <CustomButton
                color={COLORS.white}
                onPress={() => {
                  navigation.goBack();
                }}
                textSize={14}
                text={t('wireTransafer.transferLater')}
                textColor={COLORS.black}
                containerStyle={[
                  styles.selectStyle3,
                  {
                    borderWidth: wp(0.5),
                    borderColor: COLORS.header,
                  },
                ]}
              />
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  navigation.navigate('VerificationScreen');
                }}
                textSize={12}
                text={t('wireTransafer.next')}
                containerStyle={styles.selectStyle3}
              />
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};
export default WireTransafer;
