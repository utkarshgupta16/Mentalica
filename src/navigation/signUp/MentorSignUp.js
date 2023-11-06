import React, {useState} from 'react';
import {Alert, StyleSheet, Text, TextInput, View} from 'react-native';
import CustomHeader from '../../customs/Header';
import Colors from '../../customs/Colors';
import Button from '../../components/Button';
import Loader from '../../customs/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Auth} from 'aws-amplify';
import {MENTOR} from '../../utils/strings';
import EnterOtpModal from '../../customs/EnterOtpModal';

const MentorSignUp = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);

  const [educationOpen, setEducationOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [otpError, setOtpError] = useState('');

  const [state, setState] = useState({
    firstname: '',
    lastname: '',
    city: '',
    // gender: '',
    phoneNumber: '',
    username: '',
    temporaryCity: '',
    password: '',
    confirmPassword: '',
    type: MENTOR,
    education: '',
    speciality: '',
    fees: '',
    experience: '',
    language: 'Hebrew,English',
    // speciality: [],
  });

  const handleInput = ({field, value}) => {
    setState(prevState => ({...prevState, [field]: value}));
  };

  const [specialistItems, setSpecialistItems] = useState([
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
    {label: 'Sadness', value: 'sadness'},
  ]);

  const [educationItems, setEducationItems] = useState([
    {
      label: "Associate's Degree",
      value: 'associate degree',
    },
    {
      label: "Bachelor's Degree",
      value: 'bachelor degree',
    },
    {
      label: "Master's Degree",
      value: 'master degree',
    },
    {
      label: 'Doctorate/Ph.D',
      value: 'doctorate/ph.d',
    },
    {
      label: 'Professional Degree',
      value: 'professional degree',
    },
    {
      label: 'Other',
      value: 'other',
    },
  ]);

  const handleSignup = async () => {
    try {
      setIsLoading(true);

      console.log('state:', state);
      const {username, password} = state;
      const attributes = {
        'custom:firstName': state.firstname,
        'custom:lastName': state.lastname,
        'custom:city': state.city,
        'custom:phoneNumber': state.phoneNumber,
        'custom:temporaryCity': state.temporaryCity,
        'custom:expertise': state.speciality,
        'custom:type': MENTOR,
        'custom:fees': state.fees,
        'custom:experience': state.experience,
        'custom:language': state.language,
      };
      console.log('attributes:', attributes);

      const resp = await Auth.signUp({
        username,
        password,
        attributes: attributes,
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

  const submitCodeHandler = async enteredOtp => {
    try {
      const enteredCode = enteredOtp.join('');
      const res = await Auth.confirmSignUp(state.username, enteredCode);
      console.log('res:', res);
      navigation.goBack();
      setShowEnterCodeModal(false);
    } catch (error) {
      setOtpError(error);
      console.log('error confirming sign up', error);
    }
  };

  const validateInputs = () => {
    const {
      firstname,
      lastname = '',
      city = '',
      phoneNumber = '',
      username = '',
      temporaryCity = '',
      password = '',
      confirmPassword = '',
      education = '',
      speciality = '',
      //   fees = '',
    } = state;

    if (
      !firstname ||
      !lastname ||
      !username ||
      !phoneNumber ||
      !city ||
      !temporaryCity ||
      !password ||
      !confirmPassword ||
      !education ||
      !speciality
    ) {
      return true;
    }
    return false;
  };

  const resendCode = async () => {
    const response = await Auth.resendSignUp(state.username);
    console.log('response:', response);
  };

  return (
    <>
      <CustomHeader
        title={'Sign Up'}
        showBackArrow={true}
        navigation={navigation}
      />

      {/* =================================MODAL START================================= */}
      {/* <Modal
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
        isVisible={true}
        // isVisible={showEnterCodeModal}
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
          {otpError.message && (
            <Text style={styles.otpErrorText}>{otpError.message}</Text>
          )}
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
      </Modal> */}
      <EnterOtpModal
        state={state}
        submitCodeHandler={submitCodeHandler}
        resendCode={resendCode}
        showEnterCodeModal={showEnterCodeModal}
        setShowEnterCodeModal={setShowEnterCodeModal}
        otpError={otpError}
      />
      {/* =================================MODAL END================================= */}

      <View style={styles.mainContainer}>
        {renderInput({placeholder: 'First Name', field: 'firstname'})}
        {renderInput({placeholder: 'Last Name', field: 'lastname'})}
        {renderInput({placeholder: 'City', field: 'city'})}
        {renderInput({placeholder: 'Phone Number', field: 'phoneNumber'})}
        {renderInput({placeholder: 'Email', field: 'username'})}
        {renderInput({placeholder: 'Temporary city', field: 'temporaryCity'})}
        {renderInput({
          placeholder: 'Password',
          field: 'password',
          //   secureTextEntry: true,
        })}
        {renderInput({
          placeholder: 'Confirm password',
          field: 'confirmPassword',
          //   secureTextEntry: true,
        })}
        {renderInput({
          placeholder: 'Fees for 30 Mins',
          field: 'fees',
        })}
        {renderInput({
          placeholder: 'Experience in Years',
          field: 'experience',
        })}

        <DropDownPicker
          zIndex={2000}
          open={educationOpen}
          setOpen={setEducationOpen}
          value={state.education}
          setValue={props => {
            handleInput({field: 'education', value: props()});
          }}
          items={educationItems}
          setItems={setEducationItems}
          placeholder={'Select Education.'}
          style={styles.dropdown}
        />
        <DropDownPicker
          zIndex={1000}
          open={specialityOpen}
          setOpen={setSpecialityOpen}
          value={state.speciality}
          setValue={props => {
            handleInput({field: 'speciality', value: props()});
          }}
          items={specialistItems}
          setItems={setSpecialistItems}
          placeholder={'Select Speciality.'}
          style={styles.dropdown}
        />
        {state.password &&
          state.confirmPassword &&
          state.password !== state.confirmPassword && (
            <Text style={styles.passwordNotMatchText}>
              Password does not match.
            </Text>
          )}

        <Button
          disabled={validateInputs()}
          title="Sign Up"
          onPress={handleSignup}
          secureTextEntry={true}
        />
        {isLoading ? <Loader /> : null}
      </View>
    </>
  );
};

export default MentorSignUp;

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
  otpErrorText: {
    color: Colors.red,
    fontSize: 15,
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
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  mainContainer: {
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
  dropdown: {
    marginBottom: 10,
    backgroundColor: Colors.paleMintColor,
  },
  passwordNotMatchText: {
    color: Colors.red,
  },
});
