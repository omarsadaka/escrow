import React, { useState, useEffect, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS } from "../constants/API";
import axios from "axios";
import { Alert } from "react-native";
import i18n from "../Translations";

export const getGeneralSettings = async (baseURL) => {
  let url = baseURL + ENDPOINTS.generalSettings;
  try {
    let token = await AsyncStorage.getItem("TOKEN");
    let responseData = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });

    return responseData?.data?.data?.general_setting;
  } catch (error) {
    Alert.alert("something went wrong with general settings");
  }
};
export const getCitiesAndStates = async (baseURL,country) => {
  let url = baseURL + ENDPOINTS.citiesWithStates;
  try {
    let token = await AsyncStorage.getItem("TOKEN");
    let responseData = await axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      data:{
        country_code:country
      }
    });

    return responseData?.data;
  } catch (error) {
    Alert.alert("something went wrong with cities");
  }
};
export const getEscrowStatus = async (baseURL) => {
  let url = baseURL + ENDPOINTS.statusList;
  try {
    let token = await AsyncStorage.getItem("TOKEN");
    let responseData = await axios({
      method: "GET",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
    });

    return responseData?.data.data.length > 0 ? responseData?.data : [];
  } catch (error) {
    Alert.alert("something went wrong with filters");
  }
};
export const checkPassword = async (baseURL, password) => {
  console.log("info", baseURL, password);
  let url = baseURL + ENDPOINTS.checkPassword;
  try {
    let token = await AsyncStorage.getItem("TOKEN");
    let responseData = await axios({
      method: "POST",
      url: url,
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
        "X-Localization": i18n?.language
      },
      data: { password: password },
    });
    //  console.log('res',responseData.data)
    return responseData?.data?.status;
  } catch (error) {
    Alert.alert("something went wrong with checking password");
  }
};

 export const makeNotificationSeen = async (baseURL, id) => {
  // setLoading(true);
  const token = await AsyncStorage.getItem("TOKEN");
  fetch(`${baseURL}${ENDPOINTS.makeNotificationSeen}/${id}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
      "X-Localization": i18n?.language,
    },
  })
    .then((response) => response.json())
    .then(async (responseData) => {
      console.log('seen',responseData)
    })
    .catch((e) => {
      console.log(e);
    });
};
