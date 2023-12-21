import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import Colors from '../../../customs/Colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(2),
    backgroundColor: Colors.white,
    flex: 1,
    position: 'relative',
  },
  helloText: {
    // fontFamily: 'Fuzzy Bubbles Bold',
    fontFamily: 'Montserrat',
    fontSize: 20,
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
    paddingBottom: hp(2),
    paddingHorizontal: wp(2),
  },
  belowTabsContainer: {
    backgroundColor: Colors.white,
    // backgroundColor: '#EEEDED',
    paddingHorizontal: wp(4),
    borderRadius: 6,

    height: hp(73),
  },
  headingText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
  nextAppointmentCont: {
    marginTop: hp(2),
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 2,
      height: 3,
    },
    shadowOpacity: 0.57,
    shadowRadius: 4.65,
    elevation: 3,
    borderRadius: 10,
  },
  leftCont: {
    width: wp(35),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
    backgroundColor: Colors.darkPaleMintColor,
  },
  rightCont: {
    width: wp(52),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#eab676',
    borderBottomLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
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
    marginTop: hp(1),
    height: hp(52),
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
    borderRadius: 8,
    marginTop: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 3,
    marginHorizontal: 10,
    paddingHorizontal: 10,
    borderColor: '#ffff',
    borderWidth: 1,
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
  reloadButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reloadText: {color: Colors.darkPaleMintColor, paddingBottom: 10},
});
