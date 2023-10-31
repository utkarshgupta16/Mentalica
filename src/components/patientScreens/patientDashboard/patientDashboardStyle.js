import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

const screenBackgroundColor = '#F5F7F8';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    marginTop: hp(3),
    backgroundColor: screenBackgroundColor,
  },
  helloText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: hp(1),
    marginLeft: wp(2),
  },
  dateText: {
    marginBottom: hp(3),
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  tabText: {
    fontWeight: 'bold',
    fontSize: 16,
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
  },
  headingText: {
    fontWeight: 'bold',
  },
  nextAppointmentCont: {
    marginTop: hp(2),
    flexDirection: 'row',
  },
  leftCont: {
    width: wp(25),
    paddingHorizontal: wp(4),
    paddingVertical: hp(2),
    backgroundColor: '#DFDFDE',
    borderBottomLeftRadius: 5,
  },
  rightCont: {
    width: wp(57),
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
  },
  recommendedArticlesCont: {
    height: hp(50),
    marginTop: hp(1),
  },
});
