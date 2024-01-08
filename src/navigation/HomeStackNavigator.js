// import React from 'react';
// import {useSelector} from 'react-redux';
// import MentorDashboard from '../components/mentorScreens/mentorDashboard/MentorDashboard';
// import PatientDashboard from '../components/patientScreens/patientDashboard/PatientDashboard';
// const {createNativeStackNavigator} = require('@react-navigation/native-stack');

// const Stack = createNativeStackNavigator();
// export default function HomeStackNavigator() {
//   const {loginFrom} = useSelector(state => state.auth);
//   return (
//     <Stack.Navigator>
//       <Stack.Screen
//         name="PatientDashboard"
//         component={PatientDashboard}
//         options={{headerShown: false}}
//       />
//       {/* <Stack.Screen
//         name="AVChatScreen"
//         component={AVChatScreen}
//         options={{headerShown: false}}
//       /> */}
//     </Stack.Navigator>
//     // </NavigationContainer>
//   );
// }

// // export default function HomeStackNavigator() {
// //   const {loginFrom} = useSelector(state => state.auth);
// //   return (
// //     <Stack.Navigator>
// //       <Stack.Screen
// //         name={HOME}
// //         component={
// //           loginFrom === MENTOR ? (
// //             <MentorDashboardStack />
// //           ) : (
// //             <PatientDashboardStack />
// //           )
// //         }
// //         options={{
// //           header: () => null,
// //         }}
// //       />
// //       <Stack.Screen
// //         name="AVChatScreen"
// //         component={AVChatScreen}
// //         options={{headerShown: false}}
// //       />
// //     </Stack.Navigator>
// //   );
// // }
