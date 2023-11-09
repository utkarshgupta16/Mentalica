import React, {useState} from 'react';
import reactotron from 'reactotron-react-native';

const initialState = {
  isAudioEnabled: true,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
  userName: '',
  roomName: '',
  token: '',
  isVideoEnabled: true,
};

export const AppContext = React.createContext(initialState);

import MainNavigator from './src/navigation/MainNavigator';
import {SafeAreaView, StyleSheet, StatusBar} from 'react-native';
import {I18nextProvider} from 'react-i18next';
import i18n from './src/utils/i18n';

const App = () => {
  const [props, setProps] = useState(initialState);

  if (__DEV__) {
    const yeOldeConsoleLog = console.log;
    console.log = (...args) => {
      yeOldeConsoleLog(...args);
      reactotron.display({
        name: 'CONSOLE.LOG',
        value: args,
        preview:
          args.length > 0 && typeof args[0] === 'string' ? args[0] : null,
      });
    };
  }

  return (
    <AppContext.Provider value={{props, setProps}}>
      <I18nextProvider i18n={i18n}>
        <SafeAreaView style={styles.safeAreaViewStyle} />
        <MainNavigator style={styles.mainNavigator} />
      </I18nextProvider>
    </AppContext.Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
    backgroundColor: '#F5F7F8',
  },
});
