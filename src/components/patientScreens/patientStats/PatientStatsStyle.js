import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: wp(5),
    // marginTop: hp(3),
  },
  helloText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: hp(1),
    marginLeft: wp(2),
  },
  titleText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginLeft: wp(2),
    marginBottom: hp(1),
  },
  dateText: {
    marginBottom: hp(3),
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: wp(2),
  },
  newEntryBtn: {
    borderColor: 'gray',
    borderWidth: 1,
    width: 130,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 20,
  },
  listContainer: {
    marginHorizontal: wp(2),
    marginVertical: 15,
    borderRadius: 6,
    paddingHorizontal: wp(5),
    // height: '75%',
    backgroundColor: '#EEEDED',
  },
});
