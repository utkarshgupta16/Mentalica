import React from 'react';
import {Text, StyleSheet, View, Dimensions} from 'react-native';

import {colors} from '../../colors';

export const ChatListEmpty = () => {
  return <Text style={styles.titleText}>No Conversation List Found</Text>;
};

const styles = StyleSheet.create({
  titleText: {
    marginTop: '80%',
    textAlign: 'center',

    fontSize: 20,
    fontWeight: '700',
    color: 'grey',
  },
});
