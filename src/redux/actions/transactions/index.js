export const ADDNEWTRANSACTION = 'ADDNEWTRANSACTION';
export const REMOVENEWTRANSACTION = 'REMOVENEWTRANSACTION';
export const EditNEWTRANSACTION = 'EditNEWTRANSACTION';
export const ADDNEWTRANSACTIONGeneralDetails =
  'ADDNEWTRANSACTIONGeneralDetails';
export const ADDNEWTRANSACTIONItem = 'ADDNEWTRANSACTIONItem ';
export const UPDATE_PRICE = 'UPDATE_PRICE';
export const ADDCATEGORY = 'ADDCATEGORY';
export const CONFIRMED = 'CONFIRMED';
export const USERTYPE = "USERTYPE";

export const addGeneralTransactionDetails = item => {
  return {type: ADDNEWTRANSACTIONGeneralDetails, payload: item};
};

export const addTransaction = item => {
  return {type: ADDNEWTRANSACTIONItem, payload: item};
};

export const removeTransaction = id => {
  return {type: REMOVENEWTRANSACTION, payload: id};
};
export const editTransaction = newItem => {
  return {type: EditNEWTRANSACTION, payload: newItem};
};
export const updatePrice = price => {
  return {type: UPDATE_PRICE, value: price};
};
export const addCategory = val => {
  return {type: ADDCATEGORY, value: val};
};
export const transactionConfirmed = () => {
  return {type: CONFIRMED};
};
