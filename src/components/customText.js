import React from 'react';
import {StyleSheet, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {COLORS} from '../constants/colors';
import Text from "./globalText";
const chooseTextColor = color => {
  switch (color) {
    case 'white':
      return COLORS.white;
    case 'black':
      return COLORS.black;
    default:
      return color;
  }
};

const chooseFontFamily = font => {
  switch (font) {
    case 'extraBold':
      return 'Nunito-ExtraBold';
    case 'bold':
      return 'Nunito-Bold';
    case 'semiBold':
      return 'Nunito-SemiBold';
    case 'medium':
      return 'Nunito-Medium';
    case 'regular':
      return 'Nunito-Regular';
    case 'light':
      return 'Nunito-Light';

    default:
      break;
  }
};

const CustomText = ({
  text = '',
  color = 'white',
  size = 16,
  fontFamily = 'regular',
  style,
  containerStyle,
  num,
  children,
  icon,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {icon && <View style={styles.iconCntainer}>{icon}</View>}
      <Text
        numberOfLines={num}
        style={[
          {
            color: chooseTextColor(color),
            fontFamily: chooseFontFamily(fontFamily),
            fontSize: RFValue(size),
            textAlign: 'center',
          },
          style,
        ]}>
        {text}
        {children}
      </Text>
    </View>
  );
};

export default CustomText;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCntainer: {
    marginRight: 6,
  },
});
