import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';
import Colors from '../customs/Colors';

const Issue = ({title}) => {
  return (
    <Pressable style={styles.mainContainer}>
      <Text style={styles.titleText}>
        {title?.charAt(0).toUpperCase() + title?.slice(1)}
      </Text>
    </Pressable>
  );
};

export default Issue;

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 14,
    marginVertical: 5,
    borderRadius: 50,
    backgroundColor: Colors.saffron,
    paddingVertical: 8,
    marginHorizontal: 5,
    marginBottom: 20,
    shadowColor: '#cc6600',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
  },
});
