import {FlatList, Image, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import {useDispatch, useSelector} from 'react-redux';
import {getScheduledAppointmentsSlice} from '../../../redux/HomeSlice';

const AppoinmentsList = ({}) => {
  const {scheduledAppointmentsData = []} = useSelector(state => state.home);
  const {email} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
        console.log("email",email)
      let res = await dispatch(getScheduledAppointmentsSlice({email}));
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={scheduledAppointmentsData}
        renderItem={({item, index}) => {
          console.log('getScheduledAppointmentsSlice', item);
          return (
            <View
              style={{
                backgroundColor: 'green',
                borderRadius: 8,
                padding: 10,
                flex: 1,
                marginBottom:10
              }}>
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Mentor Email : {item?.mentor_email_id}
              </Text>
              <Text
                style={{paddingTop: 10, color: 'white', fontWeight: 'bold'}}>
                Meeting Time :{' '}
                {item?.slots[0].startTime + '-' + item?.slots[0].endTime}
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AppoinmentsList;
