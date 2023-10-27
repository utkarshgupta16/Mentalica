import React from 'react';
import reactotron from 'reactotron-react-native';

import {SafeAreaView, StyleSheet} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './src/navigation/MainNavigator';

const App = () => {
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
    <>
      <SafeAreaView style={styles.safeAreaViewStyle} />
      <MainNavigator />
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
    backgroundColor: Colors.whitishBlue,
  },
});
