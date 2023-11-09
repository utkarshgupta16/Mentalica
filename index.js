import {Amplify} from 'aws-amplify';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});
const config = {
  Auth: {
    identityPoolId: 'ap-south-1:9e7c1da8-aa71-4aeb-9ef2-fc4f33011561  ', // (required) - Amazon Cognito Identity Pool ID
    region: 'ap-south-1', // (required) - Amazon Cognito Region
    userPoolId: 'ap-south-1_jJotJ6a8q', // (optional) - Amazon Cognito User Pool ID
    userPoolWebClientId: '38f1s3300nblraet06642nuvrh', // (optional) - Amazon Cognito Web Client ID (App client secret needs to be disabled)
  },
};

Amplify.configure(config);
let persistor = persistStore(store);
const AppConfig = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <App />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

AppRegistry.registerComponent(appName, () => AppConfig);
