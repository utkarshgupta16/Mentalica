import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import CustomHeader from '../../customs/Header';
import Colors from '../../customs/Colors';
import Button from '../../components/Button';
import Loader from '../../customs/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Auth} from 'aws-amplify';
import {MENTOR} from '../../utils/Strings';
import EnterOtpModal from '../../customs/EnterOtpModal';
import {specialities, educationList, languageList} from '../../utils/default';
import {useDispatch} from 'react-redux';
import {singUpSlice} from '../../redux/AuthSlice';
import AddSlotsComponent from './AddSlots';
const MentorSignUp = ({navigation}) => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [showSlots, setShowSlots] = useState(false);
  const [slotState, setSlotState] = useState({startTime: '', endTime: ''});
  const [slots, addSlots] = useState([]);
  const [state, setState] = useState({
    firstName: 'Sonu',
    lastName: 'Patel',
    city: 'varanasi',
    // gender: '',
    phoneNumber: '1234567890',
    emailId: 'patel.sonu@thinksys.com',
    temporaryCity: 'testing',
    password: 'Password@123',
    confirmPassword: 'Password@123',
    type: MENTOR,
    expertise: [],
    fees: '500',
    experience: '4',
    language: [],
  });

  const handleInput = ({field, value}) => {
    setState(prevState => ({...prevState, [field]: value}));
  };

  const [specialistItems, setSpecialistItems] = useState(specialities);

  const convertString = (arrData = []) => {
    let expertiseUpdated = '';
    arrData &&
      arrData.map((val, i) => {
        if (i == 0) {
          expertiseUpdated = expertiseUpdated + val;
        } else {
          expertiseUpdated = expertiseUpdated + ',' + val;
        }
      });
    return expertiseUpdated;
  };

  const handleSignup = async () => {
    try {
      setIsLoading(true);

      // console.log('state:', state);
      // const {emailId, password} = state;
      // const attributes = {
      //   'custom:firstName': state.firstName,
      //   'custom:lastName': state.lastName,
      //   'custom:city': state.city,
      //   'custom:phoneNumber': state.phoneNumber,
      //   'custom:temporaryCity': state.temporaryCity,
      //   'custom:expertise': state.expertise,
      //   'custom:type': MENTOR,
      //   'custom:fees': state.fees,
      //   'custom:experience': state.experience,
      //   'custom:language': state.language,
      // };
      // console.log('attributes:', attributes);

      // const resp = await Auth.signUp({
      //   emailId,
      //   password,
      //   attributes: attributes,
      // });
      // console.log('resp:', resp);
      const {
        password,
        confirmPassword,
        type,
        expertise = [],
        language = [],
        ...restData
      } = state;
      let expertiseUpdated = convertString(expertise) || '';
      let stringLanguageUpdated = convertString(language) || '';

      const resp = await Auth.signUp({
        username: state.emailId,
        password,
        attributes: {
          'custom:type': 'Mentor',
        },
      });

      const attRes = await dispatch(
        singUpSlice({
          ...restData,
          expertise: expertiseUpdated,
          language: stringLanguageUpdated,
          slots,
          type: MENTOR,
        }),
      );
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
      const res = await Auth.confirmSignUp(state.emailId, enteredCode);
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
      firstName,
      lastName = '',
      city = '',
      phoneNumber = '',
      emailId = '',
      temporaryCity = '',
      password = '',
      confirmPassword = '',
      education = '',
      expertise = '',
      //   fees = '',
    } = state;

    if (
      !firstName ||
      !lastName ||
      !emailId ||
      !phoneNumber ||
      !city ||
      !temporaryCity ||
      !password ||
      !confirmPassword ||
      !expertise ||
      !slots.length
    ) {
      return true;
    }
    return false;
  };

  const resendCode = async () => {
    const response = await Auth.resendSignUp(state.emailId);
    console.log('response:', response);
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: Colors.paleMintColor,
        flex: 1,
      }}>
      <CustomHeader
        title={'Sign Up'}
        showBackArrow={true}
        navigation={navigation}
      />
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1, flexGrow: 1}}
        nestedScrollEnabled={true}>
        {/* =================================MODAL START================================= */}
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
          {renderInput({placeholder: 'First Name', field: 'firstName'})}
          {renderInput({placeholder: 'Last Name', field: 'lastName'})}
          {renderInput({placeholder: 'City', field: 'city'})}
          {renderInput({placeholder: 'Phone Number', field: 'phoneNumber'})}
          {renderInput({placeholder: 'Email', field: 'emailId'})}
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
            nestedScrollEnabled={true}
            listMode="SCROLLVIEW"
            autoScroll={true}
            zIndex={1000}
            open={specialityOpen}
            setOpen={setSpecialityOpen}
            value={state?.expertise}
            onSelectItem={val => {
              let labels = val.map(i => i?.value);
              handleInput({
                field: 'expertise',
                value: labels,
              });
            }}
            items={specialistItems}
            setItems={setSpecialistItems}
            placeholder={'Select Speciality.'}
            style={styles.dropdown}
            multiple={true}
          />
          <DropDownPicker
            listMode="SCROLLVIEW"
            autoScroll={true}
            zIndex={1000}
            open={languageOpen}
            setOpen={setLanguageOpen}
            value={state?.language}
            onSelectItem={val => {
              let labels = val.map(i => i?.value);
              handleInput({
                field: 'language',
                value: labels,
              });
            }}
            items={languageList}
            // setItems={setSpecialistItems}
            placeholder={'Select Language.'}
            style={styles.dropdown}
            multiple={true}
          />
          {state.password &&
            state.confirmPassword &&
            state.password !== state.confirmPassword && (
              <Text style={styles.passwordNotMatchText}>
                Password does not match.
              </Text>
            )}
          <Pressable
            style={{
              paddingVertical: 7,
              borderStyle: 'dashed',
              borderColor: 'blue',
              borderWidth: 1,
              borderRadius: 4,
              alignItems: 'center',
              marginBottom: 10,
            }}
            onPress={() => setShowSlots(!showSlots)}>
            <Text
              style={{
                fontSize: 17,
                color: 'blue',
                // textDecorationStyle: 'solid',
                // textDecorationLine: 'underline',
              }}>
              {slots.length ? 'Update Slots' : 'Add Slots'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <View style={{paddingBottom: 10}}>
        <Button
          disabled={validateInputs()}
          title="Sign Up"
          onPress={handleSignup}
          secureTextEntry={true}
        />
      </View>
      {isLoading ? <Loader /> : null}
      {showSlots ? (
        <AddSlotsComponent
          setState={setSlotState}
          state={slotState}
          addSlots={addSlots}
          slots={slots}
          close={() => setShowSlots(false)}
        />
      ) : null}
    </SafeAreaView>
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
    paddingHorizontal: 16,
    paddingTop: 10,
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
