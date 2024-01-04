import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import Colors from '../customs/Colors';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/Responsive';

const Button = ({title, onPress, disabled = false, signup = false}) => {
  return (
    <View
      style={[
        styles.container,
        {
          marginHorizontal: signup
            ? widthPercentageToDP(30)
            : widthPercentageToDP(5),
          paddingTop: signup ? 10 : 0,
        },
      ]}>
      <Pressable
        disabled={disabled}
        style={[
          styles.pressable,
          {paddingTop: 10},
          disabled && styles.lessOpacity,
        ]}
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
    marginHorizontal: widthPercentageToDP(5),
    marginVertical: heightPercentageToDP(1),
    justifyContent: 'center',
  },
  pressable: {
    paddingVertical: 10,
    backgroundColor: Colors.darkPaleMintColor,
    borderRadius: 4,

    borderRadius: 50,
  },
  lessOpacity: {
    opacity: 0.6,
  },
  buttonText: {
    fontWeight: '700',
    textAlign: 'center',
    color: Colors.white,
    fontSize: 19,
    fontFamily: 'Montserrat',
  },
});
