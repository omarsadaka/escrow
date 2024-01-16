import {Platform, StatusBar, Dimensions} from 'react-native';

let customHeight;

if (Platform.OS === 'android') {
  const hasNotch = StatusBar.currentHeight > 24;
  if (hasNotch) {
    customHeight = Dimensions.get('window').height;
  } else {
    customHeight = Dimensions.get('window').height - StatusBar.currentHeight;
  }
} else {
  customHeight = Dimensions.get('window').height;
}

const wp = percentage => {
  return Dimensions.get('window').width * (percentage / 100) || 1;
};

const hp = percentage => {
  return customHeight * (percentage / 100) || 1;
};

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height


export {wp, hp, width, height};
