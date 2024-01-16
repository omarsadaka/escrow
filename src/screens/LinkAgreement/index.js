import React, { useEffect, useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";

import createStyles from "./style";
import CustomButton from "../../components/customButton";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../components/CustomAlert";
import { useSelector, useDispatch } from "react-redux";
import * as linkAgreements from "../../redux/actions/agreements";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import axios from "axios";
import moment from "moment";
import { hp } from "../../utilis/dimensions";
import * as agreements from "../../redux/actions/agreements";
import ProgressBar from "react-native-animated-progress";

const LinkAgreementScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const { selectedAgreements } = useSelector((state) => state.agreements);
  const [arr, setArr] = useState([]);
  const [agreementList, setAgreementList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");
  const [warningBack, setWarningBack] = useState(false);

  useEffect(() => {
    selectedAgreements && setArr(selectedAgreements);
  }, [selectedAgreements]);

  const [warning, setWarning] = useState(false);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    if (!baseURL) return;
    getAgreementList();
  }, [navigation, baseURL]);
  const getAgreementList = async () => {
    setLoading(true);
    console.log("in get agreement list...");
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.agreementList,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        // console.log("res of agree : ", res?.data?.data?.agreements);
        if (res?.data?.data?.agreements?.data) {
          setAgreementList(res?.data?.data?.agreements?.data);
          setLoading(false);
        } else {
          setAgreementList(null);
          setWarningMessage(res?.data?.message);
          setWarning2(true);
          setLoading(false);
        }
      })
      .catch((er) => {
        setAgreementList(null);
        setWarningMessage(t("accountScreen.err"));
        setLoading(false);
        setWarning2(true);
      });
  };
  const handelSelection = ({ title, id, description }) => {
    let x = arr;
    const indexOf = x.findIndex((el) => el.id == id);
    if (indexOf != -1) {
      x.splice(indexOf, 1);
    } else {
      x.push({ title: title, id: id, description: description });
    }
    setArr(x);
    console.log("array : ", x);
  };

  const AgreementItem = ({ el }) => {
    const [more, setMore] = useState(false);
    const [ref, setRef] = useState(false);
    return (
      <TouchableOpacity
        onPress={() => {
          handelSelection({
            title: el.title,
            id: el.id,
            description: el.description,
          });
          setRef((x) => !x);
        }}
        style={
          arr.findIndex((e) => e.id == el.id) != -1
            ? styles.agreementItem2
            : styles.agreementItem
        }
      >
        <View style={styles.row100}>
          <CustomText
            color={COLORS.darkBlue}
            size={14}
            text={el.title}
            style={styles.title}
          />
          <CustomText
            color={COLORS.neonGreen}
            size={10}
            text={
              t("linkAgreementScreen.co") +
              moment(el?.created_at)
                .locale('en')
                .format("DD-MM-YYYY, h:mm:ss a")
            }
            style={styles.title}
          />
        </View>
        {more && (
          <View style={styles.description}>
            <CustomText
              color={COLORS.grayColor}
              size={10}
              text={el.description}
              style={styles.text}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={() => setMore(!more)}
          style={styles.moreContainer}
        >
          <Ionicons
            name={more ? "chevron-up-outline" : "chevron-down-outline"}
            size={20}
            style={styles.iconMore}
            color={COLORS.babyBlue2}
          />
          <CustomText
            color={COLORS.black}
            size={12}
            text={more ? t("agreementScreen.less") : t("agreementScreen.more1")}
            style={styles.more}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.bg}>
      <CustomAlert
        type={'error'}
        show={warningBack}
        header={t("reviewTransaction.w")}
        body={t("newTransactions.backMessage")}
        action1={() => {
          dispatch(agreements.removeAgreements());
          setWarningBack(false);
          navigation.goBack();
        }}
        btn1={t("reviewTransaction.ok")}
        btn2={t("newTransactions.cancle")}
        action2={() => setWarningBack(false)}
        oneBtn={false}
      />
      <CustomHeader
        // warningBack={true}
        // backAction={() => setWarningBack(true)}
        navigation={navigation}
        warningLanguage={true}
      />
      <View style={styles.progressCon}>
        <ProgressBar
          progress={60}
          height={10}
          backgroundColor="green"
          // animated={false}
        />
        {/* <View style={styles.progressCounter}></View> */}
      </View>
      <CustomText color={COLORS.red} size={18} text={t("changeRole.step3")} />
      <View style={styles.row100}>
        <CustomText
          color={COLORS.darkBlue}
          size={18}
          text={t("linkAgreementScreen.linkAgreement")}
          style={styles.title}
        />
      </View>
      {loading ? (
        <ActivityIndicator size={"large"} color={COLORS.header} />
      ) : agreementList ? (
        agreementList.length > 0 ? (
          <>
            <ScrollView style={{ height: hp(40) }}>
              {agreementList.map((el) => (
                <AgreementItem el={el} key={el.id} />
              ))}
            </ScrollView>
            <CustomButton
              color={COLORS.blue}
              onPress={() => {
                if (arr.length > 0) {
                  dispatch(linkAgreements.addAgreements(arr));
                  navigation.navigate("add");
                } else {
                  setWarning(true);
                }
              }}
              textSize={16}
              text={
                t("newTransactions.Next")
              }
              containerStyle={styles.btn}
            />
          </>
        ) : (
          <CustomText
            color={COLORS.darkBlue}
            size={16}
            text={t("linkAgreementScreen.noAgree")}
            style={styles.title}
          />
        )
      ) : (
        <CustomText
          color={COLORS.darkBlue}
          size={16}
          text={t("accountScreen.err")}
          style={styles.title}
        />
      )}
      <CustomAlert
        type={'error'}
        show={warning}
        header={t("linkAgreementScreen.wh")}
        body={t("linkAgreementScreen.wb")}
        action1={() => setWarning(false)}
        btn1={t("linkAgreementScreen.wbu")}
        oneBtn={true}
      />
      <CustomAlert
        type={'error'}
        show={warning2}
        header={t("accountScreen.w")}
        body={t("accountScreen.err")}
        action1={() => {
          setWarning2(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </View>
  );
};
export default LinkAgreementScreen;
