import {Alert, Pressable, StyleSheet, TextInput} from 'react-native';
import Text from '../components/wrapperComponent/TextWrapper.js';
import View from '../components/wrapperComponent/ViewWrapper.js';
import React, {useState} from 'react';
import Colors from '../customs/Colors';
import Modal from 'react-native-modal';
import {LOGIN} from '../utils/route';
import {check} from 'react-native-permissions';
import {Auth} from 'aws-amplify';

const ForgotPassword = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setVisible] = useState(false);

  const handleContinue = () => {
    Auth.forgotPassword(userName)
      .then(data => {
        console.log('Forgot password data ==========>>>>>>>>>', data),
          setVisible(true);
      })
      .catch(err => {
        console.log('Forgot password error ===============>>>>>>>>>>', err);
        Alert.alert('Alert', 'User not found', [
          {
            text: 'Ok',
            onPress: () => console.log('Cancel Pressed'),
            style: 'Ok',
          },
        ]);
      });
  };

  const handleReset = () => {
    Auth.forgotPasswordSubmit(userName, code, password)
      .then(data => console.log('Success ==============>>>>>>>>>>>>>>', data))
      .catch(err => console.log('Success ==============>>>>>>>>>>>>>>', err));

    // navigation.navigate(LOGIN);
  };

  return (
    <View style={styles.container}>
      <Modal isVisible={isVisible}>
        <View style={styles.modalCont}>
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
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            onChangeText={text => {
              setPassword(text);
            }}
            value={password}
            secureTextEntry={true}
            autoCorrect={false}
            autoFocus={true}
          />

          <Pressable onPress={handleReset}>
            <View style={styles.continueBtn}>
              <Text style={styles.continueBtnTxt}>Reset</Text>
            </View>
          </Pressable>
        </View>
      </Modal>
      <Text style={styles.headingText}>Reset your password</Text>
      <Text>Enter your username</Text>
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

      <Pressable onPress={handleContinue}>
        <View style={styles.continueBtn}>
          <Text style={styles.continueBtnTxt}>Continue</Text>
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
  input: {
    borderBottomWidth: 1,
    borderColor: Colors.dustyGray,
    marginVertical: 20,
    padding: 10,
  },
  continueBtn: {
    backgroundColor: Colors.darkPaleMintColor,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
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
});
