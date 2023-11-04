import React from 'react';
import {View, Text} from 'react-native';
import Button from '../../components/Button';
import {Amplify} from 'aws-amplify';

const Home = () => {
  return (
    <View>
      <Text>Home</Text>
      <Button
        title="Delete Account"
        onPress={async () => {
          const res = await Amplify.Auth.deleteUser();
          console.log('res:', res);
        }}
      />
    </View>
  );
};

export default Home;
