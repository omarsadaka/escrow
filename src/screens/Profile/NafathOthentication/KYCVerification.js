import React, { useState, useEffect, useMemo } from 'react';
import { View, TouchableOpacity, Image, ScrollView, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import createStyles from './style';
import CommonStyles from '../../../constants/CommonStyles';
import CustomText from '../../../components/customText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { wp, hp } from '../../../utilis/dimensions';
import CustomInput from '../../../components/customInput';
import { useTheme } from '@react-navigation/native';
import CustomHeader from '../../../components/customHeader';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../../../components/customButton';
import { t } from 'i18next'
import { BASE_URL, ENDPOINTS, getBaseURL } from '../../../constants/API';
import SelectDropdown from 'react-native-select-dropdown';
import { RadioButton } from 'react-native-paper';
import DocumentPicker, {
  DirectoryPickerResponse,
  DocumentPickerResponse,
  isInProgress,
  types,
} from "react-native-document-picker";
import RNFetchBlob from "rn-fetch-blob";
import { showSimpleModal } from "../../../redux/actions/modal";
import { useDispatch } from "react-redux";
import Textarea from 'react-native-textarea';
import axios from 'axios';





const KYCManualVerification = ({ navigation }) => {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [env, setEnv] = useState('2');
  const [baseURL, setBaseURL] = useState('');
  const [formData, setFormData] = useState([]);
  const [allInputValues, setAllInputValues] = useState([])
  // const [allTextAreaValues, setAllTextAreaValues] = useState([])
  const [allSelectValues, setAllSelectValues] = useState([])
  const [allRadioValues, setAllRadioValues] = useState([])
  const [checked, setChecked] = useState([])
  const [uploadDocs, setUploadDocs] = useState([]);
  const [valid,setValid] = useState(false)

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
  useEffect(() => {

    const allRequiredLabels = []
    const allValuesAdded =[] 
    const allRequired= formData?.filter((el)=>el.is_required=='required')
    if(allRequired.length > 0)
    {
    allRequired.map((el)=>{
     allRequiredLabels.push(el.label)
    })
    console.log('ff',allSelectValues)
   //  console.log('allreq',allRequiredLabels)
   //  console.log('all',allInputValues,allSelectValues,allRadioValues,uploadDocs)
     const filter1 =allInputValues?.filter((el)=>allRequiredLabels.includes( el.label))?.map((el)=> el.val)
     const filter2 =allSelectValues?.filter((el)=>allRequiredLabels.includes( el.label))?.map((el)=> el.val)
     const filter3 =allRadioValues?.filter((el)=>allRequiredLabels.includes( el.label))?.map((el)=> el.val)
     const filter4 = uploadDocs.length>0 ? uploadDocs[0]?.name:''
     // console.log('ff',uploadDocs,filter4)
     allValuesAdded.push(...filter1,...filter2,...filter3)
     uploadDocs.length>0 && allValuesAdded.push(filter4)
     console.log('filter',allValuesAdded)
     if( allValuesAdded.length == 0 ||allValuesAdded.length!=allRequiredLabels?.length || allValuesAdded.includes("")||allValuesAdded.includes(" ")||allValuesAdded.includes({}))
    {
     console.log('1')
     setValid(false)
    }
    else {
     console.log('2')
     setValid(true)
    }
    }
    else{
     console.log('3')
     setValid(true)
    }
   
   }, [formData,allInputValues,allSelectValues,allRadioValues,uploadDocs])
   

  const fetchDynamicForm = async () => {
    console.log('hi')
    setLoading(true)
    try {
      let token = await AsyncStorage.getItem('TOKEN');
      fetch(baseURL + ENDPOINTS.KYCDynamicForm, {
        method: 'GET',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
          "X-Localization": i18n?.language
        },

      })
        .then((response) => response.json())
        .then((responseData) => {
           console.log('res form',responseData);
          if (responseData?.data?.form_data) {
            let arr = []
            for (const prop in responseData?.data?.form_data) {
              // console.log('key', prop, responseData?.data?.form_data[prop])
              arr.push(responseData?.data?.form_data[prop])
            }
            setFormData(arr)
            setLoading(false)
          }
          else {
            dispatch(
              showSimpleModal({
                status: true,
                payload: {
                  header: t('mistake'),  //responseData?.status,
                  message:responseData?.messages?.error,
                  action: "",
                  type:'error'
                },
              }))
            setLoading(false)

          }
        })

    } catch (error) {
      setLoading(false)

    }


  }

  useEffect(() => {
    if (!baseURL) return;
    fetchDynamicForm()
  }, [baseURL, navigation])



  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();

const handleSendingForm = async()=>{
  // console.log('allInputValues', allInputValues)
  // console.log('allSelectValues', allSelectValues)
  // console.log('allRadio', allRadioValues)
 
  const bodyFormReq =[]
  allInputValues?.map(({label,val})=>{
    // console.log('ee',label)
     let obj ={}
     obj.label=label;
     obj.val=val
     bodyFormReq.push(obj)

  })
  allSelectValues?.map(({label,val})=>{
    // console.log('ee',label)
     let obj ={}
     obj.label=label;
     obj.val=val
     bodyFormReq.push(obj)

  })
  allRadioValues?.map(({label,val})=>{
    // console.log('ee',label)
     let obj ={}
     obj.label=label;
     obj.val=val
     bodyFormReq.push(obj)

  })
  // console.log('bodyFormReq', bodyFormReq)

   
   if( uploadDocs?.length > 0)
   {
    const {name,...file} =uploadDocs[0]
    const test_file2 = formData?.find((el)=>el.type=='file')?.label
   
     let obj = {}
     obj.label=test_file2
     obj.val =file
     bodyFormReq.push(obj)
   
   } 
   let Allobj = {}
   bodyFormReq.forEach((el,i)=>{
    let arr2 =Object.values(el)
    for(var i=0 ; i < arr2.length-1; i++)
    {
       
        
         
      Allobj[arr2[i]]= arr2[i+1]
       
    }

   })
  
   let bodyReq ={}
   bodyReq = {...Allobj}

 
   
    
  
    console.log('bodyReq',bodyReq)
  
     try {
      setSubmitLoading(true)
      let token = await AsyncStorage.getItem('TOKEN');
      const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
      axios({
          method: 'POST',
          url:baseURL + ENDPOINTS.submitKYCform,
          headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
              "X-Localization": i18n?.language
          },
          data: bodyReq
  
      })
          .then((responseData) => {
              console.log(responseData.data)
             
              if (responseData?.data?.status=='success') {
               setSubmitLoading(false)
               dispatch(
                showSimpleModal({
                  status: true,
                  payload: {
                    header:  t('success'), //responseData?.data?.status,
                    message:responseData?.data?.messages?.success,
                    action: "",
                    type:'success'
                  },
                }))
               navigation.goBack();
              }
              else {
                setSubmitLoading(false)
                showSimpleModal({
                  status: true,
                  payload: {
                    header: t('mistake'), //responseData?.data?.status,
                    message:responseData?.data?.messages.error,
                    action: "",
                    type:'error'
                  },
              })}
          })
  
  } catch (error) {
    setSubmitLoading(false)
  
  }
    }
  



  const handleUpload = () => {
  
    DocumentPicker.pickMultiple({
      type: "*/*",
      readContent: true,
    }).then((pdf) => {
      // console.log("pdf : ", `${pdf.map((el) => el.type.split("/").pop())}`);
      if (pdf) {
        const docs = [];
        pdf?.map((el) =>
          RNFetchBlob.fs.readFile(el?.uri, "base64").then((data) => {
            // console.log('data', data)
            if (uploadDocs?.length == 0) {
              docs.push({
                base64: data,
                name: el?.name,
                extension: `${el?.type.split("/").pop()}`,
              });
              setUploadDocs([...uploadDocs, ...docs]);
            } else {
              if (
                !uploadDocs.includes({
                  base64: data,
                  name: el?.name,
                  extension: `${el?.type.split("/").pop()}`,
                })
              ) {
                // console.log("not include");
                docs.push({
                  base64: data,
                  name: el?.name,
                  extension: `${el?.type.split("/").pop()}`,
                });
                setUploadDocs([...uploadDocs, ...docs]);
              }
            }
          })
        );
        return;
      }
    });
  };
  return (
    <ScrollView
      scrollEnabled={true}
      style={{ flex: 1, backgroundColor: COLORS }}
      contentContainerStyle={{ alignItems: 'center' }}
    >
      <CustomHeader navigation={navigation} />
      {!loading ? 
        formData.length>0?
      (
        <>
          <View style={styles.dynamicFormContainer}>
            <FlatList
              data={formData}
              renderItem={({ item, index }) => {
                // console.log('kycitem',item)

                var { type, name_en,name_ar, label, extensions, is_required, options } = item;
                // console.log('item',type,name,item)
                //text input
                if (type == 'text') {
                  return (
                    <>
                    <CustomInput
                      label={`  ${ i18n.language=='en'? name_en:name_ar}  ${is_required=='required'? '*':'' }`}
                      //  error={
                      //   is_required=='required'
                      //   && (allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0)
                      //   ? true
                      //   : false
                      // }
                       // errorMessage={t('requiredField')}
                      // placeholder={t("updateProfile.fnp")}
                      // value={lastName}
                      onChangeText={(inputVal) => {
                        let input = [...allInputValues]
                       // console.log('bug',allInputValues?.find ((el)=>el.label==label)?.val.length)
                        let inputIndex = input.findIndex(x => x.index === index)
                        if (inputIndex !== -1) {
                          input[inputIndex].label = label
                          input[inputIndex].val = inputVal
                        }
                        else {
                          input.push({
                            index: index,
                            label: label,
                            val: inputVal,
                          });
                        }
                        setAllInputValues(input)
                        // let arr=[]
                        // let obj ={}
                        // obj.label =label
                        // obj.val=inputVal
                        //   arr.push(obj)
                        // console.log('inputVal',arr[arr.length-1])

                        //  setAllInputValues((prev)=>[...prev,arr[arr.length-1]])
                      }
                      }
                      // required={item.is_required == 'required'}
                      // error={lastName.length > 0 ? false : true}
                      //errorMessage={t("updateProfile.err")}
                      keyboardType={'default'}
                      // inputRef={ref2}
                      containerStyle={{  width: '100%',
                      borderColor: is_required=='required'
                      && (allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0 )
                      ? COLORS.red
                      : COLORS.header
                    }}

                    />
                    { is_required=='required'
                    && (allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0 )&&
                    ( <CustomText 
                       color={COLORS.red}
                       text={t('requiredField')}
                       size={12}
                       />
                     )}
                     </>
                  )
                }

                //textarea input
                else if (type == 'textarea')
                // {console.log('ss', allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0)
                  return (
                    <View>
                      <CustomText color={COLORS.header}  text={` ${ i18n.language=='en'? name_en:name_ar}  ${is_required=='required'? '*':'' } `} />
                      <Textarea
                        containerStyle={[styles.textareaContainer,{
                          borderColor:
                          is_required=='required'
                        && (allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0 )
                          ? COLORS.red
                          : COLORS.header,
                          
                        }]}
                        style={[styles.textarea,{textAlign:i18n.language=='ar'? 'right': 'left',height:'100%',textAlignVertical:'top'}]}
                        onChangeText={(inputVal) => {
                          let input = [...allInputValues]
                          let inputIndex = input.findIndex(x => x.index === index)
                          if (inputIndex !== -1) {
                            input[inputIndex].label = label
                            input[inputIndex].val = inputVal
                          }
                          else {
                            input.push({
                              index: index,
                              label: label,
                              val: inputVal,
                            });
                          }
                          setAllInputValues(input)

                        }}
                        // defaultValue={}
                        maxLength={200}
                        placeholder={i18n.language=='en'? name_en:name_ar}
                        placeholderTextColor={'#c7c7c7'}
                        underlineColorAndroid={'transparent'}
                      />
                      { is_required=='required'
                        && (allInputValues?.find ((el)=>el.label==label)?.val?.length ==0 || allInputValues?.filter ((el)=>el.label==label).length==0 )&&
                        ( <CustomText 
                           color={COLORS.red}
                           text={t('requiredField')}
                           size={12}
                           />
                         )}
                    </View>
                  )
                        

                //select input 
                else if (type == 'select')

                  return (
                    <>
                    <SelectDropdown
                      
                      data={options}
                      defaultButtonText={i18n.language=='en'? name_en:name_ar}
                      renderDropdownIcon={() => {
                        return (
                          <Ionicons
                            style={styles.dropDownIcon}
                            color={COLORS.secondary}
                            size={25}
                            name="md-chevron-down"
                          />
                        );
                      }}
                      buttonTextStyle={CommonStyles.dropDownBtnTxt}
                      buttonStyle={{
                        backgroundColor: COLORS.inputBackGround,
                        width: '100%',
                        height: hp(6),
                        marginVertical: hp(2),
                        borderWidth: wp(0.28),
                        borderRadius: wp(2),
                        borderColor:
                          is_required=='required'
                        && (allSelectValues?.find ((el)=>el.label==label)?.val?.length ==0 || allSelectValues?.filter ((el)=>el.label==label).length==0 )
                          ? COLORS.red
                          : COLORS.header
                        }}
                      
                      rowStyle={CommonStyles.dropDownRow}
                      rowTextStyle={CommonStyles.dropDownTxt}
                      onSelect={(inputVal, index) => {
                        // console.log('val', inputVal)

                        let filter = allSelectValues.filter((el=>el.label!=label))
                        let input = [...filter]
                        let inputIndex = input.findIndex(x => x.index === index)
                        // if (inputIndex !== -1) {
                        //   input[inputIndex].label = label
                        //   input[inputIndex].val = inputVal
                        // }
                        // else {
                          input.push({
                            index: index,
                            label: label,
                            val: inputVal,
                          });
                       // }
                        setAllSelectValues(input)


                        //   setchoosedCatVAL(val);
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem;
                      }}
                      rowTextForSelection={(item, index) => {
                        return item;
                      }}
                    />
                    { is_required=='required'
                        && (allSelectValues?.find ((el)=>el.label==label)?.val?.length ==0 || allSelectValues?.filter ((el)=>el.label==label).length==0 )&&
                        ( <CustomText 
                           color={COLORS.red}
                           text={t('requiredField')}
                           size={12}
                           />
                         )}
                         </>
                  )

                //radio or checkbox input
                else if (type == 'radio' || type == 'checkbox') {
                  return (
                    <View>
                      <CustomText color={COLORS.header}  text={`  ${ i18n.language=='en'? name_en:name_ar} ${is_required=='required'? '*':'' } `} />

                      {item.options.map((el, index) =>{
                          // setAllRadioValues()
                        return (
                        <View
                          key={index}
                          style={styles.radioCont}
                        >
                          {/* <CheckBox
                                 style={styles.checkBox}
                                 // disabled={loading == true ? true : false}
                                 //isChecked={isSelected}
                                 onClick={(newValue) => {
                             
                                 }}
                                 rightText={el}
                                 checkBoxColor={COLORS.black}
                                 rightTextStyle={{ color: COLORS.black }}
                              /> */}
                          <CustomText text={el} color={COLORS.black} />
                          <RadioButton
                            value={el}
                            status={ checked?.filter(e=>e.val==el)?.length > 0? 'checked':'unchecked'   }
                            onPress={(val) => {
                            
                             let input = [...allRadioValues]
                             let inputIndex = input.findIndex(x => x.index === index)
                            //  if (inputIndex !== -1) 
                            // {
                              
                             
                            //    input[inputIndex].index = index
                            //    input[inputIndex].label = label
                            //    input[inputIndex].val = el
                            //    input[inputIndex].status = !checked?.filter((el)=>el.val==el)[0]?.status 
                            //  }
                            //  else {
                              const arr=input.filter(el=>el.label!=label)

                               arr.push({
                                 index: index,
                                 label: label,
                                 val: el,
                                 status: ! checked?.filter((el)=>el.val==el)[0]?.status 

                               });
                            // }
                            // console.log('input',arr)
                              setAllRadioValues(arr)
                               
                               setChecked(arr)
                            }}
                          />
                        </View>
                      )})}
                        { is_required=='required'
                        && (allRadioValues?.find ((el)=>el.label==label)?.val?.length ==0 || allRadioValues?.filter ((el)=>el.label==label).length==0 )&&
                        ( <CustomText 
                           color={COLORS.red}
                           text={t('requiredField')}
                           size={12}
                           />
                         )}
                    </View>
                  )
                }

                // file input

                else if (type == 'file') {
                  return (
                    <>
                      <TouchableOpacity
                        style={styles.uploadBtn}
                        onPress={handleUpload}
                      >
                        <CustomText
                          color={COLORS.white}
                          size={17}
                          text={`  ${ i18n.language=='en'? name_en:name_ar} ${is_required=='required'? '*':'' } `}
                        />
                      </TouchableOpacity>
                      { is_required=='required'
                        && uploadDocs?.length ==0 &&
                        ( <CustomText 
                           color={COLORS.red}
                           text={t('requiredField')}
                           size={12}
                           />
                         )}
                           
                       <CustomText 
                           color={COLORS.black}
                           text={`${t('allowedExtensions')} : ${formData?.find((el)=>el.type=='file')?.extensions}`  }
                           size={12}
                           />
                        
                      {uploadDocs?.length > 0 &&
                     uploadDocs?.map((el) => (
                       <TouchableOpacity
                         key={el?.name}
                         style={{ marginHorizontal: wp(5) }}
                         onPress={() => {}}
                       >
                         <CustomText color={COLORS.header} size={16} text={el?.name} />
                       </TouchableOpacity>
                     ))}
                    </>

                  )
                }
              }

              }

            />

          </View>
          <CustomButton
          disabled={!valid}
            loading={submitLoading}
            onPress={handleSendingForm}
            text={t('submit')}
            color={!valid ? COLORS.grey : COLORS.header}
            width={'85%'}
            style={
              {
                backgroundColor: COLORS.header,
                marginHorizontal: wp(5),

                justifyContent: "center",

                minWidth: wp(35),
                minHeight: hp(5),
                alignSelf: "center",
                borderRadius: hp(1)
              }}
          />

        </>) 
        :(
        <CustomText  
        text ={t('NoForm')}
        color={COLORS.header}
        />
        )
        : (

        <ActivityIndicator size={'large'} color={COLORS.header} />
      )
      }


    </ScrollView>
  );
};
export default KYCManualVerification;
