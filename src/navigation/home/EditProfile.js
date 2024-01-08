/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Animated,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ScreenLoading from '../../components/ScreenLoading';
import {
  editProfileSlice,
  getUrlToUploadImage,
  uploadImageToServerSlice,
} from '../../redux/HomeSlice';
import convertLang, {PATIENT} from '../../utils/Strings';
import Colors from '../../customs/Colors';
import View from '../../components/wrapperComponent/ViewWrapper.js';
import Text from '../../components/wrapperComponent/TextWrapper.js';
import {darkModeColor, profileURL} from '../../utils/utils';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PreviewImage} from '../../components/PreviewImage';
import {useIsFocused} from '@react-navigation/native';
import {connectActionSheet} from '@expo/react-native-action-sheet';
import ImagePicker from 'react-native-image-crop-picker';
import {decode} from 'base-64';
import RNFS from 'react-native-fs';
import Header from '../../components/Header';
import {doctorURI, patientURI} from '../../icons';

const EditProfile = ({route, navigation, showActionSheetWithOptions}) => {
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);
  const isFocus = useIsFocused();
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
  const [isEdit, setEdit] = useState(false);
  const [state, setState] = useState(restData);
  const {t} = useTranslation();
  const {type, loginFrom} = useSelector(state => state.auth);
  const {
    darkMode,
    profileData,
    isImageLoading = false,
  } = useSelector(state => state.home);
  const {uniqueId} = profileData || {};
  const {SAVE, FIRST_NAME, LAST_NAME, PHONE_NO} = convertLang(t);
  // const [isImageLoading, setOnLoadingImage] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim1 = useRef(new Animated.Value(1)).current;
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
    const {email_id, ...fields} = state;
    try {
      setLoading(true);
      await dispatch(
        editProfileSlice({
          // emailId: email_id,
          type: type == PATIENT ? 'patient' : 'mentor',
          ...fields,
        }),
      );
      setLoading(false);
      navigation.goBack();
    } catch (err) {
      setLoading(false);
    }
  };

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim1, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setEdit(pre => !pre);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {});
    });
  };

  const fadeOut = val => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start(() => {
      setEdit(val);
      Animated.timing(fadeAnim1, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleUploadImage = useCallback(async () => {
    const options = ['Take Photo', 'Choose From Library', 'Cancel'];
    const cancelButtonIndex = 2;
    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async buttonIndex => {
        if (buttonIndex === 0) {
          ImagePicker.openCamera({
            width: 300,
            height: 400,
            mediaType: 'photo',
            cropping: true,
            compressImageQuality: 0.7,
          })
            .then(async image => {
              dispatch(getUrlToUploadImage()).then(({payload}) => {
                uploadImageToServer(image, payload.url);
              });
            })
            .catch(err => {});
        } else if (buttonIndex === 1) {
          ImagePicker.openPicker({
            mediaType: 'photo',
            compressImageQuality: 0.7,
            showsSelectedCount: true,
            maxFiles: 1,
            cropping: true,
            forceJpg: true,
          })
            .then(async image => {
              dispatch(getUrlToUploadImage()).then(({payload}) => {
                uploadImageToServer(image, payload.url);
              });
            })
            .catch(error => {});
        }
      },
    );
  }, [dispatch, showActionSheetWithOptions, uploadImageToServer]);

  const decodeBase64 = async data => {
    try {
      const decodedData = await decode(data);
      const bytes = await new Uint8Array(decodedData.length);
      for (let i = 0; i < decodedData.length; i++) {
        bytes[i] = decodedData.charCodeAt(i);
      }
      return bytes.buffer;
    } catch (e) {
      console.log('Error while decoding:', e);
    }
  };

  const uploadImageToServer = useCallback(
    async (data, signedUrl) => {
      if (signedUrl) {
        // setOnLoadingImage(true);
        const fileData = await RNFS.readFile(data?.path, 'base64');
        const _data = await decodeBase64(fileData);
        try {
          await dispatch(uploadImageToServerSlice({data: _data, signedUrl}));
          // setOnLoadingImage(false);
        } catch (e) {
          // setOnLoadingImage(false);

          console.log('Error while fetching', e);
        }
      }
    },
    [dispatch],
  );

  return (
    <View
      style={{
        backgroundColor: isEdit && !darkMode ? 'black' : 'white',
        flex: 1,
      }}>
      <Header
        navigation={navigation}
        isBack={isEdit ? false : true}
        hideRight={isEdit ? false : true}
        setEdit={val => {
          fadeOut(val);
        }}
        darkMode={darkMode}
        fadeAnim={isEdit ? fadeAnim : fadeAnim1}
        handleUploadImage={handleUploadImage}
        label={isEdit ? 'Profile Photo' : 'Profile'}
        borderBottomColor={
          darkMode || isEdit ? Colors.shadowColor1 : Colors.shadowColor
        }
        labelStyle={{
          color: isEdit ? Colors.white : darkModeColor(darkMode),
          fontSize: 16,
          fontWeight: '600',
        }}
      />
      {isLoading ? <ScreenLoading /> : null}
      {isEdit ? null : (
        <Animated.View style={{padding: 10, opacity: fadeAnim1}}>
          <View style={styles.imageContainer}>
            <Pressable
              onPress={() => {
                fadeIn();
                // navigation.navigate('PreviewImage', {
                //   url: profileURL(uniqueId),
                // });
              }}>
              <Image
                source={
                  uniqueId
                    ? {
                        cache: 'reload',
                        uri: profileURL(uniqueId) + '?time=' + new Date(),
                      }
                    : loginFrom === PATIENT
                    ? patientURI
                    : doctorURI
                }
                style={styles.image}
              />
              <View style={styles.cameraIcon}>
                <MaterialIcons
                  name="photo-camera"
                  size={16}
                  color={Colors.white}
                  style={styles.icon}
                />
              </View>
            </Pressable>
          </View>
          {renderInput({placeholder: FIRST_NAME, field: 'firstName'})}
          {renderInput({placeholder: LAST_NAME, field: 'lastName'})}
          {renderInput({placeholder: PHONE_NO, field: 'phoneNumber'})}

          <TouchableOpacity onPress={onSave} style={styles.saveButton}>
            <Text
              button
              style={{color: 'white', fontWeight: 'bold', fontSize: 18}}>
              {SAVE}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      {/* {isEdit ? ( */}
      <Animated.View
        style={[
          {
            opacity: fadeAnim,
            flex: 1,
          },
        ]}>
        <PreviewImage
          url={profileURL(uniqueId) + '?time=' + new Date()}
          isImageLoading={isImageLoading}
        />
      </Animated.View>
    </View>
  );
};

export default connectActionSheet(EditProfile);

const styles = StyleSheet.create({
  saveButton: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    backgroundColor: Colors.darkPaleMintColor,
    borderColor: 'white',
    borderRadius: 6,
  },
  image: {
    width: 80,
    height: 80,
    objectFit: 'cover',
    borderRadius: 40,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    position: 'relative',
  },
  cameraIcon: {
    backgroundColor: 'green',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
