import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Image,
  Switch,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import { height, wp } from "../../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import CustomAlert from "../../components/CustomAlert";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import { setUnSeenCount } from "../../redux/actions/notification";
import { makeNotificationSeen } from "../../utilis/apis";
import Sound from 'react-native-sound';
import { showMessage } from "react-native-flash-message";

const Notification = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");

  const [notificationData, setNotificationData] = useState([]);
  const [newsData, setNewsData] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [section, setSection] = useState(1);
  const [page, setPage] = useState(1);
  const [pageNews, setPageNews] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [paginationInfoNews, setPaginationInfoNews] = useState({});
  const [moreDataLoader, setMoreDataLoader] = useState(false);
  const [moreDataLoaderNews, setMoreDataLoaderNews] = useState(false);
  const [userKV, setUserKV] = useState(null);
  const { unSeenCount } = useSelector((state) => state.notification);


 

  useEffect(() => {
    console.log("hello there page", page);
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    !(page > paginationInfo.last_page) && getNotification();
    !(pageNews > paginationInfoNews.last_page) && getNews(false);
  }, [navigation, baseURL, page, pageNews, unSeenCount]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUnseenCount()
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(()=>{
    if(unSeenCount>0) playSound()
  },[])

  const playSound= async()=>{
    const sound = await AsyncStorage.getItem("SoundEffect");
    if(sound=='off'){
      return
    }
    setTimeout(() => {
      var sound = new Sound("sound.mp3",Sound.MAIN_BUNDLE, (error) => {      
      });
      setTimeout(() => {
          sound.play((success) => {     
          });
          showMessage({
            position:'top',
            message: t('notification.unReadNotifi'),
            type: 'info',
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
     }, 100);
   }, 100);
  }

  const getNotification = async () => {
    page == 1 && section==1&& setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    console.log("in get notification info...", page);
    fetch(`${baseURL}` + `${ENDPOINTS.getNotification}` + `?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.data) {
          // console.log("notification data : ", responseData.data);
          dispatch(
            setUnSeenCount({
              unSeenCount: responseData?.unseen_count,
            })
          );
          setPaginationInfo(responseData.data);
          page == 1
            ? setNotificationData(responseData.data.data)
            : setNotificationData([
                ...notificationData,
                ...responseData.data.data,
              ]);
          console.log("length", responseData.data.data.length);
          setLoading(false);
        } else {
          setErrMessage(responseData.message);
          setErrShow(true);
          setLoading(false);
        }
      })
      .catch((e) => {
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
        setLoading(false);
      });
  };

  const getNews = async (isRefresh) => {
    // pageNews == 1&& section==2 && setLoading(true);
    setNewsData([])
    const token = await AsyncStorage.getItem("TOKEN");
    console.log("in get news info...", pageNews);
    fetch(`${baseURL}` + `${ENDPOINTS.getNews}` + `?page=${pageNews}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.notifications.data) {
          // console.log("getNews", responseData.notifications.data);
          // dispatch(
          //   setUnSeenCount({
          //     unSeenCount: responseData?.unseen_count,
          //   })
          // );
          setPaginationInfoNews(responseData.notifications);
          pageNews == 1
            ? setNewsData(responseData.notifications.data)
            : setNewsData([
                ...newsData,
                ...responseData.notifications.data,
              ]);
          // console.log("length", responseData.notifications.data.length);
          // setLoading(false);
        } else {
          setErrMessage(responseData.message);
          setErrShow(true);
          // setLoading(false);
        }
        if(!isRefresh) getCustomMessage()
        setLoading(false)
      })
      .catch((e) => {
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
        setLoading(false);
      });
  };
  const getCustomMessage = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(`${baseURL}` + `${ENDPOINTS.getNotification}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if(responseData.custom_message.length>0){
          responseData.custom_message.forEach(ele => {
            const obj={
              title_ar: ele.card_message?ele.card_message:ele.kv_message,
              title_en: ele.card_message?ele.card_message:ele.kv_message,
              created_at: '',
              type: ele?.card_message?'1':'2',
              seen: ele?.seen
            }
            setNewsData((prev)=> [obj, ...prev,])
          });
        
        }
        if(responseData.data.user){
          setUserKV(responseData.data.user.kv)
        }
      })
      .catch((e) => {
        setErrMessage(t("accountScreen.err"));
        setErrShow(true);
      });
  };

  const getUnseenCount = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(`${baseURL}` + `${ENDPOINTS.getNotification}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData.data) {
          dispatch(
            setUnSeenCount({
              unSeenCount: responseData?.unseen_count,
            })
          );
        } 
      })
      .catch((e) => {
      });
  };

  const onRefresh = async () => {
    setLoading(true)
    getNotification();
  };
  const onRefreshNews = async () => {
    setLoading(true)
    getNews(true)
  };
  const ItemComponent = ({ el }) => (
    <TouchableOpacity
      onPress={() => {
        makeNotificationSeen(baseURL, el?.id);
        navigation.navigate("TransactionDetails", {
          el: { id: el?.escrow_id ? el?.escrow_id : el?.escrow_number },
          from:'Notifications'
        });
      }}
      style={[styles.itemContainer,{borderColor:el.seen==1?COLORS.header:COLORS.red}]}
    >
      <View style={styles.innerContainer}>
        <CustomText
          color={COLORS.black}
          size={13}
          text={el.notification}
          style={styles.innerText}
        />
      </View>
      <View style={styles.innerContainer}>
        <CustomText
          color={COLORS.black}
          size={13}
          text={t("notification.date")}
          style={styles.innerText}
        />
        <CustomText
          color={COLORS.black}
          size={14}
          text={`${moment(el?.created_at)
            .locale("en")
            .format("DD-MM-YYYY, h:mm:ss a")}`}
        />
      </View>
    </TouchableOpacity>
  );
  const ItemNews = ({ el }) => (
    <TouchableOpacity
      onPress={async() => {
        if(el.type){
           if(el.type=='1'){
            makeNotificationSeen(baseURL, 'card_message');
            navigation.navigate('Accounts')
           }else{
            makeNotificationSeen(baseURL, 'kv_message');
            navigation.navigate('profile', {
              screen: 'IDVerification',
              params: { 
                  type: "IDVerification",
                  kv: userKV,
               },
            });
           }
        }else{
          navigation.navigate("NewsDetails", {
            Item: el,
          });
        }
       
      }}
      style={[styles.itemContainer,{borderColor:el.hasOwnProperty('seen')?el.seen==1?COLORS.header:COLORS.red:COLORS.header}]}
    >
      <View style={styles.innerContainer}>
        <CustomText
          color={COLORS.black}
          size={13}
          text={i18n.language=='ar'? el.title_ar: el.title_en}
          style={styles.innerText}
        />
      </View>
      {el.created_at?
       <View style={styles.innerContainer}>
       <CustomText
         color={COLORS.black}
         size={13}
         text={t("notification.date")}
         style={styles.innerText}
       />
       <CustomText
       color={COLORS.black}
       size={14}
       text={`${moment(el?.created_at)
         .locale("en")
         .format("DD-MM-YYYY, h:mm:ss a")}`}
      />        
      </View>
      :null}
     
    </TouchableOpacity>
  );
  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <View style={{ flex: 1, marginBottom:height*0.04}}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <>
            <CustomText
              color={COLORS.black}
              size={20}
              text={t("notification.header")}
              style={styles.BackTxt}
            />
            <View style={styles.selectStyle}>
              <TouchableOpacity
                onPress={() => {
                  // setPage(1)
                  setSection(1);
                }}
                style={section == 1 ? styles.selectedStyle : styles.basicStyle}
              >
                <Ionicons
                  name="ios-receipt-outline"
                  size={16}
                  color={section == 1 ? COLORS.white : COLORS.loginTab}
                  style={{ marginHorizontal: wp(2) }}
                />
                <CustomText
                  color={section == 1 ? COLORS.white : COLORS.header}
                  size={14}
                  text={t("notification.do")}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setSection(2)}
                style={section == 2 ? styles.selectedStyle : styles.basicStyle}
              >
                <Ionicons
                  name="ios-checkmark-outline"
                  size={16}
                  color={section == 2 ? COLORS.white : COLORS.loginTab}
                  style={{ marginHorizontal: wp(2) }}
                />
                <CustomText
                  color={section == 2 ? COLORS.white : COLORS.header}
                  size={14}
                  text={t("notification.news")}
                />
              </TouchableOpacity>
            </View>
            {section == 1 ? (
              <>
                {notificationData ? (
                  notificationData.length > 0 ? (
                    <FlatList
                      refreshControl={<RefreshControl onRefresh={onRefresh} />}
                      data={ notificationData}
                      renderItem={({ item: el }) => (
                        // <>
                        // </>
                        <ItemComponent el={el} />
                      )}
                      keyExtractor={(item, index) => index}
                      initialNumToRender={6}
                      maxToRenderPerBatch={6}
                      //bug
                      onEndReached={() => {
                        console.log(
                          "End",
                          paginationInfo.last_page,
                          page,
                          moreDataLoader,
                          notificationData?.length
                        );
                          if (page > paginationInfo.last_page) {
                            setMoreDataLoader(false);
                          }
                          if (page <= paginationInfo.last_page) {
                            console.log(
                              "End2",
                              paginationInfo.last_page,
                              page,
                              moreDataLoader,
                              notificationData?.length
                            );
                            setPage(page + 1);
                            setMoreDataLoader(true);
                          }
                       
                      }}
                      // onEndReachedThreshold={0.5}
                      ListFooterComponent={() => (
                        <View>
                          {page < paginationInfo?.last_page && (
                            <ActivityIndicator
                              size={"small"}
                              color={COLORS.header}
                              loading={moreDataLoader}
                            />
                          )}
                          {page > paginationInfo?.last_page &&
                            !moreDataLoader && (
                              <CustomText
                                color={COLORS.header}
                                size={16}
                                text={`${t("noMore")} ${
                                  notificationData?.length
                                }`}
                              />
                            )}
                        </View>
                      )}
                    />
                  ) : (
                    <View style={styles.errStyle}>
                      <CustomText
                        color={COLORS.header}
                        size={14}
                        text={t("notification.empty")}
                        style={styles.errorMessages}
                      />
                    </View>
                  )
                ) : (
                  <View style={styles.errStyle}>
                    <CustomText
                      color={COLORS.header}
                      size={14}
                      text={t("notification.error")}
                      style={styles.errorMessages}
                    />
                  </View>
                )}
              </>
            ) : (
              <>
              {newsData ? (
                newsData.length > 0 ? (
                  <FlatList
                    refreshControl={<RefreshControl onRefresh={onRefreshNews} />}
                    data={newsData}
                    renderItem={({ item: el }) => (
                      // <>
                      // </>
                      <ItemNews el={el}/>
                    )}
                    keyExtractor={(item, index) => index}
                    initialNumToRender={6}
                    maxToRenderPerBatch={6}
                    //bug
                    onEndReached={() => {
                      console.log(
                        "End",
                        paginationInfo.last_page,
                        page,
                        moreDataLoaderNews,
                        notificationData?.length
                      );
                    
                        if (pageNews > paginationInfoNews.last_page) {
                          setMoreDataLoaderNews(false);
                        }
                        if (pageNews <= paginationInfoNews.last_page) {
                          console.log(
                            "End2 news",
                            paginationInfoNews.last_page,
                            pageNews,
                            moreDataLoaderNews,
                            newsData?.length
                          );
                          setPageNews(pageNews + 1);
                          setMoreDataLoaderNews(true);
                        }                     
                    }}
                    // onEndReachedThreshold={0.5}
                    ListFooterComponent={() => (
                      <View>
                        {pageNews < paginationInfoNews?.last_page && (
                          <ActivityIndicator
                            size={"small"}
                            color={COLORS.header}
                            loading={moreDataLoaderNews}
                          />
                        )}
                        {pageNews > paginationInfoNews?.last_page &&
                          !moreDataLoaderNews && (
                            <CustomText
                              color={COLORS.header}
                              size={16}
                              text={`${t("noMore")} ${
                                newsData?.length
                              }`}
                            />
                          )}
                      </View>
                    )}
                  />
                ) : (
                  <View style={styles.errStyle}>
                    <CustomText
                      color={COLORS.header}
                      size={14}
                      text={t("notification.emptyNews")}
                      style={styles.errorMessages}
                    />
                  </View>
                )
              ) : (
                <View style={styles.errStyle}>
                  <CustomText
                    color={COLORS.header}
                    size={14}
                    text={t("notification.error")}
                    style={styles.errorMessages}
                  />
                </View>
              )}
            </>
             )} 
          </>
        )}
      </View>
      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </View>
  );
};
export default Notification;
