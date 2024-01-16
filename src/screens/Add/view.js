import React, { useMemo, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import CustomInput from "../../components/customInput";
import { useTranslation } from "react-i18next";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as transactions from "../../redux/actions/transactions/index";
import CustomButton from "../../components/customButton";
import createStyles from "./styles";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import CustomText from "../../components/customText";
import CustomHeader from "../../components/customHeader";
import CustomAlert from "../../components/CustomAlert";
import ProgressBar from "react-native-animated-progress";

const ViewScreen = ({ navigation, route }) => {
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [showDeleteModal, setShowDeleteModal] = useState({
    status: false,
    id: null,
  });
  const [showAgreement, setShowAgreement] = useState(false);
  const [agreementName, setAgreementName] = useState("");
  const [agreementDescription, setAgreementDescription] = useState("");
  const [warningBack, setWarningBack] = useState(false);
  const [itemsPriceError, setItemsPriceError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [validPrice, setValidPrice] = useState(false);
  const [validQuantity, setValidQuantity] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const [show, setShow] = useState(false);
  const priceRef = useRef();
  const quantityRef = useRef();
  const [EditableItem, setEditableItem] = useState(null);
  const nameRef = useRef();
  const {
    item,
    userPrice,
  } = useSelector((state) => state.transactions);

  const [data, setData] = useState({
    item: {
      id: null,
      name: "",
      Price: "",
      Quantity: "",
    },
  });
  const handleDelete = () => {
  
    dispatch(transactions.removeTransaction(showDeleteModal.id));
    setShowDeleteModal({ status: false, id: null });
  };
  const RenderItems = ({ el }) => {
    return (
      <>
        <Collapse style={styles.itemFormContainer} key={el.id}>
          <CollapseHeader style={styles.itemFormHeaderContainer}>
            {/* <TouchableOpacity >
            <MaterialIcons name="arrow-drop-down" size={30} color={COLORS.babyBlue2} />
            </TouchableOpacity > */}
            <TouchableOpacity
              onPress={() => {
               
                setShowDeleteModal({ status: true, id: el.id });
              }}
              style={styles.iconsCont}
            >
              <MaterialIcons name="delete" size={22} color={COLORS.red} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setEditableItem(el);
                setModalVisible(true);
              }} //handleEdit(el)
              style={styles.iconsCont}
            >
              <MaterialIcons name="edit" size={22} color={COLORS.babyBlue2} />
            </TouchableOpacity>
            <View style={styles.iconsCont2}>
              <CustomText
                color={COLORS.black}
                size={16}
                text={
                  el.name +
                  "\n" +
                  t("newTransactions.q") +
                  ": " +
                  el.Quantity +
                  "  " +
                  t("newTransactions.p") +
                  ": " +
                  el.Price
                }
              />
            </View>
          </CollapseHeader>
          <CollapseBody>
            <CustomInput
              containerStyle={styles.btn}
              label={t("newTransactions.item")}
              editable={false}
              value={el.name}
              icon={
                <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
              }
            />
            <CustomInput
              containerStyle={styles.btn}
              label={t("newTransactions.Price")}
              editable={false}
              value={el.Price}
              icon={
                <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
              }
            />
            <CustomInput
              containerStyle={styles.btn}
              label={t("newTransactions.Quantity")}
              value={el.Quantity}
              editable={false}
              icon={
                <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
              }
            />
          </CollapseBody>
        </Collapse>
      </>
    );
  };
  const handleSubmit = () => {
    let price = 0;
    item.map((el) => {
      price = price + parseInt(el?.Price) * parseInt(el?.Quantity);
    });
    if (price != parseInt(userPrice)) {
      setItemsPriceError(true);
    } else {
      navigation.navigate("linkAgreement");
    }
  };
  useEffect(() => {
    setData({
      ...data,
      item: EditableItem
        ? EditableItem
        : {
            id: null,
            name: "",
            Price: "",
            Quantity: "",
          },
    });
    handleGetRemainingAmount();
  }, [navigation, EditableItem, modalVisible]);
  const handleGetRemainingAmount = () => {
    let price = 0;
    item &&
      item.length > 0 &&
      (EditableItem
        ? item.map((el) => {
            if (el.id != EditableItem?.id)
              price = price + parseInt(el?.Price) * parseInt(el?.Quantity);
          })
        : item.map((el) => {
            price = price + parseInt(el?.Price) * parseInt(el?.Quantity);
          }));

    setRemaining(parseInt(userPrice) - price);
  };
  useEffect(() => {
    data?.item?.Price && parseInt(data?.item?.Price) > 0
      ? setValidPrice(true)
      : setValidPrice(false);
  }, [data?.item?.Price]);
  useEffect(() => {
    data?.item?.Quantity && parseInt(data?.item?.Quantity) > 0
      ? setValidQuantity(true)
      : setValidQuantity(false);
  }, [data?.item?.Quantity]);
  const handleAddItem = () => {
    if (
      remaining <
      parseInt(data?.item?.Price) * parseInt(data?.item?.Quantity)
    ) {
      setShow(true);
    } else {
      EditableItem && dispatch(transactions.removeTransaction(EditableItem.id));
      dispatch(
        transactions.addTransaction({
          item: {
            ...data?.item,
            id:
              item?.length == 0 ? 0 : parseInt(item[item?.length - 1]?.id) + 1,
          },
        })
      );
      EditableItem && setEditableItem(null);
      setModalVisible(!modalVisible);
    }
  };
  const checkValidations = () => {
    data?.item?.name && data?.item?.name.length > 0
      ? validPrice
        ? validQuantity
          ? handleAddItem()
          : quantityRef.current.focus()
        : priceRef.current.focus()
      : nameRef.current.focus();
  };
  return (
    <>
      <View style={styles.container}>
        <CustomHeader
          navigation={navigation}
          // warningBack={true}
          // backAction={() => setWarningBack(true)}
          warningLanguage={true}
        />
        <ScrollView>
          <View style={styles.progressCon}>
            <ProgressBar
              progress={40}
              height={10}
              backgroundColor="green"
              // animated={false}
            />
          </View>
          <CustomText
            color={COLORS.red}
            size={18}
            text={t("changeRole.step2")}
          />
          <View style={styles.screen}>
            {/* items */}
            <CustomText
              color={COLORS.blue}
              size={16}
              text={t("newTransactions.tot") + userPrice} //remaining
            />
            {item && item.length == 0 && (
              <CustomText
                color={COLORS.black}
                size={18}
                text={t("newTransactions.noItems")}
              />
            )}
            {item?.map((el) => (
              <RenderItems el={el} key={el.id} />
            ))}
            <View style={styles.btnsContainer}>
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  handleSubmit();
                }}
                textSize={16}
                text={t("newTransactions.Next")} //t("newTransactions.Confirm")
                containerStyle={[{ width: "100%" }]}
              />
            </View>
            <TouchableOpacity
              style={styles.plusCont}
              onPress={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <AntDesign name="plus" size={30} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <ScrollView
            contentContainerStyle={styles.centeredViewAdd}
            style={styles.centeredView2Add}
          >
            <View style={styles.headerCon}>
              <CustomText
                color={COLORS.blue}
                size={18}
                text={t("newTransactions.addItem")}
                // style={styles.title}
              />
              <TouchableOpacity
                onPress={() => {
                  EditableItem && setEditableItem(null);
                  setModalVisible(!modalVisible);
                }}
                // style={CommonStyles.closeCont}
              >
                <AntDesign name={"closecircleo"} size={30} color={COLORS.red} />
              </TouchableOpacity>
            </View>
            <View style={styles.itemFormContainer}>
              <CustomText
                color={COLORS.blue}
                size={16}
                text={t("newTransactions.remaining") + remaining} //remaining
              />
              <CustomInput
                inputRef={nameRef}
                containerStyle={styles.btn}
                label={t("newTransactions.item")}
                value={data?.item?.name}
                onChangeText={(val) => {
                  setData((prevState) => ({
                    ...prevState,
                    item: {
                      ...prevState.item,
                      name: val,
                    },
                  }));
                }}
                icon={
                  <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
                }
              />
              <CustomInput
                inputRef={priceRef}
                containerStyle={styles.btn}
                label={t("newTransactions.Price")}
                keyboardType="numeric"
                value={data?.item?.Price}
                onChangeText={(val) => {
                  setData((prevState) => ({
                    ...prevState,
                    item: {
                      ...prevState.item,
                      Price: val,
                    },
                  }));
                }}
                icon={
                  <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
                }
                error={data?.item?.Price ? !validPrice : false}
                errorMessage={t("newTransactions.numErr")}
              />

              <CustomInput
                inputRef={quantityRef}
                containerStyle={styles.btn}
                label={t("newTransactions.Quantity")}
                keyboardType="numeric"
                value={data?.item?.Quantity}
                onChangeText={(val) => {
                  setData((prevState) => ({
                    ...prevState,
                    item: {
                      ...prevState.item,
                      Quantity: val,
                    },
                  }));
                }}
                icon={
                  <AntDesign name="idcard" size={20} color={COLORS.babyBlue2} />
                }
                error={data?.item?.Quantity ? !validQuantity : false}
                errorMessage={t("newTransactions.numErr")}
              />
            </View>
            {/* // Add button */}
            <TouchableOpacity
              onPress={() => {
                checkValidations();
              }} //
              style={styles.buttonStyle}
            >
              <CustomText
                color={"white"}
                size={15}
                text={t("agreementScreen.add")}
              />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
      <CustomAlert
        type={'error'}
        show={warningBack}
        header={t("reviewTransaction.w")}
        body={t("newTransactions.backMessage")}
        action1={() => {
          setWarningBack(false);
          navigation.navigate("changeRole");
        }}
        btn1={t("reviewTransaction.ok")}
        btn2={t("newTransactions.cancle")}
        action2={() => setWarningBack(false)}
        oneBtn={false}
      />
      <CustomAlert
        type={'error'}
        show={showDeleteModal.status}
        header={t("newTransactions.deleteHeader")}
        body={t("newTransactions.deleteBody")}
        action1={handleDelete}
        btn1={t("reviewTransaction.ok")}
        btn2={t("newTransactions.cancle")}
        action2={() => setShowDeleteModal({ status: false, id: null })}
        oneBtn={false}
      />
      <CustomAlert
        type={'error'}
        show={itemsPriceError}
        header={t("reviewTransaction.w")}
        body={t("reviewTransaction.error") + " ( " + userPrice + " ) "}
        action1={() => {
          setItemsPriceError(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
      <CustomAlert
        type={'error'}
        show={show}
        header={t("reviewTransaction.w")}
        body={t("newTransactions.priErr")}
        action1={() => {
          setShow(false);
        }}
        btn1={t("reviewTransaction.ok")}
        oneBtn={true}
      />
      <Modal animationType="slide" transparent={true} visible={showAgreement}>
        <View style={styles.modalView}>
          <View style={styles.centeredView2}>
            <View style={styles.modalTxtCont}>
              <CustomText
                text={agreementName} //t('newTransactions.aggh')
                color={COLORS.header}
                containerStyle={styles.headerModalCont}
                size={20}
              />
              <CustomText
                text={agreementDescription}
                color={COLORS.blue}
                size={16}
                containerStyle={styles.bodyModalCont}
              />
            </View>
            <CustomButton
              color={COLORS.blue}
              onPress={() => setShowAgreement(false)}
              textSize={14}
              text={t("newTransactions.aggb")}
              containerStyle={styles.modalBtn2}
              textStyle={styles.closeButtonTxt}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ViewScreen;
