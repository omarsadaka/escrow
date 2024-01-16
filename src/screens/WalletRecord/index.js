import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import { hp } from "../../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";


const WalletRecord = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");
  const [userData, setUserData] = useState(null);
  // const [data, setData] = useState(null);
  const data=[
    {title:'withdraw compaign offer', cost:'30 SAR', date:'26 November 2023', subTitle:'Finished at Saturday 25 November 2023', type:1},
    {title:'add compaign offer', cost:'30 SAR', date:'15 November 2023', subTitle:'Finished at Saturday 25 November 2023', type:2},
    {title:'withdraw compaign offer', cost:'80 SAR', date:'01 September 2023', subTitle:'Finished at Thursday 31 August 2023', type:1},
  ]
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, []);

  useEffect(() => {
    if (!baseURL) return;
    getUserInfo()
  }, [baseURL]);
 
  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
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
        if (responseData.data) {
          setUserData(responseData);
          setLoading(false);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const walletCharge=()=>{
    return(
     <View style={styles.walletCharge}>
       <View style={{alignItems:'center',flex:1}}>
       <Fontisto name="wallet" size={33} color={COLORS.operationsIcons}/>
       </View>
       <View style={{alignItems:'center',flex:1.5}}>
         <CustomText text={t('sideMenu.wallet')} color={COLORS.black} size={15}/>
         <CustomText text={userData?.data?.user?.balance +' '+ t('SAR')} color={COLORS.black} size={22} fontFamily='bold' />
       </View>
     </View>
    )
    
  }
  return (
    <ScrollView contentContainerStyle={styles.bannedContainer}>
      <CustomHeader navigation={navigation} />
      {loading ? (
        <ActivityIndicator color={COLORS.header} size={"large"} />
      ) : (
        <>
        {walletCharge()}
          {data && data.length > 0 ? (
            <>
              <View style={styles.screen}>
                {data.map((el, index) => (
                  <View style={styles.itemContainer}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      {el.type==1?
                      <Feather name="plus-circle" size={16} color={COLORS.green}/>
                      :
                      <Feather name="minus-circle" size={16} color={COLORS.red}/>}
                     <View style={{flex:1, alignItems:'flex-start',marginHorizontal:3}}>
                     <CustomText text={el.title} color={COLORS.black} size={15}/>
                     </View>
                     <CustomText text={el.cost} color={COLORS.red} size={18}/>
                    </View>
                    <View style={{marginTop: hp(2),alignItems:'flex-start'}}>
                    <CustomText text={el.date} color={COLORS.black} size={13}/>
                    <CustomText text={el.subTitle} color={COLORS.black} size={13}/>
                    </View>
                  </View>
                ))}
              </View>
            </>
          ) : (
            <CustomText
              text={t("contactUs.qasno")}
              color={COLORS.blue}
              size={20}
            />
          )}
        </>
      )}

      {/* <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      /> */}
    </ScrollView>
  );
};
export default WalletRecord;
