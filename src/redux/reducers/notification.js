import {SETUNSEENCOUNT, } from '../actions/notification';

const initialState = {
  unSeenCount: null,
};
export default (state = initialState, action) => {
  switch (action.type) {
    case SETUNSEENCOUNT:
      return {
        unSeenCount: action.payload,
        };
   
    default:
      return state;
  }
};
