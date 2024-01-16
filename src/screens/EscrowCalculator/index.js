import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Switch,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomInput from "../../components/customInput";
import { useTranslation } from "react-i18next";
import CustomButton from "../../components/customButton";
import createStyles from "./style";
import { useState } from "react";
import CustomText from "../../components/customText";
import SelectDropdown from "react-native-select-dropdown";
import CustomHeader from "../../components/customHeader";
import CustomAlert from "../../components/CustomAlert";
import { hp, width, wp } from "../../utilis/dimensions";
import { showMessage } from "react-native-flash-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import ScrollPicker from "react-native-wheel-scrollview-picker";
import RBSheet from "react-native-raw-bottom-sheet";

const HoursArr = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23,
];
const DaysArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

const EscrowCalculator = ({ navigation, route }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const scrollingRef = useRef();
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [previewData, setPreview] = useState(null);
  const [more, setMore] = useState(false);

  const [buyerOrSeller, setBuyerOrSeller] = useState(
    t("RegisterScreen.Seller")
  );
  const [amount, setAmount] = useState("");
  const amountRef = useRef();
  const RBSheetRef3 = useRef();
  const [valid, setValid] = useState(false);
  const [inspectionPeriod, setInspectionPeriod] = useState("");
  const [inspectionLabel, setInspectionLabel] = useState("");
  const [inspectionType, setInspectionType] = useState(t("shortEscrow.fawry"));
  const [inspectionTypeField, setInspectionTypeField] = useState('');
  const [showInspectionPeriodWarning, setShowInspectionPeriodWarning] =
    useState(false);
  const [SaudiEscrowFeePaidBy, setSaudiEscrowFeePaidBy] = useState("");
  const [payMethods, setPayMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const val = parseInt(amount);
    if (amount.length != 0) {
      if (val >= 50 && val <= 2000) {
        setValid(true);
      } else {
        setValid(false);
      }
    } else {
      setValid(false);
    }
  }, [amount]);

  const getCategories = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(baseURL + ENDPOINTS.categoryList, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language,
      },
    })
      .then((response) => response.json())
      .then(async (res) => {
        console.log("payments : ", res?.payments);
        if (res?.payments) {
          await AsyncStorage.setItem(
            "PaymentMethodsSeller",
            JSON.stringify(res?.payments)
          );
          setPayMethods(res?.payments);
          setSaudiEscrowFeePaidBy(res?.payments[0].value);
          setLoading(false);
        } else {
          setErrMess(res?.messages?.error);
          setLoading(false);
          setWarning2(true);
        }
      })
      .catch((er) => {
        console.log("eee : ", er);
        setErrMess(t("accountScreen.err"));
        setWarning2(true);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (!baseURL) return;
    getCategories();
  }, [baseURL]);
  const handlePreviewEscrow = async () => {
    setPreviewLoading(true);
    setMore(false);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      type: buyerOrSeller == t("RegisterScreen.Seller") ? "1" : "2",
      amount: amount,
      shipping_cost: "0",
      discount_amount: "0",
      discount_type: "1",
      charge_payer: "1",
      inspection_period:
        inspectionType == t("shortEscrow.days") ? inspectionPeriod : "0",
      ...(buyerOrSeller == t("RegisterScreen.Seller") && {
        payment_type: SaudiEscrowFeePaidBy,
      }),
      charge_shipping: "1",
      inspection_period_type: inspectionTypeField,
      device_info: deviceInfo
    };
    console.log('objobjobjobjobj', obj)
    fetch(baseURL + ENDPOINTS2.escrowCalculation, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("preview data : ", responseData);
        setPreviewLoading(false);
        if (responseData.data) {
          setPreview(responseData.data);
          setMore(true);
          scrollingRef.current.scrollToEnd({ animated: true });
        } else if (responseData.messages.error) {
          showMessage({
            message: responseData.messages.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(responseData?.messages?.error);
          setWarning2(true);
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("accountScreen.err"));
        setWarning2(true);
        setPreviewLoading(false);
      });
  };
  const handleCheckValidations = () => {
    if (!valid) {
      amountRef.current.focus();
      return;
    } else if (inspectionPeriod?.length == 0) {
      setShowInspectionPeriodWarning(true);
      return;
    } else {
      handlePreviewEscrow();
    }
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomHeader navigation={navigation} warningLanguage={true} />
      <View style={styles.screen}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <ScrollView ref={scrollingRef}>
            <CustomText
              color={COLORS.blue}
              size={16}
              text={t("sideMenu.escrowCalc")}
            />
            <View style={styles.itemFormContainer}>
              {/* //seller or buyer */}
              <View style={styles.dropdownCont}>
                <View style={{ flexDirection: "row" }}>
                  <CustomText
                    containerStyle={{ marginLeft: wp(2) }}
                    color={COLORS.lightGrey}
                    size={14}
                    text={t("RegisterScreen.iam")}
                  />
                  <CustomText
                    containerStyle={{ marginLeft: wp(1) }}
                    color={COLORS.red}
                    size={16}
                    text="*"
                  />
                </View>
                <SelectDropdown
                  data={[t("RegisterScreen.Seller"), t("loginScreen.buyer")]}
                  defaultButtonText={buyerOrSeller}
                  renderDropdownIcon={() => {
                    return (
                      <FontAwesome5
                        name="caret-down"
                        size={20}
                        color={COLORS.babyBlue2}
                      />
                    );
                  }}
                  buttonTextStyle={styles.dropDownBtnTxt}
                  buttonStyle={styles.dropDownBtn}
                  rowStyle={styles.dropDownRow}
                  rowTextStyle={styles.dropDownTxt}
                  onSelect={(val, index) => {
                    setBuyerOrSeller(val);
                  }}
                  buttonTextAfterSelection={(selectedItem, index) => {
                    return selectedItem;
                  }}
                  rowTextForSelection={(item, index) => {
                    return item;
                  }}
                />
              </View>

              {/* //Amount */}
              <CustomInput
                label={t("RegisterScreen.Amount")}
                requiredLabel={true}
                placeholder={t("AmountReq")}
                value={amount}
                onChangeText={setAmount}
                error={!valid}
                errorMessage={t("RegisterScreen.err")}
                keyboardType="numeric"
                inputRef={amountRef}
                icon={
                  <FontAwesome5
                    name="money-bill-wave-alt"
                    size={15}
                    color={COLORS.babyBlue2}
                  />
                }
                containerStyle={styles.textInputContainer}
              />

              {/* //inspection period */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: hp(2),
                  marginTop: hp(1),
                }}
              >
                <CustomText
                  containerStyle={{ marginLeft: wp(2) }}
                  color={COLORS.lightGrey}
                  size={width * 0.025}
                  text={t("shortEscrow.inspectionType")}
                />
                <CustomText
                  containerStyle={{ marginLeft: wp(1) }}
                  color={COLORS.red}
                  size={16}
                  text="*"
                />

                <CustomText
                  containerStyle={styles.showescrowPeriodStyle}
                  color={COLORS.header}
                  size={width * 0.03}
                  text={inspectionPeriod + " " + inspectionLabel}
                />
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginBottom: hp(2),
                }}
              >
                <CustomButton
                  color={"#f5f5f5"}
                  onPress={() => {
                    setInspectionType(t("shortEscrow.fawry"));
                    setInspectionTypeField('minutes')
                    setInspectionPeriod("15");
                    setInspectionLabel(t("shortEscrow.min"));
                  }}
                  textSize={width * 0.03}
                  text={t("shortEscrow.fawry")}
                  textColor={COLORS.blue}
                  containerStyle={{ flex: 2,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2} }}
                />
                <CustomButton
                  color={"#f5f5f5"}
                  onPress={() => {
                    setInspectionType(t("shortEscrow.hours"));
                    setInspectionTypeField('hour')
                    setInspectionPeriod("1");
                    setInspectionLabel(t("shortEscrow.hour"));
                    RBSheetRef3.current.open();
                  }}
                  textSize={width * 0.03}
                  text={t("shortEscrow.hours")}
                  textColor={COLORS.blue}
                  containerStyle={{
                    flex: 1,
                    marginHorizontal: width * 0.02,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2}
                  }}
                />
                <CustomButton
                  color={"#f5f5f5"}
                  onPress={() => {
                    setInspectionType(t("shortEscrow.days"));
                    setInspectionTypeField('day')
                    setInspectionPeriod("1");
                    setInspectionLabel(t("shortEscrow.day"));
                    RBSheetRef3.current.open();
                  }}
                  textSize={width * 0.03}
                  text={t("shortEscrow.days")}
                  textColor={COLORS.blue}
                  containerStyle={{ flex: 1 ,elevation: 5,shadowOpacity:0.3,  shadowOffset:{width:1, height:2}}}
                />
                <View style={{ width: width * 0.02, }} />
              </View>

              <RBSheet
                ref={RBSheetRef3}
                height={250}
                openDuration={250}
                customStyles={{
                  container: {
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: COLORS.white,
                    borderTopLeftRadius: wp(8),
                    borderTopRightRadius: wp(8),
                  },
                }}
              >
                <View
                  style={{
                    width: wp(100),
                    justifyContent: "space-between",
                    paddingVertical: 10,
                    paddingHorizontal: wp(5),
                    flexDirection: "row",
                    backgroundColor: COLORS.blue,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "BahijTheSansArabicSemiBold",
                      color: "white",
                      marginLeft: wp(35),
                    }}
                  >
                    {inspectionType == t("shortEscrow.hours")
                      ? t("shortEscrow.hours2")
                      : t("shortEscrow.days2")}
                  </Text>
                  <TouchableOpacity onPress={() => RBSheetRef3.current.close()}>
                    <Text
                      style={{
                        fontFamily: "BahijTheSansArabicSemiBold",
                        color: COLORS.white,
                      }}
                    >
                      {t("shortEscrow.done")}
                    </Text>
                  </TouchableOpacity>
                </View>
                <ScrollPicker
                  dataSource={
                    inspectionType == t("shortEscrow.hours")
                      ? HoursArr
                      : DaysArr
                  }
                  selectedIndex={0}
                  renderItem={(el, index) => (
                    <View
                      style={{
                        width: wp(30),
                      }}
                    >
                      <Text
                        style={{
                          alignSelf: "center",
                          margin: 10,
                          fontFamily: "BahijTheSansArabicSemiBold",
                          color: "black",
                        }}
                      >
                        {el}
                      </Text>
                    </View>
                  )}
                  onValueChange={(selectedItem, index) => {
                    setInspectionPeriod(selectedItem);
                  }}
                  wrapperHeight={200}
                  wrapperWidth={50}
                  wrapperColor="#FFFFFF"
                  itemHeight={60}
                  highlightColor="#d8d8d8"
                  highlightBorderWidth={2}
                />
              </RBSheet>

              {/* //pay methods seller */}
              {buyerOrSeller == t("RegisterScreen.Seller") && (
                <View style={styles.dropdownCont}>
                  <View style={{ flexDirection: "row" }}>
                    <CustomText
                      containerStyle={{ marginLeft: wp(2) }}
                      color={COLORS.lightGrey}
                      size={14}
                      text={t("shortEscrow.payMethod")}
                    />
                    <CustomText
                      containerStyle={{ marginLeft: wp(1) }}
                      color={COLORS.red}
                      size={16}
                      text="*"
                    />
                  </View>

                  <SelectDropdown
                    data={payMethods.map((el) => el.name)}
                    defaultButtonText={payMethods[0].name}
                    renderDropdownIcon={() => {
                      return (
                        <FontAwesome5
                          name="caret-down"
                          size={20}
                          color={COLORS.babyBlue2}
                        />
                      );
                    }}
                    buttonTextStyle={styles.dropDownBtnTxt}
                    buttonStyle={styles.dropDownBtn}
                    rowStyle={styles.dropDownRow}
                    rowTextStyle={styles.dropDownTxt}
                    onSelect={(val, index) => {
                      setSaudiEscrowFeePaidBy(payMethods[index].value);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
              )}
            </View>
            <CustomButton
              loading={previewLoading}
              disabled={previewLoading}
              color={COLORS.blue}
              onPress={() => {
                handleCheckValidations();
              }}
              textSize={14}
              text={t("newTransactions.calc")}
              containerStyle={{
                width: "60%",
                alignSelf: "center",
                marginVertical: hp(1),
                height: hp(6),
              }}
            />
            {/* // calculation */}
            {more && (
              <View style={styles.collapsBodyCont}>
                {/* escrow type buying selling */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      text={t("shortEscrow.transactionType")}
                      // style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={buyerOrSeller}
                    />
                  </View>
                </View>
                {/* Amount */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      text={t("shortEscrow.enteredAmount")}
                      // style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        previewData?.escrow_amount + t("reviewTransaction.sar")
                      }
                    />
                  </View>
                </View>
                {/* cpa method */}
                {buyerOrSeller == t("RegisterScreen.Seller") && (
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={11}
                        text={t("shortEscrow.payMethod")}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={previewData?.payment_method?.name}
                      />
                    </View>
                  </View>
                )}
                {/* {inspection confirm period} */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      text={t("transactionDetails.inspection")}
                      style={styles.accordionTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={inspectionPeriod + " " + inspectionLabel}
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
                {/* charge */}
                {buyerOrSeller == t("RegisterScreen.Seller") && (
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={11}
                        text={t("transDetailsScreen.charge")}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={previewData?.charge + t("reviewTransaction.sar")}
                      />
                    </View>
                  </View>
                )}

                {/* vat Amount */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      text={t("transDetailsScreen.vatAmount")}
                      // style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        previewData?.vat_amount + t("reviewTransaction.sar")
                      }
                    />
                  </View>
                </View>
                {previewData?.extended_vat != 0 && (
                  <>
                    {/* vat extended percentage */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={11}
                          text={t("transDetailsScreen.extended")}
                          // style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={previewData?.extended_vat_precentage}
                        />
                      </View>
                    </View>
                    {/* vat extended Amount */}
                    <View style={styles.transactionInfo2}>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={11}
                          text={t("transDetailsScreen.extendedamount")}
                          // style={styles.accordionFinalTitle}
                        />
                      </View>
                      <View style={styles.accordionBodyTitleCont}>
                        <CustomText
                          color={COLORS.statisticsTitle}
                          size={12}
                          text={
                            previewData?.extended_vat +
                            t("reviewTransaction.sar")
                          }
                        />
                      </View>
                    </View>
                  </>
                )}

                {/* total vat amount */}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      text={t("transDetailsScreen.totalVat")}
                      style={styles.accordionTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        parseFloat(
                          parseFloat(previewData?.charge) +
                            parseFloat(previewData?.vat_amount) +
                            parseFloat(previewData?.extended_vat)
                        ).toFixed(2) + t("reviewTransaction.sar")
                      }
                      style={styles.accordionTitle}
                    />
                  </View>
                </View>
                {/* total Amount with vats*/}
                <View style={styles.transactionInfo2}>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={11}
                      data
                      text={t("transDetailsScreen.tot1")}
                      // style={styles.accordionFinalTitle}
                    />
                  </View>
                  <View style={styles.accordionBodyTitleCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={12}
                      text={
                        previewData?.payed_amount + t("reviewTransaction.sar")
                      }
                    />
                  </View>
                </View>
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <CustomAlert
        type={"error"}
        show={warning2}
        header={t("accountScreen.w")}
        body={errmess}
        action1={() => {
          setWarning2(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={"error"}
        show={showInspectionPeriodWarning}
        header={t("reviewTransaction.w")}
        body={t("shortEscrow.typwwarInsperiod")}
        action1={() => {
          setShowInspectionPeriodWarning(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
    </KeyboardAvoidingView>
  );
};

export default EscrowCalculator;
