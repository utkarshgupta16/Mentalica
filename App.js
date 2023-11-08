import React from 'react';
import reactotron from 'reactotron-react-native';
import MainNavigator from './src/navigation/MainNavigator';
import {SafeAreaView, StyleSheet} from 'react-native';
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
    <SafeAreaView style={{flex:1}}>
      <MainNavigator style={styles.mainNavigator} />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,

    backgroundColor: '#F5F7F8',
  },
});
