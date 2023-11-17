import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import Colors from './Colors';

const Loader = () => {
  return (
    <View style={styles.loaderContainer}>
      <View style={styles.loaderBackground} />
      <ActivityIndicator size="large" />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black,
    opacity: 0.5,
  },
});
