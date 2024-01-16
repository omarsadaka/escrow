//modal for handling req messages

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
} from "react-native";
import { COLORS } from "../constants/colors";
import CustomText from "../components/customText";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../utilis/dimensions";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../components/customButton";
import { setShowModal } from "../redux/actions/modal";
const CustomModal = ({ onChangeText = () => {} }) => {
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { status, header, message } = useSelector((state) => state.modal);

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={status}
        onRequestClose={() => {
          dispatch(
            setShowModal({
              status: false,
              header: "",
              message: "",
              action: false
            })
          );
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.centeredView}>
            <View style={styles.modalTxtCont}>
              <View style={styles.headerModalCont}>
                <View style={styles.modaltitle}>
                  <Image
                    source={require("../assets/newLogo.png")}
                    resizeMode={"contain"}
                    style={styles.modalLogo}
                  />
                  <CustomText color={COLORS.header} size={20} text={header} />
                </View>
              </View>
              <CustomText
                text={message}
                color={COLORS.blue}
                size={20}
                containerStyle={styles.bodyModalCont}
              />
            </View>
            <View style={[styles.modalBtnsCont, { justifyContent: "center" }]}>
              <CustomButton
                color={COLORS.blue}
                onPress={() =>{
                    dispatch(
                      setShowModal({
                        status: false,
                        header: "",
                        message: "",
                        action: false
                      })
                    )
                }}
                textSize={14}
                text={t("close")}
                containerStyle={styles.modalBtn}
                textStyle={styles.closeButtonTxt}
              />

              {/* <CustomButton
              color={COLORS.blue}
              //onPress={ 
                
              //  console.log('showDeleteModal.id from state',showDeleteModal.id)
              //  handleDelete 
            //}
              textSize={14}
              text={t('newTransactions.delete')}
              containerStyle={styles.modalBtn}
              textStyle={styles.closeButtonTxt}
            /> */}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomModal;
const createStyles = (COLORS) =>
  StyleSheet.create({
    modalView: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(52, 52, 52, 0.6)",
      flex: 1,
    },

    centeredView: {
      backgroundColor: COLORS.white,
      paddingHorizontal: wp(3),
      borderRadius: 15,
      paddingBottom: hp(3),
      paddingTop: hp(1),
      height: "30%",
      width: "90%",

      position: "absolute",

      // top: '%',
      //
    },
    modalContent1: {
      height: "70%",
    },
    headerModalCont: {
      minHeight: "20%",
      borderBottomColor: COLORS.grey,
      borderBottomWidth: 0.5,
      justifyContent: "flex-start",
      alignItems: "flex-start",
    },
    bodyModalCont: {
      paddingVertical: hp(3),
    },
    modalBtnsCont: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    modalBtn: {
      width: "45%",
    },
    modalTxtCont: {
      minHeight: "70%",

      // justifyContent:'flex-start'
    },
    modalLogo: {
      width: wp(16),
      height: wp(16),
    },
    modaltitle: {
      height: hp(7),
      flexDirection: "row",
      borderBottomColor: COLORS.header,
      borderBottomWidth: wp(0.1),
      alignItems: "center",
      marginHorizontal: wp(2),
    },
  });
