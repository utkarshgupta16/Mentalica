// import { API_URL, API_PREVIEW_URL } from '@env';
import {Platform} from 'react-native';
const API_URL = 'https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com';
export const endPoints = {
  // singUpMentorProfile: `${API_URL}/setMentorProfile`,
  // singUpPatientProfile: `${API_URL}/setPatientProfile`,
  signUpUserProfile: `${API_URL}/setUserProfile`,
  getAllMentorList: `${API_URL}/getMentorList`,
  bookAppointment: `${API_URL}/scheduleAppointment`,
  // getPatientProfile: `${API_URL}/getMe`,
  // getMentorProfile: `${API_URL}/getMe`,
  getProfile: `${API_URL}/getMe`,
  getScheduledAppointments: `${API_URL}/getAppointments`,
  getTwilloToken: `${API_URL}/getTwilloToken`,
  sendNotification: 'https://fcm.googleapis.com/fcm/send',
  editProfile: `${API_URL}/updateUserProfile`,
  getMentorAvailableSlots: `${API_URL}/slots?uniqueId=`,
  getArticleList: `${API_URL}/articleList`,
  getTwillioChatAPI: `${API_URL}/chatToken?identity=`,
  deleteConversation: `${API_URL}/deleteConversation`,
  fetchConversation: `${API_URL}/fetchConversation`,
  updateConversation: `${API_URL}/updateConversation`,
  updateSlots: `${API_URL}/slots`,
  getSlots: `${API_URL}/slots?date=`,
  getUrlToUploadImage: `${API_URL}/userpic`,
  getProfileUrl: `${API_URL}/userpic?type=getImage`,
  getMentorsByName: `${API_URL}/getMentorList?name=`,
  getMentorsByExperties: `${API_URL}/getMentorList?expertise=`,
  getMentorsByExperience: `${API_URL}/getMentorList?exp=`,
  getMentorsByNameAndExperties: `${API_URL}/getMentorList?`,
};
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';

export const searchAPI = {
  name: endPoints.getMentorsByName,
  experties: endPoints.getMentorsByExperties,
  experience: endPoints.getMentorsByExperience,
};
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
