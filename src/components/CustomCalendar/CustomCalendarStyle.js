import {StyleSheet} from 'react-native';
import Colors from '../../customs/Colors';

const styles = StyleSheet.create({
  container: {flex: 1},
  buttonStyle: {
    borderWidth: 1,
    borderColor: Colors.silver,
    width: 40,
    height: 40,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.dune,
  },
  monthContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginTop: 15,
    marginBottom: 12,
    alignItems: 'center',
    // backgroundColor: '#c9e4c96e',
    backgroundColor: '#afeeee3d',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  alignItemsCommon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthYearText: {
    textAlign: 'center',
    paddingTop: 7,
  },
  todayIndicator: {
    backgroundColor: Colors.emerald,
    width: 5,
    height: 5,
    borderRadius: 5,
  },
  yearStyle: {
    position: 'absolute',
    top: 22,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    shadowColor: '#cc6600',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    height: 165,
    backgroundColor: Colors.transparent,
  },
  containerYear: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
});

export default styles;
