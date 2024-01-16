export const WELCOME = "WELCOME";
export const REMEMBERME = "REMEMBERME";
export const LOGOUT = "LOGOUT";
export const VALIDMPIN = "VALIDMPIN";

export const setWelcome = () => {
  return { type: WELCOME };
};
export const rememberMe = (value) => {
  return { type: REMEMBERME, value: value };
};
export const logOut = () => {
  return { type: LOGOUT };
};
export const isValidMpin = (val) => {
  return { type: VALIDMPIN, value: val };
};
