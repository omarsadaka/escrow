import {
  WELCOME,
  REMEMBERME,
  LOGOUT,
  VALIDMPIN,
} from "../actions/authentication";

const initialState = {
  welcome: false,
  rememberMe: false,
  validMpin: false,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case WELCOME:
      console.log("in welcome...", state.welcome, state.rememberMe);
      return { ...state, welcome: true };
    case REMEMBERME:
      console.log("in remember me..");
      return { ...state, rememberMe: action.value };
    case LOGOUT:
      console.log("in logout...", state);
      return { ...state, welcome: false, rememberMe: false, validMpin: false };
    case VALIDMPIN:
      return { ...state, validMpin: action.value };
    default:
      return state;
  }
};
