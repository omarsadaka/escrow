import React, { FC, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  View,
  TouchableOpacity,
  Animated,
  I18nManager,
} from "react-native";
import createStyles from "./styles";
import { data } from "./data";
import CustomText from "../../components/customText";
import CustomButton from "../../components/customButton";
// import {COLORS} from '../../constants/colors';
import { useTheme } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setShowVideoModal } from "../../redux/actions/modal";
import Lottie from "lottie-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";

const { width } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { colors: COLORS } = useTheme();
  const styles = useMemo(() => createStyles(COLORS), []);
  const [scrollIndex, setScrollIndex] = useState(0);
  const scrollRef = useRef();
  const { t } = useTranslation();
  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [animation2, setAnimation2] = useState(new Animated.Value(0));
  const [animation3, setAnimation3] = useState(new Animated.Value(0));
  const [animation4, setAnimation4] = useState(new Animated.Value(0));

  const handleAnimation = (type) => {
    Animated.timing(
      type == 1
        ? animation
        : type == 2
        ? animation2
        : type == 3
        ? animation3
        : animation4,
      {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }
    ).start();
  };
  const cancelAnimation = (type) => {
    Animated.timing(
      type == 1
        ? animation
        : type == 2
        ? animation2
        : type == 3
        ? animation3
        : animation4,
      {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }
    ).start();
  };
  const handleVideoModal = () => {
    console.log("press");
    dispatch(
      setShowVideoModal({
        status: true,
        youtubeVideoId: "iee2TATGMyI",
      })
    );
  };

  useEffect(() => {
    let animArr = [0, 1, 2, 3];
    handleAnimation(scrollIndex + 1);
    animArr.forEach((element) => {
      if (element != scrollIndex) {
        cancelAnimation(element + 1);
      }
    });
  }, [scrollIndex]);

  useEffect(() => {
    update()
  }, []);

  const update= async()=>{
    await AsyncStorage.setItem('@SHOWLANG', '1')

  }
  // animation 1
  const animatedStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const animatedStyle1 = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  // animation 2

  const animatedStyle2 = {
    transform: [
      {
        translateY: animation2.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: animation2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const animatedStyle3 = {
    transform: [
      {
        translateY: animation2.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: animation2.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  // animation 3

  const animatedStyle4 = {
    transform: [
      {
        translateY: animation3.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: animation3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const animatedStyle5 = {
    transform: [
      {
        translateY: animation3.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: animation3.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  // animation 4

  const animatedStyle6 = {
    transform: [
      {
        translateY: animation4.interpolate({
          inputRange: [0, 1],
          outputRange: [-100, 0],
        }),
      },
    ],
    opacity: animation4.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  const animatedStyle7 = {
    transform: [
      {
        translateY: animation4.interpolate({
          inputRange: [0, 1],
          outputRange: [100, 0],
        }),
      },
    ],
    opacity: animation4.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
  };
  return (
    <View style={styles.container}>
      <View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(event) => {
            setScrollIndex(
              Math.round(event.nativeEvent.contentOffset.x / width)
            );
          }}
        >
          {data.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={index == 3 ? handleVideoModal : () => {}}
                style={styles.imageContainer}
              >
                {index == 3 ? (
                  <Animated.View style={[animatedStyle6, styles.image]}>
                    <Lottie
                      //size={15}
                      source={require("../../assets/lottie/videoPlayer.json")}
                      autoPlay
                      loop={true}
                    />
                  </Animated.View>
                ) : (
                  <Animated.Image
                    style={[
                      styles.image,
                      index == 0
                        ? animatedStyle
                        : index == 1
                        ? animatedStyle2
                        : animatedStyle4,
                    ]}
                    resizeMode="contain"
                    source={item.image}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <View style={styles.bottomPart}>
        <Animated.View
          style={
            scrollIndex == 0
              ? animatedStyle1
              : scrollIndex == 1
              ? animatedStyle3
              : scrollIndex == 2
              ? animatedStyle5
              : animatedStyle7
          }
        >
          <CustomText
            size={25}
            color={COLORS.black}
            text={data[scrollIndex].title}
            style={[styles.text, { marginBottom: 15 }]}
          />

          <CustomText
            color={COLORS.black}
            size={15}
            text={data[scrollIndex].text}
            style={styles.text}
          />
        </Animated.View>

        {scrollIndex != data.length - 1 && (
          <CustomButton
            color={COLORS.blue}
            text={t("next")}
            onPress={() => {
              scrollRef.current?.scrollTo({
                x: width * (scrollIndex + 1),
                animated: true,
              });
            }}
            containerStyle={styles.btn}
          />
        )}
        {scrollIndex == data.length - 1 && (
          <CustomButton
            color={COLORS.blue}
            onPress={async () => {
              await AsyncStorage.setItem("ONBOARDING", "true");
              await AsyncStorage.setItem(
                "NAVIGATION_STATE_TIME",
                new Date().toString()
              );
              navigation.navigate("RegisterValidateMobile");
              if (!I18nManager.isRTL) {
                I18nManager.allowRTL(true);
                I18nManager.forceRTL(true);
                RNRestart.Restart();
              }
            }}
            text={t("letsCreateAccount")}
            containerStyle={styles.btn}
          />
        )}
        {scrollIndex != data.length - 1 && (
          <Pressable
            onPress={() => {
              scrollRef.current?.scrollTo({
                x: width * data.length,
                animated: true,
              });
            }}
            style={styles.skipContainer}
          >
            <CustomText color={COLORS.black} text={t("skip")} />
          </Pressable>
        )}
        {scrollIndex == data.length - 1 && (
          <Pressable
            onPress={async () => {
              await AsyncStorage.setItem("ONBOARDING", "true");
              // navigation.navigate("Login");
              if (!I18nManager.isRTL) {
                I18nManager.allowRTL(true);
                I18nManager.forceRTL(true);
                RNRestart.Restart();
              }
            }}
            style={styles.skipContainer}
          >
            <CustomText color={COLORS.black} text={t("alreadyHaveAccount")} />
          </Pressable>
        )}
        {/* <View style={styles.swiperDots}>
          {data.map((item, index) => (
            <View
              key={index}
              style={[
                styles.swiperDot,
                {
                  backgroundColor:
                    scrollIndex == index ? COLORS.blue : COLORS.grey,
                },
              ]}
            />
          ))}
        </View> */}
      </View>
    </View>
  );
};

export default OnboardingScreen;
