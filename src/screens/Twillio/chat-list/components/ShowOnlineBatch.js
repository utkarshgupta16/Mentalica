import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Colors from '../../../../customs/Colors';

const ShowOnlineBatch = ({otherUser, participantStatus}) => {
  const {identity} = otherUser || {};
  return (
    <>
      {participantStatus[identity]?.isOnline ? (
        <View style={styles.containerStyle}>
          <View style={styles.batchStyle} />
        </View>
      ) : null}
    </>
  );
};

export default ShowOnlineBatch;

const styles = StyleSheet.create({
  containerStyle: {
    marginLeft: 5,
    position: 'absolute',
    right: -5,
    top: 7,
    zIndex: 100,
  },
  batchStyle: {
    backgroundColor: Colors.emerald,
    width: 15,
    height: 15,
    borderRadius: 10,
  },
});
