import { useTheme } from "@react-navigation/native";
import React, { useMemo, useRef } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  Image,
  ActivityIndicator,
  Linking,
} from "react-native";
import { hp, wp } from "../utilis/dimensions";
import CustomText from "../components/customText";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { showSimpleModal } from "../redux/actions/modal";
import AntDesign from "react-native-vector-icons/AntDesign";
import CommonStyles from "../constants/CommonStyles";
const SimpleCustomModal = ({}) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const ref1 = useRef();
  const { simpleModalStatus, simpleModalPayload } = useSelector(
    (state) => state.modal
  );
  return (
    <Modal visible={simpleModalStatus} transparent animationType="slide">
      <View style={styles.centered_view}>
        <View
          style={[
            styles.modal,
            {
              // minHeight: hp(10),
            },
          ]}
        >
          <View style={styles.modaltitle}>
            <View style={{ flexDirection: "row",paddingVertical:2 }}>
              {simpleModalPayload.type=='error'?
              <Image
                source={require("../assets/warning.png")}
                resizeMode={"contain"}
                style={styles.warningLogo}/>
              :
              <Image
                source={require("../assets/newLogo.png")}
                resizeMode={"contain"}
                style={styles.modalLogo}/>
              }
              
              
              <CustomText
                color={COLORS.black}
                size={17}
                text={simpleModalPayload?.header} //t(`${simpleModalPayload?.header}`)
              />
            </View>
            <TouchableOpacity style={CommonStyles.closeCont}>
              <AntDesign
                onPress={() =>
                  dispatch(
                    showSimpleModal({
                      status: false,
                      payload: { header: t(""), message: t(""), action: "" },
                    })
                  )
                }
                name={"closecircleo"}
                size={30}
                color={COLORS.red}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.modalbody2}>
            {
              <CustomText
                color={COLORS.black}
                size={15}
                text={t(`${simpleModalPayload?.message}`)}
              />
            }
          </View>
          <View style={styles.modalBtnCont}>
            <TouchableOpacity
              onPress={() =>{ 
                dispatch(
                  showSimpleModal({
                    status: false,
                    payload: { header: t(""), message: t(""), action: "" },
                  })
                )
                if(simpleModalPayload?.action){
                  Linking.openSettings()
                }
              }}
              style={[
                styles.modalbutton,
                // {width: oneBtn == true ? '50%' : '42%', borderRadius: hp(2)},
                { width: "75%", borderRadius: hp(2) },
              ]}
            >
              <CustomText color={COLORS.white} size={16} text={simpleModalPayload?.action? t('goSettings') : t("OK")} />
            </TouchableOpacity>
            {/* {oneBtn == false && (
              <TouchableOpacity
                onPress={action2}
                style={[styles.modalbutton, {borderRadius: hp(2)}]}>
                <CustomText color={'white'} size={16} text={btn2} />
              </TouchableOpacity>
            )} */}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SimpleCustomModal;

const createStyles = (COLORS) =>
  StyleSheet.create({
    modal: {
      width: "92%",
      backgroundColor: COLORS.white,
      borderRadius: hp(2),
    },
    modaltitle: {
      // minHeight: hp(9),
      flexDirection: "row",
      borderBottomColor: COLORS.header,
      borderBottomWidth: wp(0.1),
      alignItems: "center",
      justifyContent: "space-between",
    },
    modalbody: {
      minHeight: hp(13),
      paddingVertical: hp(3),
      alignItems: "flex-start",
      marginLeft: wp(5),
    },
    modalbody2: {
      minHeight: hp(13),
      alignItems: "center",
      justifyContent: "center",
    },
    modalbutton: {
      backgroundColor: COLORS.header,
      color: "white",
      height: hp(7),
      width: "42%",
      alignItems: "center",
      justifyContent: "center",
    },
    modalTitleTxt: {
      color: COLORS.header,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
    },
    modalBodyTxt: {
      color: COLORS.black,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
      marginHorizontal: wp(4),
      lineHeight: hp(3),
    },
    modalBodyTxt2: {
      textAlign: "center",
      color: COLORS.blue,
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabic-Plain",
      marginHorizontal: wp(4),
      lineHeight: hp(3),
    },
    modalBtnCont: {
      flexDirection: "row",
      bottom: hp(2),
      justifyContent: "space-around",
      // width:'100%'
    },
    modalBtnTxt: {
      color: "white",
      writingDirection: "rtl",
      fontFamily: "BahijTheSansArabicExtraBold",
    },
    centered_view: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
      borderRadius: hp(2),
    },
    modalLogo: {
      width: wp(16),
      height: wp(16),
    },
    warningLogo: {
      width: wp(9),
      height: wp(9),
      marginHorizontal: wp(3)
    },
  });
