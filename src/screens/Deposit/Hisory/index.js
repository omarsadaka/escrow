import { t } from "i18next";
import React, { useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import CustomText from "../../../components/customText";
import { COLORS } from "../../../constants/colors";
import { ENDPOINTS, getBaseURL } from "../../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WithdrawCard from "../../../components/cards/withdraw";
import CustomHeader from "../../../components/customHeader";
import createStyles from "./styles";
import CustomAlert from "../../../components/CustomAlert";
import { RefreshControl } from "react-native";
const DepositHistory = ({ navigation, route }) => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState("2");
  const [baseURL, setBaseURL] = useState("");
  const styles = useMemo(() => createStyles(COLORS), []);
  const [warning, setWarning] = useState(false);
  const [errmess, setErrMess] = useState("");
  const filterRoute = route?.params?.filterParam;
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [moreDataLoader, setMoreDataLoader] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});


  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, [env]);
  const getSavedEnv = async () => {
    try {
      const value = await AsyncStorage.getItem("ENVIROMENT");
      if (value !== null) {
        // value previously stored
        setEnv(value);
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    getSavedEnv();
  }, []);
  const getDepositHistory = async () => {
    var formdata = new FormData();
    filterRoute != undefined && formdata.append("type[]", filterRoute[0]);
    let bodyObj = filterRoute ? { type: filterRoute } : {};
    
    page==1&& setLoading(true);
    try {
      let token = await AsyncStorage.getItem("TOKEN");
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      let url = `${baseURL}` + `${ENDPOINTS.depositHistory}` + `?page=${page}`;
      formdata.append('device_info', deviceInfo)
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data;",
          "X-Localization": i18n?.language
        },
        body:
          //bodyObj
          filterRoute
            ? // filterRoute
              formdata
            : {},
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.data) {
            setPaginationInfo(responseData.data.deposit)
             page==1
             ? setHistory(responseData.data.deposit.data)
             :setHistory([...history,...responseData.data.deposit.data])

            setLoading(false);
          } else {
            setHistory(null);
            setLoading(false);
            setErrMess(t("deposit.error"));
            setLoading(false);
          }
        });
    } catch (error) {
      setHistory(null);
      setLoading(false);
      setErrMess(t("deposit.error"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!baseURL) return;
    getDepositHistory();
  }, [baseURL, filterRoute,page]);
  const onRefresh = () => {
    getDepositHistory();
  };
  return (
    <>
      <CustomHeader navigation={navigation}  specialPress={'Home'}/>
      <View
        style={styles.bg}
       
      >
        <View style={styles.container}>
          <CustomText
            size={20}
            text={t("depositHistory.depositH")}
            color={COLORS.cardBlue}
          />

          {!loading ? (
            history ? (
              history.length > 0 ? (
                <FlatList
                refreshControl={
                        <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
                      }
              data={history}
              renderItem={({ item: el }) => (

                   <WithdrawCard
                    key={el.id}
                    data={el}
                    navigation={navigation}
                    deposit={true}
                  />
              )}

              keyExtractor={(item, index) => index}
              onEndReached={() => {
                if (page <= paginationInfo.last_page) {
                  console.log('End')
                  setPage(page + 1)
                  setMoreDataLoader(true)
                  
               }
               else {
                 setMoreDataLoader(false)
               }
  
              }
            }
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() =>
                  <View>
  
                    {paginationInfo?.last_page >= page && <ActivityIndicator
                     size={'small'}
                     color={COLORS.header}
                     loading={moreDataLoader} />}
             { paginationInfo?.last_page < page && !moreDataLoader &&
                     <CustomText
                      color={COLORS.header}
                      size={16}
                      text={`${t('noMore')} ${history?.length}`}
                     />
                     }
                  </View>
                }
                 />
              ) : (
                <CustomText
                  text={t("depositHistory.nodata")}
                  color={COLORS.cardBlue}
                />
              )
            ) : (
              <CustomText text={t("deposit.error")} color={COLORS.cardBlue} />
            )
          ) : (
            <ActivityIndicator color={COLORS.header} />
          )}
        </View>
      </View>
      <CustomAlert
        type={'error'}
        show={warning}
        header={t("accountScreen.w")}
        body={errmess}
        action1={() => {
          setWarning(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </>
  );
};
export default DepositHistory;
