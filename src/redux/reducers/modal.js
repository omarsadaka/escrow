import {
  MODALSTATUS,
  VIDEOMODALSTATUS,
  OTPMODALSTATUS,
  SIMPLEMODALSTATUS,
} from "../actions/modal";

const initialState = {
  status: false,
  videoStatus: false,
  otpStatus: false,
  code: null,
  header: "",
  message: "",
  youtubeVideoId: "",
  simpleModalStatus: false,
  simpleModalPayload: {
    message: "",
    header: "",
    type:"",
    action: false
  },
};
export default (state = initialState, action) => {
  switch (action.type) {
    case MODALSTATUS:
      return {
        ...state,
        status: action.payload.status,
        header: action.payload.header,
        message: action.payload.message,
      };
    case VIDEOMODALSTATUS:
      return {
        ...state,
        videoStatus: action.payload.status,
        youtubeVideoId: action.payload.youtubeVideoId,
      };

    case OTPMODALSTATUS:
      console.log("in  OTPMODALSTATUS...", action);
      return {
        ...state,
        otpStatus: action.payload.status,
        code: action.payload.code,
      };
    case SIMPLEMODALSTATUS:
      return {
        ...state,
        simpleModalStatus: action.payload.status,
        simpleModalPayload: {
          header: action.payload.payload.header,
          message: action.payload.payload.message,
          type: action.payload.payload.type,
          action: action.payload.payload.action,
        },
      };
    default:
      return state;
  }
};
