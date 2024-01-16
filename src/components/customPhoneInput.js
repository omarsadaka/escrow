import React, { useState, useRef, useMemo, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  StatusBar,
  TouchableOpacity,
  Text,
  PermissionsAndroid,
  Pressable,
  ScrollView,
  FlatList,
  Image,
  Modal,
  Linking,
  ImageBackground,
  Dimensions,
} from "react-native";
import { COLORS } from "../constants/colors";
import { useTheme } from "@react-navigation/native";
import CustomText from "./customText";
import CustomInput from "./customInput";
import { useTranslation } from "react-i18next";
import { height, hp, wp } from "../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RFValue } from "react-native-responsive-fontsize";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Contacts from "react-native-contacts";
import RBSheet from "react-native-raw-bottom-sheet";
import QRCodeScanner from "react-native-qrcode-scanner";

const CustomPhoneInputFinal = ({
  placeholder,
  validateInput = true,
  editable = true,
  smaller = false,
  dropDownContainerStyle = {},
  containerStyle = {},
  inputRef,
  onChangeText = () => {},
  setIsValid = () => {},
  showContacts,
  noContacts,
  draft,
  valueToStore,
  userPhone,
  showQRCode,
  changeMobile,
}) => {
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [value, setValue] = useState(draft ? valueToStore : "");
  const [theme, setTheme] = useState("light");
  // const [valid, setValid] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [searchQuery, setSearchQuery] = useState(false);
  const phoneRef = useRef({});
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [phoneConflict, setPhoneConflict] = useState(false);
  const [phoneIsArabic, setPhoneIsArabic] = useState(false);
  const [visible, setVisible] = useState(false);
  const [productQRref, setProductQRref] = useState();
  const [showCountries, setShowCountries] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    icon: require("../assets/saudi-arabia-flag-icon.png"),
    code: "+966",
  });
  const countresItems = [
    {
      label: "Suadi Arabia",
      code: "+966",
      icon: require("../assets/saudi-arabia-flag-icon.png"),
    },
    // {
    //   label: "Egypt",
    //   code: "+20",
    //   icon: require("../assets/egyptian-flag-logo.png"),
    // },
  ];
  useEffect(() => {
    validateInput == true && handlePhoneValidation(value);
  }, [value]);

  const handlePhoneValidation = (phone) => {
    // if (!(String(phone).startsWith('05') && String(phone).length == 10)) {

    let numbers = '0123456789';
    for (var i=0; i < phone?.length; i++) {
        if(numbers.indexOf(phone[i]) > -1 ) {
          setPhoneIsArabic(false);
          setShowMessage(false);
          setIsValid(true);
        }else {
            setPhoneIsArabic(true);
            setShowMessage(true);
            setIsValid(false);
        }
    }

    if (!(String(phone).startsWith("5") && String(phone).length == 9)) {
      setShowMessage(true);
      setIsValid(false);
      setPhoneConflict(false);
    } else if (phone == userPhone) {
      setPhoneConflict(true);
      setShowMessage(true);
      setIsValid(false);
    } else {
      setPhoneConflict(false);
      setShowMessage(false);
      setIsValid(true);
    }
  };
  const onChangeSearchText = (query) => {
    setSearchQuery(query);
    const filteredData = contacts.filter(
      (contact) =>
        contact?.displayName?.toLowerCase().includes(query.toLowerCase()) ||
        contact?.phoneNumbers[0]?.number
          ?.split(" ")
          .join("")
          ?.includes(query.split(" ").join(""))
    );
    setFilteredContacts(filteredData);
  };

  const getSavedTheme = async () => {
    try {
      const value = await AsyncStorage.getItem("THEME");
      if (value !== null) {
        // value previously stored
        setTheme(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getSavedTheme();
  }, [theme]);

  useEffect(() => {
    !noContacts && getContacts();
  }, []);
  const getContacts = () => {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      }).then((res) => {
        if (res == "granted") {
          Contacts.getAll().then((contacts) => {
            setContacts(contacts);
            setFilteredContacts(contacts);
          });
        } else {
          console.log("err per");
          // showMessage({ message: t("permission denied"), type: "warning" });
        }

        // .catch((error) => {

        //   console.error("Permission error: ", error);
      });
    } catch (error) {
      console.log("err per 2");
    }
  };

  const ContactItemComponent = ({ el }) => {
    return (
      <Pressable
        onPress={() => {
          phoneRef.current.close();
          var number = "";
          if (el?.phoneNumbers[0]?.number?.startsWith("+966")) {
            number = el?.phoneNumbers[0]?.number.replace("+966", "");
            setValue(number.replace(/ /g, ""));
            // setValue(
            //   el?.phoneNumbers[0]?.number?.split("+966")[1].split(" ").join("")
            // );
          } else if (el?.phoneNumbers[0]?.number?.startsWith("966")) {
            number = el?.phoneNumbers[0]?.number.replace("966", "");
            setValue(number.replace(/ /g, ""));
            // setValue(
            //   el?.phoneNumbers[0]?.number?.split("966")[1].split(" ").join("")
            // );
          } else if (el?.phoneNumbers[0]?.number?.startsWith("0")) {
            number = el?.phoneNumbers[0]?.number.replace("0", "");
            setValue(number.replace(/ /g, ""));
            // setValue(
            //   el?.phoneNumbers[0]?.number?.split("0")[1].split(" ").join("")
            // );
          } else {
            // setValue(el?.phoneNumbers[0]?.number?.split(" ").join(""));
            number = el?.phoneNumbers[0]?.number?.split(" ").join("");
            setValue(number.replace(/ /g, ""));
          }

          handlePhoneValidation(number.replace(/ /g, ""));
          onChangeText(number.replace(/ /g, ""));
        }}
      >
        <View style={styles.contactContainer}>
          <Image
            source={
              el?.hasThumbnail == true
                ? { uri: el.thumbnailPath }
                : require("../assets/avatarContact.jpg")
            }
            style={styles.thumbNail}
          />

          <View style={styles.contactSubContainer}>
            <CustomText style={styles.contactTxt1} color={COLORS.header}>
              {el.displayName}
            </CustomText>
            <CustomText style={styles.contactTxt2} color={COLORS.grey}>
              {el?.phoneNumbers[0]?.number}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <>
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: showContacts?"85%": "80%",
          marginLeft: changeMobile ? "16%" : 0,
          alignSelf:'center'
        }}
      >
        <CustomText
          text={t("profileScreens.phone")}
          color={COLORS.lightGrey}
          size={RFValue(11)}
          style={{width:'100%',textAlign:'left'}}
        />
      </View>

      <View
        style={[
          styles.container,
          { flexDirection: i18n.language == "ar" ? "row-reverse" : "row"},
        ]}
      >
        {showQRCode ? (
          <>
            <Ionicons
              style={styles.qrCodeIcon}
              color={COLORS.header}
              size={30}
              name="qr-code-outline"
              onPress={() => setVisible(true)}
            />
          </>
        ) : null}
        <TouchableOpacity
          onPress={() => setShowCountries(true)}
          style={[styles.dropDownContainer, { ...dropDownContainerStyle }]}
        >
          <Image
            source={selectedCountry.icon}
            style={{
              width: wp(10),
              height: hp(3.5),
              marginRight: 10,
              resizeMode: "contain",
            }}
          />
          <CustomText
            text={selectedCountry.code}
            color={COLORS.black}
            size={RFValue(13)}
          />
        </TouchableOpacity>

        <CustomInput
          inputRef={inputRef}
          editable={editable}
          defaultValue={value}
          value={placeholder ? placeholder : value?.trim(" ")}
          placeholder={placeholder ? placeholder : "50 963 1234"}
          keyboardType="numeric"
          textInputStyle={{
            textAlign: i18n.language == "ar" ? "left" : "left",
            paddingRight: 12,
          }}
          containerStyle={[
            styles.containerStyle,
            {
              ...containerStyle,
              borderBottomColor: showMessage ? COLORS.red : COLORS.black,
            },
          ]}
          textContainerStyle={styles.textContainerStyle}
          onChangeText={(text) => {
            setValue(text);
            handlePhoneValidation(text);
            onChangeText(text);
          }}
        />

        {!noContacts && (
          <>
            <MaterialCommunityIcons
              style={styles.contactsStyle}
              color={COLORS.header}
              size={30}
              name="contacts"
              onPress={() => {
                phoneRef.current.open();
              }}
            />
            <RBSheet
              ref={phoneRef}
              height={700}
              openDuration={250}
              customStyles={{
                container: {
                  // justifyContent: "center",
                  // alignItems: "center",
                  height: "90%",
                  borderTopEndRadius:wp(8),
                  borderTopStartRadius:wp(8)
                },
              }}
            >
              <CustomInput
                value={searchQuery}
                placeholder={t("search")}
                textInputStyle={{
                  textAlign: i18n.language == "ar" ? "right" : "left",
                }}
                containerStyle={[
                  styles.containerStyle,
                  {
                    width: "90%",
                  },
                ]}
                textContainerStyle={styles.textContainerStyle}
                onChangeText={(txt) => onChangeSearchText(txt)}
              />

              {filteredContacts?.length > 0 ? (
                <FlatList
                  data={filteredContacts}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item: el }) => (
                    <ContactItemComponent el={el} />
                  )}
                />
              ) : (
                <CustomText text={t("noDataFound")} color={COLORS.header} />
              )}
            </RBSheet>
          </>
        )}
      </View>

      {showMessage && (
        <View style={styles.errorMessage}>
          <CustomText
            text={
              phoneConflict
                ? t("RegisterScreen.conflictphoneError")
                : phoneIsArabic?t("RegisterScreen.notAcceptArabic") : t("RegisterScreen.PhoneValidation")
            }
            color={"red"}
            size={11}
          />
        </View>
      )}
      <Modal
        transparent={true}
        animationType="slide"
        visible={visible}
        onRequestClose={() => setVisible(!visible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modal2}>
            <View style={styles.modalHeader}>
              <CustomText
                color={COLORS.black}
                size={14}
                text={t("shortEscrow.scanQRCode")}
                style={styles.BackTxt}
              />
              <TouchableOpacity
                onPress={() => setVisible(false)}
                style={styles.close2}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={28}
                  color={COLORS.babyBlue2}
                />
              </TouchableOpacity>
            </View>
            <QRCodeScanner
              cameraStyle={{width:'90%',alignItems:'center',alignSelf:'center',marginTop: hp(5)}}
              reactivate={true}
              showMarker={true}
              onRead={(e) => {
                console.log("onSuccess", e.data);
                if (e.data.startsWith("966")) {
                  const number = e.data.replace("966", "");
                  setValue(number);
                  handlePhoneValidation(number);
                  onChangeText(number);
                } else if (e.data.startsWith("+966")) {
                  const number = e.data.replace("+966", "");
                  setValue(number);
                  handlePhoneValidation(number);
                  onChangeText(number);
                } else if (e.data.startsWith("00966")) {
                  const number = e.data.replace("00966", "");
                  setValue(number);
                  handlePhoneValidation(number);
                  onChangeText(number);
                } else {
                  setValue(e.data);
                  handlePhoneValidation(e.data);
                  onChangeText(e.data);
                }
                setVisible(false);
              }}
              // flashMode={RNCamera.Constants.FlashMode.torch}
            />
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        animationType="slide"
        visible={showCountries}
        onRequestClose={() => setShowCountries(!showCountries)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalCountry}>
            <View style={styles.modalHeaderCountry}>
              <CustomText
                color={COLORS.black}
                size={14}
                text={t("selectCountry")}
                style={styles.BackTxt}
              />
              <TouchableOpacity
                onPress={() => setShowCountries(false)}
                style={{ marginRight: wp(1) }}
              >
                <Ionicons
                  name="close-circle-outline"
                  size={30}
                  color={COLORS.babyBlue2}
                />
              </TouchableOpacity>
            </View>
            {countresItems.map((item) => (
              <TouchableOpacity
                onPress={() => {
                  setShowCountries(false);
                }}
                style={{
                  flexDirection: "row-reverse",
                  alignItems: "center",
                  width: "85%",
                  marginTop: hp(2),
                }}
              >
                <Image
                  source={item.icon}
                  style={{
                    width: wp(10),
                    height: hp(5),
                    resizeMode: "contain",
                  }}
                />
                <CustomText
                  text={item.label}
                  color={COLORS.black}
                  size={RFValue(16)}
                  containerStyle={{
                    marginHorizontal: wp(2),
                  }}
                />
                <CustomText
                  text={item.code}
                  color={COLORS.lightGrey}
                  size={RFValue(16)}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CustomPhoneInputFinal;
const createStyles = (COLORS) =>
  StyleSheet.create({
    container: {
      alignItems: "flex-start",
      alignContent:'center',
      flexDirection: "row-reverse",
      width: "75%",
      maxHeight: hp(8),
      alignSelf: "center",
      marginTop: hp(2),
      justifyContent: "flex-start",
      alignSelf:'center'
    },
    containerStyle: {
      marginRight: wp(2),
      maxHeight: hp(6),
      borderBottomWidth: 1,
      width: "70%",
      // alignContent: "center",
      backgroundColor: COLORS.inputBackGround,
      height: "100%",
      borderColor: COLORS.inputBackGround,
      borderRadius: 0,
      bottom: height*0.0285,
    },
    textContainerStyle: {
      backgroundColor: COLORS.inputBackGround,
      // alignItems: "flex-start",
      // justifyContent: "flex-start",
      // marginHorizontal: wp(1),
      // paddingVertical: hp(0),
      textAlign: "flex-end",
    },
    contactsStyle: { alignSelf: "flex-start" },
    qrCodeIcon: { alignSelf: "flex-start", marginHorizontal: wp(2) },
    dropDownContainer: {
      flexDirection: "row-reverse",
      height: "75%",
      borderBottomColor: COLORS.black,
      borderBottomWidth: 1,
      width: "30%",
      alignItems: "center",
      justifyContent: "space-between",
      // top: -2,
      bottom: height*0.013,
    },

    errorMessage: {
      alignSelf: "flex-start",
      marginHorizontal: wp(8),
      marginBottom: hp(1),
    },
    contactContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomColor: COLORS.grey,
      borderBottomWidth: hp(0.1),
      width: "80%",
      alignSelf: "center",
    },
    contactSubContainer: {
      flexDirection: "column",
      // alignItems:'center',
      // justifyContent:'space-between'
    },
    thumbNail: {
      width: wp(13),
      height: hp(6),
      borderRadius: hp(3),
    },
    contactTxt1: {},
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#00000099",
      borderRadius: hp(2),
    },
    modal2: {
      width: "90%",
      height: hp(60),
      backgroundColor: COLORS.white,
      borderRadius: hp(2),
      alignItems: "center",
    },
    modalCountry: {
      width: "75%",
      height: hp(20),
      backgroundColor: COLORS.white,
      borderRadius: hp(2),
      alignItems: "center",
    },
    modalHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp(3),
    },
    modalHeaderCountry: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      marginVertical: hp(1),
      justifyContent: "space-between",
    },
    BackTxt: {
      marginHorizontal: wp(3),
    },

    row: {
      width: "60%",
      alignItems: "center",
      marginTop: hp(4),
      justifyContent: "space-between",
      flexDirection: "row",
    },

    centerText: {
      flex: 1,
      fontSize: 18,
      padding: 32,
      color: "#777",
    },
    textBold: {
      fontWeight: "500",
      color: "#000",
    },
    buttonText: {
      fontSize: 21,
      color: "rgb(0,122,255)",
    },
    buttonTouchable: {
      padding: 16,
    },
  });
