import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  // Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import createStyles from "./styles";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import { useDispatch } from "react-redux";
import CustomAlert from "../../components/CustomAlert";
import { TouchableOpacity } from "react-native";
import { storeStackValue } from "../../redux/actions/user";

const EscrowType = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [selected, setSelected] = useState(1);
  const [warningBack, setWarningBack] = useState(false);
  const isFocused = useIsFocused();
  // useEffect(() => {
  //   dispatch(storeStackValue(true));
  // }, [navigation, isFocused]);

  return (
    <View style={{flex:1, backgroundColor: COLORS.bg}}>
    <KeyboardAvoidingView behavior="padding">
      <CustomHeader
        navigation={navigation}
        warningLanguage={true}
        firstScreenInStack={true}
        // Home={true}
        // warningBack={true}
        // backAction={() => setWarningBack(true)}
      />
      <ScrollView>
        <CustomText
          color={COLORS.black}
          size={18}
          text={t("escrowType.select")}
          containerStyle={styles.head}
        />
        <View style={styles.selectStyle}>
          <TouchableOpacity
            onPress={() => setSelected(1)}
            style={selected == 1 ? styles.selectedStyle : styles.basicStyle}
          >
            <CustomText
              color={selected == 1 ? COLORS.black : COLORS.loginTab}
              size={14}
              text={t("escrowType.admn")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelected(2)}
            style={selected == 2 ? styles.selectedStyle : styles.basicStyle}
          >
            <CustomText
              color={selected == 2 ? COLORS.black : COLORS.loginTab}
              size={14}
              text={t("escrowType.dmanat")}
              style={styles.BackTxt3}
            />
          </TouchableOpacity>
        </View>
        {selected == 1 ? (
          <>
            <CustomText
              color={COLORS.black}
              size={15}
              text={t("escrowType.admnDes")}
              // style={styles.text3}
              containerStyle={styles.conSty}
            />
            <CustomButton
              color={COLORS.blue}
              onPress={() => {
                navigation.navigate("ShortEscrow",{UserType: t("shortEscrow.buyer")});
                dispatch(storeStackValue(true));
              }}
              textSize={12}
              text={t("escrowType.startNow")}
              containerStyle={styles.startBtn}
            />
          </>
        ) : (
          <>
            <CustomText
              color={COLORS.black}
              size={15}
              text={t("escrowType.dmanatDes")}
              // style={styles.text3}
              containerStyle={styles.conSty}
            />
            {/* <CustomButton
              color={COLORS.blue}
              onPress={() => {
                navigation.navigate("changeRole");
                dispatch(storeStackValue(true));
              }}
              textSize={12}
              text={t("escrowType.startNow")}
              containerStyle={styles.startBtn}
            /> */}
          </>
        )}
        <CustomAlert
          type={'error'}
          show={warning}
          header={t("accountScreen.w")}
          body={errmess}
          action1={() => {
            setWarning(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
      </ScrollView>
      <CustomAlert
        type={'error'}
        show={warningBack}
        header={t("reviewTransaction.w")}
        body={t("stackError")}
        action1={() => {
          dispatch(storeStackValue(false));
          setWarningBack(false);
          navigation.navigate("home");
        }}
        btn1={t("reviewTransaction.ok")}
        btn2={t("newTransactions.cancle")}
        action2={() => setWarningBack(false)}
        oneBtn={false}
      />
    </KeyboardAvoidingView>
    </View>
  );
};
export default EscrowType;
