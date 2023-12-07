import React, {useState} from 'react';
import {
  // View,
  // Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  SafeAreaView,
  I18nManager,
  Alert,
} from 'react-native';
import View from '../components/wrapperComponent/ViewWrapper.js';
import Text from '../components/wrapperComponent/TextWrapper.js';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {login, getType, getAccessToken} from '../redux/AuthSlice';
import {FORGOT_PASSWORD, MENTOR_SIGN_UP} from '../utils/route';
import {Auth} from 'aws-amplify';
import {getTwilloChatTokenSlice, setAttributes} from '../redux/HomeSlice';
import {useTranslation} from 'react-i18next';
import Loader from '../customs/Loader';
import {confirmSignUp, getCurrentUserInfo} from '../AWS/AWSConfiguration';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../utils/i18n';
import RNRestart from 'react-native-restart';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/Responsive';
import {LANG_OPTION} from '../utils/default';
import ConvertLang from '../utils/Strings';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {RESTART_APP, CHANGE_LANG} = ConvertLang(t);
  // const [rememberMe, setRememberMe] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setLanguage] = useState(
    i18n.language === 'he' ? 'Hebrew' : 'English',
  );

  const langOptions = LANG_OPTION;
  // guptagaurav9566+1@gmail.com
  // bhandari.tribhuwan@thinksys.com
  // const [enteredEmail, setEnteredEmail] = useState(
  //   'bhandari.tribhuwan@thinksys.com',
  // );
  // patel.sonu@thinksys.com
  //pandey.kaushiki@thinksys.com
  //'gauravatlive+3@gmail.com' //patient
  //'gauravatlive+2@gmail.com' //mentor
  const [enteredEmail, setEnteredEmail] = useState(
    'pandey.kaushiki@thinksys.com',
  );

  // const [enteredEmail, setEnteredEmail] = useState('gauravatlive+3@gmail.com');

  const [enteredPassword, setEnteredPassword] = useState('Password@123');

  // const [enteredEmail, setEnteredEmail] = useState(
  //   'roshanyjambhulkar1204@gmail.com',
  // );

  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const dispatch = useDispatch();

  const {darkMode} = useSelector(state => state.home);

  const resendCode = async () => {
    // console.log('enteredEmail', enteredEmail);
    const response = await Auth.resendSignUp(enteredEmail);
    // console.log('response:', response);
  };

  const loginHandler = async () => {
    if (!validateEmail(enteredEmail)) {
      setEmailWarning(true);
      return;
    }
    try {
      // console.log('Auth', await Auth.currentAuthenticatedUser());
      // const user1 = await signIn({
      //   username: enteredEmail,
      //   password: enteredPassword,
      // });
      setLoading(true);

      const user = await Auth.signIn(enteredEmail, enteredPassword);

      dispatch(getAccessToken(user?.signInUserSession?.accessToken?.jwtToken));
      const currentUserInfo = await getCurrentUserInfo();
      const {attributes} = user;
      dispatch(setAttributes(attributes));
      dispatch(
        login({
          email: enteredEmail,
          userToken: {
            jwtToken: user?.signInUserSession?.idToken?.jwtToken,
            refreshToken: user?.signInUserSession?.refreshToken?.token,
          },
        }),
      );
      dispatch(getType(currentUserInfo?.attributes['custom:type']));
      dispatch(getTwilloChatTokenSlice(enteredEmail));
      setLoading(false);
    } catch (err) {
      console.log('getCurrentUserInfo Error', err);
      setError(err);
      setLoading(false);
      setWrongCredentials(true);
    }
  };

  const signUpClickHandler = () => {
    navigation.navigate(MENTOR_SIGN_UP);
  };

  const handleEnteredEmail = email => {
    setEnteredEmail(email);
  };

  const handleEnteredPassword = password => {
    setEnteredPassword(password);
  };

  const submitCodeHandler = async () => {
    try {
      console.log('res:', res);
      const res = await confirmSignUp(enteredEmail, enteredCode);
      console.log('res:', res);
      setShowEnterCodeModal(false);
      setEnteredEmail('');
      setError('');
    } catch (err) {
      console.log('error confirming sign uppp', err);
      setShowEnterCodeModal(false);
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate(FORGOT_PASSWORD, {email: enteredEmail});
  };

  const validateEmail = email => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      {isLoading ? <Loader /> : null}
      <View style={styles.imageContainer}>
        <Image
          source={require('../icons/logo-no-background.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
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
            <Text>{`${t('Enter Email')}:`}</Text>
            <TextInput
              value={enteredEmail}
              onChangeText={text => setEnteredEmail(text)}
              style={styles.modalTextInput}
            />
          </View>
          <View style={styles.codeContainer}>
            <Text>{`${t('Enter Code')}:`}</Text>
            <TextInput
              onChangeText={text => setEnteredCode(text)}
              style={styles.modalTextInput}
            />
          </View>
          <Button title={t('Submit')} onPress={submitCodeHandler} />
        </View>
      </Modal>
      <View style={styles.container}>
        <View>
          <View style={styles.inputContainer}>
            <View style={styles.inputHeadingCont}>
              <Text>Email</Text>
              <Text warning style={styles.emailWarningTxt}>
                {emailWarning
                  ? '*Invalid email'
                  : wrongCredentials
                  ? '*Invalid credentials'
                  : null}
              </Text>
            </View>

            <View style={styles.inputParentCont}>
              <TextInput
                textAlign={i18n.language === 'he' ? 'right' : 'left'}
                onChangeText={handleEnteredEmail}
                style={{
                  borderColor: darkMode ? Colors.white : Colors.black,
                  width: '100%',
                  paddingBottom: 8,
                  fontSize: 15,
                  paddingLeft: 10,
                  color: darkMode ? Colors.white : Colors.black,
                }}
                placeholder={t('E-mail')}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={enteredEmail}
              />
            </View>
            <View style={styles.inputHeadingCont}>
              <Text>Password</Text>
            </View>
            <View style={styles.inputParentCont}>
              <TextInput
                textAlign={i18n.language === 'he' ? 'right' : 'left'}
                onChangeText={handleEnteredPassword}
                style={{
                  borderColor: darkMode ? Colors.white : Colors.black,
                  width: '80%',
                  paddingBottom: 8,

                  paddingLeft: 10,
                  fontSize: 15,
                  color: darkMode ? Colors.white : Colors.black,
                }}
                placeholder={t('Password')}
                secureTextEntry={!showPassword}
                value={enteredPassword}
              />
              {showPassword ? (
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name="visibility"
                    size={21}
                    color={Colors.grayishBlue}
                    style={{
                      marginRight: 20,
                    }}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <MaterialIcons
                    name="visibility-off"
                    size={21}
                    color={Colors.grayishBlue}
                    style={{
                      marginRight: 20,
                    }}
                  />
                </Pressable>
              )}
            </View>

            <Pressable
              onPress={handleForgotPassword}
              style={styles.forgotPassword}>
              <Text>Forgot password?</Text>
            </Pressable>
            <View style={styles.checkBoxSignUpContainer}>
              {/* <View style={styles.checkboxContainer}>
              <CheckBox
                disabled={false}
                value={rememberMe}
                onValueChange={newValue => setRememberMe(newValue)}
                style={styles.checkBox}
                boxType="square"
              />
              <Text style={styles.rememberMeText}>{t('Remember Me')}</Text>
            </View> */}
              <Button title={t('Login')} onPress={loginHandler} />
            </View>
          </View>

          <View style={styles.buttonContainerView}>
            <Text style={styles.askSignup}>
              {t("Don't have an account? Wanna")}
            </Text>
            <Pressable
              style={styles.signUpContainer}
              title={t('Sign Up')}
              onPress={signUpClickHandler}>
              <Text signUpbutton style={styles.signUpText}>
                {' '}
                {t('Sign Up')}
              </Text>
            </Pressable>
          </View>

          {/* {error ? (
          <View style={styles.buttonContainerView}>
            <Pressable
              style={styles.signUpContainer}
              title={t('Enter Code')}
              onPress={() => {
                setShowEnterCodeModal(true);
              }}>
              <Text style={styles.signUpText}>
                {t('Confirm Verification Code')}
              </Text>
            </Pressable>
          </View>
        ) : null} */}
        </View>

        <DropDownPicker
          dropDownDirection="TOP"
          listMode="SCROLLVIEW"
          autoScroll={true}
          zIndex={3000}
          open={isOpen}
          setOpen={setIsOpen}
          value={t(selectedLanguage)}
          setValue={props => {
            Alert.alert(CHANGE_LANG, RESTART_APP, [
              {
                text: 'Cancel',
                // text: NO_CANCEL,
                onPress: () => null,
              },
              {
                text: 'OK',
                onPress: () => {
                  i18n
                    .changeLanguage(i18n.language === 'he' ? 'en' : 'he')
                    .then(() => {
                      I18nManager.allowRTL(i18n.language === 'he');
                      I18nManager.forceRTL(i18n.language === 'he');
                      setLanguage(props());
                      setTimeout(() => {
                        RNRestart.Restart();
                      }, 5);
                    })
                    .catch(err => {
                      console.log(
                        'something went wrong while applying RTL',
                        err,
                      );
                    });
                },
              },
            ]);
          }}
          dropDownContainerStyle={
            {
              // width: '100%',z
            }
          }
          items={langOptions}
          placeholder={t('Select Language')}
          containerStyle={{width: '100%'}}
          style={styles.dropdown}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.paleMintColor,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 300,
  },
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
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 32,
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
  inputHeadingCont: {
    flexDirection: 'row',
    marginBottom: 9,
  },
  inputContainer: {
    // width: '100%',
    marginBottom: 20,
    marginHorizontal: 20,
  },
  inputParentCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: Colors.black,
    borderBottomWidth: 1,
    borderRadius: 8,
    marginBottom: 32,
    paddingLeft: 10,
    color: 'white',
  },
  forgotPassword: {
    marginBottom: 10,
    alignItems: 'flex-end',
    marginTop: 8,
  },
  checkBoxSignUpContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // width: 500,
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
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  askSignup: {
    fontSize: 14,
  },
  signUpContainer: {
    // marginTop: 14,
  },
  signUpText: {
    fontSize: 16,
    fontWeight: '500',
    textDecorationLine: 'none',
    color: Colors.darkPaleMintColor,
    // color: Colors.primaryBlue,
  },
  warningMessage: {
    color: 'tomato',
    fontSize: 12,
  },
  dropdown: {
    backgroundColor: Colors.paleMintColor,
    borderColor: Colors.paleMintColor,
    width: widthPercentageToDP(27),

    alignSelf: 'flex-end',
  },
  emailWarningTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
});

export default LoginScreen;
