import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import createStyles from "./styles";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import CustomText from "../../components/customText";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import AntDesign from "react-native-vector-icons/AntDesign";
import RBSheet from "react-native-raw-bottom-sheet";
import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import i18n from "../../Translations";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import DatePicker from "react-native-date-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { wp } from "../../utilis/dimensions";
import { storeStackValue, handleLogoutValue } from "../../redux/actions/user";
import * as Authentication from "../../redux/actions/authentication";
import { useDispatch } from "react-redux";

const Statement = ({ navigation }) => {
  const initialMonths = [
    { name: "Jan", status: false },
    { name: "Feb", status: false },
    { name: "March", status: false },
    { name: "April", status: false },
    { name: "May", status: false },
    { name: "June", status: false },
    { name: "Jul", status: false },
    { name: "Aug", status: false },
    { name: "Sep", status: false },
    { name: "Oct", status: false },
    { name: "Nov", status: false },
    { name: "Dec", status: false },
  ];
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const refRBSheet = useRef();
  const dispatch = useDispatch();
  const searchRefSheet = useRef();
  const { t } = useTranslation();
  const [selectedMonths, setSelectedMonths] = useState(initialMonths);
  const [showDetailsModal, setShowDetailsModal] = useState({
    status: false,
    item: null,
  });
  const [filteredStatementData, setFilteredStatementData] = useState([]);
  const [visibleDateFrom, setVisibleDateFrom] = useState(false);
  const [selectedDateFrom, setSelectedDateFrom] = useState(new Date());
  const [visibleDateTo, setVisibleDateTo] = useState(false);
  const [selectedDateTo, setSelectedDateTo] = useState(new Date());
  const [selectedDateFromToShow, setSelectedDateFromToShow] = useState();
  const [selectedDateToToShow, setSelectedDateToToShow] = useState();
  const [page, setPage] = useState(1);
  const [moreDataLoader, setMoreDataLoader] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});

  const [transactionsList, setTransactionList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => setBaseURL(res));

  const getTransactionList = async () => {
    let token = await AsyncStorage.getItem("TOKEN");
    page == 1 && setLoading(true);

    let url = `${baseURL}` + `${ENDPOINTS.transactionList}` + `?page=${page}`;
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        console.log("transaction list : ", res?.data);
        if (res?.data?.status == "ok") {
          setPaginationInfo(res?.data?.data?.transactions);
          if (page == 1) {
            setTransactionList(res?.data?.data.transactions?.data);
            setFilteredStatementData(res?.data?.data?.transactions?.data);
          } else {
            setTransactionList([
              ...transactionsList,
              ...res?.data?.data.transactions?.data,
            ]);
            setFilteredStatementData([
              ...filteredStatementData,
              ...res?.data?.data?.transactions?.data,
            ]);
          }

          setLoading(false);
        } else {
          setLoading(false);
          handleLogout()
          // showMessage({
          //   message: res?.data?.message,
          //   type: "info",
          //   titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          // });
        }
      })
      .catch((er) => {
        console.log("er : ", er);
        showMessage({
          message: res?.data?.message,
          type: "info",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem("CUSTOMER_ID");
    await AsyncStorage.removeItem("USER_PIN");
    await AsyncStorage.removeItem("USER_PIN_VALUE");
    await AsyncStorage.removeItem("ChangeLang");
    await AsyncStorage.removeItem("AUTHLANG");
    await AsyncStorage.removeItem("TOKEN");
    await AsyncStorage.removeItem("NAVIGATION_STATE_TIME");
    // await AsyncStorage.removeItem("CUSTOMER_LOGIN");
    await AsyncStorage.removeItem("API_LANGUAGE");
    // await AsyncStorage.removeItem("CUSTOMER_OBJECT");
    dispatch(storeStackValue(false));
    dispatch(handleLogoutValue(true));
    dispatch(Authentication.logOut());
    showMessage({
      message: t("sideMenu.signOutSuccessfully"),
      type: "success",
      titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
    });
  };

  useEffect(() => {
    if (!baseURL) return;
    getTransactionList();
  }, [baseURL, page]);

  // useEffect(() => {
  //   //g('bug',filteredStatementData,selectedMonths)
  // }, [filteredStatementData, selectedMonths]);

  const handleDeleteAllFilters = () => {
    setFilteredStatementData([]);
    setSelectedMonths(initialMonths);
    setSelectedDateFrom(new Date());
    setSelectedDateTo(new Date());
  };
  const applySearch = () => {
    if (selectedDateToToShow && selectedDateFromToShow) {
      let from = moment(selectedDateFrom).format("yyyy-MM");
      let to = moment(selectedDateTo).format("yyyy-MM");
      console.log("apply", from, to);
      const searchedArr = [];
      const SearchedData = transactionsList.map((statement) => {
        if (
          moment(statement.created_at).format("yyyy-MM") >= from &&
          moment(statement.created_at).format("yyyy-MM") <= to
        ) {
          console.log("between", statement.created_at);
          searchedArr.push(statement);
        }
      });
      console.log("searched data", searchedArr);
      if (searchedArr.length > 0)
        setFilteredStatementData(searchedArr); //if searched data ==[]
      else {
        console.log("halo1"); // no result
        setFilteredStatementData(["empty"]);
      }
    } else {
      console.log("halo2");
      setFilteredStatementData([]); //delete all
      setPage(1);
    }
  };

  const handleDeleteAllSearch = () => {
    setSelectedDateToToShow();
    setSelectedDateFromToShow();
  };
  const handleDateFilter = (item) => {
    // handling selected Items
    let specificElement = selectedMonths.find((el) => {
      return el.name == item.item;
    });
    let arrWithoutElement = selectedMonths.filter((e) => {
      return e.name != specificElement.name;
    });
    const arrayToSet = [...arrWithoutElement];
    arrayToSet.push({
      name: specificElement.name,
      status: !specificElement.status,
    });
    setSelectedMonths(arrayToSet);
    //setSelectedMonths(...selectedMonths,{name:specificMonth?.name ,status:!specificMonth?.status })

    // filtration Logic
    const selectedMonthsArr = [];
    arrayToSet.map((el) => {
      if (el.status == true) selectedMonthsArr.push(el.name);
    });

    const filteredData = transactionsList.filter((statement) => {
      return selectedMonthsArr.includes(
        initialMonths[new Date(statement.created_at).getMonth()]?.name
      );
    });
    setFilteredStatementData(filteredData);
    //console.log('filteredData',filteredData)
  };

  const renderItem = ({ item }) => {
    // console.log('item',item)
    return (
      <TouchableOpacity
        style={styles.statementItem}
        onPress={() => setShowDetailsModal({ status: true, item: item })}
      >
        <View style={styles.infoCont}>
          <View style={styles.Icon}>
            <FontAwesome5
              name="money-bill-wave"
              size={25}
              color={COLORS.blue}
            />
          </View>
          <View style={styles.descCont}>
            <CustomText
              color={COLORS.black}
              size={12}
              text={item.details}
              style={styles.descTxt}
            />
            <CustomText
              color={COLORS.black}
              size={12}
              text={item.escrow_number}
              style={styles.descTxt}
            />
          </View>
        </View>
        <View style={styles.infoCont2}>
          <CustomText
            color={item?.trx_type == "-" ? COLORS.red : COLORS.green}
            size={17}
            text={
              (item?.trx_type == "-" ? item?.trx_type : "") +
              // parseFloat(item?.amount).toFixed(2)
              item?.amount
            }
            style={styles.phoneTxt}
          />
          <CustomText
            color={COLORS.black}
            size={14}
            text={`${moment(item?.created_at)
              .locale("en")
              .format("DD-MM-YYYY, h:mm:ss a")}`}
            style={styles.userNameTxt}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const renderDateItem = (month) => {
    return (
      <TouchableOpacity
        style={[
          styles.dateItem,
          {
            backgroundColor:
              selectedMonths.find((el) => {
                return el.name == month.item;
              })?.status == true
                ? COLORS.babyBlue3
                : COLORS.transactionsInfoBg,
          },
        ]}
        onPress={() => handleDateFilter(month)}
      >
        <CustomText
          color={COLORS.primaryTxt}
          size={17}
          text={t(`Months.${month.item}`)}
          //style={CommonStyles.titleTxt}
        />
      </TouchableOpacity>
    );
  };

  const SheetComponent = () => (
    <View
      style={{
        backgroundColor: COLORS.bg,
        flex: 1,
      }}
    >
      <View style={styles.headerFilter}>
        {/* filterHeader */}
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={handleDeleteAllFilters}>
            <CustomText
              color={COLORS.primaryTxt}
              size={20}
              text={t("transactionsScreen.deleteAll")}
              //style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>

          <CustomText
            color={COLORS.primaryTxt}
            size={20}
            text={`${t(
              "transactionsScreen.date"
            )} ${new Date().getUTCFullYear()}`}
            //style={CommonStyles.titleTxt}
          />
          <TouchableOpacity onPress={() => refRBSheet?.current.close()}>
            <Ionicons name="close" size={25} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        {/* Body */}

        <FlatList
          contentContainerStyle={styles.flatlistFilterContent}
          data={[
            "Jan",
            "Feb",
            "March",
            "April",
            "May",
            "June",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ]}
          renderItem={renderDateItem}
          keyExtractor={(item, i) => i}
          numColumns={2}
          // extraData={selectedId}
        />
      </View>
    </View>
  );

  const SearchSheetComponent = () => (
    <View
      style={{
        backgroundColor: COLORS.bg,
        flex: 1,
      }}
    >
      <View style={styles.headerFilter}>
        {/* filterHeader */}
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={handleDeleteAllSearch}>
            <CustomText
              color={COLORS.primaryTxt}
              size={20}
              text={t("transactionsScreen.deleteAll")}
              //style={CommonStyles.titleTxt}
            />
          </TouchableOpacity>

          <CustomText
            color={COLORS.primaryTxt}
            size={20}
            text={t(`search`)}
            //style={CommonStyles.titleTxt}
          />
          <TouchableOpacity onPress={() => searchRefSheet?.current.close()}>
            <Ionicons name="close" size={25} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        {/* Body */}

        <CustomInput
          onPress={() => {
            setVisibleDateFrom(true);
          }}
          // containerStyle={styles.btn}
          label={t("from")}
          value={
            selectedDateFromToShow != null
              ? moment(selectedDateFromToShow).locale("en").format("yyyy-MM")
              : null
          }
          dateInput={true}
          onChangeText={(val) => {
            // console.log('ccc',val)
          }}
          icon={
            <AntDesign name="calendar" size={20} color={COLORS.babyBlue2} />
          }
        />
        <DatePicker
          locale={i18n.language}
          mode="date"
          modal
          open={visibleDateFrom}
          date={selectedDateFrom}
          onConfirm={(date) => {
            // console.log('date',moment(date).locale('en').format('yyyy-MM'))
            setVisibleDateFrom(false);
            setSelectedDateFrom(date);
            setSelectedDateFromToShow(date);
          }}
          onCancel={() => {
            setVisibleDateFrom(false);
          }}
          confirmText={i18n.language == "en" ? "confirm" : "تأكيد"}
          cancelText={i18n.language == "en" ? "cancle" : "إلغاء"}
          title={i18n.language == "en" ? "select date" : "اختر التاريخ"}
        />

        <CustomInput
          onPress={() => setVisibleDateTo(true)}
          // containerStyle={styles.btn}
          label={t("to")}
          value={
            selectedDateToToShow != null
              ? moment(selectedDateToToShow).locale("en").format("yyyy-MM")
              : null
          }
          dateInput={true}
          onChangeText={(val) => {
            //  console.log('ccc',val)
          }}
          icon={
            <AntDesign name="calendar" size={20} color={COLORS.babyBlue2} />
          }
        />
        <DatePicker
          locale={i18n.language}
          mode="date"
          modal
          open={visibleDateTo}
          date={selectedDateTo}
          onConfirm={(date) => {
            // console.log('date',moment(date).locale('en').format('yyyy-MM'))
            setVisibleDateTo(false);
            setSelectedDateTo(date);
            setSelectedDateToToShow(date);
          }}
          onCancel={() => {
            setVisibleDateTo(false);
          }}
          confirmText={i18n.language == "en" ? "confirm" : "تأكيد"}
          cancelText={i18n.language == "en" ? "cancle" : "إلغاء"}
          title={i18n.language == "en" ? "select date" : "اختر التاريخ"}
        />

        <CustomButton
          text={`${t("transactionsScreen.apply")} `}
          width={"80%"}
          color={COLORS.header}
          containerStyle={{ borderRadius: 0, alignSelf: "center" }}
          onPress={applySearch}
        />
      </View>
    </View>
  );
  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `A Saudi Escrow "${
          showDetailsModal?.item?.trx_type == "+" ? "Credit" : "Debit"
        }" of "SAR ${parseFloat(showDetailsModal?.item?.amount).toFixed(
          2
        )}" with the detail of
           "${showDetailsModal?.item?.details}" with transaction reference "${
          showDetailsModal?.item?.trx
        }"
            on "${moment(showDetailsModal?.item?.created_at)
              .locale("en")
              .format("DD-MM-YYYY, h:mm:ss a")}.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <>
      <View style={styles.screen}>
        <CustomHeader navigation={navigation} />
        {/* Filter */}
        <View style={styles.filterIconsContainer}>
          <TouchableOpacity
            style={styles.filter}
            onPress={() => refRBSheet.current.open()}
          >
            <AntDesign name="filter" size={28} color={COLORS.header} />
          </TouchableOpacity>
          <TouchableOpacity
            //style ={styles.filter}
            onPress={() => searchRefSheet.current.open()}
          >
            <AntDesign name="search1" size={25} color={COLORS.header} />
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator
            size={"large"}
            color={COLORS.header}
            style={styles.loadingStyle}
          />
        ) : filteredStatementData.length == 0 &&
          selectedMonths.length > 0 &&
          selectedMonths.filter((el) => el.status == true).length > 0 ? (
          <CustomText
            color={COLORS.grey}
            size={20}
            text={t("No_Results")}
            style={styles.descTitle}
          />
        ) : filteredStatementData[0] == "empty" ? (
          <CustomText
            color={COLORS.grey}
            size={20}
            text={t("No_Results")}
            style={styles.descTitle}
          />
        ) : (
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={loading}
                onRefresh={() => getTransactionList()}
              />
            }
            data={
              filteredStatementData.length > 0 &&
              filteredStatementData[0] != "empty"
                ? filteredStatementData
                : transactionsList
            }
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            onEndReached={() => {
              console.log("End", page, paginationInfo.last_page);
              if (page <= paginationInfo?.last_page) {
                setPage(page + 1);
                setMoreDataLoader(true);
              } else {
                console.log("2");
                setMoreDataLoader(false);
              }
            }}
            onEndReachedThreshold={0.1}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            ListFooterComponent={() => (
              <View>
                {paginationInfo?.last_page >= page && (
                  <ActivityIndicator
                    size={"small"}
                    color={COLORS.header}
                    loading={moreDataLoader}
                  />
                )}
                {paginationInfo?.last_page < page && !moreDataLoader && (
                  <CustomText
                    color={COLORS.header}
                    size={16}
                    text={`${t("noMore")} ${
                      filteredStatementData?.length > 0
                        ? filteredStatementData?.length
                        : transactionsList.length
                    }`}
                  />
                )}
              </View>
            )}
          />
        )}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "#00000060",
            },
            container: { height: "50%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
          }}
        >
          <SheetComponent />
        </RBSheet>
        <RBSheet
          ref={searchRefSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "#00000060",
            },
            container: { height: "46%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
          }}
        >
          <SearchSheetComponent />
        </RBSheet>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showDetailsModal.status}
        onRequestClose={() => {
          setShowDetailsModal({ status: !showDetailsModal, item: null });
        }}
      >
        <View
          style={styles.modalView}
          onPress={() => setShowDetailsModal({ status: false, item: null })}
        >
          <View style={styles.centeredView}>
            <View>
              <TouchableOpacity
                onPress={() =>
                  setShowDetailsModal({ status: false, item: null })
                }
                style={styles.closeIcon}
              >
                <AntDesign
                  //  onPress={() =>
                  //   setShowDetailsModal({ status: false, item: null })
                  // }
                  name={"closecircleo"}
                  size={30}
                  color={COLORS.red}
                />
              </TouchableOpacity>
              <Image
                style={styles.logo}
                source={require("../../assets/newLogo.png")}
              />
              <View style={styles.termsHeader}>
                <CustomText
                  color={COLORS.blue}
                  size={20}
                  text={t("statementScreen.td")}
                  style={styles.text2}
                />
              </View>
              <View style={styles.modalSubView}>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.details")}
                    style={styles.descTitle}
                  />
                  <View style={{ alignItems: "flex-end" }}>
                    <CustomText
                      color={COLORS.grey}
                      size={15}
                      // num={2}
                      text={showDetailsModal?.item?.details}
                      style={[styles.descTitle, { maxWidth: "90%" }]}
                    />
                  </View>
                </View>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.date")}
                    style={styles.descTitle}
                  />
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={moment(showDetailsModal?.item?.created_at)
                      .locale("en")
                      .format("DD-MM-YYYY, h:mm:ss a")}
                    style={styles.descTitle}
                  />
                </View>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.referenceNumber")}
                    style={styles.descTitle}
                  />
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={showDetailsModal?.item?.trx}
                    style={styles.descTitle}
                  />
                </View>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.operationType")}
                    style={styles.descTitle}
                  />
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={
                      showDetailsModal?.item?.trx_type == "+"
                        ? i18n.language == "ar"
                          ? "دائن"
                          : "Credit"
                        : i18n.language == "ar"
                        ? "مدين"
                        : "Debit"
                    }
                    style={styles.descTitle}
                  />
                </View>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.balance")}
                    style={styles.descTitle}
                  />
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={showDetailsModal?.item?.amount}
                    style={styles.descTitle}
                  />
                </View>
                <View style={styles.modalSubView1}>
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={t("statementScreen.total")}
                    style={styles.descTitle}
                  />
                  <CustomText
                    color={COLORS.grey}
                    size={15}
                    text={showDetailsModal?.item?.post_balance}
                    style={styles.descTitle}
                  />
                </View>
              </View>
              <CustomButton
                color={COLORS.blue}
                onPress={() => {
                  setShowDetailsModal({ status: false, item: null });
                  navigation.navigate("TransactionDetails", {
                    el: {
                      id: showDetailsModal?.item?.escrow_id
                        ? showDetailsModal?.item?.escrow_id
                        : showDetailsModal?.item?.escrow_number,
                    },
                    from:'Statement'
                  });
                }}
                textSize={14}
                text={t("statementScreen.goDetails")}
                containerStyle={styles.detailsButton}
              />
              <TouchableOpacity
                style={[styles.filter, { alignSelf: "center" }]}
                onPress={onShare}
              >
                <AntDesign name="sharealt" size={28} color={COLORS.header} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Statement;
