import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, Image, ScrollView, Modal} from 'react-native';
import createStyles from './style';
import CustomText from '../../../components/customText';
import {useTheme} from '@react-navigation/native';
import CustomHeader from '../../../components/customHeader';
import {useTranslation} from 'react-i18next';

const VerificationOptions = ({navigation, route}) => {
  const {colors: COLORS} = useTheme();
  const {type} = route?.params;
  console.log('route : ', route?.params);
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();

  return (
    <ScrollView
      scrollEnabled={true}
      style={{flex: 1, backgroundColor: COLORS.bg}}>
      <CustomHeader
        navigation={navigation}
      />
      <View style={styles.headerStyle}>
        <CustomText
          color={COLORS.black}
          size={20}
          text={type == 'IDVerification' ? t('nafath.idv') : t('nafath.ci')}
          style={styles.BackTxt}
        />
        <TouchableOpacity
          onPress={
            type == 'IDVerification'
              ? () => navigation.navigate('IDVerified')
              : () => navigation.goBack()
          }
          style={styles.container}>
          <CustomText
            color={COLORS.proTxt}
            size={13}
            text={type == 'IDVerification' ? t('nafath.op1') : t('nafath.op2')}
            style={styles.Txt}
          />
          <CustomText
            color={COLORS.proTxt}
            size={18}
            text={type == 'IDVerification' ? t('nafath.idvv') : t('nafath.ci')}
            style={styles.Txt2}
          />
          <CustomText
            color={COLORS.proTxt}
            size={13}
            text={t('nafath.txt')}
            style={styles.Txt}
          />
          <CustomText
            color={type == 'IDVerification' ? COLORS.proTxt : COLORS.green}
            size={18}
            text={type == 'IDVerification' ? t('nafath.v') : t('nafath.cd')}
            style={styles.Txt3}
          />
        </TouchableOpacity>


        <TouchableOpacity
          onPress={
            route?.params?.kv==0 
              ? () => navigation.navigate('KYCManualVerification')
              : () => navigation.goBack()
          }
          style={styles.container}>
          <CustomText
            color={COLORS.proTxt}
            size={13}
            text={type == 'IDVerification' ? t('nafath.op2') : t('nafath.op2')}
            style={styles.Txt}
          />
          <CustomText
            color={COLORS.proTxt}
            size={18}
            text={type == 'IDVerification' ? t('nafath.idvv2') : t('nafath.ci')}
            style={styles.Txt2}
          />
          <CustomText
            color={COLORS.proTxt}
            size={13}
            text={t('nafath.txt')}
            style={styles.Txt}
          />
          <CustomText
            color={route?.params?.kv == 0 ? COLORS.proTxt :route?.params?.kv == 2 ? COLORS.yellow: COLORS.green}
            size={18}
            text={
              route?.params?.kv==0 
              ? t('nafath.v') 
              : route?.params?.kv==2
              ? t('profileScreens.awaitingKv')
              : t('nafath.cd')}
            style={styles.Txt3}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default VerificationOptions;
