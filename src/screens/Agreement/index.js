import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  RefreshControl,
  FlatList,
} from "react-native";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import createStyles from "./styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomInput from "../../components/customInput";
import CustomButton from "../../components/customButton";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Lottie from "lottie-react-native";
import { hp, wp } from "../../utilis/dimensions";
import SelectDropdown from "react-native-select-dropdown";
import CustomAlert from "../../components/CustomAlert";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import axios from "axios";
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import { showMessage } from "react-native-flash-message";
import Swipeable from "react-native-gesture-handler/Swipeable";
import RBSheet from "react-native-raw-bottom-sheet";
import CheckBox from "react-native-check-box";
import Textarea from "react-native-textarea";

const AgreementScreen = ({ navigation }) => {
  const [baseURL, setBaseURL] = useState("");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [modalVisible, setModalVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [remove, setRemove] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const [catNum, setCatNum] = useState(0);
  const [warning, setWarning] = useState(false);
  const [agreementList, setAgreementList] = useState([]);
  const [aggFilteredList, setAggFilteredList] = useState([]);
  const [deleteWarning, setDeleteWarning] = useState({ state: false, id: 0 });
  const [agreementLoading, setAgreementLoading] = useState(true);
  const [errMess, setErrMess] = useState(false);
  const [showErr, setShowErr] = useState(false);
  const [aggName, setAggName] = useState(null);
  const [aggMore, setAggMore] = useState(null);
  const [editId, setEditId] = useState(null);
  const [category, setCategory] = useState(null);
  const [categoryList, setCategoryList] = useState([]);
  const [agreementDocs, setAgreementDocs] = useState(null);
  const [categoryIDs, setCategoryIDs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [categoryLoading, SetCategoryLoading] = useState(true);
  const [viewAgree, setViewAgree] = useState(false);
  const [viewDocs, setViewDocs] = useState(null);
  const [deletedId, setDeletedId] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [page, setPage] = useState(1);
  const [moreDataLoader, setMoreDataLoader] = useState(false);
  const [paginationInfo, setPaginationInfo] = useState({});

  const agRef1 = useRef();
  const agRef2 = useRef();
  const swipRef = useRef();
  let row = [];
  let prevOpenedRow;
  const refRBSheet = useRef();
  const [categoryFiltrationVal, setCategoryFiltrationVal] = useState([]);
  const [toggleCheckBox, setToggleCheckBox] = useState([
    //category
    { id: 0, status: false },
    { id: 1, status: false },
    { id: 2, status: false },
    { id: 3, status: false },
  ]);
  const [sheetCategories, setSheetCategories] = useState([]);
  const [downloadLoading, setDownloadLoading] = useState(false);

  const closeRow = (index) => {
   
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  const handleFinalFilterApply = (Filter) => {
  
    if (
      toggleCheckBox.filter((el) => el.status == false)?.length ==
      toggleCheckBox.length
    ) {
      setAggFilteredList(agreementList);
      refRBSheet.current.close();
      // getTransactionList(false);
    } else applyCategoryFiltration();
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

  const handleFilter = (el, criteriaVal, setCriteriaVal) => {
    // console.log('method',el,togglePriceCheckBox)
    let specificElement = criteriaVal.find((element) => element.id == el.id);
    let arrWithoutElement = criteriaVal.filter(
      (e) => e.id != specificElement.id
    );
    const arrayToSet = [...arrWithoutElement];
    arrayToSet.push({
      id: specificElement.id,
      status: !specificElement.status,
    });
    setCriteriaVal(arrayToSet);
  };
  const applyCategoryFiltration = () => {
    const checkedIds = toggleCheckBox
      .filter((e, index) => e.status == true)
      ?.map((e) => e.id);
    if (checkedIds.length == 3) {
      setAggFilteredList(agreementList);
    } else if (checkedIds[0] == 0) {
      setAggFilteredList(agreementList);
    } else {
      // setAggFilteredList(agreementList.filter((el) => el.category_id == catID));
      let arr = [];
      agreementList.map((el) => {
        checkedIds.map((it) => {
          if (el.category_id == it) {
            arr.push(el);
          }
        });
      });
      setAggFilteredList(arr);
    }
    refRBSheet.current.close();
  };
  const handleIsChecked = (el, criteriVal) => {
    return criteriVal?.find((element) => element.id == el.id)?.status;
  };
  const handleDeleteAllFilters = () => {
    setToggleCheckBox(
      toggleCheckBox.map((el) => {
        el.status = false;
        return el;
      })
    );
  };
  const SheetComponent = ({ data, BShRef, criteriaName }) => (
    <ScrollView
      style={{
        backgroundColor: COLORS.bg,
        flex: 1,
      }}
    >
      <View
        style={{
          backgroundColor: COLORS.white,
          paddingVertical: 10,
          // marginBottom: hp(20),
          paddingHorizontal: wp(5),
          flex: 1,
          minHeight: hp(40),
        }}
      >
        {/* filterHeader */}
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity onPress={() => handleDeleteAllFilters()}>
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
          <TouchableOpacity onPress={() => refRBSheet.current.close()}>
            <Ionicons name="close" size={30} color={COLORS.blue} />
          </TouchableOpacity>
        </View>

        {/* filterdata */}
        <View style={styles.CheckBoxContainer}>
          <TouchableOpacity style={styles.CheckBoxItem}>
            <CheckBox
              style={{}}
              onClick={() => handleFilterAll(toggleCheckBox, setToggleCheckBox)}
              isChecked={
                toggleCheckBox.find((element) => element.id == 0)?.status
              }
              rightText={t("transactionsScreen.all")}
              rightTextStyle={{ color: COLORS.black }}
            />
          </TouchableOpacity>
          {/* ALL OPTION FOR EACH FILTER CRITERIA */}
          {data?.map((el) => {
            return (
              <TouchableOpacity key={el.id} style={styles.CheckBoxItem}>
                <CheckBox
                  style={{}}
                  onClick={() =>
                    handleFilter(el, toggleCheckBox, setToggleCheckBox)
                  }
                  isChecked={handleIsChecked(el, toggleCheckBox)}
                  rightText={el.name}
                  rightTextStyle={{ color: COLORS.black }}
                  disabled={
                    criteriaName == "category"
                      ? toggleCheckBox.find((el) => el.id == 0).status
                      : false
                  }
                />
              </TouchableOpacity>
            );
          })}
        </View>
        <CustomButton
          text={`${t("transactionsScreen.apply")} ( ${
            toggleCheckBox?.filter((el) => {
              return el.status == true;
            })?.length
          } )`}
          width={"80%"}
          color={COLORS.header}
          containerStyle={{ borderRadius: 0, alignSelf: "center" }}
          onPress={() => handleFinalFilterApply(criteriaName)}
        />
      </View>
    </ScrollView>
  );
  const handleUploadِAgreementDocuments = () => {
    DocumentPicker.pickSingle({
      type: "*/*",
      readContent: true,
    }).then((pdf) => {
      console.log("pdf : ", `${pdf}`);
      if (pdf) {
        RNFetchBlob.fs.readFile(pdf?.uri, "base64").then((data) => {
          setAgreementDocs({
            base64: data,
            name: pdf?.name,
            extension: `.${pdf?.type.split("/").pop()}`,
          });
        });
        return;
      }
    });
  };
  const downloadFileFetch = async (url) => {
    setDownloadLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status == "ok") checkPermission(response.url);
      })
      .catch((er) => {
        console.log("erorr file : ", er);
        setDownloadLoading(false);
      });
  };
  // to download files
  const checkPermission = async (url) => {
    if (Platform.OS === "ios") {
      downloadFile(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: t("agreementScreen.sp"),
            message: t("agreementScreen.na"),
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(url);
          console.log("Storage Permission Granted.");
        } else {
          // If permission denied then show alert
          setDownloadLoading(false);
          showMessage({ message: t("agreementScreen.png"), type: "warning",titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
          // Alert.alert(t("agreementScreen.png"));
        }
      } catch (err) {
        // To handle permission related exception
        setDownloadLoading(false);
        console.log("++++" + err);
      }
    }
  };

  const downloadFile = async (url) => {
    // setDownloadLoading(true);
    showMessage({ message: t("agreementScreen.startD"), type: "success",titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
    const token = await AsyncStorage.getItem("TOKEN");
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = url;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = "." + file_ext[0];
    console.log("sss : ", file_ext);

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        title: `downloading file`,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", FILE_URL, {
        Authorization: "Bearer " + token,
        // "Content-Type": "application/json",
      })
      .then((res) => {
        setDownloadLoading(false);
        false;
        // Alert after successful downloading
        showMessage({ message: t("agreementScreen.fds"), type: "success",titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
  
        // alert(res);
      })
      .catch((er) => {
        setDownloadLoading(false);
        false;
        console.log("eeeeee : ", er);
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };

  const getCategories = async () => {
    SetCategoryLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    axios({
      method: "GET",
      url: baseURL + ENDPOINTS.categoryList,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        SetCategoryLoading(false);
        if (res?.data?.status == "ok") {
          let catNames = [];
          let catIds = [];
          let categoryData = [];
          if (res?.data.categories[0] && res?.data.categories[0]?.length > 0) {
            if (i18n.language == "en") {
              res?.data.categories[0]?.map((el, index) => {
                catNames.push(el?.name_en);
                catIds.push(el.id);
                categoryData.push({
                  name: el?.name_en,
                  id: index + 1,
                });
              });
            } else {
              res?.data.categories[0]?.map((el, index) => {
                catNames.push(el?.name_ar);
                catIds.push(el.id);
                categoryData.push({
                  name: el?.name_ar,
                  id: index + 1,
                });
              });
            }
          }
          setCategoryList(catNames);
          setSheetCategories(categoryData);
          setCategoryIDs(catIds);
          setCategory(catNames[0]);
          setSelectedId(catIds[0]);
          // setLoading(false);
        } else {
          // setErrMess(res?.data?.message);
          setCategory("");
          //setLoading(false);
          //setWarning(true);
        }
      })
      .catch((er) => {
        SetCategoryLoading(false);
        //  setErrMess(t('accountScreen.err'));
        setCategory("");
        //setWarning(true);
        console.log("er : ", er);
        //setLoading(false);
      });
  };

  useEffect(() => {
    if (!baseURL) return;
    getAgreementList();
    getCategories();
  }, [navigation, baseURL,page]);

  const onRefresh = () => {
    getAgreementList();
  };
  const getAgreementList = async () => {
   page==1&&
    setAgreementLoading(true);
    // console.log('in get agreement list...');
    const token = await AsyncStorage.getItem("TOKEN");
   
    let url = `${baseURL}` + `${ENDPOINTS.agreementList}` + `?page=${page}`;
  // let url = baseURL + ENDPOINTS.agreementList; 
   axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    })
      .then((res) => {
        if (res?.data?.data?.agreements) {
          setPaginationInfo(res?.data?.data?.agreements)
          if(page==1)
          {
            setAgreementList(res?.data?.data?.agreements?.data);
            setAggFilteredList(res?.data?.data?.agreements?.data);
         }
          else{
            setAgreementList([...agreementList,...res?.data?.data?.agreements?.data]);
            setAggFilteredList([...aggFilteredList,...res?.data?.data?.agreements?.data]);
          }
  
          setAgreementLoading(false);
        } else if (
          res?.data?.messages?.error
        ) {
          setErrMess(
           res?.data?.messages?.error
          );
          setAgreementLoading(false);
          setWarning(true);
        }
      })
      .catch((er) => {
        setErrMess(t("accountScreen.err"));
        setAgreementLoading(false);
        // setWarning(true);
      });
  };

  const handleDeleteAgreement = async (Id) => {
    setDeleteLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS.deleteAgreement,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      data: { 
        id: Id,
        device_info: deviceInfo
       },
    })
      .then((res) => {
        setDeleteLoading(false);
        // console.log('res of agree : ', res);
        if (res?.data?.messages?.success) {
          setDeleteWarning({ state: false, id: 0 });
          setRemove(true);
          setShow(true);
          getAgreementList();
        } else {
          setDeleteWarning({ state: false, id: 0 });
          setErrMess(
           res?.data?.messages?.error
          );
          setWarning(true);
        }
      })
      .catch((er) => {
        setDeleteLoading(false);
        showMessage({
          message: er,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
      });
  };

  const editAgreement = async () => {
    console.log("edit", editId);
    setLoading(true);
    //  console.log('in create agreement...');
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let dataObj = agreementDocs
      ? {
          id: editId,
          title: aggName,
          description: aggMore,
          category_id: selectedId,
          attachment: agreementDocs,
          device_info: deviceInfo
        }
      : {
          id: editId,
          title: aggName,
          description: aggMore,
          category_id: selectedId,
          device_info: deviceInfo
        };
  
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS.editAgreement,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      data: dataObj,
    })
      .then((res) => {
        setLoading(false);
      
        if (res?.data?.messages?.success) {
          console.log("res : ", res?.data);
          setModalVisible(!modalVisible);
          setShow(true);
          setAggName(null);
          setAggMore(null);
          setCategory(categoryList[0]);
          setSelectedId(categoryIDs[0]);
          setAgreementDocs(null);
          getAgreementList();
        } else {
          setErrMess(
             res?.data?.messages?.error
          );
          setWarning(true);
          // console.log("res from error : ", res?.data?.error);
          // showMessage({
          //   message: res?.data?.error,
          //   type: "success",
          // });
        }
      })
      .catch((er) => {
        setLoading(false);
        console.log("er : ", er);
      });
  };

  const createAgreement = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let dataObj = agreementDocs
      ? {
          title: aggName,
          description: aggMore,
          category_id: selectedId,
          attachment: agreementDocs,
          device_info: deviceInfo
        }
      : {
          title: aggName,
          description: aggMore,
          category_id: selectedId,
          device_info: deviceInfo
        };
    axios({
      method: "POST",
      url: baseURL + ENDPOINTS.addAgreement,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      data: dataObj,
    })
      .then((res) => {
        setLoading(false);
        console.log("res of add agreement : ", res?.data);
        if (res?.data?.messages?.success) {
          console.log("res : ", res?.data);
          setModalVisible(!modalVisible);
          setShow(true);
          setAggName(null);
          setAggMore(null);
          setCategory(categoryList[0]);
          setSelectedId(categoryIDs[0]);
          setAgreementDocs(null);
          getAgreementList();
        } else {
          console.log("res : ", res?.data?.messages?.error);
          setErrMess(
            res?.data?.messages?.error
          );
          setWarning(true);
          // showMessage({
          //   message: es?.data?.message?.error,
          //   type: "danger",
          // });
        }
      })
      .catch((er) => {
        setLoading(false);
        console.log("er : ", er);
      });
  };

  const renderLeftActions = (progress, dragX, item, ii) => {
    // console.log("item : ", ii);
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [-5, 0, 0, 1],
    });
    return (
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: wp(6),
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setEdit(true);
            setAggName(item.title);
            setAggMore(item.description);
            setEditId(item.id);
            categoryIDs.map((el, index) => {
              if (el == item.category_id) {
                setSelectedId(el);
                setCategory(categoryList[index]);
              }
            });
            setModalVisible(!modalVisible);
          }}
          style={{
            backgroundColor: "green",
            height: "80%",
            width: wp(18),
            justifyContent: "space-around",
            borderTopRightRadius: wp(5),
            borderBottomRightRadius: wp(5),
            // marginLeft: wp(1),
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Ionicons
            style={{ alignSelf: "center", marginLeft: 5 }}
            color={COLORS.white}
            size={20}
            name="pencil-outline"
          />
          <CustomText
            color={COLORS.wjite}
            size={14}
            text={t("agreementScreen.edit")}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setDeleteWarning({ state: true, id: ii })}
          style={{
            backgroundColor: "red",
            height: "80%",
            width: wp(18),
            // justifyContent: "center",
            // borderRadius: wp(5),
            flexDirection: "row",
            justifyContent: "space-around",
            borderTopLeftRadius: wp(5),
            borderBottomLeftRadius: wp(5),
          }}
        >
          <Ionicons
            style={{ alignSelf: "center" }}
            color={COLORS.white}
            size={20}
            name="trash-outline"
          />
          <CustomText
            color={COLORS.white}
            size={14}
            text={t("agreementScreen.remove")}
          />
        </TouchableOpacity>
      </View>
    );
  };
  const AgreementItem = ({ Item, Index }) => {
    return (
      <Swipeable
        // ref={swipRef}
        friction={1}
        ref={(ref) => (row[Index] = ref)}
        onSwipeableOpen={() => closeRow(Index)}
        renderRightActions={(progress, dragX) =>
          i18n.language == "ar" &&
          renderLeftActions(progress, dragX, Item, Item.id)
        }
        renderLeftActions={(progress, dragX) =>
          i18n.language == "en" &&
          renderLeftActions(progress, dragX, Item, Item.id)
        }
      >
        <TouchableOpacity
          onPress={() => {
            setViewAgree(true);
            setViewDocs(Item?.attachment_path);
            setAggName(Item.title);
            setAggMore(Item.description);
            categoryIDs.map((el, index) => {
              if (el == Item.category_id) {
                setSelectedId(el);
                setCategory(categoryList[index]);
              }
            });
            setModalVisible(!modalVisible);
          }}
          style={styles.agreementItem}
        >
          <View style={styles.agreementContent}>
            <CustomText
              color={COLORS.black}
              size={14}
              text={
                <View
                  style={{
                    flexDirection:
                      i18n.language == "en" ? "row" : "row-reverse",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="reader-outline"
                    size={18}
                    color={COLORS.loginTab}
                  />
                  <CustomText color={COLORS.black} size={15}>
                    {t("agreementScreen.agName2")}
                  </CustomText>
                  <CustomText style={{ color: COLORS.grayColor }}>
                    {Item?.title}
                  </CustomText>
                </View>
              }
              style={styles.agreeHeader}
            />
          </View>
          <View style={styles.editCon}>
            {Item?.attachment_path ? (
              <Ionicons
                // onPress={() => Linking.openURL(Item?.attachment_path)}
                style={{ alignSelf: "center", marginLeft: 5 }}
                color={COLORS.header}
                size={25}
                name="attach-outline"
              />
            ) : (
              <CustomText
                color={COLORS.red}
                size={5}
                text={""}
                style={styles.text}
              />
            )}
            <View style={{ flexDirection: "row" }}>
              <Ionicons name="ios-layers" size={18} color={COLORS.loginTab} />
              <CustomText
                color={COLORS.darkBlue}
                size={12}
                text={categoryIDs.map((el, index) => {
                  if (el == Item.category_id) {
                    return categoryList[index];
                  }
                })}
                style={{ alignSelf: "center", marginLeft: wp(1) }}
              />
            </View>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };
  return (
    <>
      <CustomHeader navigation={navigation} />
      <View style={ {flex:1,}}>

        <View style={styles.agreementTitle}>
          <CustomText
            color={COLORS.darkBlue}
            size={20}
            text={t("agreementScreen.agreement")}
            style={styles.title}
          />
          <View
            style={{
              // width: "20%",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              disabled={categoryLoading}
              onPress={() => refRBSheet.current.open()}
              // style={styles.addContainer}
            >
              <AntDesign name="filter" size={35} color={COLORS.header} />
            </TouchableOpacity>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
              style={styles.addContainer}
            >
              <CustomText
                color={COLORS.blue}
                size={14}
                text={t("agreementScreen.add")}
                style={styles.title}
              />
              <Ionicons name="add" size={18} color={COLORS.loginTab} />
            </Pressable>
          </View>
        </View>
        {!agreementLoading ? (
          aggFilteredList?.length > 0 ? (
            // aggFilteredList?.map((el, index) => (
            //   <AgreementItem Item={el} Index={index} />
            // ))
            <FlatList
            // style={{marginTop:hp(10)}}
              refreshControl={
             <RefreshControl refreshing={refresh} onRefresh={onRefresh} />
             }
            data={aggFilteredList}
            renderItem={({ item: el ,index}) => (

              <AgreementItem Item={el} Index={index} />
            )}
            keyExtractor={(item, index) => index}
            onEndReached={() => {
              console.log('End',page,paginationInfo.last_page)
              if (page <= paginationInfo?.last_page) {
               
                setPage(page + 1)
                setMoreDataLoader(true)
                
             }
             else {
               setMoreDataLoader(false)
             }

            }
          }
        
              onEndReachedThreshold={0.1}
                initialNumToRender={5}
              maxToRenderPerBatch={5}
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
                      text={`${t('noMore')} ${aggFilteredList?.length}`}
                     />
                     }
                </View>
              }
               />
          ) : (
            <CustomText
              text={t("agreementScreen.NoData")}
              color={COLORS.header}
              style={{ marginVertical: hp(5) }}
            />
          )
        ) : (
          <ActivityIndicator
            color={COLORS.header}
            style={{ marginVertical: hp(5) }}
          />
        )}

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={styles.centeredView}
              style={styles.centeredView2}
            >
              <TouchableOpacity style={styles.closeCont}>
                <AntDesign
                  onPress={() => {
                    setModalVisible(!modalVisible);
                    setEdit(false);
                    setViewAgree(false);
                    setViewDocs(null);
                    setAggMore(null);
                    setAggName(null);
                    setAgreementDocs(null);
                    setCategory(categoryList[0]);
                    setSelectedId(categoryIDs[0]);
                    setEditId(null);
                  }}
                  name={"closecircleo"}
                  size={30}
                  color={COLORS.red}
                />
              </TouchableOpacity>

              <CustomText
                color={COLORS.blue}
                size={18}
                text={
                  edit
                    ? t("agreementScreen.editAg")
                    : viewAgree
                    ? t("agreementScreen.previewAgg")
                    : t("agreementScreen.newAg")
                }
                style={styles.title}
              />
              {viewAgree ? (
                <>
                  <View style={styles.labledDes2}>
                    <Ionicons
                      name="reader-outline"
                      size={18}
                      color={COLORS.loginTab}
                      style={{ marginRight: wp(1) }}
                    />
                    <CustomText
                      color={COLORS.header}
                      size={15}
                      text={t("agreementScreen.viewTitle")}
                    />
                  </View>
                  <CustomText
                    color={COLORS.proTxt}
                    size={15}
                    text={aggName}
                    style={styles.viewTitle}
                  />
                </>
              ) : (
                <CustomInput
                  // editable={!viewAgree}
                  inputRef={agRef1}
                  value={aggName}
                  onChangeText={setAggName}
                  label={t("agreementScreen.agName")}
                  placeholder={"Agreement"}
                  error={aggName?.length == 0 || aggName == null}
                  errorMessage={t("requiredField")}
                  icon={
                    <Ionicons name="flag" size={20} color={COLORS.babyBlue2} />
                  }
                  containerStyle={styles.agreementName}
                  textInputStyle={{ width: wp(56) }}
                  multiline={true}
                  labelStyle={{
                    color: COLORS.header,
                    fontSize: 14,
                  }}
                />
              )}
              {viewAgree ? (
                <>
                  <View style={styles.labledDes2}>
                    <Ionicons
                      name="ios-layers"
                      size={18}
                      color={COLORS.loginTab}
                      style={{ marginRight: wp(1) }}
                    />
                    <CustomText
                      color={COLORS.header}
                      size={15}
                      text={t("agreementScreen.viewCat")}
                    />
                  </View>
                  <CustomText
                    color={COLORS.proTxt}
                    size={15}
                    text={category}
                    style={styles.viewTitle}
                  />
                </>
              ) : (
                <>
                  <CustomText
                    color={COLORS.header}
                    size={15}
                    text={t("agreementScreen.c")}
                    style={styles.title2}
                  />
                  <SelectDropdown
                    data={categoryList}
                    defaultButtonText={category}
                    defaultValue={category}
                    renderDropdownIcon={() => {
                      return (
                        <FontAwesome5
                          name="caret-down"
                          size={20}
                          color={COLORS.babyBlue2}
                        />
                      );
                    }}
                    buttonTextStyle={styles.dropDownBtnTxt}
                    buttonStyle={styles.dropDownBtn}
                    rowStyle={styles.dropDownRow}
                    rowTextStyle={styles.dropDownTxt}
                    onSelect={(val, index) => {
                      console.log("name id : ", val, categoryIDs[index]);
                      setCategory(val);
                      setSelectedId(categoryIDs[index]);
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                      return selectedItem;
                    }}
                    rowTextForSelection={(item, index) => {
                      return item;
                    }}
                    // dropdownIconPosition="left"
                  />
                </>
              )}
              <View style={viewAgree ? styles.labledDes2 : styles.labledDes4}>
                {viewAgree && (
                  <Ionicons
                    name="reader-outline"
                    size={18}
                    style={{ marginRight: wp(1) }}
                    color={COLORS.loginTab}
                  />
                )}
                <CustomText
                  color={COLORS.header}
                  size={15}
                  text={t("agreementScreen.agDesc")}
                />
              </View>
              {viewAgree ? (
                <CustomText
                  color={COLORS.proTxt}
                  size={15}
                  text={aggMore}
                  style={styles.agreeDesc}
                />
              ) : (
                <>
                  <Textarea
                    required={true}
                    inputRef={agRef2}
                    style={{
                      fontFamily: "BahijTheSansArabic-Plain",
                      textAlign:i18n.language=='ar'?'right': 'left',
                      color: COLORS.black,
                      height:'100%',
                      textAlignVertical:'top'
                    }}
                    containerStyle={[
                      styles.textareaContainer,
                      { borderColor: aggMore ? COLORS.header : COLORS.red },
                    ]}
                    onChangeText={setAggMore}
                    maxLength={200}
                    placeholder={t("agreementScreen.more")}
                    placeholderTextColor={"#c7c7c7"}
                    underlineColorAndroid={"transparent"}
                    value={aggMore}
                  />
                  {!aggMore && (
                    <CustomText
                      color={COLORS.red}
                      size={13}
                      style={{ textAlign: "center" }}
                    >
                      {t("requiredField")}
                    </CustomText>
                  )}
                </>
              )}
              {viewAgree && (
                <>
                  <View
                    style={[
                      styles.labledDes2,
                      {
                        marginVertical: hp(-1),
                      },
                    ]}
                  >
                    <Ionicons
                      name="ios-attach-outline"
                      size={18}
                      color={COLORS.loginTab}
                      style={{ marginRight: wp(1) }}
                    />
                    <CustomText
                      color={COLORS.header}
                      size={15}
                      text={t("agreementScreen.viewAtt")}
                    />
                  </View>
                  {viewDocs ? (
                    <>
                      <CustomButton
                        loading={downloadLoading}
                        disabled={downloadLoading}
                        color={COLORS.header}
                        onPress={() => downloadFileFetch(viewDocs)} // Linking.openURL()
                        textSize={12}
                        text={t("agreementScreen.vAtt")}
                        containerStyle={[
                          styles.closeButton,
                          {
                            height: hp(5),
                            borderColor: COLORS.header,
                            width: wp(30),
                          },
                        ]}
                      />
                      {/* <CustomText
                      color={COLORS.proTxt}
                      size={15}
                      text={viewDocs}
                      style={styles.viewTitle}
                    /> */}
                    </>
                  ) : (
                    <CustomText
                      color={COLORS.proTxt}
                      size={15}
                      text={viewDocs ? "" : t("agreementScreen.noAtt")}
                      style={styles.viewTitle}
                    />
                  )}
                </>
              )}
              {viewAgree == false && (
                <>
                  <CustomButton
                    color={COLORS.blue}
                    onPress={handleUploadِAgreementDocuments}
                    textSize={14}
                    text={t("agreementScreen.addAttachement")}
                    containerStyle={styles.btn}
                  />
                  {agreementDocs != null && (
                    <CustomText
                      // key={index}
                      color={COLORS.proTxt}
                      size={15}
                      text={agreementDocs.name}
                      style={styles.title4}
                    />
                  )}
                  <CustomButton
                    disabled={loading}
                    loading={loading}
                    color={COLORS.blue}
                    onPress={() => {
                      aggName == null || aggName?.length == 0
                        ? agRef1.current.focus()
                        : aggMore == null || aggMore?.length == 0
                        ? agRef2.current.focus()
                        : edit
                        ? editAgreement()
                        : createAgreement();
                    }}
                    textSize={12}
                    text={
                      edit
                        ? t("agreementScreen.update")
                        : t("agreementScreen.add")
                    }
                    containerStyle={styles.btn}
                  />
                </>
              )}
              {/* <CustomButton
                color={COLORS.white}
                onPress={() => {
                  setModalVisible(!modalVisible);
                  setEdit(false);
                  setViewAgree(false);
                  setViewDocs(null);
                  setAggMore(null);
                  setAggName(null);
                  setAgreementDocs(null);
                  setCategory(categoryList[0]);
                  setSelectedId(categoryIDs[0]);
                  setEditId(null);
                }}
                textSize={12}
                text={t("agreementScreen.close")}
                containerStyle={styles.closeButton}
                textStyle={styles.closeButtonTxt}
              /> */}
            </ScrollView>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            setShow(false);
          }}
        >
          <View style={styles.modalView}>
            <ScrollView
              contentContainerStyle={styles.centeredView3}
              style={styles.centeredView2}
            >
              <Lottie
                style={styles.logo2}
                source={require("../../assets/lottie/paymentDoneLottie.json")}
                autoPlay
                loop={false}
              />
              <CustomText
                color={COLORS.header}
                size={20}
                text={
                  remove
                    ? t("agreementScreen.agre")
                    : edit
                    ? t("agreementScreen.aged")
                    : t("agreementScreen.agad")
                }
                style={styles.title}
              />
              <CustomButton
                color={COLORS.white}
                onPress={() => {
                  setShow(false);
                  setEdit(false);
                  setRemove(false);
                }}
                textSize={16}
                text={t("agreementScreen.close")}
                containerStyle={styles.closeButton2}
                textStyle={styles.closeButtonTxt}
              />
            </ScrollView>
          </View>
        </Modal>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={false}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: "#00000060",
            },
            container: { height: "43%",borderTopLeftRadius: wp(8),borderTopRightRadius: wp(8) },
          }}
        >
          <SheetComponent
            data={sheetCategories}
            BShRef={refRBSheet}
            criteriaName={"category"}
          />
        </RBSheet>
        <CustomAlert
          type={'error'}
          show={warning}
          header={t("accountScreen.w")}
          body={errMess}
          action1={() => {
            setWarning(false);
          }}
          btn1={t("accountScreen.ok")}
          oneBtn={true}
        />
         <CustomAlert
          type={'error'}
          show={deleteWarning.state}
          header={t("accountScreen.w")}
          body={t("agreementScreen.removeBody")}
          action1={() => handleDeleteAgreement(deleteWarning.id)}
          action2={() => {
            setDeleteWarning({ state: false, id: 0 });
            console.log("iddd : ", deleteWarning.id);
          }}
          btn1={t("accountScreen.ok")}
          // loading={deleteLoading}
          btn2={t("cancle")}
          oneBtn={false}
        />
       </View>
    </>
  );
};
export default AgreementScreen;
