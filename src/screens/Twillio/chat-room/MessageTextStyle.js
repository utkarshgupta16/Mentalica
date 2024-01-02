import {Linking, StyleSheet, View} from 'react-native';

const {textStyle} = StyleSheet.create({
  textStyle: {
    fontSize: 16,
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
  },
});
const textMessageStyle = {
  left: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },

    link: {
      color: 'black',
      textDecorationLine: 'underline',
    },
  }),
  right: StyleSheet.create({
    container: {},
    text: {
      color: 'black',
      ...textStyle,
    },

    link: {
      color: 'white',
      textDecorationLine: 'underline',
    },
  }),
};

export {textMessageStyle};
