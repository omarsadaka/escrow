import React, { useEffect, useMemo, useState } from "react";
import {
  Image,
  View,
  TouchableOpacity,
  Share,
  Linking,
  I18nManager,
  ActivityIndicator,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AppStack } from "../../navigation/navigation";
import { useTranslation } from "react-i18next";
import createStyles from "./styles";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import CustomText from "../../components/customText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { useDrawerStatus } from "@react-navigation/drawer";
import {
  AccountSettingsSideMenueData,
  ContactUsSideMenueData,
  SocialMedial,
} from "./data";
import { ScrollView } from "react-native-gesture-handler";
import * as Authentication from "../../redux/actions/authentication";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import { storeStackValue, handleLogoutValue } from "../../redux/actions/user";
import CustomAlert from "../../components/CustomAlert";
import { getUniqueId } from "react-native-device-info";
import { showSimpleModal } from "../../redux/actions/modal";
import { ENDPOINTS2, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
const Drawer = createDrawerNavigator();

const MyDrawer = ({ navigation }) => {
  const { t, i18n } = useTranslation();
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState("");
  const { colors: COLORS } = useTheme();
  const dispatch = useDispatch();
  const styles = useMemo(() => createStyles(COLORS), []);
  const isFocused = useIsFocused();
  const { image } = useSelector((state) => state.user);
  const [version, setVersion] = useState("");
  const [uuid, setUUID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const getVersion = () => {
    let pkg = require("../../../package.json");
    // console.log("package : ", pkg);
    setVersion(pkg.version);
  };
  const getName = async () => {
    const name = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    let name2 = JSON.parse(name);
    setUserName(name2?.firstname + " " + name2?.lastname);
    setUserImage(name2?.image);
  };

  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    setUUID(uuidValue);
  };

  useEffect(() => {
    getName();
    getVersion();
    getUUID();
  }, [navigation, isFocused]);

  const handleLogout = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

    const formdata = new FormData();
    formdata.append("uuid", uuid);
    formdata.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS2.signOut, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("signout ress.. : ", responseData);
        if (responseData.status == "success") {
          await AsyncStorage.removeItem("CUSTOMER_ID");
          // await AsyncStorage.removeItem("REMEMBER");
          await AsyncStorage.removeItem("THEME");
          await AsyncStorage.removeItem("@CACHED_LANG");
          await AsyncStorage.removeItem("USER_PIN");
          await AsyncStorage.removeItem("USER_PIN_VALUE");
          await AsyncStorage.removeItem("ChangeLang");
          await AsyncStorage.removeItem("AUTHLANG");
          await AsyncStorage.removeItem("TOKEN");
          await AsyncStorage.removeItem("NAVIGATION_STATE_TIME");
          // await AsyncStorage.removeItem("CUSTOMER_LOGIN");
          await AsyncStorage.removeItem("API_LANGUAGE");
          // await AsyncStorage.removeItem("CUSTOMER_OBJECT");
          await AsyncStorage.removeItem("PaymentMethodsSeller");
          dispatch(storeStackValue(false));
          dispatch(handleLogoutValue(true));
          dispatch(Authentication.logOut());
          showMessage({
            message: t("sideMenu.signOutSuccessfully"),
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
          setLoading(false);
        } else {
          setLoading(false);
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t("updateHeader"),
                message: t("accountScreen.err"),
                action: "",
                type:'error'
              },
            })
          );
        }
      })
      .catch((e) => {
        setLoading(false);
        dispatch(
          showSimpleModal({
            status: true,
            payload: {
              header: t("updateHeader"),
              message: t("accountScreen.err"),
              action: "",
              type:'error'
            },
          })
        );
      });
  };
  const handleShareSocial = async () => {
    console.log("share");
    try {
      const result = await Share.share({
        title: "App link",
        message:
          "Please install Saudi Escrow app and stay safe , AppLink :https://play.google.com/store/apps/SaudiEscrow",
        url: "https://play.google.com/store/apps/SaudiEscrow",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const CustomDrawerContent = ({ ...filteredProps }) => {
    const isDrawerOpen = useDrawerStatus() === "open";
    const { stackValue } = useSelector((state) => state.user);
    const [show, setShow] = useState(false);
    const [link, setLink] = useState("");
    // console.log('props',{...filteredProps}.navigation)
    return (
      <ScrollView>
        {/* <View style ={styles.drawerHeaderContent}/> */}

        <View>
          <TouchableOpacity
            // onPress={() => navigation.navigate('Profile')}
            style={styles.ProfileContainer}
          >
            <Image
              style={styles.avatar}
              resizeMode="contain"
              source={{
                uri: image,
              }} //require("../../assets/userAvatar.png")
            />
            <View style={styles.headerTxt}>
              <CustomText
                color={COLORS.header}
                size={18}
                text={userName}
                // style={styles.userNameTxt}
              />
              <CustomText
                color={COLORS.grey}
                size={18}
                text={t("sideMenu.welcome")}
                // style={styles.helloTxt}
              />
            </View>
          </TouchableOpacity>

          <View>
            {/* FLATlIST */}
            <TouchableOpacity style={styles.accountSettingsContainer}>
              <CustomText
                text={t("sideMenu.AccountSettings")}
                color={COLORS.grey}
                size={18}
                style={styles.accountSettingsTxt}
              />
            </TouchableOpacity>

            <View>
              {AccountSettingsSideMenueData.map((el, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    if (el.link) {
                      if (stackValue) {
                        setLink(el.link);
                        setShow(true);
                      } else {
                        // navigation.navigate(el.link);
                        navigation.navigate(el.stack, { screen: el.link });
                      }
                    }
                  }}
                  style={styles.accountSettingsSideMenueDatacont}
                >
                  <Feather name={el.icon} size={25} color={COLORS.header} />
                  <View style={styles.txtCont}>
                    <CustomText
                      text={t(`sideMenu.${el.name}`)}
                      color={COLORS.header}
                      size={15}
                    />
                  </View>
                  <Feather
                    name={
                      i18n.language == "ar" ? "chevron-left" : "chevron-right"
                    }
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.contactUsTitleCont}>
              <CustomText
                text={t("sideMenu.ContactUs")}
                color={COLORS.grey}
                size={18}
                style={styles.accountSettingsTxt}
              />
            </TouchableOpacity>
            <View>
              {ContactUsSideMenueData.map((el, index) => (
                <TouchableOpacity
                  disabled={el.name == "signOut" && loading}
                  key={index}
                  onPress={
                    el.name == "inviteFriends"
                      ? handleShareSocial
                      : el.name == "signOut" || el.name == "تسجيل الخروج"
                      ? handleLogout
                      : el.link
                      ? () =>
                          stackValue
                            ? (setLink(el.link), setShow(true))
                            : navigation.navigate(el.stack, { screen: el.link }) //navigation.navigate(el.link)
                      : () => {}
                  }
                  style={styles.accountSettingsSideMenueDatacont}
                >
                  <Feather
                    name={el.icon}
                    size={25}
                    color={el.name == "signOut" ? COLORS.red : COLORS.header}
                  />
                  <View style={styles.txtCont}>
                    {el.name == "signOut" && loading ? (
                      <ActivityIndicator size={"small"} color={"red"} />
                    ) : (
                      <CustomText
                        text={t(`sideMenu.${el.name}`)}
                        color={
                          el.name == "signOut" ? COLORS.red : COLORS.header
                        }
                        size={15}
                      />
                    )}
                  </View>
                  <Feather
                    name={
                      i18n.language == "ar" ? "chevron-left" : "chevron-right"
                    }
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.socialMediaContainer}>
            {SocialMedial.map((el, index) => (
              <TouchableOpacity
                key={index}
                onPress={el.link ? () => Linking.openURL(el.link) : () => {}}
                style={styles.socialMediaItem}
              >
                <FontAwesome name={el.icon} size={20} color={COLORS.header} />
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <CustomText
              color={COLORS.black}
              size={12}
              text={t("copyRights")}
              style={styles.text}
            />
            <View style={styles.versionStyle}>
              <CustomText color={COLORS.black} size={14} text={t("version")} />
              <CustomText color={COLORS.black} size={14} text={version} />
            </View>
          </View>

          {/* <DrawerItemList {...filteredProps} /> */}
        </View>

        <CustomAlert
          type={'error'}
          show={show}
          header={t("reviewTransaction.w")}
          body={t("stackError")}
          action1={() => {
            dispatch(storeStackValue(false));
            navigation.navigate(link);
            setShow(false);
          }}
          btn1={t("reviewTransaction.ok")}
          action2={() => {
            setShow(false);
          }}
          btn2={t("cancle")}
          oneBtn={false}
        />
      </ScrollView>
    );
  };

  return (
    <Drawer.Navigator
      options={{}}
      screenOptions={{
        headerShown: false,
        drawerStyle: styles.drawer,
      }}
      drawerContent={(props) => {
        const filteredProps = {
          ...props,
          state: {
            ...props.state,
            routeNames: props.state.routeNames.filter(
              // To hide single option
              (routeName) => {
                routeName !== "Home";
              }
            ),
            routes: props.state.routes.filter((route) => route.name !== "Home"),
          },
        };
        return <CustomDrawerContent {...filteredProps} />;
      }}
    >
      <Drawer.Screen options={{ swipeEnabled: false}} name="Home" component={AppStack} />
      {/* <Drawer.Screen name="Add" component={AddStack} /> */}
    </Drawer.Navigator>
  );
};
export default MyDrawer;
