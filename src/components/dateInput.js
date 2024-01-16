import React, {useState, useMemo} from 'react';
import DatePicker from 'react-native-modern-datepicker';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  MaskedViewComponent,
} from 'react-native';
import {COLORS} from '../constants/colors';
import {wp, hp} from '../utilis/dimensions';
import CustomButton from './customButton';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next'
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import 'moment/locale/ar'
const DateTimePicker = ({
  visibleDate1,
  calenderMode,
  selectorStartingYear,
  setVisible = () => {},
  selectedDateVal = () => {},
  minDate,
}) => {
  const {t, i18n} = useTranslation();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [selectedDate, setSelectedDate] = useState('');
  const [visibleDate, setVisibleDate] = useState(false);
  const {colors: COLORS} = useTheme();
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visibleDate1}
      // setVisible={ ()=> setVisibleDate(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalSubContainer}>
       
          <View style={styles.pickerCont}>
            {calenderMode ? (
              <>
                  <TouchableOpacity
                  onPress = {()=>{
                   setVisibleDate(false);
                   setVisible(false);
                   
                 
                 }}
                 style={[styles.closeIcon,{alignSelf:i18n.language =='en'?'flex-end':'flex-start'}]} 
                  
                  >
                   <Ionicons 
                   name="close" 
                   size={30} 
                   color={COLORS.blue}
                  
                  
                   />
                 </TouchableOpacity>
              <DatePicker
                mode="monthYear"
                selectorStartingYear={selectorStartingYear?selectorStartingYear:''}
                onMonthYearChange={res => {
                  let date = moment(res, 'YYYY/MM')
                    .locale(i18n.language)
                    .format('YYYY/MM');
                  setSelectedDate(date);
                  selectedDateVal(date);
                }}
                configs={
                  i18n.language == 'ar'
                    ? {
                        dayNames: [
                          'الجمعة',
                          'الخميس',
                          'الإربعاء',
                          'الثلاثاء',
                          'الاتنين',
                          'الأحد',
                          'السبت',
                        ],
                        dayNamesShort: [
                          'الجمعة',
                          'الخميس',
                          'الإربعاء',
                          'الثلاثاء',
                          'الاتنين',
                          'الأحد',
                          'السبت',
                        ],
                        monthNames: [
                          'يناير',
                          'فبراير',
                          'مارس',
                          'إبريل',
                          'مايو',
                          'يونيو',
                          'يوليو',
                          'أغسطس',
                          'سبتمبر',
                          'إكتوبر',
                          'نوفمبر',
                          'ديسمبر',
                        ],
                      }
                    : {}
                }
              />
              </>
            ) : (
              <>
              <TouchableOpacity
              onPress = {()=>{
              //  setVisibleDate(false);
              //  setVisible(false);
               
             
             }}
             style={[styles.closeIcon,{alignSelf:i18n.language =='en'?'flex-end':'flex-start'}]} 
              
              >
               <Ionicons 
               name="close" 
               size={30} 
               color={COLORS.blue}
              
              
               />
             </TouchableOpacity>
              
              <DatePicker
                              // onMonthYearChange={res => {
                              //   console.log('res',res)
                              //   let date = moment(res, 'YYYY/MM')
                              //     .locale(i18n.language)
                              //     .format('YYYY/MM');
                              //   // setSelectedDate(date);
                              //   // selectedDateVal(date);
                              // }}
                configs={
                  i18n.language == 'ar'
                    ? {
                        dayNames: [
                          'الجمعة',
                          'الخميس',
                          'الإربعاء',
                          'الثلاثاء',
                          'الاتنين',
                          'الأحد',
                          'السبت',
                        ],
                        dayNamesShort: [
                          'الجمعة',
                          'الخميس',
                          'الإربعاء',
                          'الثلاثاء',
                          'الاتنين',
                          'الأحد',
                          'السبت',
                        ],
                        monthNames: [
                          'يناير',
                          'فبراير',
                          'مارس',
                          'إبريل',
                          'مايو',
                          'يونيو',
                          'يوليو',
                          'أغسطس',
                          'سبتمبر',
                          'إكتوبر',
                          'نوفمبر',
                          'ديسمبر',
                        ],
                      }
                    : {}
                }
                // locale={i18n.language} //doesn't work
                mode={'calender'}
                onSelectedChange={res => {
                //  console.log('res',res)
                  let date = moment(res, 'YYYY/MM/DD')
                    .locale(i18n.language)
                    .format('YYYY/MM/DD');
                  setSelectedDate(date);
                  selectedDateVal(date);
                }}
                minimumDate={minDate ? minDate : ''}
              />
                </>
            )
          
            }
          </View>

          <CustomButton
            text={t('newTransactions.Save')}
            width={'100%'}
            color={COLORS.blue}
            containerStyle={{borderRadius: 0}}
            onPress={() => {
              setVisibleDate(false);
              setVisible(false);
            }}
          />
        </View>
      </View>
    </Modal>
  );
};

export default DateTimePicker;
const createStyles = COLORS =>
  StyleSheet.create({
    modalContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(52, 52, 52, 0.6)',
      flex: 1,
    },
    modalSubContainer: {
      // backgroundColor: COLORS.backGround,
      paddingHorizontal: wp(3),
      borderRadius: 10,
      paddingBottom: hp(3),
      paddingTop: hp(1),
      height: '60%',
      width: '90%',
      position: 'absolute',
    },
    pickerCont: {
      // minHeight: '57%',
      width: '100%',
      backgroundColor:'white',
    
    },
    closeIcon :{
      paddingHorizontal:wp(2),
      paddingVertical:hp(1),
     
    }
  });
