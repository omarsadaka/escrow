import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  Image,
  Modal,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "@react-navigation/native";
import CustomText from "../components/customText";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../utilis/dimensions";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../components/customButton";
import AntDesign from "react-native-vector-icons/AntDesign";
import CommonStyles from "../constants/CommonStyles";
import {
  handleSaveAsDraftValue,
  handleSaveAsDraftWhere,
} from "../redux/actions/user";

const ChangeLanguageModal = ({
  show,
  setShow,
  handleLang,
  saveAsDraft,
  saveDraftText,
  theme,
}) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { stackValue, saveDraftValue, saveDraftEnded } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const handleSaveAsDraft = () => {
    dispatch(handleSaveAsDraftValue(true));
    dispatch(handleSaveAsDraftWhere("language"));
    console.log("where : ", "language");
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}
      onRequestClose={() => {
        setShow(!show);
      }}
    >
      <View style={styles.modalView}>
        <View
          style={[
            styles.centeredView,
            {
              paddingBottom: 10,
              paddingHorizontal: 0,
              overflow: "hidden",
              borderColor: COLORS.black,
              paddingVertical: 0,
              borderWidth: 1,
            },
          ]}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              // paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: hp(5),
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={{
                  alignSelf: "center",
                  marginHorizontal: 10,
                  height: 50,
                  width: 50,
                }}
                source={require("../assets/newLogo.png")}
              />

              <CustomText
                text={theme? t("settingsScreen.changeTheme"): t("settingsScreen.changeLang")}
                color={COLORS.blue}
                size={16}
                style={styles.passwordTitle}
              />
            </View>

            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() => {
                  setShow(!show);
                }}
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <CustomText
            text={
              stackValue
                ? t("stackError")
                : theme
                ? t("settingsScreen.changeThemeConfirm")
                : t("settingsScreen.changeLangConfirm")
            }
            style={styles.modalText}
            color={COLORS.grey}
          />
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <CustomButton
              color={COLORS.blue}
              onPress={() => {
                setShow(!show);
                handleLang();
              }}
              textSize={12}
              text={t("quickLogin.yes")}
              containerStyle={[
                styles.btn,
                { width: stackValue ? "40%" : "70%" },
              ]}
            />
            {stackValue == true && (
              <CustomButton
                loading={saveDraftValue}
                color={COLORS.blue}
                onPress={handleSaveAsDraft}
                textSize={12}
                text={t("saveAsDraft")}
                containerStyle={[styles.btn, { width: "40%" }]}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ChangeLanguageModal;
const createStyles = (COLORS) =>
  StyleSheet.create({
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },
    centeredView: {
      backgroundColor: COLORS.bg, //change
      paddingHorizontal: wp(5),
      borderRadius: 15,
      width: "90%",
      paddingVertical: 50,
      // height:'80%',
      position: "absolute",
    },
    btn: {
      width: "70%",
      alignSelf: "center",
      marginTop: hp(5),
      marginBottom: hp(1),
    },
    // closeButton: {
    //   width: "70%",
    //   alignSelf: "center",
    //   marginTop: 20,
    //   borderWidth: 1,
    //   borderColor: COLORS.grey,
    //   backgroundColor: COLORS.white,
    // },
    closeButtonTxt: {
      color: COLORS.black,
      // fontWeight: 'bold',
    },
  });
