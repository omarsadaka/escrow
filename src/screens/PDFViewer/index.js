import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
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
import { Image } from "react-native";

const PDFViewer = ({ navigation, route }) => {
  const { i18n, t } = useTranslation();
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState();
  const [isPDF, setIsPDF] = useState(true);
  useEffect(() => {
    downloadFileFetch(route.params.link);
  }, [navigation]);
  const downloadFileFetch = async (url) => {
    const token = await AsyncStorage.getItem("TOKEN");
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.status == "ok") {
          setUrl(response.url);
          const extension = getFileExtention(response.url);
          extension == "pdf" ? setIsPDF(true) : setIsPDF(false);
          setLoading(false);
        }
      })
      .catch((er) => {
        console.log("erorr file : ", er);
        setLoading(false);
      });
  };
  // to download files
  const checkPermission = async (url) => {
    setDownloadLoading(true);
    downloadFile(url);
    return
    if (Platform.OS === "ios") {
      downloadFile(url);
    } else {
      if(Platform.OS === "android" && Platform.Version >= 33){
        downloadFile(url);
      }else{
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
    let RootDir = fs.dirs.DownloadDir;
   
    const configfb = {
      fileCache: false,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: "/Escrow_" +Math.floor(date.getTime() + date.getSeconds() / 2),
      path:  RootDir +"/Escrow_" +Math.floor(date.getTime() + date.getSeconds() / 2) +file_ext,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: '',
      },
      android: configfb,
    });
    config(configOptions)
      .fetch("GET", FILE_URL, {
        Authorization: "Bearer " + token,
      })
      .then((res) => {
        if (Platform.OS === 'ios') {
          RNFetchBlob.fs.writeFile(res.path(), res.data, 'base64');
          setTimeout(async () => {
            RNFetchBlob.ios.previewDocument(res.path());
          }, 500);
        }
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
    <>
      <CustomHeader navigation={navigation} warningLanguage={true} />
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size={"large"} color={COLORS.header} />
        ) : (
          <>
            <TouchableOpacity
              disabled={downloadLoading}
              style={styles.download}
              onPress={() => {
                checkPermission(url);
              }}
            >
              {downloadLoading ? (
                <ActivityIndicator color={COLORS.header} />
              ) : (
                <>
                  <CustomText
                    color={COLORS.header}
                    size={16}
                    text={
                      route.params.attachment
                        ? t("shortEscrow.downloadAtt")
                        : t("shortEscrow.downloadAgg")
                    }
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
            {isPDF ? (
              <Pdf
                trustAllCerts={false}
                source={{
                  uri: url,
                  cache: true,
                }}
                style={styles.pdf}
              />
            ) : (
              <Image source={{ uri: url }} style={styles.image} />
            )}
          </>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  image: {
    width: wp(90),
    height: hp(65),
    resizeMode: "contain",
  },
  download: {
    flexDirection: "row",
    alignSelf: "center",
    marginVertical: hp(1),
  },
});
export default PDFViewer;
