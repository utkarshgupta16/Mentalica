/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from 'react-native';
import Colors from '../../customs/Colors';
import {dayNameArray} from '../../utils/default';
import convertLang, {MENTOR} from '../../utils/Strings';
import styles from './CalendarListStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CalendarList = ({
  data = [],
  updateData,
  type,
  videoCallAction,
  darkMode,
  selectedDay,
  isLoading,
}) => {
  const {t} = useTranslation();
  const {ARE_YOU_JOIN, LINK_EXPIRED, NO, RELOAD, YES, YOU_JOINED_CALL, OKAY} =
    convertLang(t);

  const isToday = date => {
    const today = new Date();
    return today.toDateString() === date.toDateString();
  };

  const renderItem = ({item, index}) => {
    let name = type === MENTOR ? item?.patientName : item?.mentorName;
    let {endTime} = (item.slots && item.slots.length && item.slots[0]) || {};
    const [hours, minutes] = endTime?.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    let checkExpired = true;
    const date = new Date(item?.date);
    const shadowColor = darkMode ? Colors.white : 'gray';
    const today = date && isToday(date) ? styles.today : undefined;
    return (
      <TouchableOpacity
        key={index}
        style={{
          opacity: checkExpired ? 1 : 0.5,
          flexDirection: 'row',
          marginBottom: data.length - 1 === index ? 30 : 0,
        }}
        onPress={() => {
          if (checkExpired) {
            Alert.alert(YOU_JOINED_CALL, ARE_YOU_JOIN, [
              {
                onPress: () => videoCallAction(item),
                text: YES,
              },
              {
                onPress: () => null,
                text: NO,
              },
            ]);
          } else {
            Alert.alert(LINK_EXPIRED, ``, [
              {
                onPress: () => null,
                text: OKAY,
              },
            ]);
          }
        }}>
        <View style={styles.day}>
          <Text allowFontScaling={false} style={[styles.dayNum, today]}>
            {date.getDate()}
          </Text>
          <Text allowFontScaling={false} style={[styles.dayText, today]}>
            {dayNameArray[date.getDay()]}
          </Text>
        </View>
        <View
          style={{
            shadowColor,
            ...styles.appointmentAgenda,
          }}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeText}>
              {moment(item?.startTime).format('LT')}
            </Text>
            <Text style={styles.timeText}>-</Text>
            <Text style={styles.timeText}>
              {moment(item?.endTime).format('LT')}
            </Text>
          </View>

          <View style={styles.appointmentDetails}>
            <Text style={styles.agendaText}>{name}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.flatlistContainer}
      data={data}
      renderItem={renderItem}
      refreshing={isLoading?.refreshing}
      onRefresh={() => updateData(selectedDay, 'refreshing')}
      keyExtractor={(item, index) => index}
      ListEmptyComponent={() => {
        return (
          <View
            style={{
              justifyContent: 'center',
              flex: 1,
              alignItems: 'center',
            }}>
            <Pressable
              onPress={() => {
                updateData(selectedDay, 'refreshing');
              }}>
              <MaterialIcons
                name="refresh"
                size={30}
                color={Colors.blueDarkColor}
              />
            </Pressable>
          </View>
        );
      }}
    />
  );
};

export default CalendarList;
