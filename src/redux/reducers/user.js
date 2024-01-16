import {
  DECREASE_STEPPER,
  INCREASE_STEPPER,
  IN_ADD,
  LOGOUT_VALUE,
  MAKE_RELOAD,
  RESET_POSITION,
  SAVE_AS_DRAFT,
  SAVE_AS_DRAFT_ENDED,
  SAVE_AS_DRAFT_LOADING,
  SAVE_AS_DRAFT_WHERE,
  USER_IMAGE,
} from "../actions/user";

const initialState = {
  image: null,
  stackValue: false,
  logoutValue: false,
  steperPosition: 0,
  notificationReload: false,
  saveDraftValue: false,
  saveDraftWhere: "",
  saveDraftEnded: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case USER_IMAGE:
      return { ...state, image: action.value };
    case IN_ADD:
      return { ...state, stackValue: action.value };
    case LOGOUT_VALUE:
      return { ...state, logoutValue: action.value };
    case INCREASE_STEPPER:
      return { ...state, steperPosition: action.value + 1 };
    case DECREASE_STEPPER:
      return { ...state, steperPosition: action.value - 1 };
    case RESET_POSITION:
      return { ...state, steperPosition: 0 };
    case MAKE_RELOAD:
      return { ...state, notificationReload: !state.notificationReload };
    case SAVE_AS_DRAFT:
      return { ...state, saveDraftValue: action.value };
    case SAVE_AS_DRAFT_WHERE:
      return { ...state, saveDraftWhere: action.value };
    case SAVE_AS_DRAFT_ENDED:
      return { ...state, saveDraftEnded: action.value };
    default:
      return state;
  }
};
