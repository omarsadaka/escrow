import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import createStyles from "./style";
import CustomText from "../../components/customText";
import { height, wp } from "../../utilis/dimensions";
import { useTheme, useRoute } from "@react-navigation/native";
import CustomHeader from "../../components/customHeader";
import { useTranslation } from "react-i18next";
import { ENDPOINTS, getBaseURL } from "../../constants/API";
import { useSelector, useDispatch } from "react-redux";
import RenderHtml, { defaultSystemFonts } from 'react-native-render-html';
import AsyncStorage from "@react-native-async-storage/async-storage";

const systemFonts = [...defaultSystemFonts, 'BahijTheSansArabic-Plain', 'BahijTheSansArabic-Plain'];
const ArticleDetails = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const {Item} = route?.params;
  const [loading, setLoading] = useState(false);
  const [baseURL, setBaseURL] = useState("");
  const [articleData, setArticleData] = useState({});

  
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
   console.log('item', Item)
   getArticleDetails(Item.id)
  }, [navigation, baseURL]);


  const getArticleDetails = async (id) => {
    setLoading(true);
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(`${baseURL}` + `${ENDPOINTS.getArticles}` + `/${id}`, {
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
           setArticleData(responseData.blog_details)
          setLoading(false);
        } else {
          setLoading(false);
        }
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} outStack/>
      <View style={{ flex: 1, marginBottom:height*0.04}}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
      <ScrollView>
        <View style={styles.container}>
          <Image source={{uri: articleData?.image?articleData.image:Item.image}} style={styles.image} resizeMode='cover' />
          <CustomText
           color={COLORS.blue}
           size={wp(5)}
           fontFamily='extraBold'
           text={articleData?.title?articleData.title:Item.title}
           style={styles.title}
          />
          <View style={{width: wp(95),marginTop:4}}>
           <RenderHtml
             source={{
               html: articleData?.description?articleData.description:Item.description,
             }}
             containerStyle={{width: '90%',backgroundColor:'red'}}
            //  ignoredTags={['img']}
             systemFonts={systemFonts}
             baseStyle={{ fontFamily: 'BahijTheSansArabic-Plain', fontSize: 15, textAlign:'left' }}/>
          </View>
        </View>
      </ScrollView>
        )}
      </View>
    </View>
    
  );
};
export default ArticleDetails;
