import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, Button, TouchableOpacity, Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {editProfileSlice} from '../../redux/HomeSlice';
import {PATIENT} from '../../utils/Strings';
import Colors from '../../customs/Colors';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import {Auth} from 'aws-amplify';

const ChangePassword = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const {darkMode} = useSelector(state => state.home);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassowrd] = useState('');
  const {t} = useTranslation();

  const onUpdate = () => {
    Alert.alert('Are you sure you want to update password?', '', [
      {
        text: 'Update Now',
        onPress: () => {
          updatePassword();
        },
      },
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
    ]);
  };

  const updatePassword = () => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log('User =======>>>>>>>>>>>>>', user);
        Auth.changePassword(user, oldPassword, newPassword);
      })
      .then(data => {
        console.log('success with data: ' + data);
        Alert.alert('Successfully updated password', '', '', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Failed updated password', '', '', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });
  };

  return (
    <View style={{backgroundColor: 'white', padding: 10, flex: 1}}>
      {isLoading ? <ScreenLoading /> : null}
      <View style={{marginBottom: 20}}>
        <Text
          style={{
            paddingBottom: 5,
            paddingLeft: 5,
            color: darkMode ? '#fff' : '#000',
          }}>
          Old Password
        </Text>
        <TextInput
          style={{
            padding: 8,
            borderRadius: 4,
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            color: darkMode ? 'gray' : '#000',
          }}
          placeholder={'Please Enter Old Password..'}
          value={oldPassword}
          onChangeText={text => {
            setOldPassword(text);
          }}
        />
      </View>

      <View style={{marginBottom: 20}}>
        <Text
          style={{
            paddingBottom: 5,
            paddingLeft: 5,
            color: darkMode ? '#fff' : '#000',
          }}>
          {' '}
          New Password
        </Text>
        <TextInput
          style={{
            padding: 8,
            borderRadius: 4,
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            color: darkMode ? 'gray' : '#000',
          }}
          placeholder={'Please Enter New Password..'}
          value={newPassword}
          onChangeText={text => {
            setNewPassowrd(text);
          }}
        />
      </View>

      <TouchableOpacity
        disabled={oldPassword.length == 0 || newPassword.length == 0}
        activeOpacity={
          oldPassword.length == 0 || newPassword.length == 0 ? 0 : 1
        }
        onPress={onUpdate}
        style={{
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          backgroundColor:
            oldPassword.length == 0 || newPassword.length == 0
              ? Colors.grayishBlue
              : Colors.darkPaleMintColor,
          borderColor: 'white',
          borderRadius: 6,
        }}>
        <Text
          style={{
            color:
              oldPassword.length == 0 || newPassword.length == 0
                ? 'white'
                : 'white',
            fontWeight: 'bold',
            fontSize: 18,
          }}>
          Update
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;
