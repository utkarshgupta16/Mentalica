import {Alert, Pressable, StyleSheet, TextInput} from 'react-native';
import Text from '../components/wrapperComponent/TextWrapper.js';
import View from '../components/wrapperComponent/ViewWrapper.js';
import React, {useState} from 'react';
import Colors from '../customs/Colors';
import Modal from 'react-native-modal';
import {LOGIN} from '../utils/route';
import {Auth} from 'aws-amplify';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {heightPercentageToDP} from '../utils/Responsive.js';
import {validateEmail} from '../utils/emailValidation.js';

const ForgotPassword = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isVisible, setVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailWarning, setEmailWarning] = useState(false);
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState(false);
  const [codeWarning, setCodeWarning] = useState(false);

  const handleContinue = () => {
    validateEmail(userName) &&
      Auth.forgotPassword(userName)
        .then(data => {
          setVisible(true);
          setEmailWarning(false);
        })
        .catch(err => {
          Alert.alert('Alert', 'User not found', [
            {
              text: 'Ok',
              onPress: () => console.log('Cancel Pressed'),
              style: 'Ok',
            },
          ]);
        });

    !validateEmail(userName) && setEmailWarning(true);
  };

  const handleReset = () => {
    checkConfirmPassword(password, confirmPassword) &&
      Auth.forgotPasswordSubmit(userName, code, password)
        .then(data => {
          if (data === 'SUCCESS') {
            navigation.navigate(LOGIN);
          } else {
            setCodeWarning(true);
          }
        })
        .catch(err => {
          setCodeWarning(true);
        });

    !checkConfirmPassword(password, confirmPassword) &&
      setConfirmPasswordWarning(true);
  };

  const checkConfirmPassword = (password1, password2) => {
    return password1 == password2;
  };

  return (
    <View style={styles.container}>
      <Modal avoidKeyboard={true} isVisible={isVisible}>
        <Pressable onPress={() => setVisible(false)} style={styles.closeBtn}>
          <MaterialIcons
            name="close"
            size={26}
            color={Colors.white}
            // style={{
            //   marginRight: 20,
            // }}
          />
        </Pressable>
        <View style={styles.modalCont}>
          <View style={styles.warningMsgCont}>
            <Text>Verification code</Text>
            <Text warning style={styles.warningMsg}>
              {codeWarning && '*Wrong code'}
            </Text>
          </View>
          <View style={styles.inputParentCont}>
            <TextInput
              style={styles.input}
              placeholder="Enter code"
              onChangeText={text => {
                setCode(text);
              }}
              value={code}
              keyboardType="number-pad"
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus={true}
            />
          </View>

          <Text>New password</Text>
          <View style={styles.inputParentCont}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              onChangeText={text => {
                setPassword(text);
              }}
              value={password}
              secureTextEntry={!showPassword}
              autoCorrect={false}
            />
            {showPassword ? (
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name="visibility"
                  size={16}
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
                  size={16}
                  color={Colors.grayishBlue}
                  style={{
                    marginRight: 20,
                  }}
                />
              </Pressable>
            )}
          </View>

          <View style={styles.warningMsgCont}>
            <Text>Confirm password</Text>
            <Text warning style={styles.warningMsg}>
              {confirmPasswordWarning && '*Did not match password'}
            </Text>
          </View>
          <View style={styles.inputParentCont}>
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              onChangeText={text => {
                setConfirmPassword(text);
              }}
              value={confirmPassword}
              autoCorrect={false}
              secureTextEntry={!showPassword}
            />
            {showPassword ? (
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons
                  name="visibility"
                  size={16}
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
                  size={16}
                  color={Colors.grayishBlue}
                  style={{
                    marginRight: 20,
                  }}
                />
              </Pressable>
            )}
          </View>

          <Pressable onPress={handleReset}>
            <View style={styles.continueBtn}>
              <Text button style={styles.continueBtnTxt}>
                Reset
              </Text>
            </View>
          </Pressable>
        </View>
      </Modal>
      <Text style={styles.headingText}>Reset your password</Text>
      <View style={styles.warningMsgCont}>
        <Text>Enter your username</Text>
        <Text warning style={styles.warningMsg}>
          {emailWarning && '*Invalid email'}
        </Text>
      </View>

      <View style={styles.inputParentCont}>
        <TextInput
          style={styles.input}
          placeholder="Enter username/email"
          onChangeText={text => {
            setUserName(text);
          }}
          value={userName}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoFocus={true}
          autoComplete="email"
        />
      </View>

      <Pressable onPress={handleContinue}>
        <View style={styles.continueBtn}>
          <Text button style={styles.continueBtnTxt}>
            Continue
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
    marginTop: 20,
  },
  headingText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputParentCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: 'lightgray',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    width: '80%',

    borderColor: Colors.dustyGray,
    marginVertical: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  continueBtn: {
    backgroundColor: Colors.darkPaleMintColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginTop: 15,
  },
  continueBtnTxt: {
    fontWeight: '600',
    fontSize: 16,
  },
  modalCont: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 25,
    borderRadius: 10,
  },
  closeBtn: {
    position: 'absolute',
    top: heightPercentageToDP(9),
    right: -10,
    zIndex: 1000,
    borderRadius: 50,
    backgroundColor: Colors.red,
  },
  warningMsgCont: {
    flexDirection: 'row',
  },
  warningMsg: {
    marginLeft: 5,
    fontSize: 12,
    textAlign: 'center',
    alignItems: 'center',
    color: Colors.red,
    paddingTop: 2,
  },
});
