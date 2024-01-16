import AsyncStorage from '@react-native-async-storage/async-storage'
import React ,{useState,useMemo,useEffect} from 'react'
import { Alert, View } from 'react-native'
import CustomButton from '../../../components/customButton'
import CustomHeader from '../../../components/customHeader'
import CustomText from '../../../components/customText'
import { COLORS } from '../../../constants/colors'
import { BASE_URL, ENDPOINTS, getBaseURL } from '../../../constants/API';
import createStyles from './styles';
import { useDispatch } from "react-redux";
import { showSimpleModal } from "../../../redux/actions/modal";
import { useTranslation } from 'react-i18next';


export default function DepositPreview({navigation,route}) {
     const dispatch = useDispatch()
     const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const data = route?.params?.data?.data?.deposit
  const description =route.params.description
  const [loading, setLoading] = useState(false)
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
  console.log(' deposit preview route',route?.params?.data?.data.deposit)

  const confirmDeposit = async() =>{   
    try {
      setLoading(true)
      let token = await AsyncStorage.getItem('TOKEN');
      let bodyObj = {
          transaction:route?.params?.data?.data.deposit?.trx
      }
    
      fetch(baseURL + ENDPOINTS.confirmDepositRequest +route?.params?.data?.data.deposit?.trx, {
          method: 'GET',
          headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
              "X-Localization": i18n?.language
          },

      })
          .then((response) => response.json())
          .then((responseData) => {
              console.log(responseData)
              if (responseData?.messages?.success) {
               setLoading(false)
               dispatch( showSimpleModal({
                status: true,
                payload: {
                  header: t('success'),
                  message:responseData?.messages?.success,
                  action: "",
                  type:'success'
                },}))
                navigation.navigate('DepositHistory');
              }
              else {
                  setLoading(false)
                  dispatch( showSimpleModal({
                    status: true,
                    payload: {
                      header: t('mistake'),
                      message:responseData?.messages?.error,
                      action: "",
                      type:'error'
                    },}))
              }
          })

  } catch (error) {
      setLoading(false)

  }
  }
  return (
    <>
  <CustomHeader navigation={navigation} specialPress={'DepositHistory'} />
  <CustomText
    text={t('withdraw.depositPreview')}
    color={COLORS.cardBlue}
    // style={styles.title}
   />

  <View style={styles.container}>
   <View  style={styles.previewContainer1}>
    <View  style={styles.previewSubContainer1}>
   <CustomText
    text={t('withdraw.amount')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />
   <CustomText
    text={t('withdraw.charge')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />
   
   <CustomText
    text={t('withdraw.finalAmount')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />
   <CustomText
    text={t('withdraw.Currency')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />
   <CustomText
    text={t('withdraw.depositNo')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />
    <CustomText
     text={t('withdraw.withdrawDesc')}
    color={COLORS.cardBlue}
    // style={styles.title}
    size={15}
   />

   </View>
   <View  style={styles.previewSubContainer2}>
   <CustomText
    text={data?.amount}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   <CustomText
   text={data?.charge}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   <CustomText
   text={data?.final_amo}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   <CustomText
   text={data?.method_currency}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   
   <CustomText
    text={data?.trx}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   <CustomText
    text={description?.replace(/<\/?[^>]+(>|$)/g, "")}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />

   </View>
  
   </View>
   <View style={{alignItems: 'center',}}>
   <CustomButton
      color={COLORS.blue}
      onPress={confirmDeposit}
      text={t('confirm')}
      width={'92%'}
      loading={loading}
       
                   />
        </View>
        </View>
   </>
  )
}
