import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {styles} from './patientDashboardStyle';
import {useDispatch, useSelector} from 'react-redux';
import {
  getScheduledAppointmentsSlice,
  getTwilloTokenSlice,
} from '../../../redux/HomeSlice';

const AppoinmentsList = ({}) => {
  const {scheduledAppointmentsData = []} = useSelector(state => state.home);
  const {email} = useSelector(state => state.auth);
  const [isLoading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      let res = await dispatch(
        getScheduledAppointmentsSlice({email, fieldName: 'patientEmailId'}),
      );
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={scheduledAppointmentsData}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                backgroundColor: 'green',
                borderRadius: 8,
                padding: 10,
                flex: 1,
                marginBottom: 10,
                position: 'relative',
              }}>
              {isLoading ? (
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'absolute',
                    left: 0,
                    bottom: 0,
                    top: 0,
                    right: 0,
                  }}>
                  <ActivityIndicator color={'white'} size="large" />
                </View>
              ) : null}
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                Mentor Email : {item?.mentor_email_id}
              </Text>
              <Text
                style={{paddingTop: 10, color: 'white', fontWeight: 'bold'}}>
                Meeting Time :{' '}
                {item?.slots[0].startTime + '-' + item?.slots[0].endTime}
              </Text>
              <Pressable
                style={{marginTop: 10}}
                onPress={async () => {
                  setLoading(true);
                  const res = await dispatch(getTwilloTokenSlice(item.roomId));
                  setLoading(false);
                  console.log('roomId================', res);
                }}>
                <Text
                  style={{color: 'white', fontWeight: 'bold', fontSize: 16}}>
                  Join
                </Text>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
};

export default AppoinmentsList;
