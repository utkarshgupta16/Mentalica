import {View, Text, StyleSheet, Pressable, FlatList} from 'react-native';
import React from 'react';
import {styles} from './PatientStatsStyle';


const PatientStats = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>My mood</Text>
      <Text style={styles.dateText}>4th April overview</Text>
      <Pressable>
        <View style={styles.newEntryBtn}>
          <Text>New entry</Text>
        </View>
      </Pressable>
      <View style={styles.listContainer}>
        <FlatList
          data={problemsData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const renderItem = ({item}) => {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginVertical: 15,
        backgroundColor: '#F5F7F8',
      }}>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 15,
          marginBottom: 15,
          paddingVertical: 10,
        }}>
        {item.problem}
      </Text>
      <FlatList
        data={days}
        renderItem={renderDaysItem}
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
      />
    </View>
  );
};

const renderDaysItem = ({item}) => {
  return (
    <View style={{marginRight: 25, alignItems: 'center'}}>
      <Text style={{marginBottom: 15}}>{item}</Text>
      <View
        style={{
          width: 8,
          height: 8,
          borderRadius: 50,
          backgroundColor: 'purple',
          marginBottom: 10,
        }}></View>
    </View>
  );
};

export default PatientStats;

const problemsData = [
  {
    id: 1,
    problem: 'Anxiety',
  },
  {
    id: 2,
    problem: 'Depression',
  },
  {
    id: 3,
    problem: 'Loneliness',
  },
  {
    id: 4,
    problem: 'Anxiety',
  },
];

const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
