import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Colors from '../../customs/Colors';
import CustomHeader from '../../customs/Header';
import Button from '../../components/Button';
import Loader from '../../customs/Loader';
import Modal from 'react-native-modal';
// import {useSelector} from 'react-redux';
import {Auth} from 'aws-amplify';
import {PATIENT} from '../../utils/Strings';

const PatientSignUp = ({navigation}) => {
  // const {loginFrom} = useSelector(state => state.auth);

  const [isLoading, setIsLoading] = useState(false);
  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);
  const [secondsLeft, setSecondsLeft] = useState(30);

  const [openDuty, setOpenDuty] = useState(false);
  const [dutyItems, setDutyItems] = useState([
    {label: 'Civilian', value: 'civilian'},
    {label: 'Soldier', value: 'soldier'},
    {label: 'Student', value: 'student'},
  ]);
  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);

  const [state, setState] = useState({
    firstname: '',
    lastname: '',
    age: '',
    // age: null,
    city: '',
    gender: '',
    phoneNumber: '',
    username: 'Tribhuvan@gmail.com',
    temporaryCity: '',
    duty: '',
    feel: '',
    password: '',
    confirmPassword: '',
    type: PATIENT,
  });

  const [feelOpen, setFeelOpen] = useState(false);
  const [feelItems, setFeelItems] = useState([
    {label: 'Anxiety', value: 'anxiety'},
    {label: 'Fear', value: 'fear'},
    {label: 'Danger', value: 'danger'},
    {label: 'Disappointment', value: 'disappointment'},
    {label: 'Loneliness', value: 'loneliness'},
    {label: 'Hate', value: 'hate'},
    {label: 'Abandoned', value: 'abandoned'},
    {label: 'Trauma', value: 'trauma'},
    {label: 'Shocked', value: 'shocked'},
    {label: 'Pain', value: 'pain'},
    {label: 'Anger', value: 'anger'},
    {label: 'Depressed', value: 'depressed'},
    {label: 'Sadness', value: 'sadnesss'},
  ]);

  // CHTAGPT CODE START:
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleOtpChange = (text, index) => {
    if (text.length === 1 && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    if (text.length === 0 && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
  };
  // CHTAGPT CODE END:

  const handleInput = ({field, value}) => {
    setState(prevState => ({...prevState, [field]: value}));
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);
      const {username, password} = state;
      const resp = await Auth.signUp({
        username,
        password,
        attributes: {
          'custom:firstName': state.firstname,
          'custom:lastName': state.lastname,
          'custom:city': state.city,
          'custom:duty': state.duty,
          'custom:feel': state.feel,
          'custom:phoneNumber': state.phoneNumber,
          'custom:temporaryCity': state.temporaryCity,
          'custom:type': PATIENT,
          gender: state.gender,
        },
        // autoSignIn: {
        //   // optional - enables auto sign in after user is confirmed
        //   enabled: true,
        // },
      });

      console.log('resp:', resp);
      setShowEnterCodeModal(true);
    } catch (err) {
      Alert.alert('Error!', err, [
        {
          text: 'OK',
          onPress: () => null,
        },
      ]);
      console.log('err:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = ({field, placeholder, ...props}) => {
    return (
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={state[field]}
        {...props}
        onChangeText={text => handleInput({value: text, field})}
      />
    );
  };

  const submitCodeHandler = async () => {
    try {
      const enteredCode = otp.join('');

      const res = await Auth.confirmSignUp(state.username, enteredCode);
      console.log('res:', res);
      navigation.goBack();
      setShowEnterCodeModal(false);
    } catch (error) {
      console.log('error confirming sign up', error);
      // setShowEnterCodeModal(false);
    }
  };

  const resendCode = () => {
    Auth.resendSignUp(state.username);
  };

  const validateInputs = () => {
    const {
      firstname,
      lastname = '',
      age = '',
      city = '',
      gender = '',
      phoneNumber = '',
      username = '',
      temporaryCity = '',
      duty = '',
      feel = '',
      password = '',
      confirmPassword = '',
    } = state;

    if (
      !firstname ||
      !lastname ||
      !age ||
      !username ||
      !phoneNumber ||
      !city ||
      !temporaryCity ||
      !gender ||
      !duty ||
      !feel ||
      !password ||
      !confirmPassword
    ) {
      return true;
    }
    return false;
  };

  useEffect(() => {
    let secondsInterval;
    if (showEnterCodeModal) {
      secondsInterval = setInterval(() => {
        if (secondsLeft > 0) {
          setSecondsLeft(prevSecLeft => prevSecLeft - 1);
        }
      }, 1000);
    }

    if (!showEnterCodeModal) {
      setSecondsLeft(30);
      clearInterval(secondsInterval);
    }
    return () => {
      clearInterval(secondsInterval);
    };
  }, [showEnterCodeModal, secondsLeft]);
  return (
    <>
      <CustomHeader
        title={'Sign Up'}
        showBackArrow={true}
        navigation={navigation}
      />
      {/* =================================MODAL START================================= */}
      <Modal
        avoidKeyboard={false}
        onRequestClose={() => {
          setShowEnterCodeModal(false);
        }}
        keyboardAvoidingBehavior={
          Platform.OS === 'android' ? 'height' : 'padding'
        }
        animationType="slide"
        transparent={true}
        closeOnClick={true}
        // isVisible={true}
        isVisible={showEnterCodeModal}
        onBackdropPress={() => {
          setShowEnterCodeModal(false);
        }}
        onBackButtonPress={() => {
          setShowEnterCodeModal(false);
        }}>
        <View style={styles.modalContainer}>
          <Text style={styles.enterOTPText}>
            Enter the 6-digit OTP sent to {state.username}
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={styles.otpInput}
                onChangeText={text => handleOtpChange(text, index)}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                ref={ref => (inputRefs.current[index] = ref)}
              />
            ))}
          </View>
          <Button title="Submit" onPress={submitCodeHandler} />
          <View style={styles.resendCodeContainer}>
            <Text style={styles.resendCodeAgainText}>Didn't get a code? </Text>
            <View style={styles.resendMainContainer}>
              <Pressable style={styles.resendButton} onPress={resendCode}>
                <Text style={styles.resend}>Resend</Text>
              </Pressable>
              <Text style={styles.resendTimerText}>
                In 00:{secondsLeft > 9 ? secondsLeft : '0' + secondsLeft}
              </Text>
            </View>
          </View>
        </View>
      </Modal>
      {/* =================================MODAL END================================= */}
      <View style={styles.container}>
        {renderInput({placeholder: 'First Name', field: 'firstname'})}
        {renderInput({placeholder: 'Last Name', field: 'lastname'})}
        {renderInput({placeholder: 'Age', field: 'age'})}
        {renderInput({placeholder: 'City', field: 'city'})}
        {renderInput({placeholder: 'Phone Number', field: 'phoneNumber'})}
        {renderInput({placeholder: 'Email', field: 'username'})}
        {renderInput({placeholder: 'Temporary city', field: 'temporaryCity'})}

        <DropDownPicker
          zIndex={3000}
          open={openGender}
          setOpen={setOpenGender}
          value={state.gender}
          setValue={props => {
            handleInput({field: 'gender', value: props()});
          }}
          items={genderItems}
          setItems={setGenderItems}
          placeholder={'Choose gender.'}
          style={styles.dropdown}
        />
        <DropDownPicker
          zIndex={2000}
          open={openDuty}
          setOpen={setOpenDuty}
          value={state.duty}
          setValue={props => {
            handleInput({field: 'duty', value: props()});
          }}
          items={dutyItems}
          setItems={setDutyItems}
          placeholder={'Choose Profession.'}
          style={styles.dropdown}
        />

        <DropDownPicker
          zIndex={1000}
          open={feelOpen}
          setOpen={setFeelOpen}
          value={state.feel}
          setValue={props => {
            handleInput({field: 'feel', value: props()});
          }}
          items={feelItems}
          setItems={setFeelItems}
          placeholder={'Choose How do you feel.'}
          style={styles.dropdown}
        />
        {renderInput({
          placeholder: 'Password',
          field: 'password',
          // secureTextEntry: true,
        })}
        {renderInput({
          placeholder: 'Confirm Password',
          field: 'confirmPassword',
          // secureTextEntry: true,
        })}
        {state.password &&
          state.confirmPassword &&
          state.password !== state.confirmPassword && (
            <Text style={styles.passwordNotMatchText}>
              Password does not match.
            </Text>
          )}

        <View style={styles.buttonContainer}>
          <Button
            disabled={validateInputs()}
            title="Sign Up"
            onPress={handleSignup}
          />
        </View>
        {isLoading ? <Loader /> : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    paddingVertical: 32,
    borderRadius: 10,
  },
  enterOTPText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primaryDarkBlue,
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  otpInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    textAlign: 'center',
    marginRight: 10,
    borderRadius: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTextInput: {
    borderWidth: 2,
    marginHorizontal: 10,
    width: 32,
    height: 32,
    fontSize: 16,
    borderColor: Colors.accentColor,
    textAlign: 'center',
  },
  resendCodeContainer: {
    marginTop: 24,
    flexDirection: 'row',
  },
  resendCodeAgainText: {
    fontSize: 15,
  },
  resendMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendButton: {
    marginRight: 8,
  },
  resend: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryBlue,
  },
  resendTimerText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.primaryDarkBlue,
  },
  container: {
    padding: 16,
    backgroundColor: Colors.paleMintColor,
    flex: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  passwordNotMatchText: {
    color: Colors.red,
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

export default PatientSignUp;

// Tribhuvan password: Password@123
