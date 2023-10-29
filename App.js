import React from 'react';
import reactotron from 'reactotron-react-native';
import {Provider} from 'react-redux';

// import {SafeAreaView, StyleSheet} from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './src/navigation/MainNavigator';
import {SafeAreaView, StyleSheet} from 'react-native';
import Colors from './src/customs/Colors';
import store from './src/redux/store';

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
    <Provider store={store}>
      <SafeAreaView style={styles.safeAreaViewStyle} />
      <MainNavigator style={styles.mainNavigator} />
    </Provider>
  );
};

export default App;

const styles = StyleSheet.create({
  safeAreaViewStyle: {
    flex: 0,
  },
});
