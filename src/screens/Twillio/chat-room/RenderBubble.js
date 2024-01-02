import React from 'react';
import {Bubble} from 'react-native-gifted-chat';
import Colors from '../../../customs/Colors';
const RenderMessageVideo = ({bubbleProps}) => {
  return (
    <Bubble
      {...bubbleProps}
      tickStyle={{color: Colors.blueDarkColor}}
      textStyle={{
        left: {color: 'black', fontSize: 17, fontWeight: '400'},
        right: {color: 'black', fontSize: 17, fontWeight: '400'},
      }}
      wrapperStyle={{
        left: {
          backgroundColor: 'white',
        },
        right: {
          backgroundColor: '#dcf8c6',
        },
      }}
    />
  );
};

export default RenderMessageVideo;
