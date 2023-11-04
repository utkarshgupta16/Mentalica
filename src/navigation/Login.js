import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import CustomHeader from '../customs/Header';
import {useDispatch} from 'react-redux';
import {login} from '../redux/AuthSlice';
import {
  configureAws,
  confirmSignUp,
  getAttributes,
  signIn,
} from '../AWS/AWSConfiguration';

const LoginScreen = ({navigation}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const [email, setEmail] = useState('jambhulkar.roshan@thinksys.com');
  const [password, setPassword] = useState('Password@123');
  const [emailWarning, setEmailWarning] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState(false);
  const [validEmailWarning, setValidEmailWarning] = useState(false);

  const dispatch = useDispatch();

  function ValidateEmail(input) {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (email.match(validRegex)) {
      return true;
    } else {
      return false;
    }
  }

  const loginHandler = async () => {
    email?.length == 0 ? setEmailWarning(true) : setEmailWarning(false);
    password?.length == 0
      ? setPasswordWarning(true)
      : setPasswordWarning(false);
    const validEmail = ValidateEmail(email);
    console.log('validEmail', validEmail);
    validEmail ? setValidEmailWarning(true) : setValidEmailWarning(false);

    configureAws();
    const signInMethod = await signIn(email, password);
    signInMethod?.attributes?.email_verified ? dispatch(login()) : null;

    // getAttributes();
  };

  const signUpClickHandler = () => {
    navigation.navigate('SignUp');
  };

  return (
    <>
      <CustomHeader
        title="Login"
        navigation={navigation}
        showBackArrow={true}
      />
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          {emailWarning && (
            <Text style={styles.warningMessage}>*Please provide an email</Text>
          )}
          {!validEmailWarning && (
            <Text style={styles.warningMessage}>
              *Please provide valid email
            </Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={text => {
              const emailLowercase = text.toLocaleLowerCase();
              setEmail(emailLowercase);
            }}
            value={email}
          />
          {passwordWarning && (
            <Text style={styles.warningMessage}>*Please put in a password</Text>
          )}
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={text => {
              setPassword(text);
            }}
            value={password}
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
            <Button title="Login" onPress={loginHandler} />
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
