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
import DropDownPicker from 'react-native-dropdown-picker';
import Modal from 'react-native-modal';
import {
  heightPercentageToDP as hp,
  screenHeight,
  screenWidth,
  widthPercentageToDP as wp,
} from '../../utils/Responsive';
import Close from '../../icons/icon_close.svg';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {slotsData} from '../../utils/default';
const AddSlot = ({close, state, addSlots, slots = [], setState}) => {
  let slots1 =
    (slots &&
      slots.length &&
      slots?.map(val => `${val?.startTime}-${val?.endTime}`)) ||
    [];
  const [isOpen, setOpen] = useState(false);
  const [selectedSlot, setSlots] = useState([...slots1]);
  
  // let filterData = slotsData.filter(val => {
  //   if (!slots1.includes(val?.value)) {
  //     return true;
  //   }
  //   return false;
  // });
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 10,
      }}>
      <Modal
        animationType="slide"
        transparent={true}
        isVisible={true}
        style={{flex: 0.7, top: 120, borderRadius: 10}}
        onRequestClose={() => setVisible(false)}>
        <View
          style={{
            flex: 1,
            paddingHorizontal: wp(3),
            backgroundColor: '#FFFFFFCC',
            borderRadius: 10,
            backgroundColor: 'white',
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 10,
            }}>
            <View />
            <Text
              style={{
                textAlign: 'center',
                color: '#33A3DC',
                fontSize: 18,
                fontWeight: 'bold',
                marginVertical: 10,
              }}>
              Add Slots
            </Text>
            <Pressable
              onPress={() => {
                close && close();
              }}
              style={{
                paddingLeft: wp(2),
                // alignItems: 'flex-end',
              }}>
              <Close />
            </Pressable>
          </View>
          <View
            style={{
              flexDirection: 'row',
              backgroundColor: 'white',
              zIndex: 1000,
            }}>
            {/* {renderInput({field: 'startTime', placeholder: 'Start Time'})}
            {renderInput({field: 'endTime', placeholder: 'End Time'})} */}
            <DropDownPicker
              listMode="SCROLLVIEW"
              autoScroll={true}
              zIndex={1000}
              open={isOpen}
              setOpen={setOpen}
              value={selectedSlot}
              onSelectItem={val => {
                let labels = val.map(i => i?.value);
                let slotsArray = [];
                labels.map(val => {
                  let [startTime, endTime] = val?.split('-');
                  let updateState = {
                    startTime: startTime?.includes(':')
                      ? startTime
                      : `${startTime}:00`,
                    endTime: endTime?.includes(':')
                      ? endTime
                      : `${state?.endTime}:00`,
                  };
                  slotsArray.push(updateState);
                });
                let data = [...slotsArray];
                addSlots(data);
                setSlots(labels);
              }}
              items={slotsData}
              placeholder={'Select Slot'}
              dropDownContainerStyle={{borderColor: '#33A3DC'}}
              style={{
                marginBottom: 10,
                backgroundColor: Colors.paleMintColor,
                borderColor: '#33A3DC',
              }}
              multiple={true}
            />
          </View>
          {/* <View style={{alignItems: 'center'}}>
            <Pressable
              onPress={() => {
                let [startTime, endTime] = selectedSlot?.split('-');
                let updateState = {
                  startTime: startTime?.includes(':')
                    ? startTime
                    : `${startTime}:00`,
                  endTime: endTime?.includes(':')
                    ? endTime
                    : `${state?.endTime}:00`,
                };
                let data = [...slots, updateState];
                addSlots(data);
                setSlots('');
              }}
              disabled={!selectedSlot}
              style={{
                backgroundColor: 'green',
                marginTop: 10,
                borderWidth: 1,
                borderRadius: 4,
                paddingHorizontal: 15,
                paddingVertical: 5,
                borderColor: 'white',
                opacity: selectedSlot ? 1 : 0.5,
              }}>
              <Text style={{color: 'white'}}>Add</Text>
            </Pressable>
          </View> */}

          {slots && slots.length ? (
            <FlatList
              showsVerticalScrollIndicator={false}
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
                      borderColor: '#33A3DC',
                    }}>
                    <View style={{}}>
                      <Text style={{paddingBottom: 5}}>
                        Start Time{` : ${item?.startTime}`}
                      </Text>
                      <Text>End Time {`  : ${item?.endTime}`}</Text>
                    </View>
                    <Pressable
                      style={{}}
                      onPress={() => {
                        let keyIndex = `${item.startTime}-${item.endTime}`;
                        let selectedSlotNew = [...selectedSlot];
                        let selectedIndexKey =
                          selectedSlotNew.indexOf(keyIndex);
                        let data = [...slots];
                        data.splice(index, 1);
                        selectedSlotNew.splice(selectedIndexKey, 1);
                        addSlots(data);
                        setSlots(selectedSlotNew);
                      }}>
                      <Text
                        style={{
                          color: '#33A3DC',
                          fontSize: 15,
                          fontWeight: '500',
                        }}>
                        Delete
                      </Text>
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
        </View>





      </Modal>
    </View>
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
