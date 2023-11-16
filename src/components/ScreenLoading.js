import React from 'react';
import {ActivityIndicator, View} from 'react-native';

const ScreenLoading = () => {
  return (
    <View
      style={{
        backgroundColor: '#00000082',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        left: 0,
        bottom: 0,
        top: 0,
        right: 0,
        zIndex: 1000,
      }}>
      <ActivityIndicator size={'large'} color="white" />
    </View>
  );
};

export default ScreenLoading;
