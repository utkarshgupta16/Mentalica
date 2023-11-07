// import React, {useEffect, useState} from 'react';
// import {View, Text} from 'react-native';
// import {useSelector} from 'react-redux';
// import {MENTOR} from '../../utils/Strings';
// import MentorDashboard from '../../components/mentorScreens/mentorDashboard/MentorDashboard';
// import PatientDashboard from '../../components/patientScreens/patientDashboard/PatientDashboard';
// import {getCurrentUserInfo} from '../../AWS/AWSConfiguration';

// const Home = () => {
//   const [currentUserInfo, setCurrentUserInfo] = useState({str: ''});

//   useEffect(() => {
//     (async () => {
//       const currentUserInfo = await getCurrentUserInfo();
//       setCurrentUserInfo({str: currentUserInfo?.attributes['custom:type']});
//     })();
//   }, []);

//   return (
//     <View style={{flex: 1}}>
//       {currentUserInfo.str === MENTOR ? (
//         <MentorDashboard />
//       ) : (
//         <PatientDashboard />
//       )}
//     </View>
//   );
// };

// export default Home;
