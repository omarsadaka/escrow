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

const AddCard = ({navigation}) => {
  const { colors: COLORS } = useTheme();
  const route = useRoute();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const {Url} = route?.params;
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


  // useEffect(() => {
  //   const backAction = async () => {
  //     // write code to handel navigation
  //     navigation.push('TransactionDetails',{el: El.escrow, from:'Pay'})
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  
  const getLastLogin = async () => {
    const userInfo = await AsyncStorage.getItem("CUSTOMER_OBJECT");
    setUserInfo(JSON.parse(userInfo));
    const lastDate = await AsyncStorage.getItem("LastLoginDate");
    setLastDate(moment(lastDate).locale("en").format("llll"));
  };
  

  const loadHandler = ({ url }) => {
    console.log('url', url)
    if (url.includes('status')) {
      if (url.includes('status=authorized')) {
          dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('success'),
                message: t('accountScreen.cardCreated'),
                action: "",
                type:'success'
              },
            })
          );
          navigation.push('Accounts',{isCard: false})
      }
      else{
        console.log('status error')
        dispatch(
            showSimpleModal({
              status: true,
              payload: {
                header: t('mistake'),
                message: t('accountScreen.cardFail'),
                action: "",
                type:'error'
              },
            })
          );
        navigation.push('Accounts')
      } 
    } else {
      console.log('status = waiting');
    }
  };


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
                  navigation.push('Accounts')
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
export default AddCard;
