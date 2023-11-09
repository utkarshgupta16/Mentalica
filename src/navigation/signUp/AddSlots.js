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
  const {t} = useTranslation();
  const [isOpen, setOpen] = useState(false);
  const [selectedSlot, setSlots] = useState('');
  let slots1 =
    (slots &&
      slots.length &&
      slots.map(val => `${val?.startTime}-${val?.endTime}`)) ||
    [];
  let filterData = slotsData.filter(val => {
    if (!slots1.includes(val?.value)) {
      return true;
    }
    return false;
  });

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
          {t("Book Slots")}
        </Text>
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
            setValue={setSlots}
            items={filterData}
            placeholder={'Select Slot'}
            style={{marginBottom: 10, backgroundColor: Colors.paleMintColor}}
          />
        </View>
        <View style={{alignItems: 'center'}}>
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
            <Text style={{color: 'white'}}>{t("Add")}</Text>
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
                      {t("Start Time:")} {item?.startTime}
                    </Text>
                    <Text>{t("End Time:")} {item?.endTime}</Text>
                  </View>
                  <Pressable
                    style={{}}
                    onPress={() => {
                      let data = [...slots];
                      data.splice(index, 1);
                      addSlots(data);
                    }}>
                    <Text>{t("Delete")}</Text>
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
