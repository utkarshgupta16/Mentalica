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
    justifyContent: 'center',
    // marginTop: 15,
    marginBottom: 12,
    alignItems: 'center',
  },
  alignItemsCommon: {justifyContent: 'center', alignItems: 'center'},
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
});

export default styles;
