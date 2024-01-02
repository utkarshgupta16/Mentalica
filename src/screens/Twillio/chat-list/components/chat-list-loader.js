import React from 'react';
import {View, StyleSheet, ActivityIndicator} from 'react-native';

export const ChatListLoader = () => {
  return (
    <View style={{justifyContent:"center",flex:1}}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  item: {
    height: 80,
    borderRadius: 10,
    marginBottom: 10,
  },
});
