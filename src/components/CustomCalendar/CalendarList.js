/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  View,
  Text,
  Alert,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';
import Colors from '../../customs/Colors';
import {dayNameArray} from '../../utils/default';
import convertLang, {MENTOR, PATIENT} from '../../utils/Strings';
import styles from './CalendarListStyle';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {doctorURI, patientURI} from '../../icons';

const CalendarList = ({
  data = [],
  updateData,
  type,
  videoCallAction,
  darkMode,
  selectedDay,
  isLoading,
  loginFrom,
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
    let {endTime, startTime} =
      (item.slots && item.slots.length && item.slots[0]) || {};
    const [hours, minutes] = endTime?.split(':');
    const [startH, startM] = startTime?.split(':');
    const now = new Date();
    now.setHours(hours, minutes, 0, 0);
    let checkExpired = true;
    const date = new Date(item?.date);
    const shadowColor = darkMode ? Colors.white : 'gray';
    const today = date && isToday(date) ? styles.today : undefined;

    return (
      <View
        key={index}
        style={{
          opacity: checkExpired ? 1 : 0.5,
          // alignItems: 'center',
          marginBottom: index === data.length - 1 ? 20 : 0,
          padding: 12,
          borderRadius: 10,
          marginTop: index == 0 ? 20 : 15,
          backgroundColor: 'white',
          shadowOffset: {
            width: 1,
            height: 1,
          },
          shadowOpacity: 0.3,
          shadowRadius: 5.65,
          elevation: 3,
          marginHorizontal: 5,
          paddingHorizontal: 15,
          flex: 1,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            defaultSource={loginFrom === PATIENT ? patientURI : doctorURI}
            source={
              false
                ? {
                    cache: 'reload',
                    // uri: profileURL(uniqueId) + '?time=' + new Date(),
                  }
                : loginFrom === PATIENT
                ? patientURI
                : doctorURI
            }
            style={{
              width: 45,
              height: 45,
              borderRadius: 15,
              objectFit: 'cover',
              padding: 2,
            }}
          />
          <Text
            style={[
              styles.agendaText,
              {paddingLeft: 15, fontSize: 18, fontWeight: 'bold'},
            ]}>
            {name}
          </Text>
        </View>
        <View>
          {/* calendar-month */}
          <View
            style={{
              flexDirection: 'row',
              marginVertical: 15,
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="calendar-today"
              size={24}
              color={Colors.shadowColor1}
            />
            <Text style={{...styles.timeText, paddingLeft: 8}}>
              {moment(date).format('DDD MMM YYYY')}
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingBottom: 10,
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="access-time"
              size={24}
              color={Colors.shadowColor1}
            />
            <Text style={[styles.timeText, {paddingLeft: 8}]}>
              {`${
                startH > 12
                  ? `0${startH - 12}:${startM} PM`
                  : `${startH}:${startM} AM`
              } `}
            </Text>
            <Text style={styles.timeText}>-</Text>
            <Text style={styles.timeText}>
              {` ${
                hours > 12
                  ? `0${hours - 12}:${minutes} PM`
                  : `${hours}:${minutes} AM`
              }`}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Pressable
            style={{
              flex: 1,
              backgroundColor: '#afeeee3d',
              // backgroundColor: Colors.darkPaleMintColor,
              paddingHorizontal: 5,
              paddingVertical: 10,
              borderRadius: 8,
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
            <Text
              style={{
                color: Colors.blueDarkColor,
                // color: Colors.white,
                fontWeight: 'bold',
                textAlign: 'center',
                fontSize: 17,
              }}>
              Join
            </Text>
          </Pressable>
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 0.15,
              marginLeft: 10,
              borderWidth: 1,
              borderColor: Colors.lavender,
              borderRadius: 8,
            }}>
            <MaterialIcons
              name="chat"
              size={23}
              color={Colors.primaryBlue}
              // color={Colors.darkPaleMintColor}
            />
          </Pressable>
        </View>
      </View>
    );

    return (
      <View
        key={index}
        style={{
          opacity: checkExpired ? 1 : 0.5,
          flexDirection: 'row',
          marginBottom: data.length - 1 === index ? 30 : 0,
        }}
        // onPress={() => {
        //   if (checkExpired) {
        //     Alert.alert(YOU_JOINED_CALL, ARE_YOU_JOIN, [
        //       {
        //         onPress: () => videoCallAction(item),
        //         text: YES,
        //       },
        //       {
        //         onPress: () => null,
        //         text: NO,
        //       },
        //     ]);
        //   } else {
        //     Alert.alert(LINK_EXPIRED, ``, [
        //       {
        //         onPress: () => null,
        //         text: OKAY,
        //       },
        //     ]);
        //   }
        // }}
      >
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
              {/* {moment(item?.startTime).format('LT')} */}
              {`${
                startH > 12
                  ? `0${startH - 12}:${startM} PM`
                  : `${startH}:${startM} AM`
              }`}
            </Text>
            <Text style={styles.timeText}>-</Text>
            <Text style={styles.timeText}>
              {/* {moment(item?.endTime).format('LT')} */}
              {/* {endTime} */}
              {`${
                hours > 12
                  ? `0${hours - 12}:${minutes} PM`
                  : `${hours}:${minutes} AM`
              }`}
            </Text>
          </View>
          <View style={styles.appointmentDetails}>
            <Text style={styles.agendaText}>{name}</Text>
          </View>
          <Pressable
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
            <Text style={{color: Colors.blueDarkColor, fontWeight: 'bold'}}>
              Join
            </Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <FlatList
      style={{flex: 1}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.flatlistContainer]}
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
