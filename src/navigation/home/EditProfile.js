import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {TextInput, Button, TouchableOpacity} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {editProfileSlice} from '../../redux/HomeSlice';
import {PATIENT} from '../../utils/Strings';
import Colors from '../../customs/Colors';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';

const EditProfile = ({route, navigation}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const {data} = route?.params || {};
  const {
    email_id,
    fcmToken,
    slots,
    experience,
    language,
    temporaryCity,
    city,
    fees,
    deviceType,
    duty,
    gender,
    feel,
    age,
    expertise,
    ...restData
  } = data;
  const [state, setState] = useState(restData);
  const {t} = useTranslation();
  const {type, jwtToken} = useSelector(state => state.auth);
  const {darkMode} = useSelector(state => state.home);

  const renderInput = ({placeholder, field}) => {
    return (
      <View style={{marginBottom: 20}}>
        <Text style={{paddingBottom: 5, paddingLeft: 5, color: 'gray'}}>
          {placeholder}
        </Text>
        <TextInput
          style={{
            padding: 8,
            borderRadius: 4,
            borderBottomWidth: 1,
            borderColor: 'lightgray',
            color: darkMode ? '#fff' : 'gray',
          }}
          placeholder={placeholder}
          value={state[field]}
          onChangeText={e => {
            setState({...state, [field]: e});
          }}
        />
      </View>
    );
  };

  const onSave = async () => {
    try {
      setLoading(true);
      await dispatch(
        editProfileSlice({
          jwtToken,
          emailId: email_id,
          type: type == PATIENT ? 'patient' : 'mentor',
          ...state,
        }),
      );
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
    }
  };
  return (
    <View style={{backgroundColor: 'white', padding: 10, flex: 1}}>
      {isLoading ? <ScreenLoading /> : null}
      {renderInput({placeholder: 'First Name', field: 'firstName'})}
      {renderInput({placeholder: 'Last Name', field: 'lastName'})}
      {renderInput({placeholder: 'Phone Number', field: 'phoneNumber'})}

      <TouchableOpacity
        onPress={onSave}
        style={{
          marginTop: 10,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 8,
          backgroundColor: Colors.darkPaleMintColor,
          borderColor: 'white',
          borderRadius: 6,
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
          Save
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfile;
