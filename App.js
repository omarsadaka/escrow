import 'react-native-gesture-handler';
import React from 'react';
import {SafeAreaView} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';
import {navigationRef} from './src/navigation/navigation';
import MainNavigation from './src/navigation/navigation';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/Translations/index';
import FlashMessage from 'react-native-flash-message';
import ModalWrapper from './src/modals';
import DoubleTapToClose from './src/components/DoubleTabToExit';
export default function App() {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <DoubleTapToClose />
        <SafeAreaView style={{flex: 1}}>
          <MainNavigation refs={navigationRef} />
          <FlashMessage position="bottom" />
          {/* <ModalWrapper/> */}
        </SafeAreaView>
      </I18nextProvider>
    </Provider>
  );
}
