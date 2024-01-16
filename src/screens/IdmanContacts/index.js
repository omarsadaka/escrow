import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Image,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  PermissionsAndroid
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import { height, hp, wp } from "../../utilis/dimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import { useSelector, useDispatch } from "react-redux";
import Contacts from "react-native-contacts";
import CustomInput from "../../components/customInput";
import RBSheet from "react-native-raw-bottom-sheet";
import { storeStackValue } from "../../redux/actions/user";
import axios from "axios";
import moment from "moment";

const IdmanContacts = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const isFocused = useIsFocused();
  const contactRef = useRef({});
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState(false);
  const [value, setValue] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [transactionsList, setTransactionList] = useState([]);
  const [filterLoader, setFilterLoader] = useState(false);
  const [customerID, setCustomerID] = useState(null);

  const data=[
    {type: 1,title:'title 1',subTitle:'sub-title 1',price:'140.00',date:'13-11-2023'},
    {type: 0,title:'title 2',subTitle:'sub-title 2',price:'160.00',date:'13-11-2023'},
    {type: 0,title:'title 3',subTitle:'sub-title 3',price:'195.00',date:'13-11-2023'},
    {type: 1,title:'title 4',subTitle:'sub-title 4',price:'110.00',date:'13-11-2023'}
  ]

  

 

  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
    getContacts()
  }, [navigation, baseURL,]);


  useEffect(() => {
    const getID = async () => {
      const CUSTOMER_ID = await AsyncStorage.getItem("CUSTOMER_ID");
      setCustomerID(CUSTOMER_ID);
    };
    getID();
  }, []);

  const getContacts = () => {
    try {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
        title: "Contacts",
        message: "This app would like to view your contacts.",
        buttonPositive: "Please accept bare mortal",
      }).then((res) => {
        setLoading(false)
        if (res == "granted") {
          Contacts.getAll().then((contacts) => {
            console.log('contacts',contacts)
            setContacts(contacts);
            setFilteredContacts(contacts);
          });
        } else {
          console.log("err per");
          // showMessage({ message: t("permission denied"), type: "warning" });
        }
      });
    } catch (error) {
      setLoading(false)
      console.log("err per 2");
    }
  };
  const getTransactionList = async () => {
    setFilterLoader(true)
    let token = await AsyncStorage.getItem("TOKEN");
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    let url = `${baseURL}` + `${ENDPOINTS.myEscrows}` + `?page=1`;
    let dataObj = {
      type: "",
      category: "",
      escrow_type: "",
      is_draft: "",
      sort_by: '',
      // device_info: deviceInfo
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
        console.log("reeeesssss : ", res?.data?.escrows[0]?.data);
        if (res?.data?.status == "ok") {
           setTransactionList(res?.data?.escrows[0]?.data)
          setFilterLoader(false);
        } else {
          setFilterLoader(false);
          showMessage({
            message: res?.data?.message,
            type: "info",
            titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
          });
        }
      })
      .catch((er) => {
        console.log("erererer : ", er?.message);
        showMessage({
          message: er?.message,
          type: "danger",
          titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'}
        });
        setFilterLoader(false);
      });
  };
  const onChangeSearchText = (query) => {
    setSearchQuery(query);
    const filteredData = contacts.filter(
      (contact) =>
        contact?.displayName?.toLowerCase().includes(query.toLowerCase()) ||
        contact?.phoneNumbers[0]?.number
          ?.split(" ")
          .join("")
          ?.includes(query.split(" ").join(""))
    );
    setFilteredContacts(filteredData);
  };
  const ContactItemComponent = ({ el }) => {
    return (
      <Pressable
        onPress={() => {
          var number = "";
          if (el?.phoneNumbers[0]?.number?.startsWith("+966")) {
            number = el?.phoneNumbers[0]?.number.replace("+966", "");
            setValue(number.replace(/ /g, ""));
          } else if (el?.phoneNumbers[0]?.number?.startsWith("966")) {
            number = el?.phoneNumbers[0]?.number.replace("966", "");
            setValue(number.replace(/ /g, ""));
          } else if (el?.phoneNumbers[0]?.number?.startsWith("965")) {
            number = el?.phoneNumbers[0]?.number.replace("965", "");
            setValue(number.replace(/ /g, ""));
          }  else if (el?.phoneNumbers[0]?.number?.startsWith("+965")) {
            number = el?.phoneNumbers[0]?.number.replace("+965", "");
            setValue(number.replace(/ /g, ""));
          }else if (el?.phoneNumbers[0]?.number?.startsWith("0")) {
            number = el?.phoneNumbers[0]?.number.replace("0", "");
            setValue(number.replace(/ /g, ""));
          } else {
            number = el?.phoneNumbers[0]?.number?.split(" ").join("");
            setValue(number.replace(/ /g, ""));
          }
          // handlePhoneValidation(number.replace(/ /g, ""));
          if(el.hasThumbnail) setImage(el.thumbnailPath)
          setName(el.displayName)
          setNumber(el?.phoneNumbers[0]?.number)
          contactRef.current.open();
          getTransactionList()
        }}
      >
        <View style={styles.contactContainer}>
          <Image
            source={
              el?.hasThumbnail == true
                ? { uri: el.thumbnailPath }
                : require("../../assets/avatarContact.jpg")
            }
            style={styles.thumbNail}
          />

          <View style={styles.contactSubContainer}>
            <CustomText style={styles.contactTxt1} color={COLORS.header}>
              {el.displayName}
            </CustomText>
            <CustomText style={styles.contactTxt2} color={COLORS.grey}>
              {el?.phoneNumbers[0]?.number}
            </CustomText>
          </View>
        </View>
      </Pressable>
    );
  };
  const TransactionItemComponent=({ el })=>{
    return(
      <View style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          <View style={[styles.thumbNail3,{backgroundColor: el?.buyer_id == customerID?COLORS.green : COLORS.red}]}>
            <Feather name={el?.buyer_id == customerID ? "shopping-cart":"shopping-bag"} size={20} color={COLORS.white}/>
          </View>
          <View style={{flex:1, alignItems:'flex-start',marginHorizontal:wp(1)}}>
           <CustomText color={COLORS.black} size={14} text={el.escrow_number}/>
           <CustomText color={COLORS.grey} size={13} text={el.title}/>
          </View>
          <View style={{flex:1, alignItems:'flex-end',marginHorizontal: wp(1)}}>
           <CustomText color={el?.buyer_id == customerID? COLORS.green : COLORS.red} size={14} text={parseFloat(el?.escrow_amount).toFixed(2) +' '+ t('SAR')}/>
           <CustomText color={COLORS.grey} size={10} text={`${moment(el?.created_at).locale("en").format("DD-MM-YYYY  HH:mm:ss a")}`}/>
          </View>
        </View>
        <View style={styles.line}/>
      </View>
    )
  }
  const operationType=()=>{
           return(
              <View style={{width:'75%', alignItems:'center', flexDirection:'row',marginTop:hp(1)}}>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                      navigation.navigate('plus', { screen: 'ShortEscrow',params: { UserType: t("shortEscrow.buyer"), Phone: value}});
                      dispatch(storeStackValue(true));
                     }}>
                     <Ionicons name="cart-outline" size={30} color={COLORS.operationsIcons} />
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("buyer")}
                      style={styles.statisticsTxt}/>
                   </TouchableOpacity>
                   <TouchableOpacity
                     style={[styles.operationsItem,{flex:1}]}
                     onPress={() =>{
                      navigation.navigate('plus', { screen: 'ShortEscrow',params: { UserType: t("shortEscrow.seller"),  Phone: value}});
                      dispatch(storeStackValue(true));
                     }}>
                     <Ionicons name="basket-outline" size={30} color={COLORS.operationsIcons} />
                     <CustomText
                      color={COLORS.operationsItemTxt}
                      size={14}
                      text={t("seller")}
                      style={styles.statisticsTxt}/>
                   </TouchableOpacity>
              </View>
        )
  }
  const transactionHistory=()=>{
    return(
      <View style={styles.transactionHistory}>
        <CustomText 
        color={COLORS.black} size={16} 
        text={t('sideMenu.transactionHistory')}
        style={{flex:1, textAlign:'left',marginHorizontal:wp(2),marginTop: hp(1)}}/>
        <View style={styles.line}/>
        {filterLoader? <ActivityIndicator size={"large"} color={COLORS.header} />:
        <FlatList
          style={{width:'100%',padding:5}}
          data={transactionsList}
          keyExtractor={(item, index) => index}
          renderItem={({ item: el }) => (
              <TransactionItemComponent el={el} />
          )}
        />
      }
      </View>
    )
  }
  const contactDetails=()=>{
    return(
      <RBSheet
      ref={contactRef}
      height={700}
      openDuration={250}
      customStyles={{
        container: {
          // justifyContent: "center",
          // alignItems: "center",
          height: "80%",
          borderTopEndRadius:wp(8),
          borderTopStartRadius:wp(8)
        },
      }}
    >
     <View style={{height:'100%', alignItems:'center',padding: wp(2)}}>
      <Ionicons name="close" size={25} color={COLORS.blue} 
       style={{alignSelf:'flex-end'}}
       onPress={()=> contactRef.current.close()}/>
        <Image
            source={
              image
                ? { uri: el.thumbnailPath }
                : require("../../assets/avatarContact.jpg")
            }
            style={styles.thumbNail2}
          />
        <View style={styles.contactSubContainer2}>
          <CustomText style={styles.contactTxt1} color={COLORS.header}>
            {name}
          </CustomText>
          <CustomText style={styles.contactTxt2} color={COLORS.grey}>
            {number}
          </CustomText>
        </View>
        {operationType()}
        {transactionHistory()}
     </View>
    </RBSheet>
    )
  }
  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <View style={{ flex: 1, marginBottom:height*0.04}}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <>
            <CustomInput
                value={searchQuery}
                placeholder={t("search")}
                textInputStyle={{
                  textAlign: i18n.language == "ar" ? "right" : "left",
                }}
                containerStyle={[
                  styles.containerStyle,
                ]}
                textContainerStyle={styles.textContainerStyle}
                onChangeText={(txt) => onChangeSearchText(txt)}
                icon={ <Ionicons name="search" size={20} color={COLORS.text} />}
              />

              {filteredContacts?.length > 0 ? (
                <FlatList
                  data={filteredContacts}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item: el }) => (
                    <ContactItemComponent el={el} />
                  )}
                />
              ) : (
                <CustomText text={t("noDataFound")} color={COLORS.header} />
              )}
           
          </>
        )}
      </View>
      {contactDetails()}
    </View>
  );
};
export default IdmanContacts;
