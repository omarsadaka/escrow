import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Share
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import { height, hp, wp } from "../../utilis/dimensions";
import { useTheme, useRoute } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import { useSelector, useDispatch } from "react-redux";
import CustomButton from "../../components/customButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import share from "react-native-share";

const GetFreeBalance = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [baseURL, setBaseURL] = useState("https://escrow2d.meiladigital-sa.com/backend/api/");
  const [username,setUserName] = useState('')
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    getUserInfo()
  }, [navigation, baseURL]);


  const handleShare = async () => {
    console.log("share");
    try {
      // const result = await Share.share({
      //   title: "Invetation link",
      //   message: t('sideMenu.getOff'),
      //   url: `${baseURL}${username}`
      // });
      // if (result.action === Share.sharedAction) {
      //   if (result.activityType) {
      //     // shared with activity type of result.activityType
      //   }
      // }
      share.open({
        title: "Invetation link",
        message: t('sideMenu.getOff')+'\n',
        url: `${baseURL}${username}`,
        subject: "Invetation link" //  for email
      });
    } catch (error) {
      alert(error.message);
    }
  };

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
          let dd = responseData.data.user;
          setUserName(dd?.username);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoading(false);
      });
  };

  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <View style={{ flex: 1, marginBottom:height*0.04}}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
        <ScrollView>
        <View style={styles.container}>
        <CustomText text={t(`sideMenu.inviteFriends`)} color={COLORS.header} size={17}/>

        <View style={styles.card}>
         <View style={{width:'100%',flexDirection:'row'}}>
           <CustomText text={t('sideMenu.give')} color={COLORS.black} size={17}/>
           <CustomText text={'10'+' '+t('dashboard.SAR')} color={COLORS.header} size={17} style={{marginHorizontal:wp(1)}}/>
           <CustomText text={t('sideMenu.take')} color={COLORS.black} size={17}/>
           <CustomText text={'10'+' '+t('dashboard.SAR')} color={COLORS.header} size={17} style={{marginHorizontal:wp(1)}}/>
         </View>
         <CustomText text={t(`sideMenu.everyFriend`)} color={COLORS.grey} size={13} style={{flex:1,textAlign:'left'}}/>
         <View style={{flexDirection:'row',marginTop:hp(3),marginHorizontal:wp(5)}}>
          <View style={{alignItems:'center'}}>
            <View style={styles.circle}>
              <Image source={require('../../assets/invite.png')} style={styles.image} resizeMode='contain' />
            </View>
            <View style={styles.line}/>
            <View style={styles.circle}>
              <Image source={require('../../assets/happy.png')} style={styles.image} resizeMode='contain' />
            </View>
            <View style={styles.line}/>
            <View style={styles.circle}>
              <Image source={require('../../assets/giftbox.png')} style={styles.image} resizeMode='contain' />
            </View>
          </View>
          <View style={{alignItems:'center',flex:1,marginHorizontal:wp(2)}}>
          <CustomText text={t(`sideMenu.inviteFriends`)} color={COLORS.grey} size={14}  style={{flex:1,textAlign:'left'}}/>
          <CustomText text={t(`sideMenu.inviteTitle1`)} color={COLORS.grey} size={14}  style={{flex:1,textAlign:'left',marginVertical: hp(7)}}/>
          <CustomText text={t(`sideMenu.inviteTitle2`)} color={COLORS.grey} size={14}  style={{flex:1,textAlign:'left'}}/>
          </View>
         </View>
         <CustomButton
              color={COLORS.blue}
              onPress={()=> handleShare()}
              // loading={loading}
              textSize={12}
              text={t("sideMenu.inviteFriends")}
              containerStyle={styles.btn}
            />
        </View>
         <View style={[styles.card,{flexDirection:'row'}]}>
           <View style={{flex:1,alignItems:'center'}}>
            <CustomText text={'0'} color={COLORS.black} size={15}/>
            <CustomText text={t('sideMenu.friendsWhoBuy')} color={COLORS.grey} size={13}/>
           </View>
           <View style={styles.line}/>
           <View style={{flex:1,alignItems:'center'}}>
            <CustomText text={'0'+' '+t('dashboard.SAR')} color={COLORS.black} size={15}/>
            <CustomText text={t('sideMenu.collectedBalance')} color={COLORS.grey} size={13}/>
           </View>
         </View>
         <CustomText text={t('sideMenu.inviteTitle3')} color={COLORS.grey} size={14} style={{marginTop: hp(2)}}/>
        </View>
        </ScrollView>  
        )}
      </View>
    </View>
  );
};
export default GetFreeBalance;
