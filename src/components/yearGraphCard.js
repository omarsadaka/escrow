import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "../constants/colors";
import CustomText from "./customText";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { height, hp, width, wp } from "../utilis/dimensions";
import { useDispatch } from "react-redux";

const YearGraphCard = ({
  el,
  type,
  onClick,
  filter,
  name,
}) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [clickedname, setClickedName] =useState('')
  

  return (
    <>
    {filter==1?
     <TouchableOpacity onPress={()=> {
        setClickedName(null)
        onClick(el)      
      }}
      style={{alignSelf:'flex-end'}}>
      <CustomText color={COLORS.black} size={17} text={type==1? el.sold:el.purchased}/>
      <View style={[styles.colum,{
        backgroundColor:clickedname== el.year?COLORS.blue:COLORS.gray,
        height:type==1? 20*parseInt(el.sold): 20*parseInt(el.purchased)}]}/>
      <CustomText color={COLORS.black} size={18} text={el.year}/>
     </TouchableOpacity>
    :
    <TouchableOpacity onPress={()=> {
        setClickedName(el.month)
        onClick(el)
      }}
      style={{alignSelf:'flex-end'}}>
      <CustomText color={COLORS.black} size={17} text={type==1? el.sold:el.purchased}/>
      <View style={[styles.colum,{
        backgroundColor: clickedname==el.month?COLORS.blue:COLORS.gray,
        height:type==1? 20*parseInt(el.sold): 20*parseInt(el.purchased)}]}/>
      <CustomText color={COLORS.black} size={18} text={el.month}/>
     </TouchableOpacity>
    }
    
    </>
  );
};

export default YearGraphCard;
const createStyles = (COLORS) =>
  StyleSheet.create({
    colum:{
       width: width*0.17,
       marginHorizontal: width*0.05,
       borderTopStartRadius:15,
       borderTopEndRadius:15,
       borderWidth:1,
       borderColor: COLORS.blue,
       maxHeight: height*0.3,
       minHeight: height*0.03
    }
  });
