import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import Colors from '../../../customs/Colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    flex: 1,
    // backgroundColor: 'white',
    backgroundColor: '#F5F7F8',
    marginHorizontal: 8,
  },
  helloCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  createAppointmentBtn: {
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.4),
    borderRadius: 10,
  },
  AppontmentBtnText: {},
  helloText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginTop: hp(2),
    marginBottom: hp(1),
    color: Colors.black,
  },
  dateText: {
    marginBottom: hp(3),
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.black,
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.black,
  },
  appointmentCont: {
    flexDirection: 'row',
    backgroundColor: '#EEEDED',
    paddingHorizontal: wp(4),
    paddingTop: hp(1),
    borderRadius: 6,
  },
  bookedPointmentRow: {
    marginVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookedPointmentSlot: {
    paddingHorizontal: wp(6),
    paddingVertical: hp(3),
    width: wp(60),
    marginLeft: wp(4),
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: '#E4D0D0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: '#888',
    fontSize: 16,
  },

  itemContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  timeColumn: {
    width: 100, // Adjust the width as needed
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  appointmentDetails: {
    flex: 1,
  },
});
