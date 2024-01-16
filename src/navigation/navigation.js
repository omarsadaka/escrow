import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  TouchableOpacity,
  SafeAreaView,
  View,
  Linking,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  PermissionsAndroid,
  BackHandler,
} from "react-native";
import {
  createNavigationContainerRef,
  useNavigation,
} from "@react-navigation/native";
import Lottie from "lottie-react-native";
import messaging from "@react-native-firebase/messaging";
// import RNIsDeviceRooted from 'react-native-isDeviceRooted';
import JailMonkey from 'jail-monkey'
import RNExitApp from 'react-native-exit-app';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { NavigationContainer, StackActions } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { COLORS } from "../constants/colors";
import { hp, width, wp } from "../utilis/dimensions";
import SplashScreen from "../screens/SplashScreen/index";
import Onboarding from "../screens/OnBoarding/index";
import Login from "../screens/Login/index";
import Register from "../screens/Register/index";
import AccountCreatedScreen from "../screens/AccountCreated/index";
import AccountVerification from "../screens/AccountVerification/index";
import AccountAuthentication from "../screens/AccountAuthentication/index";
import FaceID from "../screens/FaceID/index";
import Fingerprint from "../screens/Fingerprint/index";
import Dashboard from "../screens/Home";
import TransactionsListScreen from "../screens/Transactions";
import Settings from "../screens/Setting/Settings";
import Statement from "../screens/Statement";
import Accounts from "../screens/Accounts&Card/index";
import Profile from "../screens/Profile";
import AgreementScreen from "../screens/Agreement/index";
import AddScreen from "../screens/Add/index";
import TransactionDetails from "../screens/TransactionDetails";
import PaymentScreen from "../screens/Payment/index";
import WireTransafer from "../screens/Payment/WireTransafer";
import CreditCard from "../screens/Payment/CreditCard";
import VerificationScreen from "../screens/Payment/Verification";
import PaymentSuccessfully from "../screens/Payment/PaymentSuccessfully";
import LinkAgreementScreen from "../screens/LinkAgreement";
import chatBot from "../screens/chatBot";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import ResetPasswordScreen from "../screens/forgetPassword/resetPassword";
import TourDetails from "../screens/TourDetails";
import SendOTPScreen from "../screens/forgetPassword/sendOTP";
import { setWelcome, isValidMpin } from "../redux/actions/authentication";
import ViewScreen from "../screens/Add/view";
import styles from "../screens/SplashScreen/styles";
import UpdateBasicInfo from "../screens/UpdateBasicInfo";
import ChangeEmail from "../screens/ChangeEmail";
import VerifyEmail from "../screens/VerifyEmail";
import MyDrawer from "../screens/sideMenue/sideMenue";
import NewTransactionRoleScreen from "../screens/Add/changeRole";
import ReviewTransaction from "../screens/ReviewTransaction";
import FAQScreen from "../screens/ContactUs/FAQ";
import ALLFAQDataScreen from "../screens/ContactUs/ALLFAQData";
import VerificationOptions from "../screens/Profile/NafathOthentication";
import IDVerified from "../screens/Profile/NafathOthentication/IDVerified";
import KYCManualVerification from "../screens/Profile/NafathOthentication/KYCVerification";
import TransactionAdded from "../screens/ReviewTransaction/transactionAdded";
import QuickLoginScreen from "../screens/QuickLogin/login";
import ModalWrapper from "../modals/index";
import Notification from "../screens/Notification";
import WithdrawLog from "../screens/withdraw/withdrawLog";
import NewWithdraw from "../screens/withdraw/newWithdraw";
import WithdrawPreview from "../screens/withdraw/withdrawPreview";
import LoadDepositMethods from "../screens/Deposit/LoadMethods";
import CreateDepositRequest from "../screens/Deposit/CreateDeposit";
import DepositHistory from "../screens/Deposit/Hisory";
import UpdateUserProfile from "../screens/UpdateUserProfile";
import OneSignal from "react-native-onesignal";
import GoogleAuthentication from "../screens/GoogleAuthentication";
import Verify2FA from "../screens/Verify2FA";
import EscrowReview from "../screens/EscrowReview";
import CustomText from "../components/customText";
import ApplicationPin from "../screens/ApllicationPin";
import VerifyPIN from "../screens/VerifyPIN";
import WithdrawDynamicForm from "../screens/withdraw/WithdrawDynamicForm";
import ResetMPIN from "../screens/VerifyPIN/ResetMPIN";
import DepositDynamicForm from "../screens/Deposit/CreateDeposit/DepositDynamicForm";
import DepositPreview from "../screens/Deposit/CreateDeposit/previewDeposit";
import {
  handleSaveAsDraftEnded,
  handleSaveAsDraftLoading,
  handleSaveAsDraftValue,
  handleSaveAsDraftWhere,
  makeReloadTransactions,
  storeStackValue,
} from "../redux/actions/user";
import CustomAlert from "../components/CustomAlert";
import DeviceInfo from "react-native-device-info";
import SupportTicketsHistory from "../screens/ContactUs/support-tickets/ticketsHistory";
import NewSupportTicket from "../screens/ContactUs/support-tickets/new-ticket";
import EscrowCalculator from "../screens/EscrowCalculator";
import SupportTicketDetails from "../screens/ContactUs/support-tickets/ticket-details";
import { ENDPOINTS, getBaseURL } from "../constants/API";
import { FirebaseMessagingTypes } from "@react-native-firebase/messaging";
import PushNotification from "react-native-push-notification";
import { firebase } from "@react-native-firebase/app";
import BannedProducts from "../screens/BannedProducts";
import RatingScreen from "../screens/Rating";
import EscrowType from "../screens/Add/EscrowType";
import ShortEscrow from "../screens/Add/ShortEscrow";
import PDF from "../screens/Add/PDF";
import PDFViewer from "../screens/PDFViewer";
import NetInfo from "@react-native-community/netinfo";
import NoInternetScreen from "../screens/NoInternet";
import PayWebView from "../screens/PayWebView";
import TourScreen1 from "../screens/IntroductionTour/TourScreen1";
import TourScreen2 from "../screens/IntroductionTour/TourScreen2";
import TourScreen3 from "../screens/IntroductionTour/TourScreen3";
import TourScreen4 from "../screens/IntroductionTour/TourScreen4";
import TourScreen5 from "../screens/IntroductionTour/TourScreen5";
import TourScreen6 from "../screens/IntroductionTour/TourScreen6";
import RegisterValidateMobile from "../screens/Register/validatePhone";
import VerifyRegisterMobile from "../screens/VerifyRegisterMobile";
import SideMenu from "../screens/SideMenu";
import NewsDetails from "../screens/NewsDetails";
import TechnicalSupport from "../screens/technicalSupport";
import ChooseLanguage from "../screens/ChooseLanguage/index";
import Articles from "../screens/Articles";
import ArticleDetails from "../screens/ArticleDetails";
import GetFreeBalance from "../screens/GetFreeBalance";
import Geolocation from 'react-native-geolocation-service';
import VerifyOtpFastLogin from "../screens/VerifyOtpFastLogin";
import AddCard from "../screens/AddCard";
import NotificationPermission from "../screens/NotificationPermission";
import IdmanContacts from "../screens/IdmanContacts";
import WalletRecord from "../screens/WalletRecord";
import { showMessage } from "react-native-flash-message";
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Sound from 'react-native-sound';

export const navigationRef = createNavigationContainerRef();
const Stack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();
const PERSISTENCE_KEY = "NAVIGATION_STATE";



export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

const InternetStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="NoInternetScreen"
        component={NoInternetScreen}
      />
    </Stack.Navigator>
  );
};
const PINStack = () => {
  const { i18n, t } = useTranslation();
  const { colors: COLORS } = useTheme();
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="VerifyPIN"
        component={VerifyPIN}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("loginScreen.resetPinHeader"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
        name="ResetMPIN"
        component={ResetMPIN}
      />
    </Stack.Navigator>
  );
};
const AuthenticationStack = () => {
  const { i18n, t } = useTranslation();
  const { colors: COLORS } = useTheme();
  const [onBoarding, setOnBoarding] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [isGranted, setIsGranted] = useState(false);
  const [loading, setLoading] = useState(true);


  const getSavedOnBoarding = async () => {
    try {
      const value = await AsyncStorage.getItem("ONBOARDING");
      if (value !== null) {
        // value previously stored
        setOnBoarding(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  const getSavedShowLang = async () => {
    try {
      const value = await AsyncStorage.getItem("HideChooseLang");
      if (value !== null) {
        setShowLang(true);
      }
    } catch (e) {
      // error reading value
    }
  };

  const checkPermission= async()=>{
    if(Platform.OS=='android'){
      const granted_android = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS );
      if(granted_android){
        setIsGranted(true)
      }
    }else{
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        if (enabled) {
          setIsGranted(true)
        }
    }
  }
  
  const stopLoading=()=>{
    setTimeout(() => {
      setLoading(false)
    }, 700);
  }
  useEffect(() => {
    checkPermission()
    getSavedShowLang()
    getSavedOnBoarding();
    stopLoading()
  }, []);
  return (
    <>
    {loading?
      <Lottie
      style={{
        width: wp(20),
        height: hp(20),
        alignSelf:'center',
        marginTop:'30%'
      }}
      source={require("../assets/lottie/loadingLottie.json")}
      autoPlay
      loop={loading}
    />
      :
    <Stack.Navigator
    // initialRouteName={onBoarding ? "Login":"SplashScreen"}
    >
      {Platform.OS=='android'?
       (DeviceInfo.getSystemVersion()>=13&&isGranted)?
       null
       :
       <>
         <Stack.Screen
           options={{ headerShown: false }}
           name="NotificationPermission"
           component={NotificationPermission}
         />
       </>
      :
      isGranted?
        null:
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="NotificationPermission"
            component={NotificationPermission}
          />
        </>
     }
     {showLang?
      null
      :
        <>
         <Stack.Screen
            options={{ headerShown: false }}
            name="SplashScreen"
            component={SplashScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="ChooseLanguage"
            component={ChooseLanguage}
          />
        </>
     }
     {onBoarding?
      null
      :
        <>
          <Stack.Screen
            options={{ headerShown: false }}
            name="Onboarding"
            component={Onboarding}
          />
        </>
      }


      <Stack.Screen
        options={{ headerShown: false }}
        name="Login"
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Verify2FA"
        component={Verify2FA}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VerifyOtpFastLogin"
        component={VerifyOtpFastLogin}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Register"
        component={Register}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AccountCreated"
        component={AccountCreatedScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("loginScreen.accAuth"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
        name="AccountVerification"
        component={AccountVerification}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AccountAuthentication"
        component={AccountAuthentication}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="FaceID"
        component={FaceID}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Fingerprint"
        component={Fingerprint}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UpdateUserProfile"
        component={UpdateUserProfile}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="resetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: true,
          title: t("loginScreen.forgetPassword2"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />

      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen1"
        component={TourScreen1}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen2"
        component={TourScreen2}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen3"
        component={TourScreen3}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen4"
        component={TourScreen4}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen5"
        component={TourScreen5}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourScreen6"
        component={TourScreen6}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />
      <Stack.Screen
        // options={{headerShown: false}}
        name="TourDetails"
        component={TourDetails}
        options={{
          headerShown: true,
          title: t("loginScreen.introTour"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
      />

      <Stack.Screen
        options={{
          headerShown: true,
          title: t("loginScreen.forgetPassword2"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
        name="forgetPassword"
        component={SendOTPScreen}
      />
      <Stack.Screen
        options={{
          headerShown: true,
          title: t("loginScreen.quickSignIn"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
        name="quickLogin"
        component={QuickLoginScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="RegisterValidateMobile"
        component={RegisterValidateMobile}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="VerifyRegisterMobile"
        component={VerifyRegisterMobile}
      />
       <Stack.Screen
        options={{
          headerShown: true,
          title: t("technicalSupport"),
          headerTintColor: COLORS.black,
          headerStyle: {
            backgroundColor: COLORS.inputBackGround,
          },
        }}
        name="TechnicalSupport"
        component={TechnicalSupport}
      />
    </Stack.Navigator>
   }
  </>
  );
};
const ProfileStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={Profile}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UpdateBasicInfo"
        component={UpdateBasicInfo}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ChangeEmail"
        component={ChangeEmail}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VerifyEmail"
        component={VerifyEmail}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="IDVerification"
        component={VerificationOptions}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="IDVerified"
        component={IDVerified}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="KYCManualVerification"
        component={KYCManualVerification}
      />
    </Stack.Navigator>
  );
};
const HomeStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Home"
        component={Dashboard}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Transactions"
        component={TransactionsListScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="TransactionDetails"
        component={TransactionDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Statement"
        component={Statement}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Accounts"
        component={Accounts}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="AddCard"
        component={AddCard}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Agreement"
        component={AgreementScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Payment"
        component={PaymentScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="wireTransafer"
        component={WireTransafer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CreditCard"
        component={CreditCard}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="VerificationScreen"
        component={VerificationScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PaymentSuccessfully"
        component={PaymentSuccessfully}
      />
      {/* <Stack.Screen
        options={{ headerShown: false }}
        name="chatBot"
        component={chatBot}
      /> */}
      {/* <Stack.Screen
        options={{ headerShown: false }}
        name="FAQ"
        component={FAQScreen}
      /> */}
      <Stack.Screen
        options={{ headerShown: false }}
        name="AllFAQData"
        component={ALLFAQDataScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SupportTicketsHistory"
        component={SupportTicketsHistory}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="NewSupportTicket"
        component={NewSupportTicket}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="SupportTicketDetails"
        component={SupportTicketDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Notification"
        component={Notification}
      />
       <Stack.Screen
        options={{ headerShown: false }}
        name="NewsDetails"
        component={NewsDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WithdrawLog"
        component={WithdrawLog}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="NewWithdraw"
        component={NewWithdraw}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WithdrawDynamicForm"
        component={WithdrawDynamicForm}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WithdrawPreview"
        component={WithdrawPreview}
      />

      <Stack.Screen
        options={{ headerShown: false }}
        name="LoadDepositMethods"
        component={LoadDepositMethods}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="CreateDepositRequest"
        component={CreateDepositRequest}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="DepositHistory"
        component={DepositHistory}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="DepositPreview"
        component={DepositPreview}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="DepositDynamicForm"
        component={DepositDynamicForm}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="EscrowReview"
        component={EscrowReview}
      />
      {/* <Stack.Screen
        options={{ headerShown: false }}
        name="EscrowCalculator"
        component={EscrowCalculator}
      /> */}
      {/* <Stack.Screen
        options={{ headerShown: false }}
        name="BannedProducts"
        component={BannedProducts}
      /> */}
      {/* <Stack.Screen
        options={{ headerShown: false }}
        name="RatingScreen"
        component={RatingScreen}
      /> */}
      <Stack.Screen
        options={{ headerShown: false }}
        name="PDFViewer"
        component={PDFViewer}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PayWebView"
        component={PayWebView}
      />
    </Stack.Navigator>
  );
};
const SettingsStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Settings"
        component={Settings}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GoogleAuthentication"
        component={GoogleAuthentication}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ApplicationPin"
        component={ApplicationPin}
      />
    </Stack.Navigator>
  );
};
const AddStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="EscrowType"
      screenOptions={{ unmountOnBlur: true }}
    >
      <Stack.Screen
        options={{ headerShown: false, unmountOnBlur: true }}
        name="EscrowType"
        component={EscrowType}
      />
      <Stack.Screen
        options={{ headerShown: false, unmountOnBlur: true }}
        name="ShortEscrow"
        component={ShortEscrow}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="PDF"
        component={PDF}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="add"
        component={AddScreen}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name="viewNewTransactionItems"
        component={ViewScreen}
      />
      <Stack.Screen
        name="linkAgreement"
        component={LinkAgreementScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="changeRole"
        component={NewTransactionRoleScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ReviewTransaction"
        component={ReviewTransaction}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TransactionAdded"
        component={TransactionAdded}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
const MoresStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="SideMenu"
        component={SideMenu}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="EscrowCalculator"
        component={EscrowCalculator}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="chatBot"
        component={chatBot}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="Articles"
        component={Articles}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="ArticleDetails"
        component={ArticleDetails}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="GetFreeBalance"
        component={GetFreeBalance}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="IdmanContacts"
        component={IdmanContacts}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="WalletRecord"
        component={WalletRecord}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="FAQ"
        component={FAQScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="RatingScreen"
        component={RatingScreen}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="BannedProducts"
        component={BannedProducts}
      />
    </Stack.Navigator>
  );
};

export const AppStack = () => {
  const { colors: COLORS } = useTheme();
  const { stackValue, saveDraftEnded, saveDraftWhere } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const nav = useNavigation();
  const { i18n, t } = useTranslation();
  const [route, setRoute] = useState("");
  const [navigate, setNavigate] = useState(false);
  const [show, setShow] = useState(false);

  const handleModal = () => {
    setShow(false);
    setNavigate(true);
  };
  const handleCloseModal = () => {
    setShow(false);
    setNavigate(false);
  };
  useEffect(() => {
    if (navigate || (saveDraftEnded && saveDraftWhere == "bottomBar")) {
      dispatch(storeStackValue(false));
      nav.navigate(route);
      setNavigate(false);
      if (saveDraftEnded) {
        dispatch(handleSaveAsDraftEnded(false));
        dispatch(handleSaveAsDraftValue(false));
      }
      setShow(false);
      dispatch(handleSaveAsDraftWhere(""));
    }
  }, [navigate, route, saveDraftEnded]);
  return (
    <>
      <CustomAlert
        type={'error'}
        show={show}
        header={t("reviewTransaction.w")}
        body={t("stackError")}
        action1={handleModal}
        btn1={t("reviewTransaction.ok")}
        action2={handleCloseModal}
        btn2={t("cancle")}
        oneBtn={false}
        saveAsDraft={true}
        saveDraftText={"bottomBar"}
      />
      <Tabs.Navigator
        initialRouteName="home"
        screenOptions={({ route, focused }) => ({
          headerShown: false,
          tabBarActiveTintColor: COLORS.header,
          tabBarInactiveTintColor: COLORS.footerIcon,
          tabBarStyle: {
            backgroundColor: COLORS.footer,
            // paddingBottom: hp(1.6),
            height: hp(9),
            borderTopColor: COLORS.footer,
            // borderRadius: hp(2),
          },
        })}
      >
        <Tabs.Screen
          name="home"
          component={HomeStack}
          listeners={{
            tabPress: (e) => {
              if (stackValue == true) {
                setRoute("home");
                setShow(true);
                e.preventDefault();
              }
            },
          }}
          options={{
            unmountOnBlur: false,
            title: ({ color, focused }) => (
              <CustomText
                color={COLORS.footerIcon}
                size={width * 0.022}
                text={t("home")}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused ? <View style={[style.indicator,{backgroundColor: COLORS.blue,}]} /> : null}
                <MaterialCommunityIcons
                  name="home-variant-outline"
                  size={33}
                  color={focused ? COLORS.header : COLORS.footerIcon}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          component={ProfileStack}
          listeners={{
            tabPress: (e) => {
              if (stackValue == true) {
                setRoute("profile");
                setShow(true);
                e.preventDefault();
              }
            },
          }}
          options={{
            unmountOnBlur: false,
            title: ({ color, focused }) => (
              <CustomText
                color={COLORS.footerIcon}
                size={width * 0.022}
                text={t("profile")}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused ? <View style={[style.indicator,{backgroundColor: COLORS.blue,}]} /> : null}
                <EvilIcons
                  name="user"
                  size={40}
                  color={focused ? COLORS.header : COLORS.footerIcon}
                />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="plus"
          component={AddStack}
          listeners={{
            tabPress: (e) => {
              if (stackValue == true) {
                e.preventDefault();
              } else {
                // navigationRef.navigate("plus", {
                //   screen: "EscrowType",
                // });
                 navigationRef.navigate("plus", {
                  screen: "ShortEscrow",
                  params:{
                    UserType: t("shortEscrow.buyer")
                  }
                });
                dispatch(storeStackValue(true));
              }
            },
          }}
          options={{
            unmountOnBlur: true,
            // tabBarActiveBackgroundColor: 'white',
            title: ({ color, focused }) => (
              <CustomText
                color={COLORS.blue}
                size={width * 0.022}
                text={t("add")}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={style.homeCon}>
                <View style={[style.home,{backgroundColor: COLORS.blue}]}>
                  <FontAwesome
                    name="plus"
                    size={30}
                    // color={focused ? COLORS.header : COLORS.footerIcon}
                    color={COLORS.white}
                  />
                </View>
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          component={SettingsStack}
          listeners={{
            tabPress: (e) => {
              if (stackValue == true) {
                setRoute("settings");
                setShow(true);
                e.preventDefault();
              }
            },
          }}
          options={{
            unmountOnBlur: false,
            title: ({ color, focused }) => (
              <CustomText
                color={COLORS.footerIcon}
                size={width * 0.022}
                text={t("setting")}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused ? <View style={[style.indicator,{backgroundColor: COLORS.blue,}]} /> : null}
                <Ionicons
                  name="settings-outline"
                  size={26}
                  color={focused ? COLORS.header : COLORS.footerIcon}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="MoresStack"
          component={MoresStack}
          listeners={{
            tabPress: (e) => {
              if (stackValue == true) {
                setRoute("MoresStack");
                setShow(true);
                e.preventDefault();
              }
            },
          }}
          options={{
            unmountOnBlur: false,
            title: ({ color, focused }) => (
              <CustomText
                color={COLORS.footerIcon}
                size={width * 0.022}
                text={t("more")}
              />
            ),
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                {focused ? <View style={[style.indicator,{backgroundColor: COLORS.blue,}]} /> : null}
                <EvilIcons
                  name="navicon"
                  size={40}
                  color={focused ? COLORS.header : COLORS.footerIcon}
                />
              </View>
            ),
          }}
        />
      </Tabs.Navigator>
    </>
  );
};


const LightTheme = (colorTheme)=>{
  return{
    dark: false,
    colors: {
      bg: "#F6F6F6",
      white: "white",
      black: "black",
      babyBlue: "#31D0EA",
      babyBlue2: "#2699FB",
      babyBlue3: "#9BD0FD",
      babyBlue4: "#97CCF9",
      blue: colorTheme&&colorTheme!=null? colorTheme :"#09518E" ,  //"#09518E"
      darkBlue: "#29304D",
      green: "#34C759",
      grey: "grey",
      lightGrey: "#707070",
      lightGrey2: "#F6F6F6",
      red: "red",
      monbg: "#F8F7FB",
      header: colorTheme&&colorTheme!=null? colorTheme :'#09518E',  //"#09518e"
      primaryTxt: "#29304D",
      statisticsTitle: "#666666",
      transactionsTitle: "#b2b2b2",
      transactionsSuccessStatus: "#5de02d",
      yellow: "#FFC839",
      pink: "#FF6653",
      operationsItemTxt: "#3a3a3a",
      progressBar: "#FFF6F5",
      transactionsInfoBg: "#f4f4f8",
      neonGreen: "#5DE02D",
  
      cardBlue: "#25659B",
      cardGreen: "#259B88",
      disputeInfoTxt: "#ffca4a",
      description: "#999",
      darkPg: "white",
      backGround: "#F8F7FB",
      //Home
      headerContent: "white",
      monText: "#09518E",
      monCurr: "white",
      operationsIcons: "#4f62c0",
      operationsCard: "#FFFFFF",
      //transactions
      transactionsCard: "white",
      tabTxt: "#25659b",
      activeTabTxt: "white",
      transactionsItemName: "#09518e",
      agreementBg: "#f5f5f5",
      settlementDes: "#f4f4f8",
      ModalBg: "white",
      settTitle: "#09518E",
      field: "#f0f0f0",
      inputBackGround: "white",
      babyBack: "#9BD0FD",
      headerText: "#09518e",
      footer: "white",
      footerIcon: "gray",
      inputBackGround2: "white",
      inputBackGround3: "white",
      grayColor: "grey",
      randomDisc: "#eee",
      details: "#ddd",
      backInput: "#ccc",
      proTxt: "#999",
      aggColor: "white",
      loginTab: "#666666",
    },
  };
}

const DarkTheme = {
  dark: true,
  colors: {
    white: "#071628",
    black: "white",
    babyBlue: "#31D0EA",
    babyBlue2: "#2699FB",
    babyBlue3: "#9BD0FD",
    babyBlue4: "#2699FB",
    blue: "#09518E",
    darkBlue: "white",
    green: "#34C759",
    grey: "grey",
    lightGrey: "#fff",
    lightGrey2: "#071628",
    red: "white",
    monbg: "#2a3746",
    bg: "#071628",
    header: "#09518e",
    primaryTxt: "white",
    statisticsTitle: "white",
    transactionsTitle: "gray",
    transactionsSuccessStatus: "#5de02d",
    yellow: "#FFC839",
    pink: "#FF6653",
    operationsItemTxt: "white",
    progressBar: "#FFF6F5",
    transactionsInfoBg: "grey",
    neonGreen: "#5DE02D",

    cardBlue: "#25659B",
    cardGreen: "#259B88",
    disputeInfoTxt: "#ffca4a",
    description: "#09518e",
    darkPg: "#071628",
    backGround: "#071628",
    field: "#141414",
    inputBackGround: "#2a3746",
    babyBack: "#2a3746",
    headerText: "#fff",
    footer: "#0d2b4e",
    footerIcon: "white",
    inputBackGround2: "#8f959f",
    inputBackGround3: "#2b3759",
    grayColor: "#ccc",
    //Home
    headerContent: "white",
    monText: "white",
    monCurr: "white",
    operationsIcons: "#4F62C0",
    operationsCard: "#0D2A4D",
    // transactions
    transactionsCard: "#2a3746",
    tabTxt: "white",
    activeTabTxt: "white",
    transactionsItemName: "white",
    agreementBg: "#25659b",
    settlementDes: "#09518e",
    ModalBg: "#071628",
    settTitle: "white",
    randomDisc: "#8f959f",
    details: "#222",
    backInput: "#444",
    proTxt: "#999",
    aggColor: "#25659b",
    loginTab: "#aaa",
  },
};

const MainNavigation = () => {
  const [baseURL, setBaseURL] = useState(null);
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, []);
  const [theme, setTheme] = useState("light");
  const [colorTheme, setColorTheme] = useState("#09518E");
  const { stackValue, logoutValue } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { i18n, t } = useTranslation();
  const [isReady, setIsReady] = useState(false);
  const [initialState, setInitialState] = useState();
  const [changeLang, setChangeLang] = useState("");
  const [isToken, setIsToken] = useState("");
  const [notificationAlert, setNotificationAlert] = useState({
    show: false,
    title: "",
    body: "",
    escrowId: "",
  });
  const [isConnected, setIsConnected] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const getSavedLang = async () => {
    try {
      const value = await AsyncStorage.getItem("@CACHED_LANG");
      const value2 = await AsyncStorage.getItem("ChangeLang");
      setChangeLang(value2);
      if (value !== null) {
        await i18n.changeLanguage(value);
      }
    } catch (e) {
      // error reading value
    }
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
  const getSavedColorTheme = async () => {
    try {
      const value = await AsyncStorage.getItem("COLORTHEME");
      if (value !== null) {
        // value previously stored
        setColorTheme(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  const getSavedCustomerID = async () => {
    try {
      const value = await AsyncStorage.getItem("CUSTOMER_ID");
      if (value !== null) {
        // value previously stored
        // dispatch(setWelcome());
      }
    } catch (e) {
      // error reading value
    }
  };
  const getPIN = async () => {
    const vPIN = await AsyncStorage.getItem("USER_PIN");
    const tok = await AsyncStorage.getItem("TOKEN");
    setIsToken(tok);
    vPIN == 1 && dispatch(isValidMpin(true));
    await AsyncStorage.setItem("ChangeLang", "2");
  };

  // Check if device is rooted or jailbroken.
  const isDeviceRootedOrLocked= async()=>{
    const isRooted = JailMonkey.isJailBroken()
    setIsLocked(isRooted)
  }

  const getCurrentLocation = async() => {
    if (Platform.OS == 'ios') {
      Geolocation.requestAuthorization();
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
       authorizationLevel: 'whenInUse',
     });
     const granted_ios = await request(
      Platform.select({
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        android: PERMISSIONS.ACCESS_FINE_LOCATION
      }),
    );
     if (granted_ios=='granted') {
       getLocation()
     } else {
      showMessage({
        message:t('allowLocationAlert'),
        type: 'info',
        titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
      });
     }
    }else{
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
     );
      const granted_android = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
      if (granted_android) {
        getLocation()
      } else {
        showMessage({
          message:t('allowLocationAlert'),
          type: 'info',
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      }
    }
    
   
  };

  const getLocation=()=>{
    Geolocation.getCurrentPosition(
      position => {
        console.log('getCurrentLocation', position);
        getDeviceInfo(position.coords.latitude,position.coords.longitude)
      },
      error => {
        console.log('asd', error.message);
        getDeviceInfo('','')
        // alert(error.message)
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        // timeout: 20000,
        // maximumAge: 0,
      },
    );
  }

  const getDeviceInfo=async(lat, lon)=>{
    DeviceInfo.getDeviceName().then(async(deviceName) => {
      const deviceInfo={
        hardware: deviceName,
        os: Platform.OS,
        os_release: DeviceInfo.getSystemVersion(),
        lat: lat?lat.toString():'',
        long: lon?lon.toString():''
      }
      console.log('deviceInfo', deviceInfo)
      await AsyncStorage.setItem('DeviceInfo', JSON.stringify(deviceInfo))
    });
  }

  useEffect(() => {
    isDeviceRootedOrLocked()
    // requestUserPermission()
    getSavedTheme();
    getSavedColorTheme()
    getSavedLang();
    getSavedCustomerID();
    getPIN();
    getCurrentLocation()
    handleNotification()
  }, []);




 const handleNotification=async()=> {
    messaging().onMessage(async (remoteMessage) => {
      console.log('remoteMessage', remoteMessage)
      PushNotification.localNotification({
        channelId: remoteMessage.ttl,
        messageId: remoteMessage.messageId,
        title: remoteMessage.notification.title, // (optional)
        message: remoteMessage.notification.body,
        vibrate: true,
        playSound: true,
        smallIcon:  "no_icon", 
        largeIcon: Platform.OS=='android'?remoteMessage.notification?.android?.smallIcon:'',
        // soundName: Platform.OS=='android'?remoteMessage.notification?.android?.sound:'',
        soundName:'sound.mp3'
      });
      setNotificationAlert({
        show: true,
        title: t("notificationAlertHeader"),
        body: `${remoteMessage.notification.title} \n ${remoteMessage.notification.body}`,
        escrowId: remoteMessage.data.escrowId,
      });
      playSound()
      dispatch(makeReloadTransactions());
    });
    PushNotification.setApplicationIconBadgeNumber(0)
  }

  const playSound= async()=>{
    const sound = await AsyncStorage.getItem("SoundEffect");
    if(sound =='on'){
      setTimeout(() => {
        var sound = new Sound("sound.mp3",Sound.MAIN_BUNDLE, (error) => {      
        });
        setTimeout(() => {
            sound.play((success) => {     
            });
       }, 100);
     }, 100);
    }
  }

  async function requestUserPermission() {
    if(DeviceInfo.getSystemVersion()>=13){
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      let fcm1 = await messaging().getToken();
      console.log('fcm token', fcm1);
    }
    handleNotification()
  }

//  const checkPermission = async () => {
//     const enabled = await messaging().hasPermission();
//     console.log('enabled', enabled)
//     if (enabled) {
//       getToken()
//       handleNotification()
//     } else {
//       console.log('user not has Permission');
//       requestPermission();
//     }
//   };

//  const requestPermission = async () => {
//     try {
//       await messaging().requestPermission();
//       getToken();
//     } catch (error) {
//       // User has rejected permissions
//       console.log('permission rejected');
//     }
//   };
 const getToken = async () => {
    if (Platform.OS == 'ios') {
      let ReceivedfcmToken = await messaging().getToken();
      if (ReceivedfcmToken) {
        console.log('ReceivedfcmToken:' + ReceivedfcmToken);
      }
    } else {
      PushNotification.configure({
        onRegister: async value => {
          console.log('device token ====== =====  ', value);         
        },
        popInitialNotification: false,
        requestPermissions: true,
      });
    }
  };
  const { welcome, validMpin } = useSelector((state) => state.authentication);
  const [apiVersion, setApiVersion] = useState(null);
  const [version, setVersion] = useState(null);
  const [noUpdate, setNoUpdate] = useState(false);
  const [show, setShow] = useState(false);
  const [promoMessage, setPromoMessage] = useState("");
  const [oneButton, setOneButton] = useState(false);
  const [updateLink, setUpdateLink] = useState(false);
  const [isLoop, setIsLoop] = useState(true);

  const getVersion = () => {
    let pkg = require("../../package.json");
    setVersion(pkg.version);
  };
  useEffect(() => {
    getVersion();
  }, []);

  useEffect(() => {
    const restoreState = async () => {
      try {
        const initialUrl = await Linking.getInitialURL();
        if (changeLang == "1") {
          setNoUpdate(true);
        }
        if (changeLang != "" && changeLang != "1" && baseURL) {
          fetch(baseURL + ENDPOINTS.generalSettings, {
            method: "GET",
            headers: {
              "X-Localization": i18n.language,
            },
          })
            .then((response) => response.json())
            .then(async (res) => {
              if (res.messages.success) {
                if (
                  res.data.general_setting.app_version.toString() == version
                ) {
                  setNoUpdate(true);
                } else {
                  Platform.OS == "ios"
                    ? setUpdateLink(res.data.general_setting.ios_url)
                    : setUpdateLink(res.data.general_setting.android_url);
                  setIsLoop(false);
                  if (res.data.general_setting.force_update == 1) {
                    //mandatory update
                    setPromoMessage(res.data.general_setting.update_message);
                    setOneButton(true);
                    if(!isLocked) setShow(true);
                  } else {
                    // not mandatory update
                    const storedVersion = await AsyncStorage.getItem(
                      "updateVersionNotMandatory"
                    );
                    if (
                      storedVersion &&
                      storedVersion == res.data.general_setting.app_version
                    ) {
                      setNoUpdate(true);
                    } else {
                      await AsyncStorage.setItem(
                        "updateVersionNotMandatory",
                        res.data.general_setting.app_version.toString()
                      );
                      setPromoMessage(res.data.general_setting.promo_message);
                      setOneButton(false);
                      if(!isLocked) setShow(true);
                    }
                  }
                }
              }
            })
            .catch((er) => {
              setNoUpdate(true);
            });
        }
        if (Platform.OS !== "web" && initialUrl == null) {
          // Only restore state if there's no deep link and we're not on web
          const savedStateString = await AsyncStorage.getItem(PERSISTENCE_KEY);
          const savedStateTime = await AsyncStorage.getItem(
            "NAVIGATION_STATE_TIME"
          );
          const state = savedStateString
            ? JSON.parse(savedStateString)
            : undefined;
          const time = savedStateTime ? savedStateTime : undefined;
          if (state !== undefined) {
            if (time !== undefined) {
              var startDate = new Date(time);
              var endDate = new Date();
              var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
              if (seconds < 15) {
                setInitialState(state);
              }
            }
          }
        }
      } finally {
        noUpdate && !isLocked && setIsReady(true);
      }
    };
    if (!isReady) {
      restoreState();
    }
  }, [isReady, baseURL, changeLang, noUpdate]);

  if (!isReady) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          backgroundColor: "white",
        }}
      >
        <Lottie
          style={{
            // alignSelf: "center",
            width: wp(30),
            height: hp(30),
            // marginVertical: hp(3),
          }}
          source={require("../assets/lottie/loadingLottie.json")}
          autoPlay
          loop={isLoop}
        />
        <CustomAlert
          type={'success'}
          show={show}
          header={t("updateHeader")}
          body={promoMessage}
          action1={() => {
            Linking.openURL(updateLink);
            // setShow(false);
          }}
          btn1={t("uu")}
          action2={() => {
            setIsReady(true);
            setShow(false);
          }}
          btn2={t("nn")}
          oneBtn={oneButton}
        />
         <CustomAlert
          type={'error'}
          show={isLocked}
          header={t("updateHeader")}
          body={t('rootedMessage')}
          action1={() => {
            RNExitApp.exitApp();
          }}
          btn1={t("OK")}
          oneBtn={true}
        />
      </View>
    );
  }

  return (
    <NavigationContainer
      initialState={initialState}
      onStateChange={(state) => {
        if (stackValue == false) {
          AsyncStorage.setItem(PERSISTENCE_KEY, JSON.stringify(state));
        }
      }}
      theme={theme === "dark" ? DarkTheme : LightTheme(colorTheme)}
      ref={navigationRef}
    >
      <SafeAreaView style={{ flex: 1 }}>
        {!isConnected ? (
          <InternetStack />
        ) : changeLang == "1" &&
          !logoutValue &&
          isToken &&
          initialState?.type &&
          initialState?.type == "drawer" ? (
          <MyDrawer navigation={navigationRef} />
        ) : validMpin ? (
          <PINStack />
        ) : welcome ? (
          <MyDrawer navigation={navigationRef} />
        ) : (
          <AuthenticationStack />
        )}

        <ModalWrapper navigation={navigationRef} />
        {/* notificationAlert */}
        <CustomAlert
          type={'success'}
          show={notificationAlert.show}
          header={notificationAlert.title}
          body={notificationAlert.body}
          action1={() => {
            setNotificationAlert({
              show: false,
              title: "",
              body: "",
              escrowId: "",
            });
            notificationAlert.escrowId.length > 0 &&
              navigationRef.navigate("TransactionDetails", {
                el: { id: notificationAlert.escrowId },
              });
          }}
          btn2={t("OK")}
          btn1={t("view")}
          action2={() => {
            setNotificationAlert({
              show: false,
              title: "",
              body: "",
              escrowId: "",
            });
          }}
          oneBtn={false}
        />
      </SafeAreaView>
    </NavigationContainer>
  );
};
const style = StyleSheet.create({
  home: {
    width: wp(15),
    height: wp(15),
    backgroundColor: COLORS.blue,
    borderRadius: wp(15) / 2,
    elevation: 3,
    justifyContent: "center",
    alignItems: "center",
    shadowOpacity: 0.2,
    shadowOffset: { height: 1, width: 1 },
  },
  homeCon: {
    width: wp(18),
    height: wp(18),
    backgroundColor: "#f5f5f5",
    marginTop: -hp(5),
    borderRadius: wp(18) / 2,
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: wp(12),
    height: 5,
    alignSelf: "center",
  },
});
export default MainNavigation;
