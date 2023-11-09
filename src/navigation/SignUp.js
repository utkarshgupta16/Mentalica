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
import CustomHeader from '../customs/Header';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import Loader from '../customs/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Auth} from 'aws-amplify';
import {MENTOR, PATIENT} from '../utils/Strings';
import EnterOtpModal from '../customs/EnterOtpModal';
import {specialities, languageList} from '../utils/default';
import {useDispatch} from 'react-redux';
import {singUpSlice} from '../redux/AuthSlice';
import AddSlotsComponent from './signUp/AddSlots';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const MentorSignUp = ({navigation}) => {
  const typeOfItems = [
    {
      label: 'Patient',
      value: PATIENT,
    },
    {
      label: 'Mentor',
      value: MENTOR,
    },
  ];
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);

  const [languageOpen, setLanguageOpen] = useState(false);
  const [specialityOpen, setSpecialityOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeValue, setTypeValue] = useState(PATIENT);
  const [openGender, setOpenGender] = useState(false);
  const [genderItems, setGenderItems] = useState([
    {label: 'Male', value: 'male'},
    {label: 'Female', value: 'female'},
  ]);
  const [dutyItems, setDutyItems] = useState([
    {label: 'Civilian', value: 'civilian'},
    {label: 'Soldier', value: 'soldier'},
    {label: 'Student', value: 'student'},
  ]);
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
  const [openDuty, setOpenDuty] = useState(false);
  const [feelOpen, setFeelOpen] = useState(false);
  const [typeItems, setTypeItems] = useState(typeOfItems);
  const [otpError, setOtpError] = useState('');
  const [showSlots, setShowSlots] = useState(false);
  const [slotState, setSlotState] = useState({startTime: '', endTime: ''});
  const [slots, addSlots] = useState([]);
  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    city: '',
    temporaryCity: '',
    phoneNumber: '',
    emailId: '',
    password: '',
    confirmPassword: '',
    age: '',
    // MENTOR:
    // type: MENTOR,
    expertise: [],
    fees: '',
    experience: '',
    language: [],
    // PATIENT:
    // type: PATIENT,

    gender: '',
    duty: '',
    feel: '',
  });

  const handleInput = ({field, value}) => {
    setState(prevState => ({...prevState, [field]: value}));
  };

  const [specialistItems, setSpecialistItems] = useState(specialities);

  const convertString = (arrData = []) => {
    let expertiseUpdated = '';
    arrData &&
      arrData.map((val, i) => {
        if (i === 0) {
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

      const {
        expertise = [],
        fees = '',
        experience = '',
        language = [],
        // PATIENT:
        // type: PATIENT,
        gender = '',
        duty = '',
        feel = '',
        ...commonSignupData
      } = state;

      let finalSignupData = {
        ...commonSignupData,
      };

      if (typeValue === MENTOR) {
        let expertiseUpdated = convertString(expertise) || '';
        let stringLanguageUpdated = convertString(language) || '';
        finalSignupData = {
          ...finalSignupData,
          expertise: expertiseUpdated,
          fees,
          experience,
          language: stringLanguageUpdated,
          slots,
        };
      } else {
        finalSignupData = {
          ...finalSignupData,
          gender,
          duty,
          feel,
        };
      }

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

      // const resp = await Auth.signUp({
      //   emailId,
      //   password,
      //   attributes: attributes,
      // });
      const {password, confirmPassword, ...restData} = finalSignupData;

      const resp = await Auth.signUp({
        username: state.emailId,
        password,
        attributes: {
          'custom:type': typeValue,
        },
      });
      const attRes = await dispatch(
        singUpSlice({
          ...restData,
          type: typeValue,
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

  const renderInput = ({field, placeholder, keyBoardType, ...props}) => {
    return (
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        value={state[field]}
        keyboardType={keyBoardType || 'default'}
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
      firstName = '',
      lastName = '',
      city = '',
      temporaryCity = '',
      phoneNumber = '',
      emailId = '',
      password = '',
      confirmPassword = '',
      // MENTOR:
      // type: MENTOR,
      expertise = [],
      fees = '',
      experience = '',
      language = [],
      // PATIENT:
      // type: PATIENT,
      age = '',
      gender = '',
      duty = '',
      feel = '',
      //   fees = '',
    } = state;

    if (
      !firstName ||
      !lastName ||
      !city ||
      !temporaryCity ||
      !phoneNumber ||
      !emailId ||
      !password ||
      !confirmPassword
    ) {
      return true;
    }
    if (typeValue === MENTOR) {
      if (
        !expertise.length ||
        !language.length ||
        // !slots.length ||
        !fees ||
        !experience
      ) {
        return true;
      }
    }
    if (typeValue === PATIENT) {
      if (!age || !gender || !duty || !feel) {
        return true;
      }
    }
    if (!typeValue) {
      return true;
    }

    return false;
  };

  const resendCode = async () => {
    const response = await Auth.resendSignUp(state.emailId);
    console.log('response:', response);
  };

  const mentorExtras = (
    <>
      <DropDownPicker
        nestedScrollEnabled={true}
        listMode="SCROLLVIEW"
        autoScroll={true}
        zIndex={2000}
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
        containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
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
        containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />
      {renderInput({
        placeholder: 'Fees for 30 Mins',
        field: 'fees',
      })}
      {renderInput({
        placeholder: 'Experience in Years',
        field: 'experience',
      })}
    </>
  );

  const patientExtras = (
    <>
      <DropDownPicker
        listMode="SCROLLVIEW"
        autoScroll={true}
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
        containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
        style={styles.dropdown}
      />
      <DropDownPicker
        listMode="SCROLLVIEW"
        autoScroll={true}
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
        containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />

      <DropDownPicker
        listMode="SCROLLVIEW"
        autoScroll={true}
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
        containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />
    </>
  );
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        title={'Sign Up'}
        showBackArrow={true}
        navigation={navigation}
      />
      {/* <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flex: 1, flexGrow: 1}}
        nestedScrollEnabled={true}> */}
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={{flex: 1, backgroundColor: Colors.paleMintColor}}
        contentContainerStyle={{flexGrow: 1}}>
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
          {renderInput({placeholder: 'Temporary city', field: 'temporaryCity'})}
          {renderInput({
            placeholder: 'Phone Number',
            field: 'phoneNumber',
            keyBoardType: 'number-pad',
          })}
          {renderInput({
            placeholder: 'Age',
            field: 'age',
            keyBoardType: 'number-pad',
          })}
          {renderInput({placeholder: 'Email', field: 'emailId'})}
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
          {/* CHECK FOR THE TYPE: */}

          <DropDownPicker
            nestedScrollEnabled={true}
            listMode="SCROLLVIEW"
            autoScroll={true}
            zIndex={3000}
            open={typeOpen}
            setOpen={setTypeOpen}
            value={typeValue}
            setValue={setTypeValue}
            items={typeItems}
            setItems={setTypeItems}
            placeholder={'Select Type.'}
            style={styles.dropdown}
            containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
          />

          {/* CHECK FOR THE TYPE: */}

          {typeValue === MENTOR && mentorExtras}
          {typeValue === PATIENT && patientExtras}

          {state.password &&
            state.confirmPassword &&
            state.password !== state.confirmPassword && (
              <Text style={styles.passwordNotMatchText}>
                Password does not match.
              </Text>
            )}
          {typeValue === MENTOR ? (
            <Pressable
              style={styles.slotContainer}
              onPress={() => setShowSlots(!showSlots)}>
              <Text style={styles.slotsText}>
                {slots.length ? 'Update Slots' : 'Add Slots'}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      <View style={styles.signUpButtonContainer}>
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
  container: {
    backgroundColor: Colors.paleMintColor,
    flex: 1,
  },
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
    // flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: 'center',
    backgroundColor: Colors.paleMintColor,
    paddingBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    paddingLeft: 10,
  },
  dropdown: {
    backgroundColor: Colors.paleMintColor,
    borderWidth: 0,
  },
  passwordNotMatchText: {
    color: Colors.red,
  },
  slotContainer: {
    paddingVertical: 7,
    borderStyle: 'dashed',
    borderColor: '#33A3DC',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 7,
    marginHorizontal: 5,
  },
  slotsText: {
    fontSize: 17,
    color: '#33A3DC',
    fontWeight: 'bold',
  },
  signUpButtonContainer: {
    paddingBottom: 10,
  },
});
