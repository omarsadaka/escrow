import { REMOVEaGREEMENTS } from "./agreements";
import { CONFIRMED } from "./transactions";

export const USER_IMAGE = "USER_IMAGE";
export const IN_ADD = "IN_ADD";
export const LOGOUT_VALUE = "LOGOUT_VALUE";
export const INCREASE_STEPPER = "INCREASE_STEPPER";
export const DECREASE_STEPPER = "DECREASE_STEPPER";
export const RESET_POSITION = "RESET_POSITION";
export const MAKE_RELOAD = "MAKE_RELOAD";
export const SAVE_AS_DRAFT = "SAVE_AS_DRAFT";
export const SAVE_AS_DRAFT_WHERE = "SAVE_AS_DRAFT_WHERE";
export const SAVE_AS_DRAFT_ENDED = "SAVE_AS_DRAFT_ENDED";

export const storeUserImage = (url) => {
  return { type: USER_IMAGE, value: url };
};

export const storeStackValue = (value) => {
  // return { type: IN_ADD, value: value };
  return (dispatch) => {
    dispatch({ type: IN_ADD, value: value });
    dispatch({ type: CONFIRMED });
    dispatch({ type: REMOVEaGREEMENTS });
    dispatch({ type: RESET_POSITION });
  };
};
export const handleSaveAsDraftValue = (value) => {
  return { type: SAVE_AS_DRAFT, value: value };
};

export const handleSaveAsDraftWhere = (value) => {
  return { type: SAVE_AS_DRAFT_WHERE, value: value };
};
export const handleSaveAsDraftEnded = (value) => {
  return { type: SAVE_AS_DRAFT_ENDED, value: value };
};

export const handleLogoutValue = (value) => {
  return { type: LOGOUT_VALUE, value: value };
};

export const increaseStepper = (value) => {
  return { type: INCREASE_STEPPER, value: value };
};
export const decreaseStepper = (value) => {
  return { type: DECREASE_STEPPER, value: value };
};
export const makeReloadTransactions = () => {
  console.log("notification reload...");
  return { type: MAKE_RELOAD };
};
