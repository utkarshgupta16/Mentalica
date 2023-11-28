// import { API_URL, API_PREVIEW_URL } from '@env';
import {Platform} from 'react-native';
const API_URL = 'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com';
export const endPoints = {
  singUpMentorProfile: `${API_URL}/setMentorProfile`,
  singUpPatientProfile: `${API_URL}/setPatientProfile`,
  getAllMentorList: `${API_URL}/getAllMentorList`,
  bookAppointment: `${API_URL}/bookMentorPatientSlot`,
  getPatientProfile: `${API_URL}/getMePatient`,
  getMentorProfile: `${API_URL}/getMeMentor`,
  getScheduledAppointments: `${API_URL}/getMentorAppointmentSlot`,
  getTwilloToken: `${API_URL}/getTwilloToken`,
  sendNotification: "https://fcm.googleapis.com/fcm/send",
  editProfile:`${API_URL}/updateProfile`
};
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';


// export const axiosInstance = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     // Other common headers can be added here
//   },
// });

// // Function to set authorization header
// export const setAuthToken = token => {
//   if (token) {
//     axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//   } else {
//     delete axiosInstance.defaults.headers.common['Authorization'];
//   }
// };


// https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId="75thbd"&userName="vhjadvc"
