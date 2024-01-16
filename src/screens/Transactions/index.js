import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  FlatList,
} from "react-native";
import CheckBox from "react-native-check-box";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
import createStyles from "./styles";
import CommonStyles from "../../constants/CommonStyles";
import { useIsFocused, useTheme } from "@react-navigation/native";
import { BASE_URL, ENDPOINTS, ENDPOINTS2, getBaseURL } from "../../constants/API";
import TransactionCard from "../../components/transactionsCard";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "react-native-vector-icons/Ionicons";
import { hp, width, wp } from "../../utilis/dimensions";
import RBSheet from "react-native-raw-bottom-sheet";
import { showMessage } from "react-native-flash-message";
import axios from "axios";
import { getEscrowStatus } from "../../utilis/apis";
import {useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react-native";
import { handleLogoutValue, storeStackValue } from "../../redux/actions/user";
import * as Authentication from "../../redux/actions/authentication";
import { getUniqueId } from "react-native-device-info";

const TransactionsListScreen = ({ navigation, route }) => {
  const { notificationReload } = useSelector((state) => state.user);
  const [baseURL, setBaseURL] = useState("");
  let filterParam = route?.params?.filterParam;
  let cat_id = route?.params?.ID
  getBaseURL()?.then((res) => setBaseURL(res));
  const dispatch = useDispatch();
  const refRBSheet = useRef();
  const refRBStatusSheet = useRef();
  const refRBTypeOfEscrowSheet = useRef();
  const refRBDateSheet = useRef();
  const refRBPriceSheet = useRef();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [loading, setLoading] = useState(true);
  const [statusFiltrationVal, setStatusFiltrationVal] = useState([]);
  const [typeOfEscrowFiltrationVal, setTypeOfEscrowFiltrationVal] = useState(
    []
  );
  const [dynamicStatusFilterArr, setDynamicStatusFilterArr] = useState([]);
  const [categoryFiltrationVal, setCategoryFiltrationVal] = useState([]);
  const [sortingToSend, setSortingToSend] = useState("");
  const [dynamicCategoryFilterData, setDynamicCategoryFilterData] = useState(
    []
  );
  const [page, setPage] = useState(1);
  const [moreDataLoader, setMoreDataLoader] = useState(false);
  const [filterLoader, setFilterLoader] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});
  const { t, i18n } = useTranslation();
  const [transactionsList, setTransactionList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
  const [finishedList, setFinishedList] = useState([]);
  const [uuid, setUUID] = useState(null);

  const [clickedBtn, setClickedBtn] = useState('');
  const isFocused = useIsFocused();

  //toggles for filters
  const [toggleCheckBox, setToggleCheckBox] = useState([
    //category
    { id: 0, status: false },
    { id: 1, status: false },
    { id: 2, status: false },
    { id: 3, status: false },
    // { id: 4, status: false },
  ]);
  const [toggleTypeOfEscrowCheckBox, setToggleTypeOfEscrowCheckBox] = useState([
    { id: 0, status: false },
    { id: 1, status: false },
    { id: 2, status: false },
  ]);
  const [toggledateCheckBox, setToggledateCheckBox] = useState([
    { id: 1, status: false },
    { id: 2, status: false },
  ]);
  const [togglePriceCheckBox, setTogglePriceCheckBox] = useState([
    { id: 1, status: false },
    { id: 2, status: false },
  ]);
  const [toggleTypeCheckBox, setToggleTypeCheckBox] = useState([
    //status
    { id: 0, status: false },
    { id: 1, status: false },
    { id: 2, status: false },
    { id: 3, status: false },
    { id: 4, status: false },
    { id: 5, status: false },
    { id: 6, status: false },
    { id: 7, status: false },
    { id: 8, status: false },
    { id: 9, status: false },
    { id: 10, status: false },
    { id: 11, status: false },
    { id: 12, status: false },
  ]);

  useEffect(()=>{
   if(cat_id){
    if(cat_id==1){
      const arr=[
        { id: 0, status: false },
        { id: 1, status: true },
        { id: 2, status: false },
        { id: 3, status: false },
      ]
      setToggleCheckBox(arr)
      applyCategoryFiltration2(arr)
    }else if(cat_id==2){
      const arr=[
        { id: 0, status: false },
        { id: 1, status: false },
        { id: 2, status: true },
        { id: 3, status: false },
      ]
      setToggleCheckBox(arr)
      applyCategoryFiltration2(arr)
    }else if(cat_id==3){
      const arr=[
        { id: 0, status: false },
        { id: 1, status: false },
        { id: 2, status: false },
        { id: 3, status: true },
      ]
      setToggleCheckBox(arr)
      applyCategoryFiltration2(arr)
    }
   }
  },[])
  const getCategories = async () => {
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.categoryList,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
    })
      .then(async (res) => {
        // console.log("getCategories", res);
        let categoryData = [];
        if (res?.data.categories.length > 0) {
          res?.data.categories[0]?.map((el, index) => {
            categoryData.push({
              name_en: el?.name_en,
              name_ar: el?.name_ar,
              id: el.id,
            });
          });
          setDynamicCategoryFilterData(categoryData);
          await AsyncStorage.setItem(
            "PaymentMethodsSeller",
            JSON.stringify(res?.data.payments)
          );
        } else {
          setDynamicCategoryFilterData([]);
        }
      })
      .catch((er) => {
        console.log("er : ", er);
      });
  };

  const handleFinalFilterApply = (Filter) => {
    setFilterLoader(true);
    setPage(1);
    if (Filter == "price") {
      if (
        //if all are false and no option Choosed
        togglePriceCheckBox.filter((el) => el.status == false)?.length ==
        togglePriceCheckBox.length
      ) {
        setSortingToSend("");
        getTransactionList(false);
      } else {
        applyPriceSorting();
      }
    } else if (Filter == "date") {
      if (
        toggledateCheckBox.filter((el) => el.status == false)?.length ==
        toggledateCheckBox.length
      ) {
        setSortingToSend("");
        getTransactionList(false);
      } else {
        applyDateSorrting();
      }
    } else if (Filter == "status") {
      if (
        toggleTypeCheckBox.filter((el) => el.status == false)?.length ==
        toggleTypeCheckBox.length
      ) {
        getTransactionList(true);
      } else {
      }
      applyStatusFiltration();
    } else if (Filter == "typeOfEscrow") {
      if (
        toggleTypeOfEscrowCheckBox.filter((el) => el.status == false)?.length ==
        toggleTypeOfEscrowCheckBox.length
      ) {
        getTransactionList(false);
      } else {
      }
      applyTypeOfEscrowFiltration();
    } else {
      if (
        toggleCheckBox.filter((el) => el.status == false)?.length ==
        toggleCheckBox.length
      ) {
        setCategoryFiltrationVal([]);
        getTransactionList(false);
      } else applyCategoryFiltration();
    }
  };

  const applyCategoryFiltration = () => {
    const checkedIds = toggleCheckBox.filter((e, index) => e.status == true)
      ?.map((e) => e.id);
    let arr = [];
    categoryData.map((el) => checkedIds.includes(el.id) && arr.push(el));
    setCategoryFiltrationVal(checkedIds);
  };

  const applyCategoryFiltration2 = (toggleCheckBox) => {
    const checkedIds = toggleCheckBox.filter((e, index) => e.status == true)
      ?.map((e) => e.id);
    let arr = [];
    categoryData.map((el) => checkedIds.includes(el.id) && arr.push(el));
    setCategoryFiltrationVal(checkedIds);
  };

  const applyStatusFiltration = () => {
    const checkedIds = toggleTypeCheckBox
      .filter((e, index) => e.status == true)
      ?.map((e) => e.id);
    let arr = [];
    StatusData.map((el) => checkedIds.includes(el.id) && arr.push(el));
    setStatusFiltrationVal(arr?.map((el) => el.filter));
  };

  const applyTypeOfEscrowFiltration = () => {
    const checkedIds = toggleTypeOfEscrowCheckBox
      .filter((e, index) => e.status == true)
      ?.map((e) => e.id);
    let arr = [];
    TypeOfEscrowData.map((el) => checkedIds.includes(el.id) && arr.push(el));
    const matchedIds = [];
    arr.map((el) => {
      if (el.id == 2) matchedIds.push(0);
      else matchedIds.push(el.id);
    });
    setTypeOfEscrowFiltrationVal(matchedIds);
  };

  const getTransactionList = async (deleteAllFlag) => {
    //setTransactionList([])
    page == 1 && setFilterLoader(true);
    const checkDrafts = statusFiltrationVal.filter((el) => el == "draft");
    let token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let url = `${baseURL}` + `${ENDPOINTS.myEscrows}` + `?page=${page}`;
    let dataObj = {
      type:
        statusFiltrationVal?.length > 0 && deleteAllFlag == false
          ? statusFiltrationVal.filter((el) => el != "draft").length > 0
            ? statusFiltrationVal.filter((el) => el != "draft")
            : ""
          : toggleTypeCheckBox?.find((el) => el.id == 0)?.status == true ||
            deleteAllFlag == true
          ? ""
          : filterParam && filterParam[0] != "" && filterParam[0] != "draft"
          ? filterParam
          : "",

      category:
        categoryFiltrationVal?.length > 0 && categoryFiltrationVal[0] != 0
          ? categoryFiltrationVal
          : "",

      escrow_type:
        typeOfEscrowFiltrationVal?.length > 0 ? typeOfEscrowFiltrationVal : "",

      is_draft:
        checkDrafts?.length > 0
          ? 1
          : filterParam && filterParam[0] == "draft"
          ? 1
          : "",
      sort_by: sortingToSend,
      device_info: deviceInfo
    };
    console.log('dataObj', dataObj)
    axios({
      method: "post",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language,
      },
      data: dataObj,
    })
      .then((res) => {
        // console.log("reeeesssss : ", res.data);
        if (res?.data?.status == "ok") {
          setPaginationInfo(res?.data?.escrows[0]);
          page == 1
            ? setTransactionList(res?.data?.escrows[0]?.data)
            : setTransactionList([
                ...transactionsList,
                ...res?.data?.escrows[0]?.data,
              ]);

          // if (
          //   toggledateCheckBox?.filter((el) => el.status == true)?.length > 0
          // ) {
          //   handleFinalFilterApply("date");
          // }
          // if (
          //   togglePriceCheckBox.filter((el) => el.status == true)?.length > 0
          // ) {
          //   handleFinalFilterApply("price");
          // } else {
          setFilterLoader(false);
          // }
          setLoading(false);
        } else {
          setLoading(false);
          setFilterLoader(false);
          handleLogout()
          // showMessage({
          //   message: res?.data?.message?.error[0],
          //   type: "info",
          //   titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          // });
        }
      })
      .catch((er) => {
        console.log("erererer : ", er?.message);
        showMessage({
          message: er?.message,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setLoading(false);
        setFilterLoader(false);
      });
  };

  const getUUID = async () => {
    let uuidValue = await getUniqueId();
    setUUID(uuidValue);
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
    getTransactionList(false);
    getUUID()
  }, [
    baseURL,
    isFocused,
    statusFiltrationVal,
    typeOfEscrowFiltrationVal,
    sortingToSend,
    filterParam,
    categoryFiltrationVal,
    page,
    notificationReload,
  ]);

  useEffect(() => {
    if (!baseURL) return;
    getEscrowStatus(baseURL).then((res) => {
      let adjustIdsArr = [];
      res?.data.map((el, e) => {
        adjustIdsArr.push({
          id: e + 1,
          name_en: el.name_en,
          name_ar: el.name_ar,
          filter: el.filter,
        });
      });
      setDynamicStatusFilterArr(adjustIdsArr);
    });
    getCategories();
  }, [baseURL]);

  const bottomSheetCriterias = [
    {
      name: "category",
      sheetRef: refRBSheet,
      icon: "ios-layers",
    },
    {
      name: "status",
      sheetRef: refRBStatusSheet,
      icon: "git-compare",
    },
    {
      name: "typeOfEscrow",
      sheetRef: refRBTypeOfEscrowSheet,
      icon: "sync",
    },
    {
      name: "date",
      sheetRef: refRBDateSheet,
      icon: "calendar",
    },
    {
      name: "price",
      sheetRef: refRBPriceSheet,
      icon: "cash",
    },
  ];
  const categoryData = dynamicCategoryFilterData;
  const StatusData = dynamicStatusFilterArr;
  const TypeOfEscrowData = [
    {
      name_en: "short", //1
      name_ar: "إضمن",
      id: 1,
    },
    {
      name_en: "long", //0
      name_ar: "ضمانات",
      id: 2,
    },
  ];

  const dateData = [
    {
      name_en: "latest date",
      name_ar: "أحدث تاريخ",
      id: 1,
    },
    {
      name_en: "oldest date",
      name_ar: "أقدم تاريخ",
      id: 2,
    },
  ];
  const valueData = [
    {
      name_en: "highest price",
      name_ar: "الأعلى سعرا",
      id: 1,
    },
    {
      name_en: "lowest price",
      name_ar: "الأقل سعرا",
      id: 2,
    },
  ];

  const handleFilter = (el, criteriaVal, setCriteriaVal) => {
    if (el.filter == "draft") {
      // console.log("method", el);
      let specificElement = criteriaVal.find((element) => element.id == el.id);
      let falseOtherElements = [];
      let arrWithoutElement = criteriaVal.filter(
        (e) => e.id != specificElement.id
      );

      arrWithoutElement.map((el) =>
        falseOtherElements.push({ id: el.id, status: false })
      );
      const arrayToSet = [...falseOtherElements];
      arrayToSet.push({
        id: specificElement.id,
        status: !specificElement.status,
      });
      setCriteriaVal(arrayToSet);
      // }
    } else {
      let specificElement = criteriaVal.find((element) => element.id == el.id);
      let arrWithoutElement = criteriaVal.filter(
        (e) => e.id != specificElement.id
      );
      let falseDraft = arrWithoutElement.filter((e) => e.id != 12);

      // console.log("arr", falseDraft);
      const arrayToSet = [...falseDraft, { id: 12, status: false }];

      arrayToSet.push({
        id: specificElement.id,
        status: !specificElement.status,
      });
      setCriteriaVal(arrayToSet);
      // }
    }
  };

  const handleSorting = (el, criteriaVal, setCriteriaVal) => {
    const arr = [];
    let specificElement = criteriaVal.find((element) => element.id == el.id);
    let theOtherElement = criteriaVal.find((element) => element.id != el.id);
    arr.push([
      { id: specificElement.id, status: !specificElement.status },
      { id: theOtherElement.id, status: specificElement.status },
    ]);

    setCriteriaVal(arr[0]);
  };

  const applyPriceSorting = () => {
    setToggledateCheckBox([
      { id: 1, status: false },
      { id: 2, status: false },
    ]);
    const specificEle = valueData.filter((el) => {
      return (
        el.id == togglePriceCheckBox.find((e, index) => e.status == true)?.id
      );
    });

    if (specificEle[0].name_en == "highest price") {
      setSortingToSend("price_desc");
    } else {
      setSortingToSend("price_asc");
    }
    setFilterLoader(false);
  };

  const applyDateSorrting = () => {
    setTogglePriceCheckBox([
      { id: 1, status: false },
      { id: 2, status: false },
    ]);
    const specificEle = dateData.filter((el) => {
      return (
        el.id == toggledateCheckBox.find((e, index) => e.status == true)?.id
      );
    });

    if (specificEle[0].name_en == "latest date") {
      setSortingToSend("date_desc");
    } else {
      setSortingToSend("date_asc");
    }
    setFilterLoader(false);
  };

  const handleIsChecked = (el, criteriVal) => {
    return criteriVal?.find((element) => element.id == el.id)?.status;
  };
  const handleFilterAll = (criteriaVal, setCriteriaVal) => {
    //make them false if all ==  true
    let arrWithoutElement = criteriaVal
      .filter((element) => element.id != 0)
      .map((el) => {
        el.status = false;
        return el;
      });

    //make them disabled if all == true
    setCriteriaVal([
      ...arrWithoutElement,
      { id: 0, status: !criteriaVal.filter((el) => el.id == 0)[0].status },
    ]);
  };

  const handleDeleteAllFilters = (criteriaName) => {
    //status of all obj = false --reset
    criteriaName == "category" &&
      setToggleCheckBox(
        toggleCheckBox.map((el) => {
          el.status = false;
          return el;
        })
      );
    criteriaName == "status" &&
      setToggleTypeCheckBox(
        toggleTypeCheckBox.map((el) => {
          el.status = false;
          return el;
        })
      );
    criteriaName == "typeOfEscrow" &&
      setToggleTypeOfEscrowCheckBox(
        toggleTypeOfEscrowCheckBox.map((el) => {
          el.status = false;
          return el;
        })
      );
    criteriaName == "date" &&
      setToggledateCheckBox(
        toggledateCheckBox.map((el) => {
          el.status = false;
          return el;
        })
      );
    criteriaName == "price" &&
      setTogglePriceCheckBox(
        togglePriceCheckBox.map((el) => {
          el.status = false;
          return el;
        })
      );
  };

  const SheetComponent = ({ data, BShRef, criteriaName }) => {
    return (
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingVertical: hp(2),
          marginBottom: hp(0.5),
          paddingHorizontal: wp(5),
          flex: 1,
        }}
      >
        {/* filterHeader */}
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            height: "16%",
            //marginBottom:hp(2),
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            onPress={() => handleDeleteAllFilters(criteriaName)}
          >
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
            text={t(`transactionsScreen.${criteriaName}`)}
            //style={CommonStyles.titleTxt}
          />
          <TouchableOpacity onPress={() => BShRef?.current.close()}>
            <Ionicons name="close" size={25} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={{
            height: "60%",
            flex: 1,
          }}
          contentContainerStyle={{
            justifyContent: "center",

            marginTop:
              criteriaName == "date" ||
              criteriaName == "price" ||
              criteriaName == "typeOfEscrow"
                ? hp(4)
                : hp(0),
          }}
        >
          {/* filterdata */}
          <View style={styles.CheckBoxContainer}>
            {/* ALL OPTION FOR EACH FILTER CRITERIA */}
            {criteriaName != "date" && criteriaName != "price" && (
              <TouchableOpacity style={styles.CheckBoxItem}>
                <CheckBox
                  style={{}}
                  onClick={() =>
                    criteriaName == "category"
                      ? handleFilterAll(toggleCheckBox, setToggleCheckBox)
                      : criteriaName == "typeOfEscrow"
                      ? handleFilterAll(
                          toggleTypeOfEscrowCheckBox,
                          setToggleTypeOfEscrowCheckBox
                        )
                      : handleFilterAll(
                          toggleTypeCheckBox,
                          setToggleTypeCheckBox
                        )
                  }
                  isChecked={
                    criteriaName == "category"
                      ? toggleCheckBox.find((element) => element.id == 0)
                          ?.status
                      : criteriaName == "typeOfEscrow"
                      ? toggleTypeOfEscrowCheckBox.find(
                          (element) => element.id == 0
                        )?.status
                      : toggleTypeCheckBox.find((element) => element.id == 0)
                          ?.status
                  }
                  rightText={t("transactionsScreen.all")}
                  rightTextStyle={{
                    fontFamily: "BahijTheSansArabic-Plain",
                    color: COLORS.black,
                    textAlign:'left'
                  }}
                />
              </TouchableOpacity>
            )}
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              {data?.map((el) => {
                return (
                  <TouchableOpacity key={el.id} style={styles.CheckBoxItem}>
                    <CheckBox
                      rightTextStyle={{
                        fontFamily: "BahijTheSansArabic-Plain",
                        color: COLORS.black,
                        textAlign:'left'
                      }}
                      style={{ fontFamily: "BahijTheSansArabicExtraBold" }}
                      onClick={
                        criteriaName == "status" ||
                        criteriaName == "category" ||
                        criteriaName == "typeOfEscrow"
                          ? () =>
                              handleFilter(
                                el,
                                criteriaName == "category"
                                  ? toggleCheckBox
                                  : criteriaName == "status"
                                  ? toggleTypeCheckBox
                                  : toggleTypeOfEscrowCheckBox,

                                criteriaName == "category"
                                  ? setToggleCheckBox
                                  : criteriaName == "status"
                                  ? setToggleTypeCheckBox
                                  : setToggleTypeOfEscrowCheckBox
                              )
                          : () =>
                              handleSorting(
                                el,
                                criteriaName == "date"
                                  ? toggledateCheckBox
                                  : togglePriceCheckBox,
                                criteriaName == "date"
                                  ? setToggledateCheckBox
                                  : setTogglePriceCheckBox
                              )
                      }
                      isChecked={handleIsChecked(
                        el,
                        criteriaName == "category"
                          ? toggleCheckBox
                          : criteriaName == "status"
                          ? toggleTypeCheckBox
                          : criteriaName == "typeOfEscrow"
                          ? toggleTypeOfEscrowCheckBox
                          : criteriaName == "date"
                          ? toggledateCheckBox
                          : togglePriceCheckBox
                      )}
                      rightText={
                        i18n.language == "en" ? el.name_en : el.name_ar
                      }
                      disabled={
                        criteriaName == "category"
                          ? toggleCheckBox.find((el) => el.id == 0).status
                          : criteriaName == "status"
                          ? toggleTypeCheckBox.find((el) => el.id == 0).status
                          : criteriaName == "typeOfEscrow"
                          ? toggleTypeOfEscrowCheckBox.find((el) => el.id == 0)
                              .status
                          : false
                      }
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </ScrollView>
        <View style={{ height: "17%" }}>
          <CustomButton
            text={`${t("transactionsScreen.apply")} ( ${
              criteriaName == "price"
                ? togglePriceCheckBox?.filter((el) => {
                    return el.status == true;
                  })?.length
                : criteriaName == "date"
                ? toggledateCheckBox?.filter((el) => {
                    return el.status == true;
                  })?.length
                : criteriaName == "status"
                ? toggleTypeCheckBox?.filter((el) => {
                    return el.status == true;
                  })?.length
                : criteriaName == "typeOfEscrow"
                ? toggleTypeOfEscrowCheckBox?.filter((el) => {
                    return el.status == true;
                  })?.length
                : toggleCheckBox?.filter((el) => {
                    return el.status == true;
                  })?.length
            } )`}
            width={"80%"}
            color={COLORS.header}
            containerStyle={{ borderRadius: 0, alignSelf: "center" }}
            onPress={() => handleFinalFilterApply(criteriaName)}
          />
        </View>
      </View>
    );
  };

  return (
    <View style={styles.fullPageCont}>
      <CustomHeader navigation={navigation} />
      {/* filters */}
      {filterLoader || loading ? (
        <ActivityIndicator
          size={"large"}
          color={COLORS.header}
          style={styles.loadingStyle}
        />
      ) : (
        <>
          <View style={styles.dropDownContainer}>
            {bottomSheetCriterias.map((el) => (
              <TouchableOpacity
                onPress={() => el.sheetRef?.current.open()}
                style={styles.filterIcons}
              >
                <Ionicons name={el.icon} size={16} color={COLORS.loginTab} />
                <CustomText
                  color={COLORS.primaryTxt}
                  size={width*0.028}
                  text={t(`transactionsScreen.${el.name}`)}
                  style={CommonStyles.filterTxt}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* cardsList */}
          <View style={CommonStyles.transactionsContainer}>
            <CustomText
              color={COLORS.primaryTxt}
              size={20}
              text={t("transactionsScreen.transactions")}
              style={CommonStyles.titleTxt}
            />
            <View style={styles.filterContainer}>
              <TouchableOpacity style={[clickedBtn=='current'? styles.filterClicked: styles.filterUnClicked]} 
              onPress={()=>{
                if(clickedBtn=='current'){ 
                  setClickedBtn('')
                  setStatusFiltrationVal([]);
                }
                else {
                  setClickedBtn('current')
                  const arr=["not-accepted", "accepted", "delivered", "accept-reject", "accepted-paid", "on-hold", "delivery-confirm"]
                  setStatusFiltrationVal(arr);
                }
                setPage(1);
                }}>
                <CustomText
                color={clickedBtn=='current'? COLORS.blue: COLORS.black}
                size={15}
                text={t("transactionsScreen.current")}/>
              </TouchableOpacity>
              <TouchableOpacity style={[clickedBtn=='finished'?styles.filterClicked:styles.filterUnClicked]} 
              onPress={()=>{
                if(clickedBtn=='finished') {
                  setClickedBtn('')
                  setStatusFiltrationVal([]);
                }
                else {
                  setClickedBtn('finished')
                  const arr=["completed", "canceled"]
                  setStatusFiltrationVal(arr);
                }
                setPage(1);
                }}>
              <CustomText
                color={clickedBtn=='finished'? COLORS.blue: COLORS.black}
                size={15}
                text={t("transactionsScreen.finished")}/>
              </TouchableOpacity>
            </View>
            {transactionsList?.length == 0 ? (
              <View style={{ alignSelf: "center" }}>
                <Lottie
                style={{
                  width: wp(20),
                  height: hp(20),
                }}
                source={require("../../assets/lottie/80582-empty-cart.json")}
                autoPlay
                loop={true}/>
                <CustomText
                  color={COLORS.primaryTxt}
                  size={20}
                  text={t("transDetailsScreen.noD")}
                />
              </View>
            ) : (
              <FlatList
                refreshControl={
                  <RefreshControl
                    refreshing={loading}
                    onRefresh={() => {
                      setPage(1);
                      getTransactionList(false);
                    }}
                  />
                }
                data={transactionsList}
                renderItem={({ item: el }) => (
                  <TransactionCard
                    key={el.escrow_number}
                    navigation={navigation}
                    el={el}
                    isClickable={true}
                  />
                )}
                keyExtractor={(item, index) => index}
                onEndReached={() => {
                  if (page <= paginationInfo.last_page) {
                    setPage(page + 1);
                    setMoreDataLoader(true);
                  } else {
                    setMoreDataLoader(false);
                  }
                }}
                initialNumToRender={5}
                maxToRenderPerBatch={5}
                onEndReachedThreshold={0.1}
                ListFooterComponent={() => {
                  // console.log("pag", paginationInfo.last_page, page);

                  return (
                    <View>
                      {paginationInfo?.last_page >= page && (
                        <ActivityIndicator
                          color={COLORS.header}
                          size={"small"}
                          loading={moreDataLoader}
                        />
                      )}
                      {paginationInfo?.last_page < page && !moreDataLoader && (
                        <CustomText
                          color={COLORS.header}
                          size={16}
                          text={`${t("noMore")} ${transactionsList?.length}`}
                        />
                      )}
                    </View>
                  );
                }}
              />
            )}
            {}
          </View>

          {/* SheetRefs */}
          <RBSheet
            ref={refRBSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#00000060",
              },
              container: { minHeight: "38%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8), },
            }}
          >
            <SheetComponent
              data={categoryData}
              BShRef={refRBSheet}
              criteriaName={"category"}
            />
          </RBSheet>

          <RBSheet
            ref={refRBStatusSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#00000060",
              },
              container: { height: "40%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8), },
            }}
          >
            <SheetComponent
              data={StatusData}
              BShRef={refRBStatusSheet}
              criteriaName={"status"}
            />
          </RBSheet>
          <RBSheet
            ref={refRBTypeOfEscrowSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#00000060",
              },
              container: { height: "30%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
             
            }}
          >
            <SheetComponent
              data={TypeOfEscrowData}
              BShRef={refRBTypeOfEscrowSheet}
              criteriaName={"typeOfEscrow"}
            />
          </RBSheet>
          <RBSheet
            ref={refRBDateSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#00000060",
              },
              container: { height: "30%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
            }}
          >
            <SheetComponent
              data={dateData}
              BShRef={refRBDateSheet}
              criteriaName={"date"}
            />
          </RBSheet>
          <RBSheet
            ref={refRBPriceSheet}
            closeOnDragDown={false}
            closeOnPressMask={true}
            customStyles={{
              wrapper: {
                backgroundColor: "#00000060",
              },
              container: { height: "30%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
            }}
          >
            <SheetComponent
              data={valueData}
              BShRef={refRBPriceSheet}
              criteriaName={"price"}
            />
          </RBSheet>
        </>
      )}
    </View>
  );
};
export default TransactionsListScreen;
