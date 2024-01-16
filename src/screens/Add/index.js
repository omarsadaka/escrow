import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomInput from "../../components/customInput";
import { useTranslation } from "react-i18next";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomButton from "../../components/customButton";
import createStyles from "./styles";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as transactions from "../../redux/actions/transactions/index";
import { useIsFocused } from "@react-navigation/native";
import CustomText from "../../components/customText";
import SelectDropdown from "react-native-select-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../../components/customHeader";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import CustomAlert from "../../components/CustomAlert";
import { wp } from "../../utilis/dimensions";
import ProgressBar from "react-native-animated-progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
const AddScreen = ({ navigation, route }) => {
  const {
    Discount,
    IsPercentage,
    SaudiEscrowFeePaidBy, // على مين ؟نصيب ايسكر
    ShippingFeePaidBuy, // مصاريف الشحن على مين؟
    BuyerShippingCost, // قيمة مصاريف الشحن
    userPrice,
    inspection_period,
    expiry_date,
  } = useSelector((state) => state.transactions);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const dispatch = useDispatch();
  const inspectionRef = useRef();
  const discountRef = useRef();
  const shippingRef = useRef();
  const [isEnabled, setIsEnabled] = useState(false); //ShippingFeePaidBuy ? true : false
  const [isEnabled2, setIsEnabled2] = useState(false); //Discount != "0" ? true : false
  const [fixedOrPercentage, setFixedOrPercentage] = useState("");
  const [isBuyer, setIsBuyer] = useState(true);
  const [inspectionPeriod, setInspectionPeriod] = useState("");
  const [valid, setValid] = useState(false);
  const [visibleDate, setVisibleDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showExpiryWarning, setShowExpiryWarning] = useState(false);
  const [showChargeWarning, setShowChargeWarning] = useState(false);
  const [showShippingWarning, setShowShippingWarning] = useState(false);
  const [validExpiry, setValidExpiry] = useState(false);
  const [discountval, setDiscountVal] = useState("");
  const [validDiscount, setValidDiscount] = useState(false);
  const [validInspection, setValidInspection] = useState(false);
  const [minimumDate, setMinimumDate] = useState("");
  const [show4, setShow4] = useState(false);
  const [warning2, setWarning2] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const isFocused = useIsFocused();
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const focuced = useIsFocused();
  const [data, setData] = useState({
    Discount: null, //Discount,
    IsPercentage: t("newTransactions.arr2"), // IsPercentage ? IsPercentage : t("newTransactions.arr2"),
    SaudiEscrowFeePaidBy: null, // SaudiEscrowFeePaidBy,
    ShippingFeePaidBuy: null, // ShippingFeePaidBuy,
    BuyerShippingCost: null, //BuyerShippingCost,
    inspectionPeriod: null, //inspection_period,
    expiryDate: null, //expiry_date,
  });
  useEffect(() => {
    let date = new Date();
    let forma = `${date.getFullYear().toString()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    setMinimumDate(forma);
  }, [navigation]);
  const handleInspection = () => {
    let peri = parseInt(inspectionPeriod);
    if (inspectionPeriod.length > 0) {
      if (peri > 0 && peri <= 15) {
        setValidInspection(true);
        return true;
      } else {
        setValidInspection(false);
        return false;
      }
    } else {
      setValidInspection(false);
      return false;
    }
  };
  const handleDiscount = () => {
    if (discountval.length > 0) {
      let disc = parseInt(discountval);
      if (fixedOrPercentage == t("newTransactions.arr2")) {
        if (disc > 0 && disc <= 100) {
          setValidDiscount(true);
          return true;
        }
      } else if (fixedOrPercentage == t("newTransactions.arr1")) {
        if (disc <= parseInt(userPrice)) {
          setValidDiscount(true);
          return true;
        }
      }
    }
    setValidDiscount(false);
    return false;
  };
  const handleExpiryDate = () => {
    // (data.expiryDate==null||data.expiryDate=='')?(return false):return true
    if (data.expiryDate == null || data.expiryDate == "") {
      setValidExpiry(false);
    } else {
      setValidExpiry(true);
    }
  };
  useEffect(() => {
    handleExpiryDate();
  }, [data.expiryDate]);
  useEffect(() => {
    handleInspection();
  }, [inspectionPeriod]);
  useEffect(() => {
    isEnabled2 && handleDiscount();
  }, [discountval]);
  useEffect(() => {
    if (selectedDate == null) {
      setData((prevState) => ({
        ...prevState,
        expiryDate: "",
      }));
    } else {
      setData((prevState) => ({
        ...prevState,
        expiryDate: moment(selectedDate).local("en").format("YYYY-MM-DD"),
      }));
    }
  }, [selectedDate]);

  const handlePreviewEscrow = async () => {
    setPreviewLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let obj = {
      amount: userPrice,
      shipping_cost:data?.BuyerShippingCost ? data?.BuyerShippingCost : "0",
      discount_amount:data?.Discount ? data?.Discount : "0",
      discount_type:data?.IsPercentage == t("newTransactions.arr2") ? "1" : "2",
      inspection_period: data?.inspectionPeriod,
      charge_payer:
       data?.SaudiEscrowFeePaidBy == t("newTransactions.seller")
          ? "1"
          : data?.SaudiEscrowFeePaidBy == "50/50"
          ? "3"
          : "2",
      charge_shipping:
        data?.ShippingFeePaidBuy == t("newTransactions.buyer") ? "2" : "1",
      device_info: deviceInfo  
    };
    fetch(baseURL + ENDPOINTS2.escrowCalculation, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n.language
      },
      body: JSON.stringify(obj),
    })
      .then((response) => response.json())
      .then((responseData) => {
        console.log("preview data : ", responseData);
        setPreviewLoading(false);
        if (responseData.data) {
          navigation.navigate("ReviewTransaction", {
            preview: responseData?.data,
          });
        } else if (responseData.messages.error) {
          showMessage({
            message: responseData.messages.error,
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          setErrMess(
            responseData?.messages?.error
          );
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
  const handleAddItem2 = () => {
    setPreviewLoading(true);
    dispatch(
      transactions.addGeneralTransactionDetails({
        Discount: data?.Discount,
        IsPercentage: data?.IsPercentage,
        SaudiEscrowFeePaidBy: data?.SaudiEscrowFeePaidBy,
        ShippingFeePaidBuy: data?.ShippingFeePaidBuy,
        BuyerShippingCost: data?.BuyerShippingCost,
        inspectionPeriod: data?.inspectionPeriod,
        expiryDate: data?.expiryDate,
      })
    );
    handlePreviewEscrow();
  };
  const toggleSwitch = (val) => {
    if (val) {
      setData((prevState) => ({
        ...prevState,
        ShippingFeePaidBuy: null,
        BuyerShippingCost: null,
      }));
    }
    setIsEnabled(!val);
  };
  const toggleSwitch2 = (val) => {
    setFixedOrPercentage(t("newTransactions.arr2"));
    setData((prevState) => ({
      ...prevState,
      Discount: "0",
    }));
    setIsEnabled2(!val);
  };
  const handleCheckValidations = () => {
    !isEnabled2 &&
      setData((prevState) => ({
        ...prevState,
        Discount: "0",
      }));
    validInspection
      ? data?.expiryDate.length > 0
        ? data?.SaudiEscrowFeePaidBy
          ? isEnabled2
            ? validDiscount
              ? isEnabled
                ? data?.ShippingFeePaidBuy
                  ? data?.BuyerShippingCost
                    ? handleAddItem2()
                    : shippingRef.current.focus()
                  : setShowShippingWarning(true)
                : handleAddItem2()
              : discountRef.current.focus()
            : isEnabled
            ? data?.ShippingFeePaidBuy
              ? data?.BuyerShippingCost
                ? handleAddItem2()
                : shippingRef.current.focus()
              : setShowShippingWarning(true)
            : handleAddItem2()
          : setShowChargeWarning(true)
        : setShowExpiryWarning(true)
      : inspectionRef.current.focus();
  };
  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <CustomHeader navigation={navigation} warningLanguage={true} />
      <ScrollView>
        <View style={styles.progressCon}>
          <ProgressBar
            progress={80}
            height={10}
            backgroundColor="green"
            // animated={false}
          />
          {/* <View style={[styles.progressCounter, { width: "40%" }]}></View> */}
        </View>
        <CustomText color={COLORS.red} size={18} text={t("changeRole.step4")} />
        <View style={styles.screen}>
          <View style={styles.itemFormContainer}>
            <CustomInput
              inputRef={inspectionRef}
              containerStyle={styles.btn}
              label={t("newTransactions.inspectionPeriod")}
              value={data?.inspectionPeriod}
              onChangeText={(val) => {
                setData((prevState) => ({
                  ...prevState,
                  inspectionPeriod: val,
                }));
                setInspectionPeriod(val);
              }}
              error={inspectionPeriod.length ? !validInspection : false}
              errorMessage={t("newTransactions.inserr")}
              keyboardType="numeric"
              icon={
                <AntDesign name="calendar" size={20} color={COLORS.babyBlue2} />
              }
            />
            <CustomInput
              onPress={() => setVisibleDate(true)}
              containerStyle={styles.btn}
              // editable={false}
              label={t("newTransactions.expiryDate")}
              value={
                data?.expiryDate == null || data?.expiryDate == ""
                  ? ""
                  : moment(data?.expiryDate).locale("en").format("DD-MM-YYYY")
              }
              dateInput={true}
              onChangeText={(val) => {
                // setData((prevState) => ({
                //   ...prevState,
                //   expiryDate: val,
                // }));
              }}
              icon={
                <AntDesign name="calendar" size={20} color={COLORS.babyBlue2} />
              }
            />
            <DatePicker
              locale={i18n.language}
              mode="date"
              modal
              open={visibleDate}
              date={new Date()}
              onConfirm={(date) => {
                setSelectedDate(date);
                setVisibleDate(false);
                // setData((prevState) => ({
                //   ...prevState,
                //   expiryDate: date,
                // }));
              }}
              minimumDate={new Date()}
              onCancel={() => {
                setVisibleDate(false);
              }}
              confirmText={i18n.language == "en" ? "confirm" : "تأكيد"}
              cancelText={i18n.language == "en" ? "cancle" : "إلغاء"}
              title={i18n.language == "en" ? "select date" : "اختر التاريخ"}
            />

            <View style={styles.dropdownCont}>
              <CustomText
                color={COLORS.blue}
                size={14}
                text={t("newTransactions.SaudiEscrowFeePaidBy")}
              />

              <SelectDropdown
                data={[
                  t("newTransactions.buyer"),
                  t("newTransactions.seller"),
                  "50/50",
                ]}
                defaultButtonText={" "}
                renderDropdownIcon={() => {
                  return (
                    <Ionicons
                      style={styles.dropDownIcon}
                      color={COLORS.black}
                      size={25}
                      name="md-chevron-down"
                    />
                  );
                }}
                buttonTextStyle={styles.dropDownBtnTxt}
                buttonStyle={styles.dropDownBtn}
                rowStyle={styles.dropDownRow}
                rowTextStyle={styles.dropDownTxt}
                onSelect={(val, index) => {
                  setData((prevState) => ({
                    ...prevState,
                    SaudiEscrowFeePaidBy: val,
                  }));
                }}
                buttonTextAfterSelection={(selectedItem, index) => {
                  return selectedItem;
                }}
                rowTextForSelection={(item, index) => {
                  return item;
                }}
              />
            </View>
            <View style={styles.shoppingFeeBox}>
              <CustomText
                color={COLORS.blue}
                size={16}
                text={t("newTransactions.Discount")}
              />
              <Switch
                style={styles.switch}
                // trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
                thumbColor={isEnabled2 ? COLORS.green : COLORS.gray}
                // ios_backgroundColor={COLORS.darkBlue}
                onValueChange={() => toggleSwitch2(isEnabled2)}
                value={isEnabled2}
              />
            </View>
            {isEnabled2 && (
              <>
                <View style={styles.dropdownCont}>
                  <CustomText
                    color={COLORS.blue}
                    size={14}
                    text={t("newTransactions.dh")}
                  />
                  <SelectDropdown
                    data={[
                      t("newTransactions.arr1"),
                      t("newTransactions.arr2"),
                    ]}
                    defaultButtonText={t("newTransactions.arr2")}
                    renderDropdownIcon={() => {
                      return (
                        <Ionicons
                          style={styles.dropDownIcon}
                          color={COLORS.black}
                          size={25}
                          name="md-chevron-down"
                        />
                      );
                    }}
                    buttonTextStyle={styles.dropDownBtnTxt}
                    buttonStyle={styles.dropDownBtn}
                    rowStyle={styles.dropDownRow}
                    rowTextStyle={styles.dropDownTxt}
                    onSelect={(val, index) => {
                      setFixedOrPercentage(val);
                      setData((prevState) => ({
                        ...prevState,
                        IsPercentage: val,
                      }));
                      handleDiscount();
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                <CustomInput
                  inputRef={discountRef}
                  containerStyle={styles.btn}
                  label={t("newTransactions.Discount")}
                  value={data?.Discount}
                  editable={fixedOrPercentage != "" ? true : false}
                  error={discountval.length ? !validDiscount : false}
                  errorMessage={
                    fixedOrPercentage == t("newTransactions.arr2")
                      ? t("newTransactions.dis1")
                      : t("newTransactions.dis2")
                  }
                  keyboardType="numeric"
                  onChangeText={(val) => {
                    setData((prevState) => ({
                      ...prevState,
                      Discount: val,
                    }));
                    setDiscountVal(val);
                  }}
                  icon={
                    <AntDesign
                      name="calendar"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
              </>
            )}

            {/* shoppingFeeBox */}
            <View style={styles.shoppingFeeBox}>
              <CustomText
                color={COLORS.blue}
                size={16}
                text={t("newTransactions.ShippingFee")}
              />
              <Switch
                style={styles.switch}
                // trackColor={{ false: COLORS.grey, true: COLORS.darkBlue }}
                thumbColor={isEnabled ? COLORS.green : COLORS.gray}
                // ios_backgroundColor={COLORS.darkBlue}
                onValueChange={() => toggleSwitch(isEnabled)}
                value={isEnabled}
              />
            </View>
            {isEnabled && (
              <>
                <View style={styles.dropdownCont}>
                  <CustomText
                    color={COLORS.blue}
                    size={14}
                    text={t("newTransactions.ShippingFeePaidBuy")}
                  />
                  <SelectDropdown
                    data={[
                      t("newTransactions.buyer"),
                      t("newTransactions.seller"),
                    ]}
                    defaultButtonText={" "}
                    renderDropdownIcon={() => {
                      return (
                        <Ionicons
                          style={styles.dropDownIcon}
                          color={COLORS.black}
                          size={25}
                          name="md-chevron-down"
                        />
                      );
                    }}
                    buttonTextStyle={styles.dropDownBtnTxt}
                    buttonStyle={styles.dropDownBtn}
                    rowStyle={styles.dropDownRow}
                    rowTextStyle={styles.dropDownTxt}
                    onSelect={(val, index) => {
                      setData((prevState) => ({
                        ...prevState,

                        ShippingFeePaidBuy: val,
                      }));
                      val == t("newTransactions.buyer")
                        ? setIsBuyer(true)
                        : setIsBuyer(false);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                  />
                </View>
                <CustomInput
                  containerStyle={styles.btn}
                  inputRef={shippingRef}
                  label={
                    isBuyer
                      ? t("newTransactions.BuyerShippingCost")
                      : t("newTransactions.sellerShippingCost")
                  }
                  // editable={item.length>0? false:true}
                  keyboardType="numeric"
                  value={data?.BuyerShippingCost}
                  onChangeText={(val) => {
                    setData((prevState) => ({
                      ...prevState,
                      BuyerShippingCost: val,
                    }));
                  }}
                  icon={
                    <AntDesign
                      name="calendar"
                      size={20}
                      color={COLORS.babyBlue2}
                    />
                  }
                />
              </>
            )}
          </View>
          <CustomButton
            color={COLORS.blue}
            disabled={previewLoading}
            loading={previewLoading}
            onPress={() => {
              handleCheckValidations();
            }}
            textSize={16}
            text={t("newTransactions.Next")}
            // containerStyle={styles.btn}
          />
        </View>
      </ScrollView>
      <CustomAlert
        type={'error'}
        show={show4}
        header={t("reviewTransaction.w")}
        body={t("reviewTransaction.m3")}
        action1={() => {
          setShow4(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={'error'}
        show={showExpiryWarning}
        header={t("reviewTransaction.w")}
        body={t("reviewTransaction.expiryWarning")}
        action1={() => {
          setShowExpiryWarning(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={'error'}
        show={showChargeWarning}
        header={t("reviewTransaction.w")}
        body={t("reviewTransaction.chargeWarning")}
        action1={() => {
          setShowChargeWarning(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={'error'}
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
        type={'error'}
        show={showShippingWarning}
        header={t("reviewTransaction.w")}
        body={t("reviewTransaction.shippingWarning")}
        action1={() => {
          setShowShippingWarning(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
    </KeyboardAvoidingView>
  );
};

export default AddScreen;
