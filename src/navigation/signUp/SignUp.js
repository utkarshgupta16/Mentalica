import React, {useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  Animated,
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import CustomHeader from '../../customs/Header';
import Colors from '../../customs/Colors';
import Button from '../../components/Button';
import Loader from '../../customs/Loader';
import DropDownPicker from 'react-native-dropdown-picker';
import {Auth} from 'aws-amplify';
// import {signUp, confirmSignUp} from '@aws-amplify/auth';
import convertLang, {MENTOR, PATIENT} from '../../utils/Strings';
import EnterOtpModal from '../../customs/EnterOtpModal';
import {specialities, languageList} from '../../utils/default';
import {useDispatch, useSelector} from 'react-redux';
import {singUpSlice} from '../../redux/AuthSlice';
import AddSlotsComponent from './AddSlots';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {widthPercentageToDP as wp} from '../../utils/Responsive';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import {
  ADD_SLOTS_SCREEN,
  ADD_SLOTS_SIGNUP_SCREEN,
  PROFILE_TAB_ROUTE,
} from '../../utils/route.js';

const MentorSignUp = ({navigation}) => {
  const {t} = useTranslation();
  const {PASSWORD_NOT_MATCH, ADD_SLOTS, UPDATE_SLOTS} = convertLang(t);
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
  const [emailWarning, setEmailWarning] = useState(false);
  const [compalsaryField, setCompalsaryField] = useState(false);
  // const [slots, addSlots] = useState([]);
  // let timestamp = Date.now();
  // const [rangeDate, setRangeDate] = useState({
  //   startDate: timestamp,
  //   endDate: timestamp,
  // });
  const timestamp = Date.now();
  const {
    slots = [],
    rangeDate = {
      startDate: timestamp,
      endDate: timestamp,
    },
  } = useSelector(state => state.home);

  const [state, setState] = useState({
    firstName: '',
    lastName: '',
    city: '',
    temporaryCity: '',
    phoneNumber: '',
    emailId: '',
    password: 'Password@123',
    confirmPassword: 'Password@123',
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

  const [isShadowVisible, setIsShadowVisible] = useState(false);
  const [specialistItems, setSpecialistItems] = useState(specialities);

  const handleShadowVisible = isShadowVisible => {
    setIsShadowVisible(isShadowVisible);
  };

  const handleOnScroll = event => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset > 0) {
      handleShadowVisible(true);
    } else {
      handleShadowVisible(false);
    }
  };

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

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  const handleSignup = async () => {
    if (!validateEmail(state.emailId == '')) {
      setEmailWarning(true);
    }
    if (validateInputs()) {
      setCompalsaryField(true);
      console.log('Please enter');
      return;
    }

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

      let fcmToken = await AsyncStorage.getItem('fcmToken');
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
          rangeDate: {...rangeDate, slots},
        };
      } else {
        finalSignupData = {
          ...finalSignupData,
          gender,
          duty,
          feel,
        };
      }

      const {password, confirmPassword, ...restData} = finalSignupData;

      await Auth.signUp({
        username: state.emailId,
        password: state.password,
        attributes: {
          'custom:type': typeValue,
        },
      });

      const ddd = {
        ...restData,
        fcmToken: fcmToken ? fcmToken : '',
        deviceType: Platform.OS,
        type: typeValue,
      };

      console.log('hello -> data', ddd);

      await dispatch(
        singUpSlice({
          ...restData,
          fcmToken: fcmToken ? fcmToken : '',
          deviceType: Platform.OS,
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
      console.log('err=====>>>>:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = ({field, placeholder, keyBoardType, ...props}) => {
    return (
      <View style={{marginBottom: 10}}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.inputLable}>
            {' '}
            {field ? convertFieldStringToCapitalized(field) : ''}
          </Text>
          <Text style={{color: 'red', fontSize: 17}}>
            {!state[field] && compalsaryField
              ? ' *'
              : field == 'emailId' &&
                compalsaryField &&
                !validateEmail(state.emailId)
              ? ' *Invalid email'
              : null}
          </Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder={`Enter ${placeholder}`}
          placeholderTextColor={Colors.grayishBlue}
          value={state[field]}
          keyboardType={keyBoardType || 'default'}
          {...props}
          onChangeText={text => handleInput({value: text, field})}
        />
      </View>
    );
  };

  const submitCodeHandler = async enteredOtp => {
    try {
      const enteredCode = enteredOtp.join('');
      // const res = await confirmSignUp({
      //   username: state.emailId,
      //   confirmationCode: enteredCode,
      // });
      // console.log('submitCodeHandler=======:', res);
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

  const convertFieldStringToCapitalized = str => {
    let result = str.charAt(0).toUpperCase() + str.slice(1);
    result = result.replace(/([A-Z])/g, ' $1');
    return result;
  };

  const mentorExtras = (
    <>
      <DropDownPicker
        nestedScrollEnabled={true}
        dropDownDirection="TOP"
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
        // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />
      <DropDownPicker
        dropDownDirection="TOP"
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
        // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
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
        dropDownDirection="TOP"
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
        colo
        // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
        style={styles.dropdown}
      />
      <DropDownPicker
        listMode="SCROLLVIEW"
        dropDownDirection="TOP"
        autoScroll={true}
        zIndex={4000}
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
        // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />

      <DropDownPicker
        dropDownDirection="TOP"
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
        // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
      />
    </>
  );
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        isShadowVisible={isShadowVisible}
        title={''}
        showBackArrow={true}
        navigation={navigation}
      />
      {!isShadowVisible && (
        <View
          style={{
            borderColor: Colors.white,
            borderBottomWidth: 0.2,
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            paddingBottom: 10,
            shadowColor: 'black',
            shadowOffset: isShadowVisible && {
              width: 0,
              height: 2,
            },
            shadowOpacity: isShadowVisible ? 1 : 0,
            shadowRadius: isShadowVisible ? 3 : 0,
            elevation: isShadowVisible ? 4 : 0,
          }}>
          <Text style={styles.createAccountTxt}>Create Account </Text>
          <MaterialIcons
            name="person-add"
            size={30}
            color={Colors.black}
            style={styles.icon}
          />
        </View>
      )}

      <KeyboardAwareScrollView
        onScroll={handleOnScroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={{flex: 1, backgroundColor: Colors.white}}
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
            dropDownDirection="TOP"
            nestedScrollEnabled={true}
            listMode="SCROLLVIEW"
            autoScroll={true}
            zIndex={3000}
            open={typeOpen}
            setOpen={setTypeOpen}
            value={typeValue}
            setValue={setTypeValue}
            // onSelectItem={val => {
            //   console.log('val:', val);
            // }}
            items={typeItems}
            setItems={setTypeItems}
            placeholder={'Select Type.'}
            style={styles.dropdown}
            // containerStyle={{borderBottomWidth: 1, borderBottomColor: 'gray'}}
          />

          {/* CHECK FOR THE TYPE: */}

          {typeValue === MENTOR && mentorExtras}
          {typeValue === PATIENT && patientExtras}

          {state.password &&
            state.confirmPassword &&
            state.password !== state.confirmPassword && (
              <Text style={styles.passwordNotMatchText}>
                {PASSWORD_NOT_MATCH}
              </Text>
            )}
          {typeValue === MENTOR ? (
            <Pressable
              style={styles.slotContainer}
              onPress={() => {
                navigation.navigate(ADD_SLOTS_SIGNUP_SCREEN);
                // setShowSlots(!showSlots);
              }}>
              <Text style={styles.slotsText}>
                {slots.length ? UPDATE_SLOTS : ADD_SLOTS}
              </Text>
            </Pressable>
          ) : null}
        </View>
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
      <View style={styles.signUpButtonContainer}>
        <Button
          signup
          title="Sign Up"
          onPress={handleSignup}
          secureTextEntry={true}
        />
      </View>
      {isLoading ? <Loader /> : null}
      {/* {showSlots ? (
        <AddSlotsComponent
          // setState={setSlotState}
          // state={slotState}
          // addSlots={addSlots}
          // slots={slots}
          // setRangeDate={setRangeDate}
          // rangeDate={rangeDate}
          close={() => setShowSlots(false)}
        />
      ) : null} */}
    </SafeAreaView>
  );
};

export default MentorSignUp;

const styles = StyleSheet.create({
  headreView: {
    width: '100%',
    borderBottomWidth: 0.2,
    borderColor: Colors.white,
    paddingBottom: 10,
  },
  createAccountTxt: {
    fontSize: 25,
    color: Colors.black,
    fontWeight: '600',
    fontFamily: 'Montserrat',
    marginLeft: 15,
  },
  container: {
    backgroundColor: Colors.white,
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
    paddingHorizontal: 25,
    paddingTop: 15,
    justifyContent: 'center',
    // backgroundColor: Colors.paleMintColor,
    paddingBottom: 10,
  },
  input: {
    height: 40,
    borderRadius: 8,
    marginBottom: 15,
    paddingLeft: 10,
    fontSize: 16,
    backgroundColor: '#d3d3d3',
  },
  inputLable: {
    color: '#000',
    fontFamily: 'Montserrat',
    marginBottom: 10,
    marginLeft: 5,
    fontSize: 16,
  },
  dropdown: {
    marginBottom: 25,
    borderColor: '#d3d3d3',
    backgroundColor: '#d3d3d3',
    color: Colors.white,
  },
  passwordNotMatchText: {
    color: Colors.red,
  },
  slotContainer: {
    paddingVertical: 7,
    borderStyle: 'dashed',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 7,
    marginHorizontal: 5,
  },
  slotsText: {
    fontSize: 17,
    color: '#000',
    fontWeight: 'bold',
  },
  signUpButtonContainer: {
    paddingBottom: 10,
    borderTopWidth: 0.2,
    borderColor: '#000',
  },
});
