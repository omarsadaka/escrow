import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ScrollView,
} from "react-native";
import CustomText from "../../../components/customText";
import CustomButton from "../../../components/customButton";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

import CustomInput from "../../../components/customInput";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../../components/customHeader";

const CreateDepositRequest = ({ navigation, route }) => {
  console.log('depositerr',route.params)
 
  const { methodCode } = route.params;
  //   console.log("currency : ", methodCode, currency);
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [depositAmount, setDepositAmount] = useState(null);
  const ref = useRef();
 

 
  const handleSelectedAmount = ()=>{
   
    if(route?.params?.data?.min_amount && route?.params?.data?.max_amount)
    {
      let max =  route?.params?.data?.max_amount?.replace(/\,/g,'')
      let min = route?.params?.data?.min_amount?.replace(/\,/g,'')

         return ! ((depositAmount - min) * (depositAmount - max) <= 0) || depositAmount ==null
  }}
  return (
    <ScrollView contentContainerStyle={styles.bg}>
      <CustomHeader navigation={navigation} />
      <CustomText
        color={COLORS.black}
        size={20}
        text={t("depositRequest.header")}
        style={styles.BackTxt}
      />
      <CustomInput
        label={t("depositRequest.Amount")}
        placeholder={"100.00"}
        value={depositAmount}
        onChangeText={setDepositAmount}
        error={handleSelectedAmount()}
        errorMessage={`${t('amountCondition')}  ${route?.params?.data?.min_amount}-${route?.params?.data?.max_amount}`}
        keyboardType="numeric"
        inputRef={ref}
        icon={
          <FontAwesome5
            name="money-bill-wave-alt"
            size={15}
            color={COLORS.babyBlue2}
          />
        }
      />
      <CustomButton
        disabled={handleSelectedAmount()}
        color={handleSelectedAmount()?COLORS.grey :COLORS.blue}
        onPress={() => {
        
          navigation.navigate('DepositDynamicForm',{
            dynamicForm:route?.params?.data?.form,
            method_code:methodCode,
            amount:depositAmount,
            details:route?.params?.data


          })
        }}
        text={t("depositRequest.add")}
        containerStyle={styles.btn2}
               // ref.current.focus();
      />

      
    </ScrollView>
  );
};
export default CreateDepositRequest;
