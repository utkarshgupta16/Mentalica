import React from 'react';
import {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Pressable,
} from 'react-native';
import Modal from 'react-native-modal';

import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';

import Close from '../../icons/icon_close.svg';

const AddSlot = ({close, state, addSlots, slots = [], setState}) => {
  const renderInput = ({field, placeholder}) => {
    return (
      <TextInput
        style={{
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderWidth: 1,
          marginLeft: 10,
          borderRadius: 4,
          borderColor: 'gray',
          flex: 1,
        }}
        value={state[field]}
        placeholder={placeholder}
        onChangeText={text => setState({...state, [field]: text})}
      />
    );
  };
  return (
    <SafeAreaView>
      <Modal
        onBackButtonPress={() => close && close()}
        onRequestClose={() => close && close()}
        animationIn={'slideInRight'}
        animationOut={'slideOutRight'}
        backdropColor={'#00000029'}
        backdropOpacity={1}
        isVisible={true}
        style={{
          flex: 1,
          alignSelf: 'flex-end',
          width: screenWidth * 0.9,
          height: screenHeight,
          margin: 0,
          paddingVertical: hp(5),
          paddingHorizontal: wp(4),
          backgroundColor: 'white',
        }}>
        <Pressable onPress={() => close && close()}>
          <Close
            height={25}
            width={25}
            color={'black'}
            style={{marginLeft: -3}}
          />
        </Pressable>
        <Text style={{textAlign: 'center', fontSize: 18, marginVertical: 10}}>
          Book Slots
        </Text>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            {renderInput({field: 'startTime', placeholder: 'Start Time'})}
            {renderInput({field: 'endTime', placeholder: 'End Time'})}
          </View>
          <Pressable
            onPress={() => {
              let updateState = {
                startTime: state.startTime.includes(':')
                  ? state.startTime
                  : `${state.startTime}:00`,
                endTime: state.endTime.includes(':')
                  ? state.endTime
                  : `${state.endTime}:00`,
              };
              let data = [...slots, updateState];
              addSlots(data);
              setState({startTime: '', endTime: ''});
            }}
            disabled={!state.startTime || !state.endTime}
            style={{
              backgroundColor: 'green',
              marginTop: 10,
              borderWidth: 1,
              borderRadius: 4,
              paddingHorizontal: 15,
              paddingVertical: 5,
              borderColor: 'white',
              opacity: state.startTime && state.endTime ? 1 : 0.5,
            }}>
            <Text style={{color: 'white'}}>Add</Text>
          </Pressable>
        </View>

        {slots && slots.length ? (
          <FlatList
            data={slots}
            style={{marginTop: 10, flex: 1}}
            keyExtractor={(item, index) => index}
            renderItem={({item, index}) => {
              return (
                <View
                  style={{
                    borderRadius: 4,
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    marginLeft: 5,
                    borderWidth: 1,
                    borderColor: 'gray',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}>
                  <View style={{}}>
                    <Text style={{paddingBottom: 5}}>
                      Start Time: {item.startTime}
                    </Text>
                    <Text>End Time: {item.endTime}</Text>
                  </View>
                  <Pressable
                    style={{}}
                    onPress={() => {
                      setState({...item});
                      let data = [...slots];
                      data.splice(index, 1);
                      addSlots(data);
                    }}>
                    <Text>Edit</Text>
                  </Pressable>
                </View>
              );
            }}
          />
        ) : (
          <View
            style={{
              flex: 1,
            }}
          />
        )}
        {/* <Pressable
          onPress={() => {
            console.log('backgroundColor', slots);
          }}
          disabled={!slots.length}
          style={{
            backgroundColor: 'green',
            marginTop: 10,
            borderWidth: 1,
            borderRadius: 4,
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderColor: 'white',
            opacity: slots.length ? 1 : 0.5,
          }}>
          <Text
            style={{color: 'white', textAlign: 'center', fontWeight: 'bold'}}>
            Submit
          </Text>
        </Pressable> */}
        {/* </View> */}
      </Modal>
    </SafeAreaView>
  );
};

export default AddSlot;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    // marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  calendarModalContainer: {
    // width: screenWidth,
    // alignSelf: 'center',
    paddingHorizontal: wp(3),
    marginBottom: hp(2),
  },
});
