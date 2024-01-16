import React, { useEffect, useMemo, useState, useRef } from "react";
import { View, TouchableOpacity } from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import AntDesign from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { ScrollView } from "react-native-gesture-handler";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import CustomButton from "../../components/customButton";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import axios from "axios";
import { showMessage } from "react-native-flash-message";
import CustomInput from "../../components/customInput";

const EscrowReview = ({ navigation, route }) => {
  const { escrow_id } = route.params;
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const reviewRef = useRef();
  const [selected, setSelected] = useState(0);

  const handleEscrowReview = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append("escrow_id", escrow_id);
    formdata.append("thumb", selected == 2 ? "0" : selected.toString());
    formdata.append("review", reviewNotes);
    formdata.append('device_info', deviceInfo)
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS2.escrowPlusReview,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      data: formdata,
    })
      .then((res) => {
        setLoading(false);
        console.log("res enable : ", res.data);
        if (res?.data?.messages?.success) {
          showMessage({
            message: res?.data?.messages?.success,
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          navigation.navigate("Transactions");
        } else if (res?.data?.messages?.error) {
          showMessage({
            message: res?.data?.messages?.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: t("accountScreen.err"),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        setLoading(false);
        console.log("er : ", er);
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };
  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <ScrollView contentContainerStyle={styles.mainStyle}>
        <CustomText
          color={COLORS.black}
          size={25}
          text={t("transDetailsScreen.review")}
          style={styles.BackTxt}
        />
        <CustomText
          text={t("transDetailsScreen.review1")}
          style={styles.modalText}
          color={COLORS.grey}
        />
        <View style={styles.thunk}>
          <TouchableOpacity
            onPress={() => {
              setSelected(1);
            }}
            style={selected == 1 ? styles.selected : styles.notselected}
          >
            <AntDesign name="like1" size={40} color={COLORS.babyBlue2} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelected(2);
            }}
            style={selected == 2 ? styles.selected : styles.notselected}
          >
            <AntDesign name="dislike1" size={40} color={COLORS.babyBlue2} />
          </TouchableOpacity>
        </View>
        <CustomInput
          label={t("transDetailsScreen.review2")}
          placeholder={t("transDetailsScreen.review2")}
          value={reviewNotes}
          onChangeText={setReviewNotes}
          inputRef={reviewRef}
          multiline
          icon={
            <FontAwesome5
              name="money-bill-wave-alt"
              size={15}
              color={COLORS.babyBlue2}
            />
          }
          textInputStyle={styles.textInputStyle}
        />
        <CustomButton
          color={COLORS.header}
          loading={loading}
          disabled={loading}
          onPress={() => {
            if (selected == 0) {
              showMessage({
                message: t("transDetailsScreen.review4"),
                type: "danger",
                titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
              });
            } else {
              if (reviewNotes && reviewNotes.length > 0) {
                handleEscrowReview();
                console.log(
                  "selected and review notes : ",
                  selected,
                  reviewNotes,
                  escrow_id
                );
              } else {
                reviewRef.current.focus();
              }
            }
          }}
          textSize={15}
          text={t("transDetailsScreen.review3")}
          containerStyle={styles.closeButton}
        />
        <CustomButton
          color={COLORS.grayColor}
          onPress={() => navigation.navigate("Transactions")}
          textSize={14}
          text={t("transDetailsScreen.continueWithoutRating")}
          containerStyle={styles.closeButton2}
        />
      </ScrollView>
      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </View>
  );
};
export default EscrowReview;
