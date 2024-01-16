export const ADDAGREEMENTS = 'ADDAGREEMENTS';
export const REMOVEaGREEMENTS = 'REMOVEaGREEMENTS';

export const addAgreements = val => {
  return {type: ADDAGREEMENTS, value: val};
};
export const removeAgreements = () => {
  return {type: REMOVEaGREEMENTS};
};
