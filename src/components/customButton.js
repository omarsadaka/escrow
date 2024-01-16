import React from 'react';
import {ActivityIndicator, Pressable, TouchableOpacity, View} from 'react-native';
import {COLORS} from '../constants/colors';
import CustomText from './customText';

const CustomButton = ({
  onPress,
  disabled = false,
  text,
  textSize = 16,
  textColor,
  textFontFamily = 'regular',
  leftIcon,
  rightIcon,
  width = '100%',
  height = 48,
  containerStyle,
  textStyle,
  leftIconContainerStyle,
  rightIconContainerStyle,
  loading = false,
  color,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          width: width,
          height: height,
          backgroundColor: color ? color : COLORS.black,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 10,
          flexDirection: 'row',
        },
        containerStyle,
      ]}>
      {leftIcon && (
        <View
          style={[
            {
              marginRight: 5,
            },
            leftIconContainerStyle,
          ]}>
          {leftIcon}
        </View>
      )}
      {!loading ? (
        <CustomText
          text={text}
          size={textSize}
          color={textColor}
          fontFamily={textFontFamily}
          style={textStyle}
        />
      ) : (
        <ActivityIndicator color={COLORS.white} size={30} />
      )}
      {rightIcon && (
        <View
          style={[
            {
              marginLeft: 10,
            },
            rightIconContainerStyle,
          ]}>
          {rightIcon}
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
