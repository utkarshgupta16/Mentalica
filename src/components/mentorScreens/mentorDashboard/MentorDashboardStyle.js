import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    flex: 1,
    backgroundColor: '#F5F7F8',
    marginHorizontal: 8,
  },
  helloText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: 15,

    marginTop: 20,
  },
  dateText: {marginBottom: 20, fontSize: 15, fontWeight: 'bold'},
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  appointmentCont: {
    flexDirection: 'row',
    backgroundColor: '#EEEDED',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 6,
  },
  bookedPointmentRow: {
    marginVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  bookedPointmentSlot: {
    paddingHorizontal: 20,
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
});
