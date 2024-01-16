import React, { useMemo, useState,useRef } from "react";
import { View, ScrollView, TouchableOpacity, Share, Platform,Modal,PermissionsAndroid,Image } from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import { useTheme } from "@react-navigation/native";
import Lottie from "lottie-react-native";
import CustomButton from "../../components/customButton";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { hp, wp } from "../../utilis/dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import CameraRoll from "@react-native-community/cameraroll";
import share from "react-native-share";
import ViewShot, { captureRef } from "react-native-view-shot";
import Feather from "react-native-vector-icons/Feather";
import { showMessage } from "react-native-flash-message";
import QRCode from "react-native-qrcode-svg";
import  DeviceInfo  from "react-native-device-info";

const TransactionAdded = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const { message, draft, notDraft, escrow_data } = route.params;
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [visible, setVisible] = useState(false);
  const viewRef = useRef();
  const viewShot = useRef(null);
  const qrCode = `https://escrow2d.meiladigital-sa.com/backend/user/escrow/details/${escrow_data?.escrow_id}`;
  let qrCodeEncoded =
  Platform.OS === "ios" ? qrCode : encodeURIComponent(qrCode);

let qrCodeImage =
  "https://chart.googleapis.com/chart?cht=qr&chl=" +
  qrCodeEncoded +
  `&chs=${i18n.language == "en" ? "285" : "500"}&choe=UTF-8&chld=L|2`;

  const handleShareSocial = async () => {
    console.log("share");
    try {
      const result = await Share.share({
        title: "Transaction link",
        message:
          "The transaction link on escrow application " +
          escrow_data?.escrow_url,
        url: escrow_data?.escrow_url,
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

  async function saveQr() {
    // if (Platform.OS === "android" && !(await hasAndroidPermission()) && DeviceInfo.getSystemVersion()<13) {
    //   return;
    // }
    viewShot.current.capture().then(async(uri) => {
      CameraRoll.save(uri)
        .then((res) => {
          if (res.length) {
            showMessage({
              message: t("profileScreens.qrCodeSaved"),
              type: "success",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          } else {
            showMessage({
              message: t("profileScreens.qrCodeNotSaved"),
              type: "danger",
              titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
            });
          }
        })
        .catch((e) => {
          showMessage({
            type: "danger",
            message: t("profileScreens.permissionRequired"),
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        });
     });
    return
   
    const uri = await captureRef(viewRef, {
      format: "png",
      quality: 0.8,
    });

    CameraRoll.save(uri)
      .then((res) => {
        if (res.length) {
          showMessage({
            message: t("profileScreens.qrCodeSaved"),
            type: "success",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        } else {
          showMessage({
            message: t("profileScreens.qrCodeNotSaved"),
            type: "danger",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((e) => {
        showMessage({
          type: "danger",
          message: t("profileScreens.permissionRequired"),
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  }

  const shareImage = async () => {
    viewShot.current.capture().then(uri => {
      share.open({
        title: "QR Code",
        message: "Any message",
        url: uri,
        subject: "Code" //  for email
      });
     });
    return
    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 0.8,
      });

      const shareResponse = await share.open({ url: uri });
    } catch (error) {
      console.log("error", error);
    }
  };

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(permission);
    return status === "granted";
  };

  const QrCodeRender=()=>{
    return(
      <Modal
      transparent={true}
      animationType="slide"
      visible={visible}
      onRequestClose={() => setVisible(!visible)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modal2}>
          <View style={styles.modalHeader}>
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
          {/* <ViewShot ref={viewRef} options={{ format: "jpg", quality: 0.9 }}>
            <Image
              source={{
                uri: qrCodeImage,
              }}
              style={{
                alignSelf: "center",
                width: 250,
                height: 250,
              }}
              resizeMode="cover"
            />
          </ViewShot> */}
          <ViewShot ref={viewShot} options={{ width: 100, height: 100, format: "jpg", quality: 1.0 }}>
           <QRCode
           size={wp(40)}
           value={qrCode}
           logoSize={40}
           logo={require('../../assets/newLogo.png')}
           logoBackgroundColor='transparent'/>
          </ViewShot>
          <View style={styles.row}>
            <TouchableOpacity onPress={() => shareImage()}>
              <Feather name="share-2" size={23} color={COLORS.babyBlue2} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => saveQr()}>
              <Feather name="download" size={23} color={COLORS.babyBlue2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    )
  }
  return (
    <ScrollView
      scrollEnabled={true}
      style={{ flex: 1, backgroundColor: COLORS.bg }}
    >
      <View style={styles.headerStyle2}>
        <Lottie
          style={styles.logo}
          source={require("../../assets/lottie/paymentDoneLottie.json")}
          autoPlay
          loop={false}
        />
        <CustomText
          color={COLORS.black}
          size={20}
          text={message ? message : t("reviewTransaction.done")}
          style={styles.BackTxt3}
        />
        {notDraft && (
          <>
            <View style={styles.shareContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("PDF", {
                    link: escrow_data?.agreement_url,
                    done: true,
                  });
                }}
                style={{flexDirection:'row',flex:2}}
              >
                 <Ionicons
                    name="eye"
                    size={25}
                    color={COLORS.header}
                  />
                <CustomText
                  color={COLORS.header}
                  size={16}
                  text={t("transactionAdded.previewAgg")}
                  // style={styles.BackTxt3}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShareSocial} 
              style={{flexDirection:'row',flex:1.2}}>
              <Ionicons
                    name="share-social-outline"
                    size={25}
                    color={COLORS.header}
                  />
                <CustomText
                  color={COLORS.header}
                  size={16}
                  text={t("transactionAdded.share")}
                  // style={styles.BackTxt3}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.shareContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("home", {
                    screen: "TransactionDetails",
                    params: {
                      el: { id: escrow_data?.escrow_id, toChat: true },
                      from:'Review'
                    },
                  });
                }}
                style={{flexDirection:'row',flex:2,}}
              >
                <Ionicons
                    name="chatbubbles-outline"  //people-circle-outline
                    size={25}
                    color={COLORS.header}
                  />
                <CustomText
                  color={COLORS.header}
                  size={16}
                  text={t("transactionAdded.contact")}
                  // style={styles.BackTxt3}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {setVisible(true)}}
                style={{flexDirection:'row',flex:1.2,}}
              >
               
              <Ionicons
              style={styles.qrCodeIcon}
              color={COLORS.header}
              size={25}
              name="qr-code-outline"
            />
                <CustomText
                  color={COLORS.header}
                  size={16}
                  text={t("transactionAdded.parCode")}
                  // style={styles.BackTxt3}
                />
              </TouchableOpacity>
            </View>
            {/* referenceNumber */}
            <View style={styles.transactionInfo2}>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={t("transactionAdded.referenceNumber")}
                  // style={styles.accordionFinalTitle}
                />
              </View>
              <View style={styles.accordionBodyTitleCont}>
                <CustomText
                  color={COLORS.statisticsTitle}
                  size={12}
                  text={escrow_data?.escrow_number}
                  // style={styles.accordionTitle}
                />
              </View>
            </View>
          </>
        )}
        <CustomButton
          color={COLORS.blue}
          onPress={
            draft
              ? () => {
                  // dispatch(storeStackValue(false));
                  // navigation.navigate("home", { screen: "Transactions" })
                  // navigation.navigate("plus", { screen: "EscrowType" })
                  // navigation.reset({
                  //   index: 0,
                  //   routes: [{ name: "EscrowType" }],
                  // });
                  navigation.navigate("home", { screen: "Transactions" });
                  //  navigation.popToTop()
                }
              : () => navigation.navigate("home", { screen: "Transactions" })
          }
          text={t("nafathVerified.con")}
          containerStyle={[styles.btn2, { marginTop: hp(5) }]}
        />
      </View>
      {QrCodeRender()}
    </ScrollView>
  );
};
export default TransactionAdded;
