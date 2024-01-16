import React, {useMemo, useState} from 'react';
import {Image, View} from 'react-native';
import CustomText from '../../components/customText';
import CustomButton from '../../components/customButton';
import {useTranslation} from 'react-i18next';
import createStyles from './styles';
import {useTheme} from '@react-navigation/native';

const AccountCreatedScreen = ({navigation}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const {t} = useTranslation();

  return (
    <View style={styles.bg}>
      <Image style={styles.logo} source={require('../../assets/check.png')} />
      <View>
        <CustomText
          color={COLORS.black}
          size={18}
          text={t('RegisterScreen.created')}
          style={styles.text}
        />
        <CustomText
          color={COLORS.black}
          size={12}
          text={
            t('RegisterScreen.createdSuccess')
          }
          style={styles.text2}
        />
      </View>

      <CustomButton
        color={COLORS.blue}
        onPress={() => {navigation.navigate('Login')}}
        textSize={12}
        text={t('RegisterScreen.Continue')}
        containerStyle={styles.btn}
      />
    </View>
  );
};
export default AccountCreatedScreen;
