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

const Artivles = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");

  const [articlesData, setArtivlesData] = useState([]);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [moreDataLoader, setMoreDataLoader] = useState(false);


 

  useEffect(() => {
    console.log("hello there page", page);
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    !(page > paginationInfo.last_page) && getArticles();
  }, [navigation, baseURL, page,]);



  const getArticles = async () => {
    page == 1 && setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(`${baseURL}` + `${ENDPOINTS.getArticles}` + `?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        if (responseData) {
          console.log("notification data : ", responseData);
         
          setPaginationInfo(responseData.pagination);
          page == 1
            ? setArtivlesData(responseData.blogs)
            : setArtivlesData([
                ...articlesData,
                ...responseData.blogs,
              ]);
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


  const onRefresh = async () => {
    setLoading(true)
    getArticles();
  };
 
  const ItemComponent = ({ el }) => (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ArticleDetails", {
          Item: el
        });
      }}
      style={styles.itemContainer}
    >
    <View style={{alignItems:'center', flexDirection:'row'}}>
      <Image source={{uri: el.image}} style={styles.image}/>
      <View style={{flex:1, alignItems:'flex-start'}}>
        <CustomText
          color={COLORS.black}
          size={15}
          text={el.title}
          style={styles.innerText}
        />

        <View style={{flexDirection:'row'}}>
        <CustomText
          color={COLORS.black}
          size={12}
          text={t("notification.date")}
          style={styles.dateText}
        />
        <CustomText
          color={COLORS.black}
          size={12}
          text={`${moment(el?.created_at)
            .locale("en")
            .format("DD-MM-YYYY, h:mm:ss a")}`}
        />
       </View>
      </View>
    </View>  
     
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
              text={t("sideMenu.Articles")}
              style={styles.BackTxt}
            />
              <>
                {articlesData ? (
                  articlesData.length > 0 ? (
                    <FlatList
                      refreshControl={<RefreshControl onRefresh={onRefresh} />}
                      data={ articlesData}
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
                          articlesData?.length
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
                              articlesData?.length
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
                                  articlesData?.length
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
                        text={t("sideMenu.empty")}
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
export default Artivles;
