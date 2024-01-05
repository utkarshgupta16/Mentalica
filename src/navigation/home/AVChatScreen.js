import {
  Alert,
  Dimensions,
  InteractionManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import {AppContext} from './App';
import {
  TwilioVideo,
  TwilioVideoLocalView,
  TwilioVideoParticipantView,
} from 'react-native-twilio-video-webrtc';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import React, {useRef, useContext, useEffect, useState} from 'react';
import {AppContext} from '../../../App';
import Colors from '../../customs/Colors';
import {useTranslation} from 'react-i18next';
// const { TwilioVideo } = require('react-native-twilio-video-webrtc');

const initialState = {
  isAudioEnabled: true,
  status: 'disconnected',
  participants: new Map(),
  videoTracks: new Map(),
  userName: '',
  roomName: '',
  token: '',
  isVideoEnabled: true,
};

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const dimensions = Dimensions.get('window');

export default VideoCallScreen = ({navigation}) => {
  const {t} = useTranslation();
  const twilioVideo = useRef(null);
  const {props, setProps} = useContext(AppContext);
  const [showControls, setShowControls] = useState(true);
  // const [props, setProps] = useState(initialState);

  const [showView, setShowView] = useState(false);
  useEffect(() => {
    const interactionPromise = InteractionManager.runAfterInteractions(() =>
      setShowView(true),
    );
    return () => interactionPromise.cancel();
  }, []);

  useEffect(() => {
    twilioVideo.current.connect({
      roomName: props.roomName,
      accessToken: props.token,
    });
    setProps({...props, status: 'connecting'});
    return () => {
      _onEndButtonPress();
    };
  }, []);

  const _onEndButtonPress = () => {
    twilioVideo.current?.disconnect();
    setProps(initialState);
  };

  const _onMuteButtonPress = () => {
    twilioVideo.current
      .setLocalAudioEnabled(!props.isAudioEnabled)
      .then(isEnabled => setProps({...props, isAudioEnabled: isEnabled}));
  };

  const _onFlipButtonPress = () => {
    twilioVideo.current.flipCamera();
  };
  //   console.log(props.status);
  //   console.log(props.videoTracks);
  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.container}
      onPress={() => setShowControls(!showControls)}>
      {/* {
          <View style={styles.callWrapper}>
            {
              <View style={styles.grid}>
                {Array.from(
                  new Map([
                    [
                      'MT84974d3d5dab72fe44ac9cd1d38aac36',
                      {
                        participantSid: 'PAbbef1890354c3f80b87a8c37fbabc607',
                        videoTrackSid: 'MT84974d3d5dab72fe44ac9cd1d38aac36',
                      },
                    ],
                  ]),
                  ([trackSid, trackIdentifier]) => {
                    console.log('participant ifno------------------');
                    console.log(trackSid);
                    console.log(trackIdentifier);
                    return (
                      <TwilioVideoParticipantView
                        style={styles.remoteVideo}
                        key={'MT84974d3d5dab72fe44ac9cd1d38aac36'}
                        trackIdentifier={{
                          participantIdentity: 'pat',
                          videoTrackId: 'MT84974d3d5dab72fe44ac9cd1d38aac36',
                        }}
                      />
                    );
                  },
                )}
              </View>
            }
          </View>
        } */}
      {props.status === 'connected' && props.videoTracks.size > 0 ? (
        <View style={styles.remoteGrid}>
          {Array.from(props.videoTracks, ([trackSid, trackIdentifier]) => {
            return (
              <TwilioVideoParticipantView
                enabled={true}
                style={styles.remoteVideo}
                key={trackSid}
                trackIdentifier={trackIdentifier}
              />
            );
          })}
        </View>
      ) : props.videoTracks.size === 0 ? (
        <TwilioVideoLocalView
          enabled={true}
          style={[
            styles.localVideo,
            {position: 'relative', flex: 1, height: height},
          ]}
        />
      ) : null}
      {props.status === 'connected' && props.videoTracks.size > 0 ? (
        <View
          style={{
            // backgroundColor: 'blue',
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            alignSelf: 'flex-end',
            width: width,
            justifyContent: 'space-around',
            bottom: 28,
          }}>
          <TwilioVideoLocalView enabled={true} style={[styles.localVideo]} />
        </View>
      ) : null}
      {showControls ? (
        <View
          style={{
            position: 'absolute',
            zIndex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            alignSelf: 'flex-end',
            width: width,
            justifyContent: 'space-around',
            bottom: 24,
          }}>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: 'red'}]}
            onPress={_onEndButtonPress}>
            <SimpleLineIcons name="call-end" size={20} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.button,
              props.isAudioEnabled && {backgroundColor: 'white'},
            ]}
            onPress={_onMuteButtonPress}>
            <Octicons
              name={'unmute'}
              size={20}
              color={props.isAudioEnabled ? Colors.black : Colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={_onFlipButtonPress}>
            <MaterialIcons
              name={'flip-camera-android'}
              size={20}
              color={Colors.white}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={() => {
          setProps({...props, status: 'connected'});
        }}
        onRoomDidDisconnect={() => {
          setProps({...props, status: 'disconnected'});
          navigation.goBack();
        }}
        onRoomDidFailToConnect={error => {
          Alert.alert('Error', error.error);
          setProps({...props, status: 'disconnected'});
          navigation.goBack();
        }}
        onParticipantAddedVideoTrack={({participant, track}) => {
          if (track.enabled) {
            setProps({
              ...props,
              videoTracks: new Map([
                ...props.videoTracks,
                [
                  track.trackSid,
                  {
                    participantSid: participant.sid,
                    videoTrackSid: track.trackSid,
                  },
                ],
              ]),
            });
          }
        }}
        onParticipantRemovedVideoTrack={({track}) => {
          const videoTracks = props.videoTracks;
          videoTracks.delete(track.trackSid);
          setProps({...props, videoTracks});
        }}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
  },
  form: {
    flex: 1,
    alignSelf: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  formGroup: {
    margin: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    width: 50,
    height: 50,
    padding: 10,
    backgroundColor: 'grey',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  textInput: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  callContainer: {
    flex: 1,
  },
  callWrapper: {
    flex: 1,
    width: '100%',
    backgroundColor: 'red',
    // justifyContent: 'center',
  },
  remoteGrid: {
    flex: 1,
  },
  remoteVideo: {
    // flex: 1,
    width: width,
    // alignItems: 'center',
    // verticalAlign: 'top',
    height: height,
  },
  localVideo: {
    position: 'absolute',
    zIndex: 1,
    right: 5,
    bottom: 50,
    width: dimensions.width / 4,
    height: dimensions.height / 4,
  },
  optionsContainer: {
    position: 'absolute',
    paddingHorizontal: 10,
    left: 0,
    right: 0,
    bottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
