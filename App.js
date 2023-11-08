import React from 'react';
import reactotron from 'reactotron-react-native';
import {Provider} from 'react-redux';

// import {SafeAreaView, StyleSheet} from 'react-native';

// import {Colors} from 'react-native/Libraries/NewAppScreen';
import MainNavigator from './src/navigation/MainNavigator';
import {SafeAreaView, StyleSheet} from 'react-native';
import store from './src/redux/store';

// Amplify.configure({
//   Auth: {
//     identityPoolId: 'ap-south-1:9e7c1da8-aa71-4aeb-9ef2-fc4f33011561  ',
//     region: 'ap-south-1',
//     userPoolId: 'ap-south-1_jJotJ6a8q',
//     userPoolWebClientId: '38f1s3300nblraet06642nuvrh',
//   },
// });

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

    backgroundColor: '#F5F7F8',
  },
});
