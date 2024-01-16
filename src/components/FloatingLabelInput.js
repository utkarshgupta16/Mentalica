import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  Animated,
  Pressable,
} from 'react-native';
import Colors from '../customs/Colors';

const FloatingLabelInput = props => {
  const {
    onChangeText: onChange,
    value = '',
    placeholder = '',
    style,
    ...restProps
  } = props;
  //   const [value, setValue] = useState('');
  const moveText = useRef(new Animated.Value(0)).current;

  const onFocusHandler = () => {
    if (!value) {
      moveTextTop();
    }
  };
  const onBlur = () => {
    if (!value) {
      moveTextBottom();
    }
  };
  const onChangeText = textValue => {
    onChange(textValue);
    if (textValue !== '') {
      moveTextTop();
    } else if (value === '') {
      moveTextBottom();
    }
  };

  const moveTextTop = () => {
    Animated.timing(moveText, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const moveTextBottom = () => {
    Animated.timing(moveText, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start();
  };

  const yVal = moveText.interpolate({
    inputRange: [0, 1],
    outputRange: [4, -24],
  });

  const animStyle = {
    transform: [{translateY: yVal}],
  };

  return (
    <View style={[styles.container]}>
      <Pressable onPress={onFocusHandler}>
        <Animated.View style={[styles.animatedStyle, animStyle]}>
          <Text style={styles.label}>{placeholder}</Text>
        </Animated.View>
      </Pressable>
      <TextInput
        value={value}
        onBlur={onBlur}
        style={style}
        onFocus={onFocusHandler}
        onChangeText={onChangeText}
        {...restProps}
      />
    </View>
  );
};
export default FloatingLabelInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    // marginTop: 20,
    backgroundColor: '#fff',
    paddingTop: 5,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#bdbdbd',
    borderRadius: 2,
    width: '100%',
    alignSelf: 'center',
    flex: 1,
  },
  icon: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: 16,
    height: 35,
    color: '#000',
  },
  label: {
    color: 'grey',
    fontSize: 15,
  },
  animatedStyle: {
    top: 10,
    left: 8,
    position: 'absolute',
    borderRadius: 90,
    zIndex: 10000,
  },
});
