import {StyleSheet} from 'react-native';
import Colors from '../../customs/Colors';
const styles = StyleSheet.create({
  flatlistContainer: {
    marginTop: 10,
    marginHorizontal: 5,
    flexGrow: 1,
  },
  renderItemContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: 7,
    alignItems: 'center',
  },
  appointmentAgenda: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'white',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.37,
    shadowRadius: 5.65,
    elevation: 3,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    flex: 1,
  },
  timeColumn: {
    width: 70, // Adjust the width as needed
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    flex: 0.8,
  },
  container: {
    flexDirection: 'row',
  },
  innerContainer: {
    flex: 1,
  },
  dayNum: {
    fontSize: 28,
    fontWeight: '200',
  },
  dayText: {
    fontSize: 14,
    backgroundColor: 'rgba(0,0,0,0)',
  },
  day: {
    width: 63,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 32,
  },
  today: {
    color: Colors.blueDarkColor,
  },
  indicator: {
    marginTop: 80,
  },
});

export default styles;
