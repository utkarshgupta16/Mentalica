import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Alert} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from '../customs/Colors';
import CustomHeader from '../customs/Header';
import Button from '../components/Button';
import Loader from '../customs/Loader';

const SignupScreen = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [temporaryCity, setTemporaryCity] = useState('');
  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);
  const [genderValue, setGenderValue] = useState(null);

  const [openDuty, setOpenDuty] = useState(false);
  const [dutyItems, setDutyItems] = useState([
    {label: 'Civilian', value: 'civilian'},
    {label: 'Soldier', value: 'soldier'},
    {label: 'Student', value: 'student'},
  ]);
  const [dutyValue, setDutyValue] = useState(null);

  const handleSignup = () => {
    if (
      !firstname ||
      !lastname ||
      !age ||
      !email ||
      !phoneNumber ||
      !city ||
      !temporaryCity ||
      !genderValue ||
      !dutyValue
    ) {
      Alert.alert('Please fill all the required fields.', {
        text: 'Ok',
        onPress: () => null,
      });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Success',
        'Successfully signed up. Please Login to continue.',
        [
          {
            text: 'Ok',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    }, 3000);
  };
  return (
    <>
      <CustomHeader
        title={'Sign Up'}
        showBackArrow={true}
        navigation={navigation}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          value={firstname}
          onChangeText={text => setFirstname(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Last Name"
          value={lastname}
          onChangeText={text => setLastname(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={text => setAge(text)}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          keyboardType="phone-pad"
        />

        <View style={styles.dropdownGenderContainer}>
          <DropDownPicker
            open={openGender}
            setOpen={setOpenGender}
            value={genderValue}
            setValue={setGenderValue}
            items={genderItems}
            setItems={setGenderItems}
            placeholder={'Choose gender.'}
            style={styles.dropdown}
          />
        </View>
        <View style={styles.dropdownDutyContainer}>
          <DropDownPicker
            open={openDuty}
            setOpen={setOpenDuty}
            value={dutyValue}
            setValue={setDutyValue}
            items={dutyItems}
            setItems={setDutyItems}
            placeholder={'Choose gender.'}
            style={styles.dropdown}
          />
        </View>

        <TextInput
          style={styles.input}
          placeholder="City"
          value={city}
          onChangeText={text => setCity(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="Temporary City"
          value={temporaryCity}
          onChangeText={text => setTemporaryCity(text)}
        />

        <View style={styles.buttonContainer}>
          <Button title="Sign Up" onPress={handleSignup} />
        </View>
      </View>
      {isLoading ? <Loader /> : null}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: Colors.paleMintColor,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 16,
  },
  dropdown: {
    marginBottom: 10,
    backgroundColor: Colors.paleMintColor,
  },
  dropdownGenderContainer: {
    zIndex: 9999,
  },
  dropdownDutyContainer: {
    zIndex: 999,
  },
});

export default SignupScreen;
