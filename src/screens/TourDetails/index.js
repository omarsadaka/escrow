import React, {useEffect, useMemo, useState} from 'react';
import { View,StyleSheet} from 'react-native';
import CustomText from '../../components/customText';
import {useRoute, useTheme} from '@react-navigation/native';
import {BASE_URL, ENDPOINTS, getBaseURL} from '../../constants/API';
import {useTranslation} from 'react-i18next';
import { hp, wp } from '../../utilis/dimensions';
import { COLORS } from '../../constants/colors';


const TourDetails = ({navigation}) => {
  const [baseURL, setBaseURL] = useState('https://escrow2d.meiladigital-sa.com/backend/api/');
  getBaseURL()?.then(res => setBaseURL(res));
  const route = useRoute();
  const {Name, Details} = route?.params;
  const {colors: COLORS} = useTheme();
  const {t, i18n} = useTranslation();
 
useEffect(()=>{
},[])

 
  
  return (
    <View style={styles.bg}>
      <CustomText
        color={COLORS.black}
        size={15}
        text={Name}
        style={styles.name}
      />
      <CustomText
        color={COLORS.black}
        size={13}
        text={Details}
        style={styles.details}
      />
    </View>
  );
};

const styles= StyleSheet.create({
    bg: {
      flexGrow: 1,
      paddingHorizontal:wp(3)
    },
    name: {
      alignSelf: "center",
      textAlign: "center",
      marginVertical: hp(2),
      color: COLORS.blue,
    },
    details: {
        flex:1,
        marginVertical: hp(1),
        textAlign:'left'
      },
 
   
  });
export default TourDetails;
