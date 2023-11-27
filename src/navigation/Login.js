import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Platform,
  Image,
  SafeAreaView,
  I18nManager,
} from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import {useDispatch, useSelector} from 'react-redux';
import {login, getType} from '../redux/AuthSlice';
import {MENTOR_SIGN_UP} from '../utils/route';
import {Auth} from 'aws-amplify';
// import {
//   signIn,
//   confirmSignUp,
//   autoSignIn,
//   confirmSignIn,
//   signOut,
// } from '@aws-amplify/auth';
import {setAttributes} from '../redux/HomeSlice';
import {useTranslation} from 'react-i18next';
import Loader from '../customs/Loader';
import {getCurrentUserInfo} from '../AWS/AWSConfiguration';
import DropDownPicker from 'react-native-dropdown-picker';
import i18n from '../utils/i18n';
import RNRestart from 'react-native-restart';
import {widthPercentageToDP} from '../utils/Responsive';
import {LANG_OPTION} from '../utils/default';
import ConvertLang from '../utils/Strings';
// import Logo from '../icons/logo-black.svg';

const LoginScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {RESTART_APP, CHANGE_LANG} = ConvertLang(t);
  const {loginFrom} = useSelector(state => state.auth);
  const [rememberMe, setRememberMe] = useState(false);
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
  const [enteredEmail, setEnteredEmail] = useState(
    'patel.sonu@thinksys.com',
  );
  const [enteredPassword, setEnteredPassword] = useState('Password@123');
  const [showEnterCodeModal, setShowEnterCodeModal] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [enteredCode, setEnteredCode] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const loginHandler = async () => {
    try {
      // console.log('Auth', await Auth.currentAuthenticatedUser());
      // const user1 = await signIn({
      //   username: enteredEmail,
      //   password: enteredPassword,
      // });
      setLoading(true);
      const user = await Auth.signIn(enteredEmail, enteredPassword);
      const currentUserInfo = await getCurrentUserInfo();
      const {attributes} = user;
      console.log('currentUserInfo', user);
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
      console.log('getCurrentUserInfo Error', err);

      setError(err);
      setLoading(false);
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
      const res = await Auth.confirmSignUp(enteredEmail, enteredCode);
      console.log('res:', res);
      setShowEnterCodeModal(false);
      setEnteredEmail('');
      setError('');
    } catch (err) {
      console.log('error confirming sign uppp', err);
      setShowEnterCodeModal(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.paleMintColor,
        justifyContent: 'space-between',
      }}>
      {isLoading ? <Loader /> : null}
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Image
          source={require('../icons/logo-no-background.png')}
          style={{width: 200, height: 300}}
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
        <View style={styles.inputContainer}>
          <TextInput
            textAlign={i18n.language === 'he' ? 'right' : 'left'}
            onChangeText={handleEnteredEmail}
            style={styles.input}
            placeholder={t('E-mail')}
            keyboardType="email-address"
            value={enteredEmail}
          />
          <TextInput
            textAlign={i18n.language === 'he' ? 'right' : 'left'}
            onChangeText={handleEnteredPassword}
            style={styles.input}
            placeholder={t('Password')}
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
              <Text style={styles.rememberMeText}>{t('Remember Me')}</Text>
            </View>
            <Button
              disabled={!enteredEmail.trim() || !enteredPassword.trim()}
              title={t('Login')}
              onPress={loginHandler}
            />
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
            <Text style={styles.signUpText}> {t('Sign Up')}</Text>
          </Pressable>
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
                text: NO_CANCEL,
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
          dropDownContainerStyle={{
            backgroundColor: Colors.white,
            borderWidth: 0,
            alignSelf: 'center',
            width: widthPercentageToDP(30),
          }}
          items={langOptions}
          placeholder={t('Select Language')}
          containerStyle={{borderBottomColor: 'gray'}}
          style={styles.dropdown}
        />
        {error ? (
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
        ) : null}
      </View>
    </SafeAreaView>
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
    // justifyContent: 'center',
    paddingHorizontal: 16,
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
    color: Colors.primaryBlue,
  },
  warningMessage: {
    color: 'tomato',
    fontSize: 12,
  },
  dropdown: {
    backgroundColor: Colors.paleMintColor,
    borderWidth: 0,
    alignSelf: 'center',
    width: widthPercentageToDP(30),
  },
});

export default LoginScreen;
