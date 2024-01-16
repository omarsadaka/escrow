import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { TabRouter, useTheme } from "@react-navigation/native";
import CustomInput from "../../components/customInput";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomButton from "../../components/customButton";
import createStyles from "./style";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import CustomText from "../../components/customText";
import CommonStyles from "../../constants/CommonStyles";
import CustomHeader from "../../components/customHeader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomAlert from "../../components/CustomAlert";
import { hp, wp } from "../../utilis/dimensions";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { storeStackValue } from "../../redux/actions/user";
import moment from "moment";
import QRCodeScanner from "react-native-qrcode-scanner";
import ProgressBar from "react-native-animated-progress";
const ReviewTransaction = ({ navigation, route }) => {
  const {
    item,
    Discount,
    IsPercentage,
    SaudiEscrowFeePaidBy, // على مين ؟نصيب ايسكر
    ShippingFeePaidBuy, // مصاريف الشحن على مين؟
    BuyerShippingCost, // قيمة مصاريف الشحن
    userPrice,
    Category,
    CategoryID,
    CategoryImage,
    Title,
    Details,
    expiry_date,
    inspection_period,
    userType,
  } = useSelector((state) => state.transactions);
  const { preview } = route.params;
  const { selectedAgreements } = useSelector((state) => state.agreements);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const [totalPrice, setTotalPrice] = useState("");
  const [warning2, setWarning2] = useState(false);
  const [errmess, setErrMess] = useState("");
  const [fixedPrice, setFixedPrice] = useState();
  const [finalPrice, setFinalPrice] = useState();
  const [isEnabled, setIsEnabled] = useState(false);
  const [validPhone, setValidPhone] = useState(false);
  const [validForm, setValidForm] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState(false);
  const [email, setEmail] = useState("");
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [itemsPriceError, setItemsPriceError] = useState(false);
  const [apiPrice, setApiPrice] = useState();
  const [qrModal, setQrModal] = useState(false);
  const emailRef = useRef();
  const phoneRef = useRef();
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(COLORS), []);
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  useEffect(() => {
    if (validateEmail(email)) {
      //validPhone &&
      setValidForm(true);
    } else {
      setValidForm(false);
    }
  }, [email]);
  const AddEscrow = async () => {
    setConfirmLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    let arr = [];
    item.map((el) => {
      let obj = {
        name: el.name,
        qty: el.Quantity,
        price: el.Price,
      };
      arr.push(obj);
    });
    let aggArr = [];
    selectedAgreements.map((el) => {
      let aggObj = { id: el.id };
      aggArr.push(aggObj);
    });
    let escrowObject = {
      type: userType,
      amount: userPrice,
      category_id: CategoryID,
      products: arr,
      email: email,
      title: Title,
      details: Details,
      discount_type: IsPercentage == t("newTransactions.arr2") ? "1" : "2",
      discount_amount: Discount ? Discount : "0",
      charge_payer:
        SaudiEscrowFeePaidBy == t("newTransactions.seller")
          ? "1"
          : SaudiEscrowFeePaidBy == "50/50"
          ? "3"
          : "2",
      charge_shipping:
        ShippingFeePaidBuy == t("newTransactions.buyer") ? "2" : "1",
      shipping_cost: BuyerShippingCost ? BuyerShippingCost : "0",
      expiry_date: moment(expiry_date).locale("en").format("YYYY-MM-DD"),
      inspection_period: inspection_period,
      agreements: aggArr,
      device_info: deviceInfo
    };
    console.log("escrow : ", escrowObject);
    fetch(baseURL + ENDPOINTS2.addNewEscrow, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language
      },
      body: JSON.stringify(escrowObject),
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("result of submit : ", responseData);
        setConfirmLoading(false);
        if (
          responseData.messages.error 
        ) {
          setErrMess(
             responseData?.messages?.error
              
          );
          setWarning2(true);
        } else {
          dispatch(storeStackValue(false));
          navigation.navigate("TransactionAdded", {
            message: responseData.message,
            notDraft: false,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        setErrMess(t("apiErr"));
        setWarning2(true);
        setConfirmLoading(false);
      });
  };
  const DetailsInfo = () => {
    return (
      <View style={styles.detailsCont}>
        {/* el details will be returned from api  */}

        <View style={styles.cardCont1}>
          <View style={styles.cardSubCont1}>
            <View>
              <Image
                style={styles.avatar}
                resizeMode="contain"
                source={{ uri: CategoryImage }}
              />
            </View>
            <View style={styles.txtSubCont1}>
              <CustomText
                color={COLORS.header}
                size={16}
                text={Category}
                style={styles.nameTxt}
              />
            </View>
          </View>
          <View>
            <CustomText
              color={COLORS.header}
              size={16}
              text={preview?.payed_amount + " " + t("reviewTransaction.sar")}
              style={styles.transactionsCurrTxt}
            />
          </View>
        </View>

        {item.map((el, i) => (
          <View key={i}>
            <View style={styles.accordionContainer}>
              <View style={styles.accordionTitleContainer}>
                <CustomText
                  color={COLORS.transactionsItemName}
                  size={14}
                  text={`${el.name}`}
                  style={styles.accordionTitle}
                />
              </View>

              <View style={styles.cardSubCont2}>
                <View>
                  <CustomText
                    color={COLORS.transactionsTitle}
                    size={13}
                    text={t("transDetailsScreen.itemPrice")}
                  />
                  <CustomText
                    color={COLORS.statisticsTitle}
                    size={14}
                    text={`${el.Price}`}
                    style={styles.transactionInfo}
                  />
                </View>
                <View>
                  <CustomText
                    color={COLORS.transactionsTitle}
                    size={13}
                    text={t("transDetailsScreen.amount")}
                  />
                  <CustomText
                    color={COLORS.statisticsTitle}
                    size={14}
                    text={`${el.Quantity}`}
                    style={styles.transactionInfo}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };
  return (
    <KeyboardAvoidingView behavior="padding">
      <CustomHeader navigation={navigation} warningLanguage={true} />
      <ScrollView style={styles.container}>
        <>
          <View style={styles.progressCon}>
            <ProgressBar
              progress={100}
              height={10}
              backgroundColor="green"
              // animated={false}
            />
            {/* <View style={styles.progressCounter}></View> */}
          </View>
          <CustomText
            color={COLORS.red}
            size={18}
            text={t("changeRole.step5")}
          />
          <View style={CommonStyles.transactionsContainer}>
            <CustomText
              color={COLORS.primaryTxt}
              size={18}
              text={t("reviewTransaction.rt")}
              style={CommonStyles.titleTxt}
            />
            <Collapse>
              <CollapseHeader style={styles.accordionHeaderCont}>
                <View style={styles.accordionHeader}>
                  <CustomText
                    color={COLORS.primaryTxt}
                    size={16}
                    text={t("reviewTransaction.totalPrice")}
                    style={CommonStyles.titleTxt}
                  />
                  <CustomText
                    color={COLORS.header}
                    size={16}
                    text={
                      preview?.payed_amount + " " + t("reviewTransaction.sar")
                    }
                    style={CommonStyles.titleTxt}
                  />
                </View>
                <MaterialIcons
                  // style={{ width: wp(5) }}
                  name="arrow-drop-down"
                  size={30}
                  color={COLORS.header}
                />
              </CollapseHeader>

              <CollapseBody style={styles.accordionBody}>
                <DetailsInfo />

                {/* new calculation */}
                <View style={styles.collapsBodyCont}>
                  {/* items actual price */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.itemP")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={13}
                        text={
                          preview?.escrow_amount + t("reviewTransaction.sar")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {preview?.discount_amount &&
                    preview?.discount_amount != 0 && (
                      <>
                        {/* discount type */}
                        <View style={styles.transactionInfo2}>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={t("transDetailsScreen.discountType")}
                              style={styles.accordionTitle}
                            />
                          </View>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={
                                IsPercentage == t("newTransactions.arr2")
                                  ? t("transDetailsScreen.percen")
                                  : t("transDetailsScreen.fix")
                              }
                            />
                          </View>
                        </View>
                        {/* discount amount */}
                        <View style={styles.transactionInfo2}>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={12}
                              text={t("transDetailsScreen.discountAmount")}
                              style={styles.accordionTitle}
                            />
                          </View>
                          <View style={styles.accordionBodyTitleCont}>
                            <CustomText
                              color={COLORS.statisticsTitle}
                              size={13}
                              text={
                                IsPercentage == t("newTransactions.arr2")
                                  ? preview?.discount_amount + " %"
                                  : preview?.discount_amount +
                                    t("reviewTransaction.sar")
                              }
                            />
                          </View>
                        </View>
                      </>
                    )}
                  {/* charge payer */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.chargePayer")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          SaudiEscrowFeePaidBy
                            ? SaudiEscrowFeePaidBy
                            : t("newTransactions.seller")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* charge */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.charge")}
                        style={styles.accordionTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={preview?.charge + t("reviewTransaction.sar")}
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* buyer charge */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.chargeBuyer")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          preview?.buyer_charge + t("reviewTransaction.sar")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* seller charge */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.sellerCharge")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          preview?.seller_charge + t("reviewTransaction.sar")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {preview?.shipping_cost && preview?.shipping_cost != 0 && (
                    <>
                      {/* shipping payer */}
                      <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.shipingPayer")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={
                              ShippingFeePaidBuy
                                ? ShippingFeePaidBuy
                                : t("transDetailsScreen.seller")
                            }
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
                      {/* shipping Cost */}
                      <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.shippingCost")}
                            style={styles.accordionTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={
                              preview?.shipping_cost +
                              t("reviewTransaction.sar")
                            }
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
                    </>
                  )}
                  {/* vat percentage */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.vatPercen")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={preview?.vat_percentage}
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* vat Amount */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.vatAmount")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={preview?.vat_amount + t("reviewTransaction.sar")}
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* Expiry date */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.exp")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={moment(expiry_date)
                          .locale("en")
                          .format("DD-MM-YYYY")}
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {/* inspection period */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.insPer")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          preview?.extended_vat && preview?.extended_vat == 0
                            ? inspection_period +
                              t("transDetailsScreen.day") +
                              t("transDetailsScreen.standard")
                            : inspection_period + t("transDetailsScreen.day")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                  {preview?.extended_vat && preview?.extended_vat != 0 && (
                    <>
                      {/* inspection extended percentage */}
                      <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.extended")}
                            style={styles.accordionFinalTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={preview?.extended_vat_precentage}
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
                      {/* inspection extended Amount */}
                      <View style={styles.transactionInfo2}>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={t("transDetailsScreen.extendedamount")}
                            style={styles.accordionFinalTitle}
                          />
                        </View>
                        <View style={styles.accordionBodyTitleCont}>
                          <CustomText
                            color={COLORS.statisticsTitle}
                            size={12}
                            text={
                              preview?.extended_vat + t("reviewTransaction.sar")
                            }
                            style={styles.accordionTitle}
                          />
                        </View>
                      </View>
                    </>
                  )}
                  {/* buyer must pay Amount */}
                  <View style={styles.transactionInfo2}>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={t("transDetailsScreen.tot1")}
                        style={styles.accordionFinalTitle}
                      />
                    </View>
                    <View style={styles.accordionBodyTitleCont}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={12}
                        text={
                          preview?.payed_amount + t("reviewTransaction.sar")
                        }
                        style={styles.accordionTitle}
                      />
                    </View>
                  </View>
                </View>
              </CollapseBody>
            </Collapse>

            {/* agreement */}
            <CustomText
              color={COLORS.header}
              size={15}
              text={t("reviewTransaction.Agg")}
              style={CommonStyles.titleTxt}
            />
            {selectedAgreements &&
              selectedAgreements.length > 0 &&
              selectedAgreements.map((el) => (
                <Collapse>
                  <CollapseHeader>
                    <View style={styles.accordionAgreementTitle}>
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={14}
                        text={el.title}
                        style={styles.accordionTitle}
                      />
                      <MaterialIcons
                        // style={{ width: wp(5) }}
                        name="arrow-drop-down"
                        size={30}
                        color={COLORS.header}
                      />
                    </View>
                  </CollapseHeader>

                  <CollapseBody style={styles.agreementBodyCont}>
                    <CustomText
                      color={COLORS.statisticsTitle}
                      size={14}
                      text={el.description}
                      style={styles.accordionTitle2}
                    />
                  </CollapseBody>
                </Collapse>
              ))}
            <View style={styles.notifycon}>
              <CustomText
                color={COLORS.header}
                size={15}
                text={
                  userType == 1
                    ? t("reviewTransaction.nb")
                    : t("reviewTransaction.ns")
                }
                style={CommonStyles.titleTxt}
              />
              <Switch
                // style={styles.switch}
                // trackColor={{ false: "#767577", true: COLORS.header }}
                thumbColor={isEnabled ? COLORS.green : COLORS.gray}
                // ios_backgroundColor="#3e3e3e"
                onValueChange={toggleSwitch}
                value={isEnabled}
              />
            </View>
            {isEnabled && (
              <>
                <TouchableOpacity
                  onPress={() => {
                    setQrModal(true);
                  }}
                  style={{ marginLeft: wp(2) }}
                >
                  <CustomText
                    color={COLORS.header}
                    size={15}
                    text={t("reviewTransaction.readQR")}
                  />
                </TouchableOpacity>
                <CustomInput
                  inputRef={emailRef}
                  label={t("RegisterScreen.email")}
                  placeholder={"user@email.com"}
                  value={email}
                  onChangeText={setEmail}
                  error={!validateEmail(email)}
                  errorMessage={t("profileScreens.emailRules")}
                  icon={
                    <Ionicons name="mail" size={20} color={COLORS.babyBlue2} />
                  }
                  containerStyle={styles.containerStyle}
                  returnDispute
                />

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "98%",
                  }}
                >
                  <CustomButton
                    loading={confirmLoading}
                    disabled={confirmLoading}
                    color={COLORS.blue}
                    onPress={() => {
                      isEnabled
                        ? validForm
                          ? AddEscrow()
                          : emailRef.current.focus()
                        : setShow2(true);
                    }}
                    textSize={16}
                    text={t("newTransactions.Confirm2")}
                    containerStyle={[{ width: "90%", marginTop: hp(3) }]}
                  />
                </View>
              </>
            )}
          </View>
        </>
        <CustomAlert
          type={'error'}
          show={show}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.m")}
          action1={() => {
            setShow(false);
            navigation.goBack();
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={show2}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.m2")}
          action1={() => setShow2(false)}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={show3}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.vmob")}
          action1={() => setShow3(false)}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        <CustomAlert
          type={'error'}
          show={show4}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.m3")}
          action1={() => {
            setShow4(false);
            navigation.goBack();
          }}
          btn1={t("reviewTransaction.ok")}
          oneBtn={true}
        />
        {/* <CustomAlert
        show={show5}
        header={t("reviewTransaction.w2")}
        body={t("reviewTransaction.m4")}
        action1={() => {
          navigation.navigate("TransactionAdded");
          setShow5(false);
        }}
        btn1={t("reviewTransaction.ok")}
        btn2={t("reviewTransaction.cancle")}
        action2={() => setShow5(false)}
        oneBtn={false}
      /> */}
        <CustomAlert
          type={'error'}
          show={itemsPriceError}
          header={t("reviewTransaction.w")}
          body={t("reviewTransaction.error")}
          action1={() => {
            setItemsPriceError(false);
            navigation.goBack();
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={qrModal}
          onRequestClose={() => {
            setQrModal(!qrModal);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.centeredView2Ag}>
              <QRCodeScanner
                onRead={(d) => {
                  alert(d.data);
                  setQrModal(false);
                }}
                reactivate={true}
                reactivateTimeout={500}
                showMarker={true}
                cameraStyle={styles.qrStyle}
                topViewStyle={{
                  width: wp(80),
                }}
                topContent={
                  <CustomText
                    color={COLORS.header}
                    size={20}
                    text={t("reviewTransaction.scan")}
                  />
                }
                bottomViewStyle={{
                  width: wp(80),
                }}
                bottomContent={
                  <TouchableOpacity
                    onPress={() => setQrModal(false)}
                    style={styles.buttonTouchable}
                  >
                    <CustomText
                      color={COLORS.red}
                      size={20}
                      text={t("agreementScreen.close")}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
export default ReviewTransaction;
