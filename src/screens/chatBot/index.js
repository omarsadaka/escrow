import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  ScrollView,
  Modal,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import {
  BASE_URL,
  ENDPOINTS,
  ENDPOINTS2,
  getBaseURL,
} from "../../constants/API";
import createStyles from './style';
import CustomText from '../../components/customText';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {wp, hp} from '../../utilis/dimensions';
import {useTheme} from '@react-navigation/native';
import CustomHeader from '../../components/customHeader';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GiftedChat} from 'react-native-gifted-chat';

const ChatBot = ({navigation}) => {
  const {colors: COLORS} = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [baseURL, setBaseURL] = useState("https://escrow2d.meiladigital-sa.com/backend/api/");
  getBaseURL()?.then((res) => {
    setBaseURL(res);
  });
  const {t, i18n} = useTranslation();
  const [messages, setMessages] = useState([]);
  const [reset, setReset] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    startChat()
  },[reset])

  const startChat=()=>{
    setLoading(true)
    fetch(baseURL + ENDPOINTS2.startChatBot, {
      method: "GET",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        setLoading(false)
        console.log('startChat', responseData.data)
        let answers = responseData?.data?.answers?.map((el) => ({
          _id: el.id,
          title: i18n.language=='ar'?el.answer_ar:el.answer_en,
          createdAt: el.created_at,
        }));
        console.log('answers', answers)
        const data=[]
        const obj={
          _id: responseData.data.id,
          text: i18n.language=='ar'?responseData.data.question_ar:responseData.data.question_en,
          createdAt: new Date(),
          keepIt: true,
          quickReplies:{
            type:'radio',
            values: answers
          }
        }
        data.push(obj)
        setMessages(data)
      })
      .catch((e) => {
        setLoading(false)
      });
  }
 
  const onQuickReply = async(replies) => {
    const deviceInfo= await AsyncStorage.getItem('DeviceInfo')
    var formdata = new FormData();
    formdata.append('answer_id', replies[0]?._id)
    formdata.append('device_info', deviceInfo)
    fetch(baseURL + ENDPOINTS2.chatBotReply, {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data;",
        "X-Localization": i18n?.language,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then(async (responseData) => {
        console.log('replyChat', responseData.data)
        let answers = responseData?.data?.answers?.map((el) => ({
          _id: el.id,
          title: i18n.language=='ar'?el.answer_ar:el.answer_en,
          createdAt: el.created_at,
          // user: {
          //   _id: el.sender.id,
          //   name: el.sender.firstname,
          //   avatar: el.sender.image,
          // },
          // sent: true,
          // received: el.seen == 1,
        }));
        console.log('answers', answers)
        const data=[]
        const obj={
          _id: responseData.data.id,
          text: i18n.language=='ar'?responseData.data.question_ar:responseData.data.question_en,
          createdAt: new Date(),
          keepIt: true,
          quickReplies:{
            type:'radio',
            values: answers
          }
        }
        data.push(obj)
          setMessages(previousMessages =>
            GiftedChat.append(previousMessages, data),
          );
       
      })
      .catch((e) => {
      });
   
  };

  return (
    <View style={{flex: 1, backgroundColor: COLORS.bg}}>
      <CustomHeader navigation={navigation} />
      <View style={styles.titleContainer}>
        <CustomText
          text={t('sideMenu.ChatAssistant')}
          color={COLORS.black}
          size={20}
          style={styles.title}
        />
        <Pressable onPress={() => setReset(!reset)} style={styles.startOver}>
          <CustomText
            text="start over"
            color={COLORS.black}
            size={12}
            style={styles.startOverText}
          />
          <Ionicons
            name="swap-horizontal-outline"
            size={15}
            color={COLORS.blue}
          />
        </Pressable>
      </View>
      {loading?
      <ActivityIndicator size={'large'} color={COLORS.blue}/>
      :
      <GiftedChat
        renderInputToolbar={() => null}
        messages={messages}
        // onSend={messages => onSend(messages)}
        // user={{
        //   _id: 1,
        // }}
        onQuickReply={onQuickReply}
        quickReplyStyle={{
          borderColor: COLORS.blue,
          width: '100%',
          
        }}
        quickReplyTextStyle={{
          fontFamily:'BahijTheSansArabic-Light',
        }}
        renderMessageText={(props)=>{
          // console.log('ssssssssss', props)
          return(
            <CustomText
            text={props.currentMessage.text}
            color={COLORS.black}
            size={wp(3.5)}
            style={{paddingHorizontal:wp(2)}}
          />
          )
        }
        }
       
      />
    }
    </View>
  );
};
export default ChatBot;
