import React, {memo} from 'react';
// import VideoPlayer from '../../../components/VideoPlayer';
import styles from './RenderChatMessageStyle';
const RenderMessageVideo = ({navigation, currentMessage}) => {
  const {video, _id} = currentMessage || {};
  return null;
  // return (
  //   <VideoPlayer
  //     navigation={navigation}
  //     video={video}
  //     videoID={_id}
  //     showPreview={true}
  //     style={styles.videoStyle}
  //   />
  // );
};

export default memo(RenderMessageVideo);
