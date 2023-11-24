import React, {useEffect, useLayoutEffect} from 'react';
import {
  Amplify,
  DataStore,
  Hub,
  Auth,
  API,
  graphqlOperation,
} from 'aws-amplify';
import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {store} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react';
import {persistStore} from 'redux-persist';
import SplashScreen from 'react-native-splash-screen';
import awsconfig from './src/aws-exports';
import amplifyconfiguration from './src/amplifyconfiguration.json';
import {createUser} from './src/graphql/mutations';
import {Message, User} from './src/models';
import {getUser} from './src/graphql/queries';
// Register background handler
Platform.OS == 'android' &&
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

Amplify.configure(awsconfig);

let persistor = persistStore(store);
const AppConfig = () => {
  useLayoutEffect(() => {
    SplashScreen.hide();
  }, []);

  useEffect(() => {
    console.log('register==========');

    const listener = Hub.listen('eeeee', async hubData => {
      console.log('listener==========', hubData);

      const {event, data} = hubData.payload;
      // if (
      //   event === 'outboxMutationProcessed' &&
      //   data.model === Message &&
      //   !['DELIVERED', 'READ'].includes(data.element.status)
      // ) {
      //   DataStore.save(
      //     Message.copyOf(data.element, updated => {
      //       updated.status = 'DELIVERED';
      //     }),
      //   );
      // }
    });

    // Remove listener
    return () => listener();
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      // get Auth user
      const authUser = await Auth.currentAuthenticatedUser({
        bypassCache: true,
      });

      if (authUser) {
        // query the database using Auth user id (sub)
        const userData = await API.graphql(
          graphqlOperation(getUser, {id: authUser.attributes.sub}),
        );

        if (userData?.data?.getUser) {
          console.log('User already exists in DB');
          return;
        }
        // if there is no users in db, create one

        const newUser = {
          id: authUser?.attributes.sub,
          name: '9193364313',
          status: 'Sonu, I am using WhatsApp',
        };
        let result = await API.graphql(
          graphqlOperation(createUser, {input: newUser}),
        );
        // console.log('newUser@@@@@@@@@@@@@@@@@', newUser);
      }
    };
    // syncUser();
  }, []);

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
