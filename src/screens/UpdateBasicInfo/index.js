import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Pressable,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import createStyles from "./style";
import CommonStyles from "../../constants/CommonStyles";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { wp, hp } from "../../utilis/dimensions";
import CustomInput from "../../components/customInput";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RBSheet from "react-native-raw-bottom-sheet";
import CustomButton from "../../components/customButton";
import { checkPassword } from "../../utilis/apis";
import { showSimpleModal } from "../../redux/actions/modal";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import { useDispatch } from "react-redux";

const UpdateBasicInfo = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("https://escrow2d.meiladigital-sa.com/backend/api/");

  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const refRBSheet = useRef();
  const [password, setPassword] = useState("");
  const [path, setPath] = useState("email"); //  =>   email || phone || pin // updatePin
  const [isActivatedPin, setIsActivatedPin] = useState(false);
  const [checkingLoader, setCheckingLoader] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);


  useEffect(async () => {
    getBaseURL()?.then((res) => setBaseURL(res));
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    setUserInfo(JSON.parse(userInfo));
    return () => {
      setBaseURL("");
    };
  }, []);


  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    setLoading(true);
    fetch(baseURL + ENDPOINTS.getUserDetails, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setLoading(false);
        if (responseData.data) {
          console.log('responseData getUserInfo', responseData.data.user)
          let dd = responseData.data.user;
          setData(dd);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoading(false);
      });
  };

  const handleCheckingPassword = () => {
    setCheckingLoader(true);
    checkPassword(baseURL, password).then((passwordStatus) => {
      console.log("pass status", passwordStatus);
      if (passwordStatus == true) {
        setCheckingLoader(false);
        refRBSheet.current.close();
        navigation.navigate("ChangeEmail", { path: path });
        setPassword("");
      } else {
        setCheckingLoader(false);
        dispatch(
          showSimpleModal({
            status: true,
            payload: {
              header:
                i18n.language == "ar" ? "حدث خطأ ما" : "something went wrong",
              message:
                i18n.language == "ar"
                  ? "كلمة السر غير صحيحة"
                  : "wrong password",
              action: "",
              type: "error",
            },
          })
        );
        setPassword("");
      }
    });
  };

  useEffect(() => {
    getUserInfo()
    getPin();
  }, [navigation]);

  const getPin = async () => {
    const pinExist = await AsyncStorage.getItem("USER_PIN");
    console.log("pinExist : ", pinExist);
    pinExist == 1 ? setIsActivatedPin(true) : setIsActivatedPin(false);
  };

  return (
    <View scrollEnabled={true} style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <CustomHeader navigation={navigation} />
      <CustomText
        text={t("profileScreens.updateInfo")}
        color={COLORS.black}
        size={20}
        style={styles.title}
      />
      {loading?
      <ActivityIndicator size={"large"} color={COLORS.header} />
      :
      <>
       <Pressable
        onPress={() => {
          setPath("email");
          setPassword("");
          refRBSheet.current.open();
        }}
        style={styles.itemContainer}
      >
        <View style={styles.itemLeft}>
          <Ionicons name="mail" size={25} color={COLORS.babyBlue2} />
        </View>
        <View style={styles.itemCenter}>
          <CustomText
            text={t("profileScreens.ChangeEmail")}
            color={COLORS.black}
            size={12}
            style={styles.itemText}
          />
          <CustomText
            text={data && `${data?.email}`}
            color={COLORS.grey}
            size={9}
            style={styles.itemSubText}
          />
        </View>
        <View style={styles.itemRight}>
          <Ionicons
            name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
            size={25}
            color={COLORS.babyBlue2}
          />
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          setPath("phone");
          setPassword("");
          refRBSheet.current.open();
        }}
        style={styles.itemContainer}
      >
        <View style={styles.itemLeft}>
          <Ionicons name="call" size={25} color={COLORS.babyBlue2} />
        </View>
        <View style={styles.itemCenter}>
          <CustomText
            text={t("profileScreens.ChangePhone")}
            color={COLORS.black}
            size={12}
            style={styles.itemText}
          />
          <CustomText
            text={data && `${data?.mobile}`}
            color={COLORS.grey}
            size={9}
            style={styles.itemSubText}
          />
        </View>
        <View style={styles.itemRight}>
          <Ionicons
            name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
            size={25}
            color={COLORS.babyBlue2}
          />
        </View>
      </Pressable>
      {isActivatedPin && (
        <Pressable
          onPress={() => {
            setPath("updatePin");
            refRBSheet.current.open();
          }}
          style={styles.itemContainer}
        >
          <View style={styles.itemLeft}>
            <Ionicons name="md-keypad" size={25} color={COLORS.babyBlue2} />
          </View>
          <View style={styles.itemCenter}>
            <CustomText
              text={t("profileScreens.ChangePin2")}
              color={COLORS.black}
              size={12}
              style={styles.itemText}
            />
            <CustomText
              text="******"
              color={COLORS.grey}
              size={9}
              style={styles.itemSubText}
            />
          </View>
          <View style={styles.itemRight}>
            <Ionicons
              name={I18nManager.isRTL ? "chevron-back" : "chevron-forward"}
              size={25}
              color={COLORS.babyBlue2}
            />
          </View>
        </Pressable>
      )}
      </>
      }
     
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={false}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "#00000060",
          },
          container: { height: "50%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.bg,
            flex: 1,
          }}
        >
          <View
            style={{
              backgroundColor: COLORS.white,
              paddingVertical: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 10,
            }}
          >
            <CustomText
              text={t("profileScreens.enterPass")}
              color={COLORS.blue}
              size={12}
              style={styles.passwordTitle}
            />
            <Ionicons name="chevron-down" size={25} color={COLORS.blue} />
          </View>
          <CustomInput
            label={t("loginScreen.password")}
            placeholder={"*********"}
            password={true}
            value={password}
            onChangeText={setPassword}
            // error={password?.length > 0 && password?.length < 8}
            // errorMessage={t("profileScreens.passRules")}
            icon={
              <Ionicons name="lock-open" size={20} color={COLORS.babyBlue2} />
            }
          />
          <>
            <CustomButton
              disabled={password.length == 0}
              color={password.length == 0 ? COLORS.grey : COLORS.blue}
              loading={checkingLoader}
              onPress={handleCheckingPassword}
              textSize={12}
              text={t("profileScreens.confirmPass")}
              containerStyle={styles.btn}
            />
            <CustomButton
              color={COLORS.white}
              onPress={() => {
                refRBSheet.current.close();
              }}
              textSize={12}
              text={t("accountScreen.closeAccount")}
              containerStyle={styles.closeButton}
              textStyle={styles.closeButtonTxt}
            />
          </>
        </View>
      </RBSheet>

    </View>
  );
};
export default UpdateBasicInfo;
