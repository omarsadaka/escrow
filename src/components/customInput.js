import React, { FC, useMemo, useState } from "react";
import {
  KeyboardTypeOptions,
  ReturnKeyTypeOptions,
  StyleSheet,
  // Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Text from "../components/globalText";
import { RFValue } from "react-native-responsive-fontsize";
// import {COLORS} from '../constants/colors';
import CustomText from "./customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "@react-navigation/native";
import { height, hp, wp } from "../utilis/dimensions";
import { useTranslation } from "react-i18next";
const CustomInput = ({
  placeholder,
  textInputStyle,
  containerStyle,
  onChangeText = () => {},
  keyboardType = "default",
  autoFocus = false,
  editable = true,
  inputStyle,
  leftIcon,
  fontFamily = "regular",
  value,
  password,
  error,
  errorMessage,
  caption,
  label,
  required,
  inputRef,
  maxLength,
  onSubmitEditing = () => {},
  returnKeyType = "default",
  icon,
  multiline,
  onPress = () => {},
  dateInput = false,
  isCvv,
  yearMonth,
  scrollEnabled,
  returnDispute,
  labelStyle,
  obBluer,
  bluerFun,
  requiredLabel = false
}) => {
  const chooseFontFamily = (font) => {
    switch (font) {
      case "extraBold":
        return "Nunito-ExtraBold";
      case "bold":
        return "Nunito-Bold";
      case "semiBold":
        return "Nunito-SemiBold";
      case "medium":
        return "Nunito-Medium";
      case "regular":
        return "Nunito-Regular";

      default:
        break;
    }
  };
  const { t, i18n } = useTranslation();
  const [text, setText] = useState("");
  const [showPassword, setShowPassword] = useState(true);
  const [makeHeight, setMakeHeight] = useState(40);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  return (
    <>
      <View
        style={[
          styles.container,
          { borderColor: error ? "red" : COLORS.blue },
          containerStyle,
        ]}
      >
        {label && !requiredLabel && (
          <CustomText
            style={[styles.textView, labelStyle]}
            color={error ? "red" : COLORS.black}
            text={label}
            size={18}
          />
        

        )}
          {requiredLabel && label && (
          <View style={{
          flexDirection:'row',
          position: "absolute",
          top:  -height*0.032,
          width:'100%',
       
    }}>
          <CustomText
            style={[styles.textViewReq, labelStyle]}
            color={error ? "red" : COLORS.black}
            text={label}
            size={18}
          />
          <CustomText
            color={"red" }
            text=' * '
            size={18}/>
          </View>
          )}

        <View style={styles.textInputView}>
          {leftIcon && <View style={styles.leftIconView}>{leftIcon}</View>}

          {dateInput && yearMonth ? (
            <Text
              onPress={onPress}
              style={[
                styles.textInput,

                {
                  fontFamily: chooseFontFamily(fontFamily),
                  // paddingLeft: leftIcon ? 56 : 0,
                  // paddingRight: required || password ? 45 : 18,
                  textAlign: i18n.language == "ar" ? "left" : "left",
                  color: error ? "red" : COLORS.black,
                },
              ]}
            >
              {value?.toString()}
            </Text>
          ) : multiline ? (
            <TextInput
              onPressIn={onPress}
              ref={inputRef}
              multiline={multiline ? multiline : true}
              onChangeText={(text) => {
                setText(text);
                onChangeText(text);
              }}
              scrollEnabled={scrollEnabled}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKeyType}
              maxLength={maxLength}
              secureTextEntry={showPassword && password}
              value={value}
              style={[
                styles.textInput,
                {
                  fontFamily: "BahijTheSansArabic-Plain", //chooseFontFamily(fontFamily)
                  // paddingLeft: leftIcon ? 56 : 0,
                  // paddingRight: required || password ? 45 : 18,
                  textAlign: i18n.language == "ar" ? "right" : "left",
                  color: error ? "red" : COLORS.black,
                  // height: makeHeight > 40 ? makeHeight : 40,
                  ...textInputStyle,
                },
              ]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.grey}
              keyboardType={keyboardType}
              autoFocus={autoFocus}
              editable={editable}
              onContentSizeChange={(event) => {
                setMakeHeight(event.nativeEvent.contentSize.height);
              }}
            />
          ) : (
            <TextInput
              onPressIn={onPress}
              ref={inputRef}
              // multiline={multiline ? multiline : true}
              onChangeText={(text) => {
                setText(text);
                onChangeText(text);
              }}
              scrollEnabled={scrollEnabled}
              onSubmitEditing={onSubmitEditing}
              returnKeyType={returnKeyType}
              maxLength={maxLength}
              secureTextEntry={showPassword && password}
              value={value}
              onBlur={obBluer ? bluerFun : () => {}}
              style={[
                styles.textInput,
                {
                  fontFamily: "BahijTheSansArabic-Plain", //chooseFontFamily(fontFamily)
                  // paddingLeft: leftIcon ? 56 : 0,
                  // paddingRight: required || password ? 45 : 18,
                  textAlign: i18n.language == "ar" ? "right" : "left",
                  color: error ? "red" : COLORS.black,
                  ...textInputStyle,
                },
              ]}
              placeholder={placeholder}
              placeholderTextColor={COLORS.grey}
              keyboardType={keyboardType}
              autoFocus={autoFocus}
              editable={editable}
            />
          )}
          {password && (
            <View style={styles.leftIconView}>
              <TouchableOpacity
                activeOpacity={0.75}
                // style={styles.showPassTouch}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={COLORS.lightGrey}
                />
              </TouchableOpacity>
            </View>
          )}
          {!password && editable && value?.length > 0 && (
            <View style={styles.leftIconView}>
              <TouchableOpacity
                // activeOpacity={0.75}
                style={{
                  backgroundColor: "#e3e3e3", //
                  borderRadius: wp(50),
                  marginRight: wp(1.5),
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onPress={() => {
                  setText("");
                  onChangeText("");
                }}
              >
                <Ionicons name={"close"} size={16} color={"white"} />
              </TouchableOpacity>
            </View>
          )}
          {required && (
            <View style={styles.star}>
              <CustomText text="*" color={error ? "red" : "grey"} size={11} />
            </View>
          )}
          {icon && <View style={styles.IconView}>{icon}</View>}
        </View>
      </View>
      {error && errorMessage && (
        <View
          style={
            isCvv
              ? styles.errorMessage2
              : returnDispute
              ? styles.errorMessage3
              : styles.errorMessage
          }
        >
          <CustomText
            text={errorMessage}
            color={error ? "red" : "grey"}
            size={11}
          />
        </View>
      )}
    </>
  );
};

export default CustomInput;

const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      paddingVertical: 0,
      marginTop: 30,
      justifyContent: "center",
      alignItems: "center",
      alignSelf: "center",
      marginVertical: 20,
      borderRadius: 8,
      borderColor: COLORS.blue,
      borderWidth: 1,
      width: "80%",
      paddingHorizontal: 5,
      backgroundColor: COLORS.inputBackGround,
    },
    textInput: {
      color: COLORS.black,
      padding: 0,
      textAlignVertical: "bottom",
      fontSize: RFValue(13),
      height: 40,
      paddingBottom: 10,
      marginHorizontal: 8,
      width: "75%",
    },
    textInputView: {
      width: "100%",
      justifyContent: "center",
      flexDirection: "row-reverse",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    showPassTouch: {
      position: "absolute",
      right: 0,
      height: "100%",
      width: 40,
      justifyContent: "center",
      alignItems: "flex-end",
    },
    textViewReq: {
      color: COLORS.lightGrey,
      fontSize: RFValue(13),
      textAlign: "left",
      marginBottom:hp(1),
     
    },
    textView :{
      width: "100%",
      position: "absolute",
      top: -height*0.032,
      color: COLORS.lightGrey,
      fontSize: RFValue(13),
      textAlign:"left",
    },
    leftIconView: {
      position: "absolute",
      zIndex: 1,
      left: -1,
      height: hp(4),
      width: wp(8),
      alignItems: "flex-end",
      // backgroundColor: "green",
      justifyContent: "center",
    },
    IconView: {
      // position: 'absolute',
      // zIndex: 1,
      // right: 0,
      width: "10%",
    },
    star: {
      position: "absolute",
      right: 17,
      height: 52,
      justifyContent: "center",
      alignItems: "center",
    },
    errorMessage: {
      marginTop: hp(-2),
      alignSelf: "center",
    },
    errorMessage2: {
      backgroundColor: "red",
      marginTop: -10,
      justifyContent: "flex-end",
      alignItems: "flex-start",

      marginLeft: wp(-40),
    },
    errorMessage3: {
      marginTop: hp(-2),
      marginLeft: wp(12),
    },
  });
