import React from "react";
import CustomModal from './customModal'
import VideoModal from "./videoModal";
import OTPModal from  './OTPModal'
import SimpleCustomModal from "./simpleModal";

export default ({navigation}) => {
  return (
    <React.Fragment>
    <CustomModal/>
    <VideoModal/>
    <OTPModal navigation={navigation}/>
    <SimpleCustomModal navigation={navigation} />
    {/* <NotesAlert navigation={navigation}/> */}
    </React.Fragment>
  );
};
