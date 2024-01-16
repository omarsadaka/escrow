import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import SelectDropdown from "react-native-select-dropdown";
import Ionicons from "react-native-vector-icons/Ionicons";
import OneQDataSection from "./OneQData";
const FAQScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState(["Annual subscriptions"]);
  const [choosedCatVAL, setchoosedCatVAL] = useState(null);
  const [choosedSubCatVAL, setchoosedSubCatVAL] = useState(null);
  const [subCategory, setSubCategory] = useState([
    { category: "Annual subscriptions", subCategory: "Commission amount" },
    { category: "Annual subscriptions", subCategory: "Commission amount" },
    { category: "Annual subscriptions", subCategory: "Commission amount" },
    { category: "Annual subscriptions", subCategory: "Commission amount" },
  ]);

  const handleSubCatData = () => {
    const SubCatArr = [];
    subCategory?.filter((el) => {
      const cat = el?.category?.replace(" ", "_"); //replaceAll
      if (t(`contactUs.${cat}`) == choosedCatVAL) {
        SubCatArr.push(t(`contactUs.${el?.subCategory?.replace(" ", "_")}`)); //replace all
      }
    });
    return SubCatArr.map((el) => {
      return el;
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.FAQScreen}>
      <CustomHeader navigation={navigation} />
      <View style={styles.body}>
        <CustomText
          text={t("sideMenu.ContactUs")}
          color={COLORS.blue}
          size={20}
          style={styles.title}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SupportTicketsHistory");
          }}
          style={styles.supportTicket}
        >
          <CustomText
            text={t("contactUs.supportTickets")}
            color={COLORS.blue}
            size={16}
          />
        </TouchableOpacity>
        <View style={styles.dropDownContainer}>
          <SelectDropdown
            data={category.map((el) => {
              return t(`contactUs.${el.replace(" ", "_")}`);
            })}
            defaultButtonText={t("contactUs.Choose_reason")}
            renderDropdownIcon={() => {
              return (
                <Ionicons
                  style={styles.dropDownIcon}
                  color={COLORS.secondary}
                  size={25}
                  name="md-chevron-down"
                />
              );
            }}
            buttonTextStyle={styles.dropDownBtnTxt}
            buttonStyle={styles.dropDownBtn}
            rowStyle={styles.dropDownRow}
            rowTextStyle={styles.dropDownTxt}
            onSelect={(val, index) => {
              console.log("val", val);
              setchoosedCatVAL(val);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>

        {choosedCatVAL && (
          <View style={styles.dropDownContainer}>
            <SelectDropdown
              data={handleSubCatData()}
              defaultButtonText={t("contactUs.Choose_reason")}
              renderDropdownIcon={() => {
                return (
                  <Ionicons
                    style={styles.dropDownIcon}
                    color={COLORS.secondary}
                    size={25}
                    name="md-chevron-down"
                  />
                );
              }}
              buttonTextStyle={styles.dropDownBtnTxt}
              buttonStyle={styles.dropDownBtn}
              rowStyle={styles.dropDownRow}
              rowTextStyle={styles.dropDownTxt}
              onSelect={(val, index) => {
                setchoosedSubCatVAL(val);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
        )}

        <View>
          {choosedSubCatVAL && (
            <View style={styles.answerSection}>
              <OneQDataSection
                category={choosedCatVAL}
                subCategory={choosedSubCatVAL}
              />
            </View>
          )}
          <TouchableOpacity onPress={() => navigation.navigate("AllFAQData")}>
            <CustomText
              text={t("contactUs.ViewAllQ")}
              color={COLORS.blue}
              style={styles.viewAllTxt}
            />
          </TouchableOpacity>
        </View>
      </View>
      <CustomText
        color={COLORS.black}
        size={11}
        text={t("copyRights")}
        style={styles.text}
      />
    </ScrollView>
  );
};
export default FAQScreen;
