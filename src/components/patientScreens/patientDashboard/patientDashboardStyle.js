import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

const screenBackgroundColor = '#F5F7F8';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),
    backgroundColor: 'white',
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
  },
  recommendedArticlesCont: {
    height: hp(45),
    marginTop: hp(1),
  },
});
