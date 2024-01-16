import {StyleSheet, Pressable, FlatList} from 'react-native';
import View from '../../wrapperComponent/ViewWrapper.js';
import Text from '../../wrapperComponent/TextWrapper.js';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';

const Invoicing = () => {
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <View>
          <Text style={styles.headingText}>€200,00</Text>
          <Text style={styles.currentBalanceText}>Current balance</Text>
        </View>
      </View>
      <Pressable>
        <View style={styles.invoicingBtn}>
          <Text style={styles.invoicingBtntext}>Batch invoicing</Text>
        </View>
      </Pressable>
      <View style={styles.invoiceList}>
        <FlatList
          data={invoiceData}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const renderItem = ({item, index}) => {
  return (
    <View key={index}>
      <View style={{marginTop: 15, flexDirection: 'row', alignItems: 'center'}}>
        <Text style={{fontSize: 13, color: 'gray', marginRight: wp(3)}}>
          {item.date}
        </Text>
        <View
          style={{
            width: wp(60),
            height: 1,
            borderBottomWidth: 1,
            borderColor: 'gray',
          }}
        />
      </View>
      <FlatList
        data={item.patientDetails}
        renderItem={renderPatientDetails}
        style={{flex: 1}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const renderPatientDetails = ({item}) => {
  return (
    <View
      style={{
        marginTop: hp(2),
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: hp(1),
          paddingHorizontal: wp(10),
        }}>
        <Text style={{fontWeight: '600'}}>{item.patientName}</Text>
        <Text style={{fontWeight: '600'}}>+ €{item.amount}</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingVertical: hp(1),
          paddingHorizontal: wp(10),
        }}>
        <Text>{item.transferby}</Text>
        <Text>€{item.transferAmount}</Text>
      </View>
    </View>
  );
};

export default Invoicing;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(5),

    backgroundColor: '#F5F7F8',
    flex: 1,
    // backgroundColor: 'white',
  },
  heading: {
    flexDirection: 'row',
    marginTop: hp(2),
  },
  headingText: {
    fontSize: 21,
    fontWeight: 'bold',
    marginBottom: hp(1),
  },
  currentBalanceText: {
    fontWeight: '500',
    marginBottom: hp(3),
  },
  invoicingBtn: {
    width: wp(40),
    height: hp(5),
    borderColor: 'gray',
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  invoicingBtntext: {
    fontWeight: '500',
  },
  invoiceList: {
    marginTop: hp(3),
    marginBottom: hp(2),
    backgroundColor: '#EEEDED',
    borderRadius: 6,
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 4.65,
    elevation: 3,
    flex: 1,
  },
});

const invoiceData = [
  {
    id: 1,
    date: 'Mon, 4th April',
    patientDetails: [
      {
        patientName: 'John cena',
        amount: 50,
        transferAmount: 200,
        transferby: 'Bank transfer',
      },
    ],
  },
  {
    date: 'Mon, 4th April',
    id: 2,
    patientDetails: [
      {
        patientName: 'Francico silva',
        amount: 50,
        transferAmount: 150,
        transferby: 'Bank transfer',
      },
      {
        patientName: 'Jose ferriera',
        amount: 50,
        transferAmount: 100,
        transferby: 'MBWay',
      },
      {
        patientName: 'Migul Alves',
        amount: 50,
        transferAmount: 200,
        transferby: 'MBWay',
      },
    ],
  },
  {
    date: 'Mon, 4th April',
    id: 3,
    patientDetails: [
      {
        patientName: 'Maria Carmo',
        amount: 50,
        transferAmount: 150,
        transferby: 'Bank transfer',
      },
    ],
  },
];
