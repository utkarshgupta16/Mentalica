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
  sendNotification: "https://fcm.googleapis.com/fcm/send"
};
export const iosPlatform = Platform.OS === 'ios';
export const androidPlatform = Platform.OS === 'android';

// https://9ktgqcno0j.execute-api.ap-south-1.amazonaws.com/getTwilloToken?roomId="75thbd"&userName="vhjadvc"
