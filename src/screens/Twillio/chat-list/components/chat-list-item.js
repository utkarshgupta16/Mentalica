import moment from 'moment';
import React, {useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Image, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {getTwilloChatTokenSlice} from '../../../../redux/HomeSlice';
import {dateFormat} from '../../../../utils/utils';
import {colors} from '../../colors';

export function ChatListItem({
  channel,
  participants,
  username,
  onLongPress,
  onPress,
  otherUser = {},
}) {
  let showDate = dateFormat(channel?.lastMessageTime);
  let otherParticipantFilter =
    (channel.attributes?.participants &&
      channel.attributes?.participants.filter(
        val => val.identity != username,
      )) ||
    [];
  let otherParticipantData = {};
  if (otherParticipantFilter && otherParticipantFilter.length) {
    let {identity} = otherParticipantFilter[0] || {};
    otherParticipantData = participants[identity] || {}
  }
  console.log('ChatListItem', otherParticipantData);

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
            style={styles.cardIcon}
            source={require('../../../../icons/patient.jpg')}
          />
        )}
        {otherParticipantData?.isOnline ? (
          <View
            style={{
              marginLeft: 5,
              position: 'absolute',
              right: 0,
              top: 7,
            }}>
            <View
              style={{
                backgroundColor: 'green',
                width: 15,
                height: 15,
                borderRadius: 10,
              }}
            />
          </View>
        ) : null}
      </View>

      <View style={{flex: 1}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
          }}>
          <Text style={styles.cardText}>
            {otherUser?.username || channel?.name}
          </Text>
          <Text style={{fontSize: 12, color: 'gray'}}>
            {showDate
              ? showDate
              : moment(channel?.lastMessageTime).format('DD/MM/YY')}
          </Text>
        </View>
        <Text
          style={{fontSize: 14, marginLeft: 8, paddingTop: 3, color: 'gray'}}>
          {channel?.lastMessageText || ''}
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
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  cardIcon: {
    height: 50,
    width: 50,
  },
  cardText: {
    fontSize: 15,
    color: colors.cinder,
    marginLeft: 8,
    marginRight: 8,
    fontWeight: 'bold',
  },
});
