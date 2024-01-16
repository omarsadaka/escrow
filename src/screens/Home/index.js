import React, { useState, useMemo, useEffect } from "react";
import {
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  View,
  Pressable,
  ScrollView,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
  Linking,
  FlatList,
} from "react-native";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import Feather from "react-native-vector-icons/Feather";
import AntDesign from "react-native-vector-icons/AntDesign";
import CommonStyles from "../../constants/CommonStyles";
import { useTheme, useIsFocused } from "@react-navigation/native";
import createStyles from "./styles";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { height, hp, width, wp } from "../../utilis/dimensions";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import axios from "axios";
import { useDispatch } from "react-redux";
import { storeUserImage } from "../../redux/actions/user";
import CustomHeader from "../../components/customHeader";
import { storeStackValue } from "../../redux/actions/user";
import { setShowVideoModal } from "../../redux/actions/modal";
import Swiper from 'react-native-swiper'
// import YearGraphCard from "../../components/yearGraphCard";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";
import Lottie from "lottie-react-native";
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';

const systemFonts = [...defaultSystemFonts, 'BahijTheSansArabic-Plain', 'BahijTheSansArabicBold'];
const Dashboard = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("https://escrow2d.meiladigital-sa.com/backend/api/");
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const { colors: COLORS } = useTheme();
  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [transactionData, setTransactionData] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingGraph, setLoadingGraph] = useState(false);
  const [status_loading, setStatus_Loading] = useState(false);
  const [data, setData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [showBalence, setShowBalance] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExpanded2, setIsExpanded2] = useState(false);
  const [filter, setFilter] = useState(1);
  const [filter2, setFilter2] = useState(1);
  const [dataByYear, setDataByYear] = useState([]);
  const [dataByMonth, setDataByMonth] = useState([]);
  const [totalYear, setTotalYear] = useState(0);
  const [categoriesByYear, setCategoriesByYear] = useState([]);
  const [categoriesByMonth, setCategoriesByMonth] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesMonth, setCategoriesMonth] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedYear1, setSelectedYear1] = useState('');
  const [totalMonth, setTotalMonth] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedMonth1, setSelectedMonth1] = useState('');
  const [clickedname, setClickedName] =useState('')
  const [totalPurchaseYear, setTotalPurchaseYear] = useState(0);
  const [totalSoldYear, setTotalSoldYear] = useState(0);
  const [categoriesByYearForAll, setCategoriesByYearForAll] = useState([]);
  const [stateText, setStateText] = useState('');
  const [statusData, setStatusData] = useState([]);
  const [stateDesc, setStateDesc] = useState('');


  const videosLinks=[
    {id:'1', link:'iee2TATGMyI', image: require('../../assets/youtube1.jpeg')},
    {id:'2', link:'0iABl98FMi0', image: require('../../assets/youtube2.jpeg')},
    {id:'3', link:'57DGzkdJ6cM', image: require('../../assets/youtube3.jpeg')}
  ] 
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    getTransactions();
    getUserInfo();
    getDataByYear()
    getDataByMonth()
  }, [navigation, baseURL, isFocused]);

  useEffect(() => {
    getDataByCategoryYear()
    getDataByCategoryMonth()
  }, [navigation,filter2,selectedMonth,selectedYear]);

  const onRefresh = async () => {
    getTransactions();
    getUserInfo();
  };

  const DashboardData = [
    // {
    //   txt: t("dashboard.pendingDeposit"),
    //   currVal: data?.data?.dashboard?.pendingDeposit,
    //   link: "DepositHistory",
    //   param: "pending",
    // },
    // {
    //   txt: t("dashboard.pendingWithdrawals"),
    //   currVal: data?.data?.dashboard?.pendingWithdrawals,
    //   link: "WithdrawLog",
    //   param: "pending",
    // },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.totalEscrow.name_ar
          : data?.data?.dashboard?.totalEscrow.name_en,
      currVal: data?.data?.dashboard?.totalEscrow.count,
      link: "Transactions",
      param: "",
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.disputed?.name_ar
          : data?.data?.dashboard?.disputed?.name_en,
      currVal: data?.data?.dashboard?.disputed?.count,
      link: "Transactions",
      param: data?.data?.dashboard?.disputed?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.accepted.name_ar
          : data?.data?.dashboard?.accepted.name_en,
      currVal: data?.data?.dashboard?.accepted?.count,
      link: "Transactions",
      param: data?.data?.dashboard?.accepted?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.notAccepted.name_ar
          : data?.data?.dashboard?.notAccepted.name_en,
      currVal: data?.data?.dashboard?.notAccepted.count,
      link: "Transactions",
      param: data?.data?.dashboard?.notAccepted?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.completed.name_ar
          : data?.data?.dashboard?.completed.name_en,
      currVal: data?.data?.dashboard?.completed.count,
      link: "Transactions",
      param: data?.data?.dashboard?.completed?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.cancelled.name_ar
          : data?.data?.dashboard?.cancelled.name_en,
      currVal: data?.data?.dashboard?.cancelled.count,
      link: "Transactions",
      param: data?.data?.dashboard?.cancelled.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.delivered.name_ar
          : data?.data?.dashboard?.delivered.name_en,
      currVal: data?.data?.dashboard?.delivered.count,
      link: "Transactions",
      param: data?.data?.dashboard?.delivered?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.deliveryConfirm.name_ar
          : data?.data?.dashboard?.deliveryConfirm.name_en,
      currVal: data?.data?.dashboard?.deliveryConfirm.count,
      link: "Transactions",
      param: data?.data?.dashboard?.deliveryConfirm?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.rejected.name_ar
          : data?.data?.dashboard?.rejected.name_en,
      currVal: data?.data?.dashboard?.rejected.count,
      link: "Transactions",
      param: data?.data?.dashboard?.rejected?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.accept_reject.name_ar
          : data?.data?.dashboard?.accept_reject.name_en,
      currVal: data?.data?.dashboard?.accept_reject?.count,
      link: "Transactions",
      param: data?.data?.dashboard?.accept_reject?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.accepted_paid.name_ar
          : data?.data?.dashboard?.accepted_paid.name_en,
      currVal: data?.data?.dashboard?.accepted_paid.count,
      link: "Transactions",
      param: data?.data?.dashboard?.accepted_paid?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.on_hold.name_ar
          : data?.data?.dashboard?.on_hold.name_en,
      currVal: data?.data?.dashboard?.on_hold?.count,
      link: "Transactions",
      param: data?.data?.dashboard?.on_hold?.filter,
    },
    {
      txt:
        i18n.language == "ar"
          ? data?.data?.dashboard?.drafted.name_ar
          : data?.data?.dashboard?.drafted.name_en,
      currVal: data?.data?.dashboard?.drafted?.count,
      link: "Transactions",
      param: data?.data?.dashboard?.drafted?.filter,
    },
  ];
  const OperationsData = [
    {
      txt: t("Transaction"),
      icon: (
        <Fontisto name="arrow-swap" size={30} color={COLORS.operationsIcons} />
      ),
      link: "Transactions",
    },
    {
      txt: t("statement"),
      icon: (
        <AntDesign name="printer" size={30} color={COLORS.operationsIcons} />
      ),
      link: "Statement",
    },
    {
      txt: t("Account & card"),
      icon: (
        <MaterialCommunityIcons
          name="cash"
          size={40}
          color={COLORS.operationsIcons}
        />
      ),
      link: "Accounts",
    },
    // {
    //   txt: t("Withdraw"),
    //   icon: (
    //     <AntDesign name="printer" size={30} color={COLORS.operationsIcons} />
    //   ),
    //   link: "WithdrawLog",
    // },
    // {
    //   txt: t("Agreement"),
    //   icon: (
    //     <Ionicons
    //       name="card-outline"
    //       size={30}
    //       color={COLORS.operationsIcons}
    //     />
    //   ),
    //   link: "Agreement",
    // },
    // {
    //   txt: t("deposit.de"),
    //   icon: (
    //     <Ionicons
    //       name="cash-outline"
    //       size={30}
    //       color={COLORS.operationsIcons}
    //     />
    //   ),
    //   link: "LoadDepositMethods",
    // },
    // {
    //   txt: t("Settings"),
    //   icon: (
    //     <Ionicons name="stats-chart" size={30} color={COLORS.operationsIcons} />
    //   ),
    //   link: "Settings",
    // },
  ];

  const getTransactions = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "get",
      url: baseURL + ENDPOINTS.getHomeTransactions,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((res) => {
        // console.log('omar res:', res.data)
        setTransactionData(res?.data?.data);
      })
      .catch((er) => console.log("er : ", er));
  };

  const getUserInfo = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    // setLoading(true);
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
          setData(responseData);

          await AsyncStorage.setItem(
            "CUSTOMER_OBJECT",
            JSON.stringify(responseData.data.user)
          );
          dispatch(storeUserImage(responseData.data.user.image));
          setLoading(false);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const getEscrowStatusValues = async (type) => {
    const token = await AsyncStorage.getItem("TOKEN");
    setStatus_Loading(true);
    fetch(baseURL + ENDPOINTS.escrowStatusValue, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setStatus_Loading(false);
        if (responseData.data) {
          console.log('getEscrowStatusValues',responseData.data)
          if(type=='seller') setStatusData(responseData.roadmap.seller_roadmap);
          else setStatusData(responseData.roadmap.buyer_roadmap);
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        setStatus_Loading(false);
      });
  };
  const getDataByYear= async()=>{
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(baseURL + ENDPOINTS.analyticsByYear, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("responseData ", responseData.data);
        if (responseData.data) {
          var sum_purchase=0
          var sum_sold=0
          setDataByYear(responseData.data);
          responseData.data.forEach(el => {
             sum_purchase=Number(sum_purchase) + Number(el.purchased) 
             sum_sold= Number(sum_sold) + Number(el.sold)
          });
          setTotalPurchaseYear(sum_purchase)
          setTotalSoldYear(sum_sold)
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
      });
  }

  const getDataByMonth= async()=>{
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(baseURL + ENDPOINTS.analyticsByMonth, {
      method: "get",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log("getDataByMonth ", responseData.data);
        if (responseData.data) {
          setDataByMonth(responseData.data);
          // setTotalMonth(responseData?.data[0]?.sum)
          // setSelectedMonth1(responseData?.data[0]?.month)
        } else {
          console.log("responseData ", responseData.message);
        }
      })
      .catch((e) => {
        console.log("error in get info : ", e);
      });
  }

  const getDataByCategoryYear= async()=>{
    const token = await AsyncStorage.getItem("TOKEN");
    setLoadingGraph(true);
    fetch(baseURL + ENDPOINTS.analyticsByCatYear, {
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
          const arr=[]
          responseData.data.forEach((el,index) => {
            const obj={
              ...el,
              color: index==1?'red':index==2?'green':'blue'
            }
            arr.push(obj)
          })
          setCategories(arr)
         

          const arr2=[]
          responseData.data.forEach((el,index) => {
            if(el?.data?.length>0){
              const item=el?.data.find(({ year }) => year === selectedYear);

              const obj={
                name: el.category,
                population: filter2==1? 
                item?.sold? item.sold: 0 
                : 
                item?.purchased?item.purchased:0,
                legendFontSize:10,
                legendFontColor: "#7F7F7F",
                color: index==1?'red':index==2?'green':'blue'
              }
              arr2.push(obj)
            }
          });
          setCategoriesByYear(arr2)


          const arr3=[]
          responseData.data.forEach((el,index) => {
            if(el?.data?.length>0){
              var total_purchase=0
              var total_sold=0
              el.data.forEach(ele => {
                total_purchase=total_purchase+Number(ele.purchased)
                total_sold=total_sold+Number(ele.sold)
              });
              const obj={
                name: el.category,
                population: filter2==1? total_sold : total_purchase,
                legendFontSize:10,
                legendFontColor: "#7F7F7F",
                color: index==1?'red':index==2?'green':'blue'
              }
              arr3.push(obj)
            }
          });
          setCategoriesByYearForAll(arr3)

          
        } else {
          console.log("responseData ", responseData.message);
        }
        setLoadingGraph(false);
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoadingGraph(false);
      });
  }

  const getDataByCategoryMonth= async()=>{
    const token = await AsyncStorage.getItem("TOKEN");
    setLoadingGraph(true);
    fetch(baseURL + ENDPOINTS.analyticsByCatMonth, {
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
          const arr=[]
          responseData.data.forEach((el,index) => {
            const obj={
              ...el,
              color: index==1?'red':index==2?'green':'blue'
            }
            arr.push(obj)
          })
          setCategoriesMonth(arr)
          const arr2=[]
          responseData.data.forEach((el,index) => {
            if(el?.data?.length>0){
              const item=el?.data.find(({ month }) => month === selectedMonth);
              // console.log('itemitemitemitem', item)
              const obj={
                name: el.category,
                population: filter2==1? 
                item?.sold ? item?.sold : 0 
                :
                item?.purchased? item.purchased: 0 ,
                legendFontSize:10,
                legendFontColor: "#7F7F7F",
                color: index==1?'red':index==2?'green':'blue'
              }
              arr2.push(obj)
            }
          });
          setCategoriesByMonth(arr2)
        } else {
          console.log("responseData ", responseData.message);
        }
        setLoadingGraph(false);
      })
      .catch((e) => {
        console.log("error in get info : ", e);
        setLoadingGraph(false);
      });
  }

  const handleVideoModal = (videoID) => {
    console.log("press");
    dispatch(
      setShowVideoModal({
        status: true,
        youtubeVideoId: videoID,
      })
    );
  };
  
  const roadState_row=(color, left, top, state, number, description )=>{
    return(
     <TouchableOpacity style={{flexDirection:'row', alignItems:'center', position:'absolute', left: left, top: top}}
     onPress={()=> {
      setStateText(state)
      setStateDesc(description)
     }}>
      {number==4?
      <>
       <CustomText color={COLORS.black} size={10} text={state} style={{marginHorizontal:wp(1)}}/>
       <View style={{width: wp(5), height: wp(5), borderRadius: wp(5)/2, backgroundColor: color,justifyContent:'center'}}>
        <CustomText color={COLORS.black} size={9} text={number} fontFamily="extraBold"/>
       </View>
      </>
      :
      <>
       <View style={{width: wp(5), height: wp(5), borderRadius: wp(5)/2, backgroundColor: color,justifyContent:'center'}}>
        <CustomText color={COLORS.black} size={10} text={number} fontFamily="extraBold"/>
       </View>
       <CustomText color={COLORS.black} size={9} text={state} style={{marginHorizontal:wp(1)}}/>
      </>
      }
      
     </TouchableOpacity>
    )
  }

  const roadState_colum=(color, left, top, state, number, description)=>{
    return(
     <TouchableOpacity style={{alignItems:'center', position:'absolute', left: left, top: top}}
     onPress={()=> {
      setStateText(state)
      setStateDesc(description)
     }}>
       <View style={{width: wp(5), height: wp(5), borderRadius: wp(5)/2, backgroundColor: color, justifyContent:'center'}}>
       <CustomText color={COLORS.black} size={9} text={number} fontFamily="extraBold"/>
       </View>
       <CustomText color={COLORS.black} size={10} text={state}/>
     </TouchableOpacity>
    )
  }
  const whoIamModel=()=>{
    return(
      <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        setVisible(!visible);
      }}
    >
      <View style={styles.modalView}>
       
        <View style={styles.centeredView}>
          <CustomText
            color={COLORS.black}
            size={16}
            text={t("userDesc")}
            style={styles.title}
          />
        {status_loading?
         <ActivityIndicator color={COLORS.header} />
         :
         <View style={{width:'98%',alignItems:'flex-end',flexDirection:'row'}}>
         {/* <View style={[styles.lottieContainer, {left: wp(3)}]}>
          <Lottie
                style={{
                  width: wp(11),
                  height: wp(11),
                }}
                source={require("../../assets/lottie/Animation - handshake-final.json")}
                autoPlay
                loop={true}/>
          </View> */}
          <ImageBackground style={[styles.image_bg,i18n.language=='ar'?{transform: [{rotateY: '180deg'}],}:{}]} source={require('../../assets/road-map2.png')} resizeMode='stretch' >

          </ImageBackground>
          {/* <View style={[styles.lottieContainer]}>
          <Lottie
                style={{
                  width: wp(12),
                  height: wp(12),
                }}
                source={require("../../assets/lottie/Animation - finish.json")}
                autoPlay
                loop={true}/>
          </View> */}
          {roadState_row('yellow', wp(20), hp(10),i18n.language=='ar'? statusData[2]?.name_ar: statusData[2]?.name_en,3,i18n.language=='ar'? statusData[2]?.desc_ar: statusData[2]?.desc_en)}
          {roadState_row('red', wp(43), hp(8),i18n.language=='ar'? statusData[3]?.name_ar: statusData[3]?.name_en,4,i18n.language=='ar'? statusData[3]?.desc_ar: statusData[3]?.desc_en)}
          {roadState_row('orange', wp(15), hp(19),i18n.language=='ar'? statusData[0]?.name_ar: statusData[0]?.name_en,1,i18n.language=='ar'? statusData[0]?.desc_ar: statusData[0]?.desc_en)}
          {roadState_colum('green', wp(47), hp(23),i18n.language=='ar'? statusData[1]?.name_ar: statusData[1]?.name_en,2,i18n.language=='ar'? statusData[1]?.desc_ar: statusData[1]?.desc_en)}
          {roadState_colum('pink', wp(73), hp(16),i18n.language=='ar'? statusData[4]?.name_ar: statusData[4]?.name_en,5,i18n.language=='ar'? statusData[4]?.desc_ar: statusData[4]?.desc_en)}
         </View>
         }
          <View style={styles.state_details}>
          <CustomText
            color={COLORS.black}
            size={17}
            text={stateText?stateText:'- -'}
            style={styles.title}
          />
          <RenderHtml
              source={{
                  html: stateDesc,
              }}
              contentWidth={width}
              containerStyle={{width: '100%'}}
              defaultTextProps={{
              }}
              ignoredTags={['img']}
              systemFonts={systemFonts}
              baseStyle={{fontFamily: 'BahijTheSansArabic-Plain', fontSize: 15, color: COLORS.black, textAlign:'left'}}
            />
          </View>
         
          <CustomButton
            color={COLORS.white}
            onPress={() => {
              setVisible(!visible);
            }}
            textSize={14}
            text={t("rating.ok")}
            containerStyle={styles.closeButton}
            textStyle={styles.closeButtonTxt}
          />
        </View>
      </View>
    </Modal>
    )
  }
  return (
    <View style={styles.fullHomeCont}>
      <CustomHeader navigation={navigation} Home={true} data={data} />
      <ScrollView
        // style={styles.fullHomeCont}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
        }
      >
        {/* Body */}
        <View style={[CommonStyles.bg,{marginBottom:hp(22), paddingHorizontal: 10}]}>
          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("currentBalance")}
            style={styles.titleTxt}
          />

          {/* Curr Section */}
          <View style={styles.container1}>
            {!loading ? (
              <>
                <View style={styles.monContainer}>
                  <View style={styles.currContainer}>
                    <CustomText
                      color={COLORS.monCurr}
                      size={width*0.04}
                      text={t("dashboard.SAR")}
                      style={styles.currTxt}
                    />
                  </View>
                  <View style={styles.monValContainer}>
                  <Feather
                      name={showBalence? "eye": "eye-off"}
                      size={25}
                      color={COLORS.operationsIcons}
                      onPress={()=> setShowBalance(!showBalence)}
                    />
                    <CustomText
                      color={COLORS.monText}
                      size={20}
                      text={showBalence? data?.data?.user?.balance : '*******'}
                      style={styles.monTxt}
                    />
                    <Fontisto
                      name="wallet"
                      size={25}
                      color={COLORS.operationsIcons}
                    />
                  </View>
                </View>
                {/* Statistics */}
                {/* <ScrollView
                  contentContainerStyle={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  style={styles.dashboardCont}
                  horizontal
                >
                  {DashboardData.map((el, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.dashboardItem}
                      onPress={
                        el.link
                          ? () =>
                              navigation.navigate(el.link, {
                                filterParam: [el?.param],
                              })
                          : () => {}
                      }
                    >
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={14}
                        text={el.currVal}
                        style={styles.statisticsTxt}
                      />
                      <CustomText
                        color={COLORS.statisticsTitle}
                        size={14}
                        text={el.txt}
                        style={styles.statisticsTxt}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView> */}
                <View style={{alignItems:'flex-start'}}>
                <CustomText
                  color={COLORS.primaryTxt}
                  size={16}
                  text={t("iam")}
                  style={styles.titleTxt}/>
                  <View style={{alignItems:'center', flexDirection:'row'}}>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                      navigation.navigate('plus', { screen: 'ShortEscrow',params: { UserType: t("shortEscrow.buyer"), Phone: ""}});
                      dispatch(storeStackValue(true));
                     }}>
                     <Ionicons name="cart-outline" size={33} color={COLORS.operationsIcons} />
                     <TouchableOpacity onPress={()=>{
                       setVisible(true)
                       getEscrowStatusValues('seller')
                       }}>
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("isBuyer")}
                      style={[styles.statisticsTxt,{textDecorationLine: 'underline'}]}/>
                      </TouchableOpacity>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                      navigation.navigate('plus', { screen: 'ShortEscrow',params: { UserType: t("shortEscrow.seller"), Phone: ""}});
                      dispatch(storeStackValue(true));
                     }}>
                     <Ionicons name="basket-outline" size={33} color={COLORS.operationsIcons} />
                     <TouchableOpacity onPress={()=> {
                      setVisible(true)
                      getEscrowStatusValues('buyer')
                      }}>
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("isSeller")}
                      style={[styles.statisticsTxt,{textDecorationLine: 'underline'}]}/>
                      </TouchableOpacity>
                   </TouchableOpacity>
                  </View>

                </View>
              </>
            ) : (
              <ActivityIndicator color={COLORS.header} />
            )}
          </View>
          {/* Operations */}

          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("operations")}
            style={styles.operationsTitle}
          />
          <View style={styles.operationsSection}>
            {OperationsData.map((el, index) => (
              <TouchableOpacity
                key={index}
                style={styles.operationsItem}
                onPress={() => {
                  if(el.link=='Accounts') el.link && navigation.navigate(`${el.link}`,{isCard: false})
                  else el.link && navigation.navigate(`${el.link}`)
                }}
              >
                {el.icon}
                <CustomText
                  color={COLORS.operationsItemTxt}
                  size={14}
                  text={el.txt}
                  style={styles.statisticsTxt}
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.analyticsCon,{marginTop:hp(2)}]}>
          <TouchableOpacity style={styles.youtubeContainer} onPress={()=> setIsExpanded(!isExpanded)}>
          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("howWorks")}
            style={{flex:1,textAlign:'left'}}
          />
          <Ionicons name={isExpanded?"caret-up-outline":"caret-down-outline"}  size={18} color={COLORS.header}/>
          </TouchableOpacity>
          {isExpanded?
          <View style={{alignItems:'center',height:hp(26)}}>
             <Swiper style={styles.wrapper} showsButtons={true} showsPagination={true}
              paginationStyle={{marginBottom: -hp(3.3)}}
              activeDotColor={COLORS.blue}
              nextButton={ 
               <Ionicons name={i18n.language=='en'?"chevron-forward-circle-outline":"chevron-back-circle-outline"}  size={25} color={COLORS.blue}/>
              }
              prevButton={
                <Ionicons name={i18n.language=='en'?"chevron-back-circle-outline":"chevron-forward-circle-outline"}  size={25} color={COLORS.blue}/>
              }>
               {
                videosLinks.map((ele)=>{
                  return(
                    <TouchableOpacity style={{width:'98%', height: hp(22),alignItems:'center',marginHorizontal:wp(1)}}
                    onPress={()=> {handleVideoModal(ele.link)}}>
                      <Image source={ele.image} style={styles.youtubeImage} resizeMode='contain' />
                    </TouchableOpacity>
                  )
                })
               }
             </Swiper>
          </View>
          :null}
          </View>

          <View style={styles.analyticsCon}>
          <TouchableOpacity style={styles.youtubeContainer} onPress={()=> setIsExpanded2(!isExpanded2)}>
          <CustomText
            color={COLORS.primaryTxt}
            size={16}
            text={t("transactionAnalytics")}
            style={{flex:1,textAlign:'left'}}
          />
          <Ionicons name={isExpanded2?"caret-up-outline":"caret-down-outline"}  size={18} color={COLORS.header}/>
          </TouchableOpacity>
          {isExpanded2?
          <View style={{alignItems:'center',marginVertical: 5,}}>
           <View style={{flexDirection:'row',width:'100%', alignItems:'center'}}>
           <TouchableOpacity style={[styles.btnFilter,{backgroundColor: filter==1?COLORS.blue:COLORS.grey}]}
           onPress={()=> setFilter(1)}>
            <CustomText color={COLORS.white} size={16} text={t("yearly")}/>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btnFilter,{backgroundColor: filter==2?COLORS.blue:COLORS.grey}]}
           onPress={()=> setFilter(2)}>
            <CustomText color={COLORS.white} size={16} text={t("monthly")}/>
           </TouchableOpacity>
           <TouchableOpacity style={[styles.btnFilter,{backgroundColor: filter==3?COLORS.blue:COLORS.grey}]}
           onPress={()=> setFilter(3)}>
            <CustomText color={COLORS.white} size={16} text={t("overAll")}/>
           </TouchableOpacity>
           </View>

            <View style={{width:'100%',marginVertical:5}}>
              <View style={{flexDirection:'row',width:'100%', alignItems:'center'}}>
                <TouchableOpacity style={[styles.btnFilter,{backgroundColor: filter2==1?COLORS.blue:COLORS.grey}]}
                  onPress={()=> setFilter2(1)}>
                  <CustomText color={COLORS.white} size={16} text={t("sold")}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btnFilter,{backgroundColor: filter2==2?COLORS.blue:COLORS.grey}]}
                  onPress={()=> setFilter2(2)}>
                  <CustomText color={COLORS.white} size={16} text={t("purchased")}/>
                </TouchableOpacity>
              </View>
          {filter!=3&&
           <View style={styles.graphCon}>
            <FlatList
              horizontal
              data={filter==1? dataByYear: dataByMonth }
              renderItem={({ item: el,index }) => (
              <>
              {filter==1?
               <TouchableOpacity onPress={()=> {
                 setClickedName(el.year)
                 setTotalYear(el.sum)
                 setSelectedYear(el.year)
               }}
               style={{alignSelf:'flex-end'}}>
               <CustomText color={COLORS.black} size={14} text={filter2==1? el.sold+' '+t('SAR'):el.purchased+' '+t('SAR')}/>
               <View style={[styles.colum,{
                 backgroundColor:clickedname == el.year?COLORS.blue:COLORS.grey,
                 height:filter2==1? 20*Number(el.sold): 20*Number(el.purchased)}]}/>
               <CustomText color={COLORS.black} size={18} text={el.year}/>
               </TouchableOpacity>
              :
              <TouchableOpacity onPress={()=> {
                setClickedName(el.month)
                setTotalMonth(el.sum)
                setSelectedMonth(el.month)
              }}
              style={{alignSelf:'flex-end'}}>
              <CustomText color={COLORS.black} size={14} text={filter2==1? el.sold+' '+t('SAR'):el.purchased+' '+t('SAR')}/>
              <View style={[styles.colum,{
                backgroundColor: clickedname==el.month?COLORS.blue:COLORS.grey,
                height:filter2==1? 20*Number(el.sold): 20*Number(el.purchased)}]}/>
              <CustomText color={COLORS.black} size={18} text={el.month}/>
             </TouchableOpacity>
            }
            </>
                )}
              keyExtractor={(item, index) => index}/>
          </View>
            }

          {filter==3&&
          <View style={styles.graphCon3}>
           <View style={{width:'100%', alignContent:'center', flexDirection:'row'}}>
             <CustomText color={COLORS.black} size={17} text={filter2==1? t("dashboard.totalSold"): t("dashboard.totalPurchase")}/>
            <CustomText color={COLORS.black} size={17} text={filter2==1? totalSoldYear+' '+t('SAR') :totalPurchaseYear+' '+t('SAR')}/>
           </View>
          </View>
          }  

          {(selectedMonth&&filter==2)||(selectedYear&&filter==1)?
          loadingGraph? <ActivityIndicator color={COLORS.blue} size={'small'}/>:
          <>
          <CustomText color={COLORS.black} size={16} text={t("total")}/>
          <CustomText color={COLORS.black} size={16} text={filter==1? totalYear +' '+ t('SAR'):totalMonth +' '+ t('SAR')}/>
          <CustomText color={COLORS.black} size={16} text={t("detailsByNum")} style={{flex:1,textAlign:'left',paddingHorizontal:5}}/>
           <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:-height*0.03}}>
           <View style={{alignItems:'center'}}>
           {
            filter==1?
            categories.map((el,index)=>{
               const itemYear=el?.data.find(({ year }) => year === selectedYear);
              return(
                <>
                {el?.data.length>0?
                <TouchableOpacity style={{width:'100%', flexDirection:'row',paddingHorizontal:5,alignItems:'center'}}
                onPress={()=>{
                  navigation.navigate('Transactions',{
                    ID: el.category_id
                   })
                }}>
                  <CustomText color={COLORS.black} size={16} text={el.category}/>
                  <View style={{width:15,height:15, borderRadius:15/2,backgroundColor:el.color,marginHorizontal:4}}/>
                   <CustomText color={COLORS.black} size={16} text={
                    filter2==1?itemYear?.sold? itemYear?.sold+' '+t('SAR'): '0'+' '+t('SAR') :
                    itemYear?.purchased? itemYear?.purchased+' '+t('SAR'): '0'+' '+t('SAR')} 
                    style={{marginHorizontal:width*0.02}}/>
                </TouchableOpacity>
                :null}
                </>
              )
            })
            :
            categoriesMonth.map((el,index)=>{
              const itemMonth=el?.data.find(({ month }) => month === selectedMonth);
              return(
                <>
                {el?.data.length>0?
                <TouchableOpacity style={{width:'100%', flexDirection:'row',paddingHorizontal:5,alignItems:'center'}}
                onPress={()=>{
                  navigation.navigate('Transactions',{
                    ID: el.category_id
                   })
                }}>
                  <CustomText color={COLORS.black} size={14} text={el.category}/>
                  <View style={{width:15,height:15, borderRadius:15/2,backgroundColor:el.color,marginHorizontal:4}}/>
                  <CustomText color={COLORS.black} size={14} text={
                    filter2==1? itemMonth?.sold? itemMonth?.sold+' '+t('SAR'): '0'+' '+t('SAR'): 
                    itemMonth?.purchased? itemMonth?.purchased+' '+t('SAR') : '0'+' '+t('SAR')} 
                    style={{marginHorizontal:width*0.02}}/>
                </TouchableOpacity>
                :null}
                </>
              )
            })
           }
           </View>
           <View style={{flex:1}}>
                <PieChart
                data={filter==1? categoriesByYear: categoriesByMonth}
                width={width*0.4}
                height={height*0.16}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"20"}
                center={[1, 1]}
                hasLegend={false}
                absolute/>
           </View>
           </View>
           </>
           :null}


         {filter==3?
          loadingGraph? <ActivityIndicator color={COLORS.blue} size={'small'}/>:
          <>
           <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop: height*0.01}}>
           <View style={{alignItems:'center'}}>
           {
            categories.map((el,index)=>{
              var total_purchase=0
              var total_sold=0
              el.data.forEach((ele, index) => {
                 total_purchase= total_purchase+Number(ele.purchased)
                 total_sold= total_sold+Number(ele.sold)
              });
             
             

              return(
                <>
                {el?.data.length>0?
                <TouchableOpacity style={{width:'100%', flexDirection:'row',paddingHorizontal:5,alignItems:'center'}}
                 onPress={()=>{
                   navigation.navigate('Transactions',{
                    ID: el.category_id
                   })
                 }}>
                  <CustomText color={COLORS.black} size={14} text={el.category}/>
                  <View style={{width:15,height:15, borderRadius:15/2,backgroundColor:el.color,marginHorizontal:4}}/>
                   <CustomText color={COLORS.black} size={14} text={filter2==1? total_sold+' '+t('SAR') : total_purchase+' '+t('SAR') + ''} style={{marginHorizontal:width*0.02}}/>
                </TouchableOpacity>
                :null}
                </>
              )
            })
           }
           </View>
           <View style={{flex:1}}>
                <PieChart
                data={categoriesByYearForAll}
                width={width*0.4}
                height={height*0.16}
                chartConfig={{
                  backgroundColor: '#1cc910',
                  backgroundGradientFrom: '#eff3ff',
                  backgroundGradientTo: '#efefef',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"20"}
                center={[1, 1]}
                hasLegend={false}
                absolute/>
           </View>
           </View>
           </>
           :null}
          

           </View>
          </View>
          :null}
         </View>

        </View>
      </ScrollView>
      {whoIamModel()}
    </View>
  );
};
export default Dashboard;
