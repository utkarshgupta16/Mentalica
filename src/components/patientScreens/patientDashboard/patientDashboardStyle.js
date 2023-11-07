import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import Colors from '../../../customs/Colors';

const screenBackgroundColor = '#F5F7F8';

export const styles = StyleSheet.create({
  container: {
    // flex: 1,
    paddingHorizontal: wp(5),
    backgroundColor: 'white',
  },
  helloText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: hp(1),
    marginLeft: wp(2),
    color: Colors.black,
  },
  dateText: {
    marginBottom: hp(3),
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: wp(2),
    color: Colors.black,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: wp(1),
  },
  belowTabsContainer: {
    backgroundColor: '#EEEDED',
    paddingHorizontal: wp(4),
    marginTop: hp(3),
    borderRadius: 6,
    paddingBottom: hp(3),
  },
  headingText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  nextAppointmentCont: {
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'center',
  },
  leftCont: {
    width: wp(30),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#DFDFDE',
    borderBottomLeftRadius: 5,
  },
  rightCont: {
    width: wp(50),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#EFB7B7',
    borderBottomLeftRadius: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  rightContVideoCall: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headingText: {
    marginTop: hp(2),
    fontWeight: 'bold',
    color: Colors.black,
  },
  recommendedArticlesCont: {
    height: hp(45),
    marginTop: hp(1),
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
