import AsyncStorage from '@react-native-async-storage/async-storage'
import React ,{useState,useMemo,useEffect} from 'react'
import { Alert, View } from 'react-native'
import CustomButton from '../../components/customButton'
import CustomHeader from '../../components/customHeader'
import CustomText from '../../components/customText'
import { COLORS } from '../../constants/colors'
import { BASE_URL, ENDPOINTS, getBaseURL } from '../../constants/API';
import createStyles from './styles';
import { useDispatch } from "react-redux";
import { showSimpleModal } from "../../redux/actions/modal";
import { useTranslation } from 'react-i18next';


export default function WithdrawPreview({navigation,route}) {
     const dispatch = useDispatch()
    const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const data = route?.params?.data?.data
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
  console.log(data)

  const confirmWithdraw = async() =>{
    try {
      setLoading(true)
      let token = await AsyncStorage.getItem('TOKEN');
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      let bodyObj = {
          transaction:data?.trx,
          device_info: deviceInfo
      }
      fetch(baseURL + ENDPOINTS.withdrawConfirm, {
          method: 'POST',
          headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
              "X-Localization": i18n?.language
          },
          body: JSON.stringify (bodyObj)

      })
          .then((response) => response.json())
          .then((responseData) => {
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
               navigation.push('WithdrawLog')
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
  <CustomHeader navigation={navigation}/>
  <CustomText
    text={t('withdraw.withdrawPreview')}
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
    text={t('withdraw.afterCharge')}
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
    text={t('withdraw.withdrawNo')}
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
   text={data?.after_charge}
    color={COLORS.cardBlue}
    size={15}
    // style={styles.title}
   />
   <CustomText
   text={data?.final_amount}
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
   <CustomButton
      color={COLORS.blue}
      onPress={confirmWithdraw}
      text={t('confirm')}
      width={'92%'}
      loading={loading}
                    />
        </View>
   </>
  )
}
