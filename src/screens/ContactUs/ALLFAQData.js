import React, { useEffect, useMemo, useState } from "react";
import {
  Text,
  ImageBackground,
  Image,
  View,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import CustomText from "../../components/customText";
import createStyles from "./styles";
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import CustomHeader from "../../components/customHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
  AccordionList,
} from "accordion-collapse-react-native";
import {
  BASE_URL,
  ENDPOINTS,
  getBaseURL,
  ENDPOINTS2,
} from "../../constants/API";
import { wp } from "../../utilis/dimensions";
import CustomAlert from "../../components/CustomAlert";
const ALLFAQDataScreen = ({ navigation }) => {
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [baseURL, setBaseURL] = useState("");
  const [header, setHeader] = useState({ heading: "", subHeading: "" });
  const [data, setData] = useState(null);
  const [errMessage, setErrMessage] = useState("");
  const [errShow, setErrShow] = useState(false);
  useEffect(() => {
    getBaseURL()?.then((res) => setBaseURL(res));
  }, []);

  useEffect(() => {
    if (!baseURL) return;
    getQuestions();
  }, [baseURL]);
  const getQuestions = async () => {
    setLoading(true);
    try {
      fetch(baseURL + ENDPOINTS2.faq, {
        method: "GET",
        headers: {
          "X-Localization": i18n?.language,
        },
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log("resss : ", responseData);
          if (responseData.messages.success) {
            setHeader({
              heading: responseData.data.faq[0].data_values.heading,
              subHeading: responseData.data.faq[0].data_values.subheading,
            });
            if (
              responseData.data.faq[1] &&
              responseData.data.faq[1].length > 0
            ) {
              let arr = [];
              responseData.data.faq[1].map((el) => {
                arr.push({
                  question: el.question,
                  answer: el.answer,
                  id: el.id,
                });
              });
              setData(arr);
            }

            setLoading(false);
          } else {
            setLoading(false);
            setErrMessage(t("accountScreen.error"));
            setErrShow(true);
          }
        });
    } catch (error) {
      setLoading(false);
      setErrMessage(t("accountScreen.err"));
      setErrShow(true);
    }
  };

  return (
    <ScrollView style={styles.FAQScreen}>
      <CustomHeader navigation={navigation} />
      {loading ? (
        <ActivityIndicator color={COLORS.header} size={"large"} />
      ) : (
        <>
          {data && data.length > 0 ? (
            <>
              <View style={{ width: wp(90), alignSelf: "center" }}>
                <CustomText
                  text={header.heading}
                  color={COLORS.blue}
                  size={20}
                />
                <CustomText
                  text={header.subHeading}
                  color={COLORS.black}
                  size={14}
                />
                {data.map((el) => {
                  return (
                    <Collapse>
                      <CollapseHeader style={styles.itemFormHeaderContainer}>
                        <CustomText
                          text={el.question}
                          color={COLORS.blue}
                          size={16}
                        />
                        <Ionicons
                          color={COLORS.secondary}
                          size={20}
                          name="md-chevron-down"
                        />
                      </CollapseHeader>
                      <CollapseBody style={styles.answerCont}>
                        <CustomText
                          text={el.answer}
                          color={COLORS.black}
                          size={14}
                        />
                      </CollapseBody>
                    </Collapse>
                  );
                })}
              </View>
            </>
          ) : (
            <CustomText
              text={t("contactUs.qasno")}
              color={COLORS.blue}
              size={20}
              // style={styles.title}
            />
          )}
        </>
      )}

      <CustomAlert
        type={'error'}
        show={errShow}
        header={t("accountScreen.w")}
        body={errMessage}
        action1={() => {
          setErrShow(false);
        }}
        btn1={t("accountScreen.ok")}
        oneBtn={true}
      />
    </ScrollView>
  );
};
export default ALLFAQDataScreen;
