import React, { useState, useEffect, useMemo } from 'react'
import { Alert, View } from 'react-native'
import CustomHeader from '../../components/customHeader'
import SelectDropdown from 'react-native-select-dropdown';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import { COLORS } from "../../constants/colors";
import CustomInput from '../../components/customInput';
import CustomButton from '../../components/customButton';
import CommonStyles from '../../constants/CommonStyles';
import { BASE_URL, ENDPOINTS, getBaseURL } from '../../constants/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import createStyles from './styles';
import { t } from 'i18next';
import CustomText from '../../components/customText';
import i18n from '../../Translations';
export default function NewWithdraw({ navigation }) {
    const styles = useMemo(() => createStyles(COLORS), []);
    const [methods, setMethods] = useState([])
    const [selectedMethod, setSelectedMethod] = useState(null)
    const [selectedMethodDetails, setSelectedMethodDetails] = useState(null)
    const [selectedAmount, setSelectedAmount] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showDetails, setShowDetails] = useState(false)
    const [env, setEnv] = useState('2');
    const [baseURL, setBaseURL] = useState('');
    useEffect(() => {
        getBaseURL()?.then(res => setBaseURL(res));
    }, [env]);
    const getSavedEnv = async () => {
        try {
            const value = await AsyncStorage.getItem('ENVIROMENT');
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
    const fetchWithdrawMethods = async () => {
        try {
            let token = await AsyncStorage.getItem('TOKEN');
            fetch(baseURL + ENDPOINTS.withdrawMethods, {
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + token,
                    'Content-Type': 'application/json',
                    "X-Localization": i18n?.language
                },

            })
                .then((response) => response.json())
                .then((responseData) => {
                    console.log(responseData.data);
                    if (responseData.data.methods) {
                        setMethods(responseData.data.methods)
                    }
                    else {

                    }
                })

        } catch (error) {
            setLoading(false)

        }


    }

    useEffect(() => {
        if (!baseURL) return;
        fetchWithdrawMethods()
    }, [baseURL])

  const handleSelectedAmount = ()=>{
   
     if(selectedMethodDetails?.min_limit && selectedMethodDetails?.max_limit)
     { let min = selectedMethodDetails?.min_limit?.replace(/\,/g,'')
        let max = selectedMethodDetails?.max_limit?.replace(/\,/g,'')
        //console.log('s0',((selectedAmount - selectedMethodDetails?.min_limit) * (selectedAmount - selectedMethodDetails?.max_limit) <= 0))
         return ! ((selectedAmount - min) * (selectedAmount - max) <= 0) ||selectedAmount ==null
  }
}

    //submit withdraw 
      
    

    return (
        <>
            <CustomHeader
                navigation={navigation} />
            <View
                style={styles.container}
            >
                <View
                    style={styles.subCont}
                >
                    <View
                        style={styles.methodsCont}
                    >
                        <CustomText
                            text={t('withdraw.method')}
                            color={COLORS.blue}
                           // style={styles.methodsLabel}
                        />
                        <SelectDropdown
                            data={methods?.map(el => { return el.name })}
                            //  defaultButtonText={t('accountScreen.ss')}
                            renderDropdownIcon={() => {
                                return (
                                    <FontAwesome5Icon
                                        name="caret-down"
                                        size={20}
                                        color={COLORS.babyBlue2}
                                    />
                                );
                            }}
                            buttonTextStyle={CommonStyles.dropDownBtnTxt}
                            buttonStyle={CommonStyles.dropDownBtn}
                            rowStyle={CommonStyles.dropDownRow}
                            rowTextStyle={CommonStyles.dropDownTxt}
                            onSelect={(val, index) => {
                                setSelectedMethod(methods?.find((el) => el.name == val).id);
                                setSelectedMethodDetails (methods?.find((el) => el.name == val))
                            }}
                            buttonTextAfterSelection={(selectedItem, index) => {
                                return selectedItem;
                            }}
                            rowTextForSelection={(item, index) => {
                                return item;
                            }}
                        />


                    </View>

                    <CustomInput
                         onPress={()=>setShowDetails(true)}
                        // inputRef={passRef}
                        containerStyle={{minWidth:'91%',alignSelf: 'flex-start',}}
                        label={t('RegisterScreen.Amount')}
                        placeholder={'500.00'}
                        color={COLORS.blue}
                        value={selectedAmount}
                        keyboardType="numeric"
                        onChangeText={setSelectedAmount}
                        error={ handleSelectedAmount()}
                        errorMessage={`${t('amountCondition')} ${selectedMethodDetails?.min_limit}-${selectedMethodDetails?.max_limit}`}
                        icon={
                            <FontAwesome5
                                name="money-bill-wave-alt"
                                size={15}
                                color={COLORS.babyBlue2}
                            />
                        }
                    />

                    <View>
                    </View>
                    {showDetails && selectedMethod &&(
                            <View style ={styles.methodDetails}>
                            <View  style ={styles.methodDetailsLable}>
                                <CustomText
                                    text={t('withdraw.Limit')}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={13}
                                />
                                <CustomText
                                    text={t('withdraw.Charge')}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={13}
                                />
                                 <CustomText
                                    text={t('withdraw.Receivable')}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={13}
                                />
                                 <CustomText
                                    text={t('withdraw.ConversionRate')}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={13}
                                />
                                 <CustomText
                                    text={t('withdraw.InSar')}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={13}
                                />
                               
                            </View>
                            <View  style ={styles.methodDetailsValues}>
                            <CustomText
                                    text={`${selectedMethodDetails?.max_limit} SAR - ${selectedMethodDetails?.min_limit} SAR  `}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={14}
                                />
                                <CustomText
                                    text={`${selectedMethodDetails?.fixed_charge} SAR`}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={14}
                                />
                                 <CustomText
                                    text={`${selectedAmount?selectedAmount:0} SAR`}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={14}
                                />
                                 <CustomText
                                    text={'1 SAR = 1 sar'}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={14}
                                />
                                 <CustomText
                                    text={`${selectedAmount?selectedAmount:0} SAR`}
                                    color={COLORS.blue}
                                    style={styles.methodsLabel}
                                    size={14}
                                />
                            </View>

                        </View>

                        )}
                    </View>
                        
                    
                    <CustomButton
                         disabled={!selectedMethod || handleSelectedAmount()}
                         color={handleSelectedAmount()?COLORS.grey :COLORS.blue}
                        onPress={()=>navigation.navigate('WithdrawDynamicForm',{
                             dynamicForm:selectedMethodDetails?.form?.form_data,
                             method_code:selectedMethod,
                             amount:selectedAmount,
                             details:selectedMethodDetails
                        })}
                       text={t("depositRequest.add")}
                       width={'92%'}
                       loading={loading}
                    />
            </View>
        </>
    )
}
