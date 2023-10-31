import {FlatList, Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {styles} from './patientDashboardStyle';

const PatientDashboard = () => {
  const [selectedTab, setSelectedTab] = useState({tabStr: 'All'});
  return (
    <View style={styles.container}>
      <Text style={styles.helloText}>Hello Andre,</Text>
      <Text style={styles.dateText}>4th April overview</Text>
      {/* Tabs */}
      <View style={styles.tabs}>
        <Pressable
          onPress={() => {
            setSelectedTab({tabStr: 'All'});
          }}>
          <View
            style={{
              backgroundColor: selectedTab.tabStr == 'All' ? '#DDE6ED' : null,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
            }}>
            <Text style={styles.tabText}>All</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedTab({tabStr: 'Appointments'});
          }}>
          <View
            style={{
              backgroundColor:
                selectedTab.tabStr == 'Appointments' ? '#DDE6ED' : null,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
            }}>
            <Text style={styles.tabText}>Appointments</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedTab({tabStr: 'Articles'});
          }}>
          <View
            style={{
              backgroundColor:
                selectedTab.tabStr == 'Articles' ? '#DDE6ED' : null,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
            }}>
            <Text style={styles.tabText}>Articles</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            setSelectedTab({tabStr: 'Saved'});
          }}>
          <View
            style={{
              backgroundColor: selectedTab.tabStr == 'Saved' ? '#DDE6ED' : null,
              paddingHorizontal: 10,
              paddingVertical: 5,
              borderRadius: 50,
            }}>
            <Text style={styles.tabText}>Saved</Text>
          </View>
        </Pressable>
      </View>
      {/*  Next Appointments */}
      {selectedTab.tabStr == 'All' ? (
        <View style={styles.belowTabsContainer}>
          <Text style={styles.headingText}>Next Appointments</Text>
          <View style={styles.nextAppointmentCont}>
            <View style={styles.leftCont}>
              <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 14}}>
                Tomorrow
              </Text>
              <Text style={{fontWeight: 'bold', fontSize: 14}}>10:00</Text>
            </View>
            <View style={styles.rightCont}>
              <Text style={{marginBottom: 9, fontWeight: 'bold', fontSize: 16}}>
                Raqual Almeida
              </Text>
              <View style={styles.rightContVideoCall}>
                <Text style={{fontWeight: 'bold'}}>Video call</Text>
                <Text style={{fontWeight: 'bold'}}>50 min</Text>
              </View>
            </View>
          </View>
          {/* Recommended Articles */}
          <Text style={styles.headingText}>Recommended articles</Text>
          <View style={styles.recommendedArticlesCont}>
            <FlatList
              data={articlesData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      ) : null}
      {selectedTab.tabStr == 'Appointments' ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
      {selectedTab.tabStr == 'Articles' ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
      {selectedTab.tabStr == 'Saved' ? (
        <Text
          style={{
            textAlign: 'center',
          }}>
          {' '}
          No data found
        </Text>
      ) : null}
    </View>
  );
};

const renderItem = ({item}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginVertical: 9,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 6,
      }}>
      <Image
        source={{uri: item.image}}
        style={{
          width: '30%',
          height: 100,
          resizeMode: 'cover',
          borderTopLeftRadius: 5,
          borderBottomLeftRadius: 5,
        }}
      />

      <View
        style={{
          width: '69%',
          paddingHorizontal: 10,
          justifyContent: 'center',
          backgroundColor: '#F5F7F8',
        }}>
        <Text style={{fontSize: 16, fontWeight: '700'}}>{item.title}</Text>
        <Text style={{marginTop: 10}}>{item.author}</Text>
      </View>
    </View>
  );
};
export default PatientDashboard;

const articlesData = [
  {
    id: 1,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://cdn.pixabay.com/photo/2020/01/08/08/43/baloon-4749597_1280.png',
  },
  {
    id: 2,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 3,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 4,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://cdn.pixabay.com/photo/2020/01/08/08/43/baloon-4749597_1280.png',
  },
  {
    id: 5,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 6,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
];
