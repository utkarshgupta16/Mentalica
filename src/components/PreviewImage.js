import React from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';

export function PreviewImage({url, isImageLoading}) {
  return (
    <View style={[styles.container]}>
      {isImageLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={'large'} color="white" />
        </View>
      ) : (
        <Image style={[styles.image]} source={{cache: 'reload', uri: url}} />
      )}
    </View>
  );
}

export default PreviewImage;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: 'black'},
  image: {
    flex: 1,
    resizeMode: 'contain',
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});
