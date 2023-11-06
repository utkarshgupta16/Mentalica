import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import CustomHeader from '../customs/Header';
import {useDispatch, useSelector} from 'react-redux';
import {login} from '../redux/AuthSlice';
import {MENTOR} from '../utils/Strings';
import {MENTOR_SIGN_UP, PATIENT_SIGN_UP} from '../utils/route';
import {Amplify, Auth} from 'aws-amplify';

const LoginScreen = ({navigation}) => {
  const {loginFrom} = useSelector(state => state.auth);
  const [rememberMe, setRememberMe] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState(
    'jambhulkar.roshan@thinksys.com',
  );
  const [enteredPassword, setEnteredPassword] = useState('Password@123');
  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');

  const dispatch = useDispatch();

  const loginHandler = async () => {
    try {
      // console.log('Auth', await Auth.currentAuthenticatedUser());
      const user = await Auth.signIn(enteredEmail, enteredPassword);

      console.log('user:', user);
      dispatch(login());
      console.log('hello -> signing in result:', user);
    } catch (error) {
      setError(error);
      console.log('hello ->error signing in', error);
    }
  };

  const signUpClickHandler = () => {
    if (loginFrom === MENTOR) {
      navigation.navigate(MENTOR_SIGN_UP);
    } else {
      navigation.navigate(PATIENT_SIGN_UP);
    }
  };

  const handleEnteredEmail = email => {
    setEnteredEmail(email);
  };

  const handleEnteredPassword = password => {
    setEnteredPassword(password);
  };

  const submitCodeHandler = async () => {
    try {
      const res = await Auth.confirmSignUp(enteredEmail, enteredCode);
      console.log('res:', res);
      setShowEnterCodeModal(false);
      setEnteredEmail('');
      setError('');
    } catch (error) {
      console.log('error confirming sign uppp', error);
      setShowEnterCodeModal(false);
    }
  };

  return (
    <>
      <CustomHeader
        title="Login"
        navigation={navigation}
        showBackArrow={true}
      />

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
        isVisible={showEnterCodeModal}
        onBackdropPress={() => {
          setShowEnterCodeModal(false);
        }}
        onBackButtonPress={() => {
          setShowEnterCodeModal(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.codeContainer}>
            <Text>Enter Email:</Text>
            <TextInput
              onChangeText={text => setEnteredEmail(text)}
              style={styles.modalTextInput}
            />
          </View>
          <View style={styles.codeContainer}>
            <Text>Enter Code:</Text>
            <TextInput
              onChangeText={text => setEnteredCode(text)}
              style={styles.modalTextInput}
            />
          </View>
          <Button title="Submit" onPress={submitCodeHandler} />
        </View>
      </Modal>

      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {/* {emailWarning && (
            <Text style={styles.warningMessage}>*Please provide an email</Text>
          )} */}
          {/* {!validEmailWarning && (
            <Text style={styles.warningMessage}>
              *Please provide valid email
            </Text>
          )} */}
          <TextInput
            onChangeText={handleEnteredEmail}
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            value={enteredEmail}
          />
          {/* {passwordWarning && (
            <Text style={styles.warningMessage}>*Please put in a password</Text>
          )} */}
          <TextInput
            onChangeText={handleEnteredPassword}
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            value={enteredPassword}
          />
          <View style={styles.checkBoxSignUpContainer}>
            <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={rememberMe}
                onValueChange={newValue => setRememberMe(newValue)}
                style={styles.checkBox}
                boxType="square"
              />
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </View>
            <Button
              disabled={!enteredEmail.trim() || !enteredPassword.trim()}
              title="Login"
              onPress={loginHandler}
            />
          </View>
        </View>
        <View style={styles.buttonContainerView}>
          <Pressable
            style={styles.signUpContainer}
            title="Sign Up"
            onPress={signUpClickHandler}>
            <Text style={styles.signUpText}> Sign Up</Text>
          </Pressable>
        </View>
        {error ? (
          <View style={styles.buttonContainerView}>
            <Pressable
              style={styles.signUpContainer}
              title="Enter Code"
              onPress={() => {
                setShowEnterCodeModal(true);
              }}>
              <Text style={styles.signUpText}>Confirm Verification Code</Text>
            </Pressable>
          </View>
        ) : null}
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
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    // width: '100%',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: Colors.black,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 32,
    paddingLeft: 10,
  },
  checkBoxSignUpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkBox: {
    marginRight: 8,
  },
  rememberMeText: {
    fontSize: 16,
  },
  buttonContainerView: {
    justifyContent: 'center',

    // alignItems: 'center',
  },
  signUpContainer: {
    marginTop: 14,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primaryDarkBlue,
    textDecorationLine: 'none',
  },
  warningMessage: {
    color: 'tomato',
    fontSize: 12,
  },
});

export default LoginScreen;
