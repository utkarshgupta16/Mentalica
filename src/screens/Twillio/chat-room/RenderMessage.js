import React from 'react';
import {Text, View, Pressable} from 'react-native';
import Colors from '../../../customs/Colors';
import {bubbleStyle} from './BubbleStyle';
import {textMessageStyle} from './MessageTextStyle';
import RenderMessageImage from './RenderMessageImage';
import RenderCustomView from './RenderCustomView';
import RenderMessageVideo from './RenderMessageVideo';

const renderTicks = currentMessage => {
  return (
    <View style={bubbleStyle.content.tickView}>
      {!!currentMessage.sent && (
        <Text style={[bubbleStyle.content.tick]}>✓</Text>
      )}
      {!!currentMessage.received && (
        <Text style={[bubbleStyle.content.tick]}>✓✓</Text>
      )}
      {!!currentMessage.pending && (
        <Text style={[bubbleStyle.content.tick]}>🕓</Text>
      )}
    </View>
  );
};
const renderUsername = (currentMessage, identity) => {
  if (currentMessage) {
    if (identity && currentMessage.user._id === identity) {
      return null;
    }
    return (
      <View style={bubbleStyle.content.usernameView}>
        <Text style={[bubbleStyle.content.username]}>
          ~ {currentMessage.user.name}
        </Text>
      </View>
    );
  }
  return null;
};

const RenderMessage = ({
  props,
  identity,
  selectedMessages,
  selectMessageToDeleteM,
  navigation,
  setToDeleteMessage,
}) => {
  const {currentMessage} = props || {};

  const {fileType, text, user, _id} = currentMessage || {};
  let position = user._id === identity ? 'right' : 'left';
  let style = {
    flex: 1,
    alignItems: position === 'right' ? 'flex-end' : 'flex-start',
  };
  if (!fileType) {
    const isSelected = selectedMessages.some(el => el._id === _id);

    return (
      <Pressable
        onPress={() => {
          selectMessageToDeleteM(currentMessage);
        }}
        style={bubbleStyle[position].container}>
        <View
          style={[
            bubbleStyle[position].wrapper,
            // {opacity: isSelected ? 0.5 : 1},
          ]}>
          <Text style={textMessageStyle[position].text}>{text}</Text>
          <View style={[bubbleStyle[position].bottom]}>
            {/* {renderUsername(props.currentMessage)} */}
            {/* {this.renderTime()} */}
            {renderTicks(currentMessage)}
          </View>
        </View>
      </Pressable>
    );
  }
  if (fileType === 'video') {
    return (
      <View style={style}>
        <RenderMessageVideo
          navigation={navigation}
          currentMessage={currentMessage}
        />
      </View>
    );
  }
  if (fileType === 'image') {
    return (
      <Pressable
        onPress={() => {
          selectMessageToDeleteM(currentMessage);
        }}
        style={bubbleStyle[position].container}>
        <View style={[bubbleStyle[position].wrapper]}>
          <RenderMessageImage
            props={props}
            selectedMessages={selectedMessages}
            selectMessageToDeleteM={selectMessageToDeleteM}
          />
          {text ? (
            <Text style={textMessageStyle[position].text}>{text}</Text>
          ) : null}
        </View>
      </Pressable>
    );
  }
  return (
    <View style={style}>
      <RenderCustomView
        setToDeleteMessage={setToDeleteMessage}
        selectedMessages={selectedMessages}
        currentMessage={currentMessage}
        navigation={navigation}
      />
    </View>
  );
};

export default RenderMessage;
