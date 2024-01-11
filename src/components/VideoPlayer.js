// import React, {useRef, useState} from 'react';
// // import Video from 'react-native-video';
// // import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
// import {
//   Dimensions,
//   Pressable,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import {colors} from '../screens/Twillio/colors';
// const VideoPlayer = ({video, style = {}, videoID: _id, navigation, route}) => {
//   const {video: selectedVideo1 = ''} = route?.params || {};
//   const selectedVideo = selectedVideo1 ? selectedVideo1 : video;

//   const videoPlayer = useRef(null);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);
//   const [paused, setPaused] = useState(true);
//   const [playerState, setPlayerState] = useState(PLAYER_STATES.PLAYING);
//   const [screenType, setScreenType] = useState('contain');

//   const onSeek = seek => {
//     videoPlayer.current.seek(seek);
//   };
//   const onPaused = playerState => {
//     setPaused(!paused);
//   };

//   const onReplay = () => {
//     setPlayerState(PLAYER_STATES.PLAYING);
//     videoPlayer.current.seek(0);
//   };

//   const onProgress = data => {
//     if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
//       setCurrentTime(data.currentTime);
//     }
//   };

//   const onLoad = data => {
//     setDuration(data.duration);
//     setIsLoading(false);
//   };

//   const onLoadStart = data => setIsLoading(true);

//   const onEnd = () => setPlayerState(PLAYER_STATES.ENDED);

//   const onFullScreen = () => {
//     if (screenType == 'contain') setScreenType('cover');
//     else setScreenType('contain');
//   };

//   const onSeeking = currentTime => setCurrentTime(currentTime);
//   if (!selectedVideo) {
//     return null;
//   }

//   // const renderVideo = styleNew => {
//   //   return (
//   //     <Video
//   //       onEnd={onEnd}
//   //       onLoad={onLoad}
//   //       onLoadStart={onLoadStart}
//   //       onProgress={onProgress}
//   //       paused={paused}
//   //       ref={videoPlayer}
//   //       resizeMode={screenType}
//   //       rate={1.0}
//   //       ignoreSilentSwitch={'obey'}
//   //       //   onFullScreen={isFullScreen}
//   //       source={{
//   //         uri: selectedVideo,
//   //       }}
//   //       style={{
//   //         ...styles.mediaPlayer,
//   //         width: Dimensions.get('window').width,
//   //         height: Dimensions.get('window').height,
//   //         ...styleNew,
//   //       }}
//   //       volume={1}
//   //     />
//   //   );
//   // };

//   return (
//     <>
//       {/* {selectedVideo1 ? (
//         <>{renderVideo()}</>
//       ) : (
//         <TouchableOpacity
//           onPress={() => {
//             navigation.navigate('VideoPlayer', {video});
//             // showVideos({selectedId: _id, selectedVideo: video});
//             // setIsFullScreen(true);
//           }}>
//           {renderVideo(style)}
//         </TouchableOpacity>
//       )} */}

//       {selectedVideo1 ? (
//         <MediaControls
//           duration={duration}
//           isLoading={isLoading}
//           mainColor="#333"
//           onFullScreen={onFullScreen}
//           onPaused={onPaused}
//           onReplay={onReplay}
//           onSeek={onSeek}
//           onSeeking={onSeeking}
//           playerState={playerState}
//           progress={currentTime}
//           // toolbar={renderToolbar()}
//         />
//       ) : null}
//     </>
//   );
// };

// export default VideoPlayer;

// const styles = StyleSheet.create({
//   screen: {
//     flexGrow: 1,
//     backgroundColor: 'tealff',
//     flex: 1,
//   },
//   messageContainer: {
//     backgroundColor: colors.snow,
//   },
//   container: {
//     flex: 1,
//   },
//   toolbar: {
//     // marginTop: 30,
//     backgroundColor: 'red',
//     padding: 10,
//     borderRadius: 5,
//   },
//   mediaPlayer: {
//     backgroundColor: 'black',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
