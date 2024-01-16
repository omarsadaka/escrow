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

const NewsDetails = ({ navigation }) => {
  const route = useRoute();
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS));
  const { t, i18n } = useTranslation();
  const {Item} = route?.params;
  const [loading, setLoading] = useState(false);
  const [baseURL, setBaseURL] = useState("");
  
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
    if (!baseURL) return;
   console.log('item', Item)
  }, [navigation, baseURL]);

  return (
    <View style={{ backgroundColor: COLORS.bg, flex: 1 }}>
      <CustomHeader navigation={navigation} />
      <View style={{ flex: 1, marginBottom:height*0.04}}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
        <ScrollView>
        <View style={styles.container}>
          <Image source={{uri: Item.attachment}} style={styles.image} resizeMode='contain' />
          <CustomText
           color={COLORS.blue}
           size={wp(5)}
           fontFamily='extraBold'
           text={i18n.language=='ar'? Item.title_ar: Item.title_en}
           style={styles.title}
          />
         <CustomText
           color={COLORS.black}
           size={wp(3)}
           text={i18n.language=='ar'? Item.body_ar: Item.body_en}
           style={styles.body}
          />
        </View>
        </ScrollView>  
        )}
      </View>
    </View>
  );
};
export default NewsDetails;
