import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ScrollView,
} from 'react-native';
import moment from 'moment';
import React, {useState} from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import {styles} from './MentorDashboardStyle';

const MentorDashboard = () => {
  const [isSelectDate, setIsSelectDate] = useState(null);
  const [selectDate, setSelectDate] = useState('');

  const generateWeekData = () => {
    const weekData = [];
    const startOfWeek = moment().startOf('D');

    for (let i = 0; i < 30; i++) {
      weekData.push({id: i, date: startOfWeek.clone().add(i, 'days')});
    }
    return weekData;
  };
  const weekData = generateWeekData();

  const handleItemPress = item => {
    setIsSelectDate(item.id === isSelectDate ? null : item.id);
    setSelectDate(item.date === isSelectDate ? null : item.date);
  };

  const renderCalenderItem = ({item}) => (
    <Pressable
      onPress={() => {
        handleItemPress(item);
      }}>
      <View
        style={{
          justifyContent: 'space-around',
          alignItems: 'center',
          marginRight: wp(4.5),
        }}>
        <Text style={{fontWeight: '600', paddingBottom: 10}}>
          {item.date.format('ddd')}
        </Text>
        <Text
          style={{
            fontWeight: '500',
            backgroundColor: item.id === isSelectDate ? 'gray' : null,
            paddingHorizontal: wp(1.9),
            paddingVertical: hp(1),
            borderRadius: 50,
            color: item.id === isSelectDate ? 'white' : null,
          }}>
          {item.date.format('DD')}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello Raquel,</Text>
      <Text style={styles.dateText}>
        {selectDate && selectDate.format('DD')}{' '}
        {selectDate && selectDate.format('MMM')} {selectDate ? 'overview' : ''}
      </Text>

      <View>
        <FlatList
          horizontal
          data={weekData}
          extraData={weekData}
          keyExtractor={item => item.date.format('YYYY-MM-DD')}
          renderItem={renderCalenderItem}
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <View style={{flex: 1, marginTop: 20}}>
        <View style={styles.appointmentCont}>
          {/* Left side with time slots */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {timeSlots.map((timeSlot, index) => (
              <View key={index} style={styles.bookedPointmentRow}>
                <Text>{timeSlot}</Text>
                {bookedSlots.map((startTime, index) => {
                  return (
                    <View key={index}>
                      {timeSlot == startTime.start ? (
                        <View style={styles.bookedPointmentSlot}>
                          <View>
                            <Text
                              style={{
                                fontWeight: '600',
                                fontSize: 15,
                                marginBottom: 10,
                              }}
                              key={index}>
                              {startTime.name}
                            </Text>
                            <Text>Video call</Text>
                          </View>
                          <Text>{startTime.duration} hr</Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
                {bookedSlots.map((startTime, index) => {
                  {
                    timeSlot == startTime.start && (
                      <View
                        style={{borderWidth: 1, width: 100, height: 40}}></View>
                    );
                  }
                })}
                {/* <View style={{borderWidth: 1, width: 100, height: 40}}></View> */}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

export default MentorDashboard;

const timeSlots = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
];

const bookedSlots = [
  {name: 'John Doe', start: '09:00', duration: 2},
  {name: 'Alice Smith', start: '01:00', duration: 1},
  {name: 'Roshan J', start: '02:00', duration: 1},
  {name: 'Kaushiki P', start: '04:00', duration: 1},
  // Add more booked slots as needed
];
