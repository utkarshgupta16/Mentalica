import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../customs/Colors';

const Button = ({title, onPress}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.pressable} onPress={onPress}>
        <Text style={styles.buttonText} numberOfLines={1}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
};

export default Button;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressable: {
    paddingHorizontal: 50,
    paddingVertical: 10,
    backgroundColor: Colors.primaryBlue,
    borderRadius: 4,
  },
  buttonText: {
    fontWeight: '700',
    color: Colors.white,
  },
});
