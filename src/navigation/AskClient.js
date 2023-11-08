import React, {useState} from 'react';
import {I18nManager, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Colors from '../customs/Colors';
import CheckBox from '@react-native-community/checkbox';
import Button from '../components/Button';
import {useDispatch} from 'react-redux';
import {loginClient} from '../redux/AuthSlice';
import {MENTOR, PATIENT} from '../utils/Strings';
import {useTranslation} from 'react-i18next';
import RNRestart from "react-native-restart";

const AskClient = ({navigation}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [error, setError] = useState(null);

  const onSubmitHandler = () => {
    const selectedType = selectedPatient ? PATIENT : MENTOR;
    dispatch(loginClient(selectedType));
    navigation.navigate('Login');
  };

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        onPress={() =>
          i18n
            .changeLanguage(i18n.language === 'he' ? 'en' : 'he')
            .then(() => {
              I18nManager.forceRTL(i18n.language === 'he');
              RNRestart.Restart();
            })
            .catch(err => {
              console.log('something went wrong while applying RTL', err);
            })
        }>
        <View style={{borderRadius: 8, padding: 8, backgroundColor: 'blue'}}>
          <Text
            style={{
              color: 'white',
              // margin: 9,

              fontSize: 18,
            }}>
            {i18n.language === 'en' ? 'English' : 'Hebrew'}
          </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.typeText}>{t('select_type')}</Text>
      <View style={styles.checkboxContainer}>
        <View style={styles.patient}>
          <CheckBox
            disabled={false}
            value={selectedPatient}
            onValueChange={newValue => {
              setError(null);
              setSelectedPatient(newValue);
              setSelectedMentor(false);
            }}
            style={styles.checkBox}
            boxType="square"
          />
          <Text style={styles.chooseText}>{t('I_am_patient')}</Text>
        </View>
        <View style={styles.mentor}>
          <CheckBox
            disabled={false}
            value={selectedMentor}
            onValueChange={newValue => {
              setError(null);
              setSelectedMentor(newValue);
              setSelectedPatient(false);
            }}
            style={styles.checkBox}
            boxType="square"
          />
          <Text style={styles.chooseText}>{t('I_am_mentor')}</Text>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </View>
      <Button
        disabled={!selectedPatient && !selectedMentor}
        onPress={onSubmitHandler}
        title="Submit"
      />
    </View>
  );
};

export default AskClient;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.paleMintColor,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxContainer: {
    marginBottom: 80,
  },
  patient: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  chooseText: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.dune,
  },
  typeText: {
    fontWeight: '700',
    fontSize: 24,
    color: Colors.dune,
    marginBottom: 64,
  },
  checkBox: {
    marginRight: 10,
  },
  mentor: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    color: Colors.red,
  },
});
