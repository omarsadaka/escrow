import React, { useEffect, useState, useMemo } from 'react';
import {
    ActivityIndicator,
  StyleSheet, TouchableOpacity, View,BackHandler
} from 'react-native';
import WebView from 'react-native-webview';
import {useRoute, useTheme} from '@react-navigation/native';
import { hp, wp } from '../../utilis/dimensions';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomText from '../../components/customText';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { useDrawerStatus } from "@react-navigation/drawer";
import moment from "moment";
import { ENDPOINTS2 , getBaseURL} from '../../constants/API';
import { showSimpleModal } from '../../redux/actions/modal';
import { useDispatch } from "react-redux";
import CircularProgress from 'react-native-circular-progress-indicator';

const PayWebView = ({navigation}) => {
  const { colors: COLORS } = useTheme();
  const route = useRoute();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {Url, EscrowID, BuyerID, CustomerID, StatusCode, El} = route?.params;
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const isDrawerOpen = useDrawerStatus() === "open";
  const [lastDate, setLastDate] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    getLastLogin()
  }, []);


  useEffect(() => {
    const backAction = async () => {
      // write code to handel navigation
      navigation.push('TransactionDetails',{el: El.escrow, from:'Pay'})
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  
  const getLastLogin = async () => {
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    setUserInfo(JSON.parse(userInfo));
    const lastDate = await AsyncStorage.getItem("LastLoginDate");
    setLastDate(moment(lastDate).locale("en").format("llll"));
  };
  

  const loadHandler = ({ url }) => {
    console.log('url', url)
    if (url.includes('status')) {
      if (url.includes('status=paid')) {
        confirmPay()
        // if (
        //   StatusCode == 2 &&
        //   BuyerID == CustomerID
        // ){
        //   dispatch(
        //     showSimpleModal({
        //       status: true,
        //       payload: {
        //         header: t('success'),
        //         message: t('transDetailsScreen.payDone'),
        //         action: "",
        //         type:'success'
        //       },
        //     })
        //   );
        //   navigation.push('TransactionDetails',{el: El.escrow, from:'Pay'})
        // }else{
        //   confirmPay()
        // }
      }
      else{
        console.log('status error')
        dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('mistake'),
                message: t('transDetailsScreen.payFail'),
                action: "",
                type:'error'
              },
            })
          );
      } 
    } else {
      console.log('status = waiting');
    }
  };

  const confirmPay= async()=>{
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata2 = new FormData();
    formdata2.append("escrow_id", EscrowID);
    formdata2.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS2.acceptAfterPay, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        Authorization: "Bearer " + token,
        "X-Localization": i18n?.language,
      },
      body: formdata2,
    })
      .then((response) => response.json())
      .then(async (responseData2) => {
        console.log("accept after ppay ress.. : ", responseData2);
        if (responseData2.messages?.success) {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'),   //responseData2?.status,
                message: t('transDetailsScreen.payDone'),
                action: "",
              },
            })
          );
          navigation.push('TransactionDetails',{el: El.escrow, from:'Pay'})
        } else if (responseData2.messages.error) {
          // dispatch(
          //   showSimpleModal({
          //     status: true,
          //     payload: {
          //       header: t('mistake'),
          //       message:t('transDetailsScreen.payFail'),  //responseData2.messages.error,
          //       action: "",
          //     },
          //   })
          // );
        } else {
         
        }
      })
      .catch((e) => {
        console.log(e);
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
  }

  const header=()=>{
    return(
        <View
        style={{
          backgroundColor: COLORS.blue,
        //   borderBottomRightRadius: hp(3),
        //   borderBottomLeftRadius: hp(3),
          minHeight: hp(9),
        }}
      >
       
        <View style={styles.transactionsHeader}>
          <View style={styles.txtHeaderContainerHome}>
              <TouchableOpacity
                style={styles.txtHeaderContainer}
                onPress={() => {
                    navigation.push('TransactionDetails',{el: El.escrow, from:'Pay'})
                }}
              >
                <MaterialIcons
                  name={i18n.language == "ar" ? "arrow-right" : "arrow-left"}
                  size={35}
                  color={COLORS.headerContent}
                />
                <CustomText
                  color={COLORS.headerContent}
                  size={15}
                  text={t("Back")}
                  style={styles.BackTxt}
                />
              </TouchableOpacity>
          </View>
    
        </View>
      </View>
    )
  }

  const loadingView=()=>{
    return(
     <CircularProgress
     value={100}
     radius={100}
     inActiveStrokeOpacity={0.5}
     activeStrokeWidth={15}
     inActiveStrokeWidth={20}
     progressValueStyle={{ fontWeight: '100', color: COLORS.blue }}
     activeStrokeSecondaryColor="yellow"
     inActiveStrokeColor="black"
     duration={4000}
     dashedStrokeConfig={{
       count: 50,
       width: 4,
     }}/>
    )
  }
  return (
    <>
      <View style={{flex:1,backgroundColor: COLORS.bg}}>
      {header()}
      {isloading?
       <View style={{flex:1,alignItems:'center',marginTop:hp(10)}}>
       {loadingView()}
       <CustomText
         color={COLORS.black}
         size={15} text={t('pleaseWait')}/>
     </View>
      :null}
      <View style={[{flex:1}]}> 
       <WebView
       style={{backgroundColor: COLORS.bg}}
       source={{uri: Url}}
       scalesPageToFit={true}
       scrollEnabled={true}
       onLoadEnd={()=> setIsLoading(false)}
      //  viewportContent={'width=device-width, user-scalable=no'}
       onNavigationStateChange={loadHandler}
     />
     </View>
    </View>
    </>
  );
};
const styles = StyleSheet.create({
    headerNotification: {
        width: "30%",
        flexDirection: "row-reverse",
        alignItems: "center",
        alignSelf: "flex-start",
      },
      transactionsHeader: {
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: hp(1),
        marginHorizontal: wp(2),
        flexDirection: "row",
      },
      verifyContainer: {
        flexDirection: "row",
        alignItems: "center",
      },
     
      txtHeaderContainer: {
        flexDirection: "row",
        width: "55%",
      },
      txtHeaderContainerHome: {
        flex:1,
        alignItems: "flex-start",
        marginLeft: wp(1),
        maxWidth: "70%",
        flexWrap: "wrap",
      },
      helloTxt: {
        opacity: 0.7,
      },
      nameCont: {
        flexDirection: "row",
      },
      hide:{
        width:0, height:0
      },
      show:{
        alignItems:'center',marginTop:hp(30)
      }
    
 
});
export default PayWebView;
