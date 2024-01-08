import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    backgroundColor: 'white',
  },
  circleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  singleItemLoadingStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
