import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
const OneQDataSection = ({ category, subCategory }) => {
  // console.log('factors',category,subCategory)
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [answer, setAnswer] = useState(null);
  const [question, setQuestion] = useState(null);

  const QData = [
    //     {
    //     category:'Annual subscriptions',
    //     subCategory:'Reduce fee',
    //     categoryArName:'الإشتراكات السنوية',
    //     subCategoryArName:'تخفيض الإشتراك',
    //     answer:t('agreementScreen.more')
    //   },
    {
      category: "Annual subscriptions",
      subCategory: "Commission amount",
      categoryArName: "الإشتراكات السنوية",
      subCategoryArName: "مبلغ العمولة",
      answer: t("agreementScreen.more"),
    },
    {
      category: "Annual subscriptions",
      subCategory: "Commission amount",
      categoryArName: "الإشتراكات السنوية",
      subCategoryArName: "مبلغ العمولة",
      answer: t("agreementScreen.more"),
    },
    {
      category: "Annual subscriptions",
      subCategory: "Commission amount",
      categoryArName: "الإشتراكات السنوية",
      subCategoryArName: "مبلغ العمولة",
      answer: t("agreementScreen.more"),
    },
    //   {
    //     category:'Annual subscriptions',
    //     subCategory:'membership banned',
    //     categoryArName:'الإشتراكات السنوية',
    //     subCategoryArName:'حظر العضوية',
    //     answer:t('agreementScreen.more')
    //   },
    //   {
    //     category:'Annual subscriptions',
    //     subCategory:'paid_memberships',
    //     categoryArName:'الإشتراكات السنوية',
    //     subCategoryArName:'العضوية مدفوعة',
    //     answer:t('agreementScreen.more')
    //   },
  ];

  const handleQA = () => {
    QData.map((el) => {
      // const categoryKey = Object.keys(i18n.t('contactUs', { returnObjects: true })).find(key => i18n.t('contactUs', { returnObjects: true })[key] === i18n.language=='ar'? el.categoryArName:el. category)
      // const subCategoryKey= Object.keys(i18n.t('contactUs', { returnObjects: true })).find(key => i18n.t('contactUs', { returnObjects: true })[key] === i18n.language=='ar'? el.subCategoryArName: el.subCategory)
      const categoryKey =
        i18n.language == "en"
          ? Object.keys(i18n.t("contactUs", { returnObjects: true })).find(
              (key) =>
                i18n.t("contactUs", { returnObjects: true })[key] ===
                el.category
            )
          : Object.keys(i18n.t("contactUs", { returnObjects: true })).find(
              (key) =>
                i18n.t("contactUs", { returnObjects: true })[key] ===
                el.categoryArName
            );
      const subCategoryKey =
        i18n.language == "en"
          ? Object.keys(i18n.t("contactUs", { returnObjects: true })).find(
              (key) =>
                i18n.t("contactUs", { returnObjects: true })[key] ===
                el.subCategory
            )
          : Object.keys(i18n.t("contactUs", { returnObjects: true })).find(
              (key) =>
                i18n.t("contactUs", { returnObjects: true })[key] ===
                el.subCategoryArName
            );

      if (
        t(`contactUs.${categoryKey}`) ==
          t(`contactUs.${el.category.replace(" ", "_")}`) &&
        t(`contactUs.${subCategoryKey}`) ==
          t(`contactUs.${el.subCategory.replace(" ", "_")}`)
      ) {
        console.log("scope1");
        // console.log('3',t(`contactUs.${subCategoryKey}`),t(`contactUs.${el.subCategory.replace(' ','_')}`))
        setAnswer(el.answer);
        setQuestion(t(`contactUs.${subCategoryKey}`));

        // return;
      }
      //  else{
      //     console.log('scope2')
      //     setAnswer(null)
      //     setQuestion(null)

      //  }
    });
  };

  useEffect(() => {
    // console.log('why')
    setAnswer(null);
    setQuestion(null);
    handleQA();
  }, [category, subCategory]);

  // {console.log('question ans',question,answer)}

  return (
    <ScrollView contentContainerStyle={styles.oneQContainer}>
      <View>
        <Collapse isExpanded={true} style={styles.itemFormContainer}>
          <CollapseHeader style={styles.itemFormHeaderContainer}>
            <CustomText text={question} color={COLORS.blue} />
            <Ionicons
              style={styles.dropDownIcon}
              color={COLORS.secondary}
              size={25}
              name="md-chevron-down"
            />
          </CollapseHeader>
          <CollapseBody style={styles.answerCont}>
            <CustomText text={answer} color={COLORS.blue} />
          </CollapseBody>
        </Collapse>
      </View>
    </ScrollView>
  );
};
export default OneQDataSection;
