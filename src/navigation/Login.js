import React, {useEffect, useState} from 'react';
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
  Switch,
} from 'react-native';
import {ViewWrapper as View} from '../components/wrapperComponent/ViewWrapper';
import {TextWrapper as Text} from '../components/wrapperComponent/TextWrapper';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {login, getType} from '../redux/AuthSlice';
import {FORGOT_PASSWORD, MENTOR_SIGN_UP} from '../utils/route';
import {Auth} from 'aws-amplify';
import {
  changeTheme,
  getTwilloChatTokenSlice,
  setAttributes,
} from '../redux/HomeSlice';
import {useTranslation} from 'react-i18next';
import Loader from '../customs/Loader';
import {confirmSignUp, getCurrentUserInfo} from '../AWS/AWSConfiguration';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../utils/i18n';
import RNRestart from 'react-native-restart';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/Responsive';
import {LANG_OPTION} from '../utils/default';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {validateEmail} from '../utils/emailValidation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import convertLang, {MENTOR} from '../utils/Strings';
import {colors} from '../screens/Twillio/colors';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {
    RESTART_APP,
    CHANGE_LANG,
    FORGOT_PASSWORD,
    EMAIL,
    PASSWORD,
    DARK_MODE,
  } = t && convertLang(t);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setLanguage] = useState(
    i18n.language === 'he' ? 'Hebrew' : 'English',
  );
  const {darkMode} = useSelector(state => state.home);

  const toggleSwitch = () => {
    dispatch(changeTheme(!darkMode));
  };

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
  // const [enteredEmail, setEnteredEmail] = useState(
  //   'pandey.kaushiki@thinksys.com',
  // );

  // const [enteredEmail, setEnteredEmail] = useState('gauravatlive+3@gmail.com');

  const [enteredPassword, setEnteredPassword] = useState('Password@123');

  const [enteredEmail, setEnteredEmail] = useState(
    'roshanyjambhulkar1204+4@gmail.com',
  );

  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [wrongCredentials, setWrongCredentials] = useState(false);

  const dispatch = useDispatch();
  const resendCode = async () => {
    const response = await Auth.resendSignUp(enteredEmail);
  };
  const loginHandler = async () => {
    if (!validateEmail(enteredEmail)) {
      setEmailWarning(true);
      return;
    }
    try {
      setLoading(true);
      const user = await Auth.signIn(enteredEmail, enteredPassword);
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
      setLoading(false);
    } catch (err) {
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
      await confirmSignUp(enteredEmail, enteredCode);
      setShowEnterCodeModal(false);
      setEnteredEmail('');
      setError('');
    } catch (err) {
      console.log('error confirming sign uppp', err);
      setShowEnterCodeModal(false);
    }
  };

  const handleForgotPassword = async () => {
    navigation.navigate('ForgotPasswordScreen', {email: enteredEmail});
  };

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        {backgroundColor: darkMode ? Colors.black : Colors.white},
      ]}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={{flexGrow: 1}}>
        {isLoading ? <Loader /> : null}
        <View style={styles.imageContainer}>
          <Image
            source={
              darkMode
                ? require('../assets/images/2.png')
                : require('../assets/images/1.png')
            }
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
                <Text style={styles.inputsLables}>{EMAIL}</Text>
                <Text warning style={styles.emailWarningTxt}>
                  {emailWarning
                    ? '*Invalid email'
                    : wrongCredentials
                    ? '*Invalid credentials'
                    : null}
                </Text>
              </View>

              <View
                style={{
                  ...styles.inputParentCont,
                  borderColor: darkMode ? Colors.white : Colors.black,
                }}>
                <TextInput
                  textAlign={i18n.language === 'he' ? 'right' : 'left'}
                  onChangeText={handleEnteredEmail}
                  style={{
                    height: 40,
                    width: '100%',
                    fontSize: 16,
                    color: darkMode ? Colors.white : Colors.black,
                    paddingHorizontal: 10,
                  }}
                  placeholderTextColor={'gray'}
                  placeholder={t('E-mail')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="email"
                  value={enteredEmail}
                />
              </View>
              <View style={styles.inputHeadingCont}>
                <Text style={styles.inputsLables}>{PASSWORD}</Text>
              </View>
              <View
                style={{
                  ...styles.inputParentCont,
                  borderColor: darkMode ? Colors.white : Colors.black,
                }}>
                <TextInput
                  textAlign={i18n.language === 'he' ? 'right' : 'left'}
                  onChangeText={handleEnteredPassword}
                  style={[
                    styles.input,
                    {color: darkMode ? Colors.white : Colors.black},
                  ]}
                  placeholder={t('Password')}
                  placeholderTextColor={'gray'}
                  secureTextEntry={!showPassword}
                  value={enteredPassword}
                />
                {showPassword ? (
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <MaterialIcons
                      name="visibility"
                      size={21}
                      color={Colors.black}
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
                      color={Colors.black}
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
                <Text>{FORGOT_PASSWORD}?</Text>
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
          </View>
          <View style={styles.darkModeParentCont}>
            <View style={styles.switchContaimer}>
              <Text style={styles.accDetailsTitle}>{DARK_MODE}</Text>
              <Switch onValueChange={toggleSwitch} value={darkMode} />
            </View>
            <View>
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
                items={langOptions}
                placeholder={t('Select Language')}
                containerStyle={{width: '100%'}}
                style={[
                  styles.dropdown,
                  {
                    backgroundColor: darkMode ? Colors.dune : '#fff',
                    borderColor: darkMode ? Colors.dune : '#fff',
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: Colors.white,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  image: {
    width: 250,
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
    borderWidth: 1,
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
    marginHorizontal: 10,
  },
  inputParentCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 20,
  },
  inputsLables: {
    fontSize: 16,
    color: Colors.black,
  },
  input: {
    height: 40,
    width: '90%',
    fontSize: 16,
    color: Colors.black,
    borderRadius: 8,
    paddingLeft: 10,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginTop: -10,
  },
  checkBoxSignUpContainer: {
    marginTop: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    justifyContent: 'center',
  },
  askSignup: {
    fontSize: 14,
    color: Colors.black,
  },
  signUpContainer: {},
  signUpText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'none',
    color: Colors.darkPaleMintColor,
  },
  warningMessage: {
    color: 'tomato',
    fontSize: 12,
  },
  dropdown: {
    color: Colors.white,
    width: widthPercentageToDP(27),
    alignSelf: 'auto',
  },
  emailWarningTxt: {
    fontSize: 12,
    marginLeft: 5,
  },
  switchContaimer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  accDetailsTitle: {marginRight: 10},
  darkModeParentCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default LoginScreen;
