// import Text from '../../wrapperComponent/TextWrapper.js';
// import View from '../../wrapperComponent/ViewWrapper.js';
// import React, {useEffect, useState} from 'react';
// import {styles} from '../../../navigation/home/homeDashboardStyle';
// import convertLang from '../../../utils/Strings';
// import {useDispatch, useSelector} from 'react-redux';
// import {getProfileSlice} from '../../../redux/HomeSlice';
// import AppointmentList from '../../../navigation/home/AppointmentList';
// import {useTranslation} from 'react-i18next';
// import ContentLoader, {
//   Circle,
//   Rect,
//   Facebook,
// } from 'react-content-loader/native';
// import {View as ViewComponent} from 'react-native';
// import {TabContentLoading} from '../../HomePageContentLoading.js';
// const tabsWidth = {
//   0: 50,
//   1: 100,
//   2: 70,
//   3: 60,
//   4: 80,
// };
// const PatientDashboard = ({navigation}) => {
//   const {t} = useTranslation();
//   const {
//     ALL,
//     APPOINTMENTS,
//     ARTICLES,
//     HELLO,
//     MENTORS_LIST,
//     NO_DATA_FOUND,
//     SAVED,
//   } = convertLang(t);

//   const [isShadowVisible, setIsShadowVisible] = useState(false);
//   const [isMe, setProfileMe] = useState(false);

//   const handleShadowVisible = isShadowVisible => {
//     setIsShadowVisible(isShadowVisible);
//   };

//   const {email, type} = useSelector(state => state.auth);
//   const {darkMode, profileData = {}} = useSelector(state => state.home);
//   const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});

//   const dispatch = useDispatch();

//   useEffect(() => {
//     (async () => {
//       try {
//         setProfileMe(true);
//         await dispatch(getProfileSlice({email, type: type}));
//         setProfileMe(false);
//       } catch (er) {
//         setProfileMe(false);
//       }
//     })();
//   }, [email, type, dispatch]);

//   return (
//     <View style={styles.container}>
//       <>
//         {isMe ? (
//           <ViewComponent style={{flexDirection: 'row', marginVertical: 10}}>
//             <TabContentLoading height={20} length={2} tabsWidth={tabsWidth} />
//           </ViewComponent>
//         ) : (
//           <Text style={styles.helloText}>
//             {HELLO}, {profileData?.firstName}
//           </Text>
//         )}
//         <AppointmentList
//           handleShadowVisible={handleShadowVisible}
//           navigation={navigation}
//         />
//       </>
//     </View>
//   );
// };

// export default PatientDashboard;
