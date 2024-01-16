import React, {useMemo, useState} from 'react';
import {View, TouchableOpacity, Image, ScrollView, Modal} from 'react-native';
import createStyles from './style';
import CustomText from '../../../components/customText';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import Lottie from 'lottie-react-native';
import CustomButton from '../../../components/customButton';

const IDVerified = ({navigation}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t, i18n} = useTranslation();

  return (
    <ScrollView
      scrollEnabled={true}
      style={{flex: 1, backgroundColor: COLORS.bg}}>
      <View style={styles.headerStyle2}>
        <Lottie
          style={styles.logo}
          source={require('../../../assets/lottie/paymentDoneLottie.json')}
          autoPlay
          loop={false}
        />
        <CustomText
          color={COLORS.black}
          size={20}
          text={t('nafathVerified.idv')}
          style={styles.BackTxt3}
        />
        <CustomText
          color={COLORS.black}
          size={18}
          text={t('nafathVerified.txt')}
          style={styles.BackTxt2}
        />
        <CustomButton
          color={COLORS.blue}
          onPress={() => {
            navigation.navigate('Profile');
          }}
          text={t('nafathVerified.con')}
          containerStyle={styles.btn2}
        />
      </View>
    </ScrollView>
  );
};
export default IDVerified;
