import moment from 'moment';
import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Image} from 'react-native';
import {TextWrapper as Text} from '../../../../components/wrapperComponent/TextWrapper';
import {ViewWrapper as View} from '../../../../components/wrapperComponent/ViewWrapper';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../../../../customs/Colors';
import {getTwilloChatTokenSlice} from '../../../../redux/HomeSlice';
import {dateFormat, profileURL} from '../../../../utils/utils';
import {colors} from '../../colors';
import ShowOnlineBatch from './ShowOnlineBatch';

export function ChatListItem({
  channel,
  participantStatus,
  username,
  onLongPress,
  onPress,
  otherUser = {},
  typingInfo,
  unreadCount,
  lastMessage,
}) {
  let showDate = dateFormat(channel?.lastMessageTime);
  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      style={styles.card}
      onPress={onPress}>
      <View>
        {channel?.image ? (
          <Image style={styles.cardIcon} source={channel?.image} />
        ) : (
          <Image
            source={
              otherUser?.profileId
                ? {
                    cache: 'reload',
                    uri: profileURL(otherUser?.profileId),
                  }
                : require('../../../../icons/patient.jpg')
            }
            style={styles.cardIcon}
          />
        )}
        <ShowOnlineBatch
          participantStatus={participantStatus}
          otherUser={otherUser}
        />
      </View>
      <View style={styles.container}>
        <View style={styles.subContainerStyle}>
          <Text style={styles.cardText}>
            {otherUser?.username || channel?.friendlyName}
          </Text>
          {/* {channel.unreadCount ? (
            <View style={styles.unreadCountViewStyle}>
              <Text style={styles.unreadCountTextStyle}>
                {channel?.unreadCount || 0}
              </Text>
            </View>
          ) : null} */}
          {unreadCount ? (
            <View style={styles.unreadCountViewStyle}>
              <Text style={styles.unreadCountTextStyle}>
                {unreadCount || 0}
              </Text>
            </View>
          ) : null}
          <Text style={styles.dateTextStyle}>
            {showDate
              ? showDate
              : moment(channel?.lastMessageTime).format('DD/MM/YY')}
          </Text>
        </View>
        <Text style={styles.lastMessageTextStyle}>
          {/* {channel?.lastMessageText || ''} */}
          {lastMessage}
        </Text>
        <Text
          style={{...styles.typingStyle, opacity: typingInfo.length ? 1 : 0}}>
          ....Typing
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.purple,
    // backgroundColor: colors.purple,
    borderRadius: 10,
    marginHorizontal: 12,
    // marginTop: 12,
    paddingHorizontal: 6,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  container: {flex: 1},
  cardIcon: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  cardText: {
    fontSize: 15,
    color: colors.cinder,
    marginLeft: 8,
    marginRight: 8,
    fontWeight: 'bold',
  },
  lastMessageTextStyle: {
    fontSize: 14,
    marginLeft: 8,
    paddingTop: 3,
    color: 'gray',
  },
  unreadCountViewStyle: {
    borderRadius: 15,
    width: 27,
    height: 27,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCountTextStyle: {color: 'white', fontWeight: 'bold'},
  subContainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  dateTextStyle: {fontSize: 12, color: 'gray'},
  typingStyle: {
    color: Colors.emerald,
    fontSize: 14,
    fontWeight: 'bold',
    paddingTop: 4,
    paddingLeft: 10,
  },
});
