export const MODALSTATUS = "MODALSTATUS";
export const VIDEOMODALSTATUS = "VIDEOMODALSTATUS";
export const OTPMODALSTATUS = "OTPMODALSTATUS";
export const SIMPLEMODALSTATUS = "SIMPLEMODALSTATUS";

export const setShowModal = (ModalDetails) => {
  return { type: MODALSTATUS, payload: ModalDetails };
};
export const setShowVideoModal = (ModalDetails) => {
  return { type: VIDEOMODALSTATUS, payload: ModalDetails };
};
export const setShowOTPModal = (ModalDetails) => {
  return { type: OTPMODALSTATUS, payload: ModalDetails };
};

export const showSimpleModal = (ModalDetails) => {
  return { type: SIMPLEMODALSTATUS, payload: ModalDetails };
};
