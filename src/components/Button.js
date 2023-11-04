import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../customs/Colors';

const Button = ({title, onPress, disabled = false}) => {
  return (
    <View style={styles.container}>
      <Pressable
        disabled={disabled}
        style={[styles.pressable, disabled && styles.lessOpacity]}
        onPress={onPress}>
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
  lessOpacity: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
    color: Colors.white,
  },
});
