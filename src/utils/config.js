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
  getMentorAvailableSlots: `${API_URL}/getAvailableSlot`,
  getArticleList: `${API_URL}/articleList`,
  getTwillioChatAPI:`${API_URL}/chatToken?identity=`,
  deleteConversation:`${API_URL}/deleteConversation`,
  fetchConversation:`${API_URL}/fetchConversation`,
  updateConversation:`${API_URL}/updateConversation`
};
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';

// https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId="75thbd"&userName="vhjadvc"
