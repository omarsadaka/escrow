import {ADDAGREEMENTS, REMOVEaGREEMENTS} from '../actions/agreements';

const initialState = {
  selectedAgreements: [],
};
export default (state = initialState, action) => {
  switch (action.type) {
    case ADDAGREEMENTS:
      return {...state, selectedAgreements: action.value};
    case REMOVEaGREEMENTS:
      return {...state, selectedAgreements: []};
    default:
      return state;
  }
};
