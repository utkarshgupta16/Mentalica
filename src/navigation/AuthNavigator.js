import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import Colors from '../customs/Colors';
import Button from '../components/Button';
import CustomHeader from '../customs/CustomHeader';
import {useDispatch} from 'react-redux';
import {login} from '../redux/AuthSlice';

const LoginScreen = ({navigation}) => {
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();

  const loginHandler = () => {
    dispatch(login());
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
          <TextInput
            style={styles.input}
            placeholder="sign up with e-mail"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
          />
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
        </View>
        <Button title="Login" onPress={loginHandler} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: Colors.paleMintColor,
    borderWidth: 1,
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
});

export default LoginScreen;
