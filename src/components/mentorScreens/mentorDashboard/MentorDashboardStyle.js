import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    flex: 1,
    backgroundColor: 'white',
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
    marginBottom: hp(2),
    marginTop: hp(2),
  },
  dateText: {
    marginBottom: hp(3),
    fontSize: 15,
    fontWeight: 'bold',
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appointments: {
    flex: 1,
    marginTop: 10,
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
  startTime: {
    fontWeight: '600',
    fontSize: 15,
    marginBottom: 10,
  },
  slot: {
    borderWidth: 1,
    width: 100,
    height: 40,
  },
  modalView: {
    height: hp(30),
    width: '100%',
    backgroundColor: '#E4D0D0',
    borderRadius: 10,
  },
  modalTextInput: {
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginHorizontal: wp(10),
    marginTop: hp(3),
  },
});
