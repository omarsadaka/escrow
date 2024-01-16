import { t } from "i18next";
import React, { useState, useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
  RefreshControl,
  FlatList,
} from "react-native";
import CustomText from "../../components/customText";
import { COLORS } from "../../constants/colors";
import { BASE_URL, ENDPOINTS, getBaseURL } from "../../constants/API";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WithdrawCard from "../../components/cards/withdraw";
import CustomHeader from "../../components/customHeader";
import createStyles from "./styles";
export default function WithdrawLog({ navigation, route }) {
  const [withdrawLog, setWithdrawLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [env, setEnv] = useState("2");
  const [baseURL, setBaseURL] = useState("");
  const styles = useMemo(() => createStyles(COLORS), []);
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

  useEffect(() => {
    if (!baseURL) return;
    fetchWithdrawList();
  }, [baseURL, filterRoute,page]);

  const onRefresh = () => {
    fetchWithdrawList();
  };

  const fetchWithdrawList = async () => {
   page==1&& setLoading(true);
    try {
      var formdata = new FormData();
      filterRoute != undefined && formdata.append("type[]", filterRoute[0]);
      let token = await AsyncStorage.getItem("TOKEN");
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')

     
      let url = `${baseURL}` + `${ENDPOINTS.withdrawList}` + `?page=${page}`;
      formdata.append('device_info', deviceInfo)
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "multipart/form-data;",
          "X-Localization": i18n?.language
        },
        body:
          filterRoute != undefined &&
          // filterRoute
          formdata,
      })
        .then((response) => response.json())
        .then((responseData) => {
          if (responseData.data) {
            // console.log('res',responseData.data.withdrawals)
            setPaginationInfo(responseData.data.withdrawals)
          
            // setWithdrawLog(responseData.data.withdrawals.data)
          
           page==1
           ? setWithdrawLog(responseData.data.withdrawals.data)
           : setWithdrawLog([...withdrawLog,...responseData.data.withdrawals.data])
            setLoading(false);
          } else {
            setLoading(false);

          }
        });
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <>
      <CustomHeader navigation={navigation} />

<View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("NewWithdraw")}
          style={styles.withdrawNow}
        >
          <CustomText
            text={t("withdraw.withdrawNow")}
            color={COLORS.cardBlue}
          />
        </TouchableOpacity>

        <CustomText
          text={t("withdraw.withdrawLog")}
          color={COLORS.cardBlue}
          // style={styles.title}
        />

        {!loading  ? (
          withdrawLog.length > 0 ? (


            <FlatList
              refreshControl={
             <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
             }
            data={withdrawLog}
            renderItem={({ item: el }) => (
              <WithdrawCard
                key={el.id}
                navigation={navigation}
                data={el}
              />
            )}
            keyExtractor={(item, index) => index}
            onEndReached={() => {
              if (page <= paginationInfo?.last_page) {
                console.log('End')
                setPage(page + 1)
                setMoreDataLoader(true)
                
             }
             else {
               setMoreDataLoader(false)
             }

            }
          }
         
          // initialNumToRender={5}
          // maxToRenderPerBatch={5}
          //   //  onEndReachedThreshold={0.1}
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
                      text={`${t('noMore')} ${withdrawLog?.length}`}
                     />
                     }
                </View>
              }
               />
          ) : (
            <CustomText
              text={t("withdraw.NowithdrawData")}
              color={COLORS.cardBlue}
              // style={styles.title}
            />
          )
        ) : (
          <ActivityIndicator color={COLORS.header} />
        )}
</View>
    </>
  );
}
