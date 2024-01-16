//modal for handling req messages


import React, { useState, useRef,useMemo,useEffect,useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
} from "react-native";
import {COLORS} from '../constants/colors';
import {useTranslation} from 'react-i18next';
import {hp, wp} from '../utilis/dimensions';
import { useSelector,useDispatch } from "react-redux";
import { setShowModal, setShowVideoModal } from "../redux/actions/modal";
import YoutubePlayer from "react-native-youtube-iframe";
import Ionicons from 'react-native-vector-icons/Ionicons';
const VideoModal = ({  
}) => {
    const styles = useMemo(() => createStyles(COLORS), []);
    const {t, i18n} = useTranslation();
    const dispatch = useDispatch();
    const [playing, setPlaying] = useState(false);
    const {videoStatus,youtubeVideoId}= useSelector((state)=>state.modal)
   

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
          setPlaying(false);
        }
      }, []);
    
      const handleClosingModal = ()=>{
        dispatch(setShowVideoModal({
            status:false,
            youtubeVideoId:''
        }
            ))
      }
    //   const togglePlaying = useCallback(() => {
    //     setPlaying((prev) => !prev);
    //   }, []);
    

  return (
    <>
  <Modal
        animationType="slide"
        transparent={true}
         visible={videoStatus  }
        //  onRequestClose={handleClosingModal}
         
        >
        <TouchableOpacity style={styles.modalView} 
       
        >
                    
           
          <View style={styles.centeredView}>
 
          <TouchableOpacity
            onPress= {handleClosingModal} 
            style={styles.closingcont}
            >
            <Ionicons name ='close' size={30} color={COLORS.black}/>
               
           </TouchableOpacity>
           <YoutubePlayer
                height={'100%'}
                width={'100%'}
                play={playing}
                videoId={youtubeVideoId}
                onChangeState={onStateChange}
            />
      {/* <Button 
      title={playing ? "pause" : "play"}
       onPress={togglePlaying} /> */}

           

          </View>
          
        </TouchableOpacity>
        
      </Modal>
   
    </>
  );
};

export default VideoModal ;
const createStyles = COLORS =>
  StyleSheet.create({
    modalView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(52, 52, 52, 0.6)',
        flex: 1,
      },
  
      centeredView: {
        backgroundColor:COLORS.white,
        paddingHorizontal: wp(1.5),
        borderRadius: 15,
        paddingVertical: hp(2),
        height: '38%',
        width: '90%',
        alignItems:'center',
        justifyContent:'center',
        position: 'absolute',
      },
      closingcont:{
      width:'18%',
      height:'15%',
      alignItems:'flex-end',
      justifyContent:'flex-end',
      alignSelf:'flex-end'
    }
  
});
