// import React, {useState} from 'react';
// import {StyleSheet, Text, View} from 'react-native';
// import Colors from '../customs/Colors';
// import CheckBox from '@react-native-community/checkbox';
// import Button from '../components/Button';
// import {useDispatch} from 'react-redux';
// import {loginClient} from '../redux/AuthSlice';
// import {MENTOR, PATIENT} from '../utils/Strings';

// const AskClient = ({navigation}) => {
//   const dispatch = useDispatch();
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const [error, setError] = useState(null);

//   const onSubmitHandler = () => {
//     const selectedType = selectedPatient ? PATIENT : MENTOR;
//     dispatch(loginClient(selectedType));
//     navigation.navigate('MainRoute');
//   };

//   return (
//     <View style={styles.mainContainer}>
//       <Text style={styles.typeText}>Select your type:</Text>
//       <View style={styles.checkboxContainer}>
//         <View style={styles.patient}>
//           <CheckBox
//             disabled={false}
//             value={selectedPatient}
//             onValueChange={newValue => {
//               setError(null);
//               setSelectedPatient(newValue);
//               setSelectedMentor(false);
//             }}
//             style={styles.checkBox}
//             boxType="square"
//           />
//           <Text style={styles.chooseText}>I am a Patient</Text>
//         </View>
//         <View style={styles.mentor}>
//           <CheckBox
//             disabled={false}
//             value={selectedMentor}
//             onValueChange={newValue => {
//               setError(null);
//               setSelectedMentor(newValue);
//               setSelectedPatient(false);
//             }}
//             style={styles.checkBox}
//             boxType="square"
//           />
//           <Text style={styles.chooseText}>I am a Therapist/Mentor</Text>
//         </View>
//         {error ? <Text style={styles.errorText}>{error}</Text> : null}
//       </View>
//       <Button
//         disabled={!selectedPatient && !selectedMentor}
//         onPress={onSubmitHandler}
//         title="Submit"
//       />
//     </View>
//   );
// };

// export default AskClient;

// const styles = StyleSheet.create({
//   mainContainer: {
//     backgroundColor: Colors.paleMintColor,
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxContainer: {
//     marginBottom: 80,
//   },
//   patient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   chooseText: {
//     fontWeight: '600',
//     fontSize: 16,
//     color: Colors.dune,
//   },
//   typeText: {
//     fontWeight: '700',
//     fontSize: 24,
//     color: Colors.dune,
//     marginBottom: 64,
//   },
//   checkBox: {
//     marginRight: 10,
//   },
//   mentor: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   errorText: {
//     color: Colors.red,
//   },
// });
