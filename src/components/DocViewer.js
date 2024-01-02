import React, {useRef, useState} from 'react';
import {Dimensions, StyleSheet, Text} from 'react-native';
import {colors} from '../screens/Twillio/colors';
import WebView from 'react-native-webview';
// import Pdf from 'react-native-pdf';

const DocViewer = ({route}) => {
  const {documents} = route?.params || {};
  // let ext = documents.split('.').pop();
  if (!documents) {
    return null;
  }
  return (
    <WebView
      source={{
        uri: documents,
      }}
    />
  );
};

export default DocViewer;

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'tealff',
    flex: 1,
  },
  messageContainer: {
    backgroundColor: colors.snow,
  },
  container: {
    flex: 1,
  },
  toolbar: {
    marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    backgroundColor: 'black',
    justifyContent: 'center',
  },
});
