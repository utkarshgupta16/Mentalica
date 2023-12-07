import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {editProfileSlice} from '../../redux/HomeSlice';
import {PATIENT} from '../../utils/Strings';
import Colors from '../../customs/Colors';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import {Auth} from 'aws-amplify';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {styles} from '../../components/mentorScreens/mentorDashboard/MentorDashboardStyle';
import {PROFILE} from '../../utils/route';

const ChangePassword = ({navigation}) => {
  const [isLoading, setLoading] = useState(false);
  const {darkMode} = useSelector(state => state.home);

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassowrd] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPasswordWarning, setConfirmPasswordWarning] = useState(false);

  const {t} = useTranslation();

  const onUpdate = () => {
    Alert.alert('Are you sure you want to update password?', '', [
      {
        text: 'Update Now',
        onPress: () => {
          console.log(
            'Update',
            handleConfirmPassword(newPassword, confirmPassword),
          );
          handleConfirmPassword(newPassword, confirmPassword)
            ? updatePassword()
            : setConfirmPasswordWarning(true);
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
          {text: 'OK', onPress: () => null},
        ]);
        navigation.navigate(PROFILE);
      })
      .catch(e => {
        console.log(e);
        Alert.alert('Failed updated password', '', '', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      });
  };

  const handleConfirmPassword = (password1, password2) => {
    return password1 === password2;
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
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              padding: 8,
              borderRadius: 4,
              color: darkMode ? 'gray' : '#000',
              width: '80%',
            }}
            placeholder={'Please Enter Old Password..'}
            value={oldPassword}
            onChangeText={text => {
              setOldPassword(text);
            }}
            secureTextEntry={!showOldPassword}
          />
          {showOldPassword ? (
            <Pressable onPress={() => setShowOldPassword(!showOldPassword)}>
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
            <Pressable onPress={() => setShowOldPassword(!showOldPassword)}>
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
      </View>

      <View style={{marginBottom: 20}}>
        <Text
          style={{
            paddingBottom: 5,
            paddingLeft: 5,
            color: darkMode ? '#fff' : '#000',
          }}>
          New Password
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              padding: 8,
              borderRadius: 4,
              color: darkMode ? 'gray' : '#000',
              width: '80%',
            }}
            placeholder={'Please Enter new Password..'}
            value={newPassword}
            onChangeText={text => {
              setNewPassowrd(text);
            }}
            secureTextEntry={!showNewPassword}
          />
          {showNewPassword ? (
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
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
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
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
      </View>

      <View style={{marginBottom: 20}}>
        <View style={{flexDirection: 'row'}}>
          <Text
            style={{
              paddingBottom: 5,
              paddingLeft: 5,
              color: darkMode ? '#fff' : '#000',
            }}>
            Confirm New Password
          </Text>
          {confirmPasswordWarning && (
            <Text warning style={{fontSize: 12, marginLeft: 5}}>
              {confirmPasswordWarning && '*Password not matched'}
            </Text>
          )}
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              padding: 8,
              color: darkMode ? 'white' : '#000',
              width: '80%',
            }}
            placeholder={'Please confirm new Password..'}
            value={confirmPassword}
            onChangeText={text => {
              setConfirmPassword(text);
            }}
            secureTextEntry={!showNewPassword}
          />
          {showNewPassword ? (
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
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
            <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
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
          button
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
