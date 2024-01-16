import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Pdf from "react-native-pdf";
import RNFetchBlob from "rn-fetch-blob";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import CustomText from "../../components/customText";
import { COLORS } from "../../constants/colors";
import { showMessage } from "react-native-flash-message";
import { useTranslation } from "react-i18next";
import { hp, wp } from "../../utilis/dimensions";
import CustomHeader from "../../components/customHeader";

const PDF = ({ navigation, route }) => {
  const { i18n, t } = useTranslation();
  const [downloadLoading, setDownloadLoading] = useState(false);

  // to download files
  const checkPermission = async (url) => {
    setDownloadLoading(true);
    if (Platform.OS === "ios") {
      downloadFile(url);
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: t("agreementScreen.sp"),
            message: t("agreementScreen.na"),
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          // Start downloading
          downloadFile(url);
          console.log("Storage Permission Granted.");
        } else {
          setDownloadLoading(false);
          // If permission denied then show alert
          showMessage({ message: t("agreementScreen.png"), type: "warning",titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
          // Alert.alert(t("agreementScreen.png"));
        }
      } catch (err) {
        setDownloadLoading(false);
        // To handle permission related exception
        console.log("++++" + err);
      }
    }
  };

  const downloadFile = async (url) => {
    const token = await AsyncStorage.getItem("TOKEN");
    // Get today's date to add the time suffix in filename
    let date = new Date();
    // File URL which we want to download
    let FILE_URL = url;
    // Function to get extention of the file url
    let file_ext = getFileExtention(FILE_URL);

    file_ext = "." + file_ext[0];
    console.log("sss : ", file_ext);

    // config: To get response by passing the downloading related options
    // fs: Root directory path to download
    const { config, fs } = RNFetchBlob;
    let RootDir = fs.dirs.PictureDir;
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        path:
          RootDir +
          "/file_" +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          file_ext,
        description: "downloading file...",
        notification: true,
        // useDownloadManager works with Android only
        useDownloadManager: true,
      },
    };
    config(options)
      .fetch("GET", FILE_URL, {
        Authorization: "Bearer " + token,
      })
      .then((res) => {
        showMessage({ message: t("agreementScreen.fds"), type: "success",titleStyle:{textAlign:'left',fontFamily:'BahijTheSansArabic-Plain'} });
        setDownloadLoading(false);
      })
      .catch((er) => {
        setDownloadLoading(false);
        console.log("eeeeee : ", er);
      });
  };

  const getFileExtention = (fileUrl) => {
    // To get the file extension
    return /[.]/.exec(fileUrl) ? /[^.]+$/.exec(fileUrl) : undefined;
  };
  return (
    <View style={styles.container}>
      <CustomHeader navigation={navigation} warningLanguage={true} />
      <TouchableOpacity
        disabled={downloadLoading}
        style={styles.download}
        onPress={() => {
          checkPermission(route.params.link);
        }}
      >
        {downloadLoading ? (
          <ActivityIndicator color={COLORS.header} />
        ) : (
          <>
            <CustomText
              color={COLORS.header}
              size={16}
              text={t("shortEscrow.downloadAgg")}
              style={styles.accordionTitle}
            />
            <MaterialIcons
              // style={{ width: wp(5) }}
              name="file-download"
              size={30}
              color={COLORS.header}
            />
          </>
        )}
      </TouchableOpacity>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: route.params.link,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          // console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          // console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log("error", error);
        }}
        onPressLink={(uri) => {
          // console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  download: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: hp(1),
  },
});
export default PDF;
