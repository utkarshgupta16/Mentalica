import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Colors from '../customs/Colors';

const Issue = ({title}) => {
  return (
    <Pressable style={styles.mainContainer}>
      <Text style={styles.titleText}>{title}</Text>
    </Pressable>
  );
};

export default Issue;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 14,
    borderRadius: 50,
    backgroundColor: Colors.palePink,
    paddingVertical: 8,
    marginRight: 18,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.dune,
  },
});
