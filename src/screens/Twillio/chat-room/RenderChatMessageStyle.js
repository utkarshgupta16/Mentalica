import {StyleSheet} from 'react-native';
import Colors from '../../../customs/Colors';
import colors from '../../../customs/Colors';

const styles = StyleSheet.create({
  screen: {
    flexGrow: 1,
    backgroundColor: 'tealff',
    flex: 1,
  },
  messageContainer: {
    backgroundColor: colors.snow,
  },
  container: {
    flex: 1,
  },
  toolbar: {
    // marginTop: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  mediaPlayer: {
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  videoStyle: {
    width: 160,
    height: 120,
    borderRadius: 15,
    marginTop: 3,
    marginHorizontal: 3,
    marginBottom: 5,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  customViewPressStyle: {
    borderRadius: 10,
    backgroundColor: 'white',
    marginVertical: 3,
    marginHorizontal: 3,
  },
  customImageStyle: {width: 160, height: 150, objectFit: 'contain'},
  scrollviewFooter: {flexDirection: 'row', marginHorizontal: 10},
  footerView: {
    paddingRight: 10,
    borderRadius: 10,
    marginVertical: 8,
  },
  footerPressable: {
    position: 'absolute',
    right: 3,
    top: -8,
    backgroundColor: 'white',
    zIndex: 100,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#aaa',
  },
  footerVideo: {
    width: 170,
    height: 150,
    borderRadius: 5,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  footerImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
  },
  footerFilePress: {
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
    borderRadius: 4,
  },
  footerFileImage: {
    width: 100,
    height: 80,
    borderRadius: 5,
    // objectFit: 'contain',
  },
  footerFileText: {paddingVertical: 5, width: 80},
  renderSendImage: {paddingVertical: 7, paddingRight: 12},
  headerChatRoomStyle: {fontSize: 16, fontWeight: '500', color: Colors.black},
});

export default styles;
