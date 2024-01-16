const convertString = convertLang => {
  const CHANGE_LANG =
    convertLang && convertLang('Are you sure want to change language');
  const RESTART_APP =
    convertLang &&
    convertLang('your app will be restarted when you changed language');
  const PASSWORD_NOT_MATCH =
    convertLang && convertLang('Password does not match.');
  const UPDATE_SLOTS = convertLang && convertLang('Update Slots');
  const ADD_SLOTS = convertLang && convertLang('Add Slots');
  const HOME = convertLang && convertLang('Home');
  const HOME_TAB_ROUTE = 'HomeTabRoute';
  const INVOICING = convertLang && convertLang('Invoicing');
  const STATS = convertLang && convertLang('Stats');
  const MESSAGES = convertLang && convertLang('Messages');
  const PROFILE = convertLang && convertLang('Profile');
  const ALL = convertLang && convertLang('All');
  const APPOINTMENTS = convertLang && convertLang('Appointments');
  const ARTICLES = convertLang && convertLang('Articles');
  const SAVED = convertLang && convertLang('Saved');
  const MENTORS_LIST = convertLang && convertLang('Mentors List');
  const HELLO = convertLang && convertLang('Hello');
  const OKAY = convertLang && convertLang('Okay');
  const HARDWARE_SUPPORT =
    convertLang &&
    convertLang('Hardware to support video calls is not available');
  const ERROR = convertLang && convertLang('Error');
  const PERMISSIONS_ACCESS =
    convertLang &&
    convertLang(
      'Permission to access hardware was blocked, please grant manually',
    );
  const ONE_GRANTED =
    convertLang && convertLang('One of the permissions was not granted');
  const PERMISSIONS_GRANTED =
    convertLang && convertLang('Permission not granted');
  const YOU_JOINED_CALL =
    convertLang && convertLang("You'll be joined to this video call");
  const ARE_YOU_JOIN =
    convertLang && convertLang('Are you sure you want to join?');
  const YES = convertLang && convertLang('Yes');
  const NO = convertLang && convertLang('No');
  const RELOAD = convertLang && convertLang('Reload');
  const NO_DATA_FOUND = convertLang && convertLang('No data found');
  const ARE_YOU_LOGOUT =
    convertLang && convertLang('Are you sure want to log out?');
  const LOGOUT = convertLang && convertLang('Log Out');
  const NO_CANCEL = convertLang && convertLang('No, Cancel');
  const I_AM_SPECIALIST = convertLang && convertLang("I'm a specialist in");
  const I_WANT = convertLang && convertLang('I want to address');
  const ACCOUNT_DETAILS = convertLang && convertLang('Account Details');
  const PAYMENT = convertLang && convertLang('Payment');
  const LINK_EXPIRED = convertLang && convertLang('Meeting Link Expired');
  const PATIENT_EMAIL_ID = 'patientEmailId';
  const MENTOR_EMAIL_ID = 'mentorEmailId';
  const HEBREW = 'Hebrew';
  // const ENGLISH = 'English';
  const ENGLISH = convertLang && convertLang('English');
  const HINDI = convertLang && convertLang('Hindi');
  const SELECT_LANG = convertLang && convertLang('Select Language');
  const INVOICE = convertLang && convertLang('Invoice');
  const SUN = convertLang && convertLang('Sun');
  const DARK_MODE = convertLang && convertLang('Dark Mode');
  const CHANGE_PASSWORD = convertLang && convertLang('Change Password');
  const SAVE = convertLang && convertLang('Save');
  const FIRST_NAME = convertLang && convertLang('first name');
  const LAST_NAME = convertLang && convertLang('last name');
  const PHONE_NO = convertLang && convertLang('Phone Number');
  const OLD_PASSWORD = convertLang && convertLang('Old Password');
  const NEW_PASSWORD = convertLang && convertLang('New Password');
  const CONF_NEW_PASSWORD = convertLang && convertLang('Confirm New Password');
  const TODAY = convertLang && convertLang('Today');
  const TOMORROW = convertLang && convertLang('Tomorrow');
  const DAY_AFTER_TOMORROW = convertLang && convertLang('Day after tomorrow');
  const PLEASE_ENTER_OLD_PASSWORD =
    convertLang && convertLang('Please Enter Old Password');
  const PLEASE_ENTER_NEW_PASSWORD =
    convertLang && convertLang('Please Enter New Password');
  const PLEASE_Confirm_NEW_PASSWORD =
    convertLang && convertLang('Please Confirm New Password');
  const UPDATE = convertLang && convertLang('Update');
  const CONTACT_DETAILS = convertLang && convertLang('Contact Details');
  const EMAIL_ADD = convertLang && convertLang('Email Address');
  const OK = convertLang && convertLang('OK');
  const CHAT = convertLang && convertLang('Chat');
  const EXPERTIES = convertLang && convertLang('Experties');
  const SPEAKS = convertLang && convertLang('Speaks');
  const YEARS_OF_EXPERIENCE = convertLang && convertLang('Years of experience');
  const FOR = convertLang && convertLang('for');
  const MINS_STARTS = convertLang && convertLang('mins starts');
  const STARTS = convertLang && convertLang('starts');
  const MINS = convertLang && convertLang('mins');
  const NEXT_AAPPOINTMENTS = convertLang && convertLang('Next Appointments');
  const RECOMMENDED_ARTICLES =
    convertLang && convertLang('Recommended articles');
  const VIDEO_CALL = convertLang && convertLang('Video Call');
  const RAQUAL_ALMEIDA = convertLang && convertLang('Raqual Almeida');
  const SARA_FAWLER = convertLang && convertLang('Sara Fawler');
  const THE_HEALING_POWER_OF_NATURE =
    convertLang && convertLang('The healing power of nature');
  const AVAILABLE_SLOTS = convertLang && convertLang('Available Slots');
  const NO_SLOTS_AVAILABLE_TO_BOOK =
    convertLang && convertLang('No slots available to book');
  const SCHEDULE_APPOINTMENT =
    convertLang && convertLang('Schedule Appointment');
  const EMAIL = convertLang && convertLang('Email');
  const FORGOT_PASSWORD = convertLang && convertLang('Forgot password');
  const PASSWORD = convertLang && convertLang('Password');
  const SIGN_UP = convertLang && convertLang('Sign Up');
  const CITY = convertLang && convertLang('City');
  const TEMP_CITY = convertLang && convertLang('Temporary City');
  const AGE = convertLang && convertLang('Age');
  const EMAIL_ID = convertLang && convertLang('Email Id');
  const CONFIRM_PASSWORD = convertLang && convertLang('Confirm Password');
  const CHOOSE_GENDER = convertLang && convertLang('Choose Gender');
  const CHOOSE_PROFESSION = convertLang && convertLang('Choose Profession');
  const CHOOSE_HOW_DO_YOU_FEEL =
    convertLang && convertLang('Choose How do you feel');
  const ENTER = convertLang && convertLang('Enter');
  const CREATE_ACCOUNT = convertLang && convertLang('Create Account');
  const PATIENT_LABEL = convertLang && convertLang('Patient');
  const MENTOR_LABEL = convertLang && convertLang('Mentor');
  const MAlE = convertLang && convertLang('Male');
  const FEMAlE = convertLang && convertLang('Female');
  const CIVILIAN = convertLang && convertLang('Civilian');
  const SOLDIER = convertLang && convertLang('Soldier');
  const STUDENT = convertLang && convertLang('Student');
  const HATE = convertLang && convertLang('Hate');
  const ABANDONED = convertLang && convertLang('Abandoned');
  const SELECT_SPECIALITY = convertLang && convertLang('Select Speciality');
  const SELECT_LANGUAGE = convertLang && convertLang('Select Language');
  const FEES_FOR_30_MINS = convertLang && convertLang('Fees For 30 Mins');
  const EXPERIENCE_IN_YEARS = convertLang && convertLang('Experince in Years');
  const SELECTED_DATE = convertLang && convertLang('Selected date');
  const DATE_FROM = convertLang && convertLang('Date from');
  const TO = convertLang && convertLang('to');
  const SELECT_TIME = convertLang && convertLang('Select Time');
  const DEPRESSION = convertLang && convertLang('Depression');
  const DISAAPOINTMENT = convertLang && convertLang('Disappointment');
  const ANXIETY = convertLang && convertLang('Anxiety');
  const STUDENT_LIFE = convertLang && convertLang('Student Life');
  const LONELINESS = convertLang && convertLang('Loneliness');
  const FEAR = convertLang && convertLang('Fear');
  const DANGER = convertLang && convertLang('Danger');
  const TRAUMA = convertLang && convertLang('Trauma');
  const SHOCKED = convertLang && convertLang('Shocked');
  const PAIN = convertLang && convertLang('Pain');
  const ANGER = convertLang && convertLang('Anger');
  const DEPRESSED = convertLang && convertLang('Depressed');
  const SADNESS = convertLang && convertLang('Sadness');
  const SELECTED_TYPE = convertLang && convertLang('Select Type.');

  return {
    SELECTED_TYPE,
    ENGLISH,
    HINDI,
    SADNESS,
    DEPRESSED,
    ANGER,
    PAIN,
    SHOCKED,
    DANGER,
    TRAUMA,
    FEAR,
    LONELINESS,
    STUDENT_LIFE,
    ANXIETY,
    DISAAPOINTMENT,
    SELECT_TIME,
    STUDENT,
    HATE,
    ABANDONED,
    SELECTED_DATE,
    DATE_FROM,
    TO,
    SELECT_SPECIALITY,
    FEES_FOR_30_MINS,
    EXPERIENCE_IN_YEARS,
    SELECT_LANGUAGE,
    MAlE,
    FEMAlE,
    CIVILIAN,
    SOLDIER,
    CITY,
    PATIENT_LABEL,
    MENTOR_LABEL,
    CREATE_ACCOUNT,
    ENTER,
    TEMP_CITY,
    AGE,
    EMAIL_ID,
    CHOOSE_GENDER,
    CONFIRM_PASSWORD,
    CHOOSE_PROFESSION,
    CHOOSE_HOW_DO_YOU_FEEL,
    FORGOT_PASSWORD,
    PASSWORD,
    EMAIL,
    SCHEDULE_APPOINTMENT,
    THE_HEALING_POWER_OF_NATURE,
    SARA_FAWLER,
    RAQUAL_ALMEIDA,
    VIDEO_CALL,
    RECOMMENDED_ARTICLES,
    NEXT_AAPPOINTMENTS,
    RESTART_APP,
    UPDATE_SLOTS,
    ADD_SLOTS,
    OKAY,
    SELECT_LANG,
    HEBREW,
    MENTOR_EMAIL_ID,
    RELOAD,
    NO_CANCEL,
    ARE_YOU_LOGOUT,
    LOGOUT,
    I_AM_SPECIALIST,
    I_WANT,
    ACCOUNT_DETAILS,
    PAYMENT,
    LINK_EXPIRED,
    PATIENT_EMAIL_ID,
    MENTORS_LIST,
    MESSAGES,
    NO_DATA_FOUND,
    NO,
    YES,
    ARE_YOU_JOIN,
    YOU_JOINED_CALL,
    PERMISSIONS_GRANTED,
    HOME,
    HOME_TAB_ROUTE,
    INVOICING,
    STATS,
    PROFILE,
    ALL,
    APPOINTMENTS,
    ARTICLES,
    SAVED,
    HELLO,
    HARDWARE_SUPPORT,
    ERROR,
    PERMISSIONS_ACCESS,
    ONE_GRANTED,
    PASSWORD_NOT_MATCH,
    CHANGE_LANG,
    INVOICE,
    SUN,
    DARK_MODE,
    CHANGE_PASSWORD,
    SAVE,
    FIRST_NAME,
    LAST_NAME,
    PHONE_NO,
    OLD_PASSWORD,
    NEW_PASSWORD,
    CONF_NEW_PASSWORD,
    TODAY,
    TOMORROW,
    DAY_AFTER_TOMORROW,
    PLEASE_Confirm_NEW_PASSWORD,
    PLEASE_ENTER_NEW_PASSWORD,
    PLEASE_ENTER_OLD_PASSWORD,
    UPDATE,
    CONTACT_DETAILS,
    EMAIL_ADD,
    OK,
    CHAT,
    EXPERTIES,
    SPEAKS,
    YEARS_OF_EXPERIENCE,
    FOR,
    MINS_STARTS,
    STARTS,
    MINS,
    AVAILABLE_SLOTS,
    NO_SLOTS_AVAILABLE_TO_BOOK,
    SIGN_UP,
  };
};
export default convertString;
export const FROM = 'From';
export const TO = 'To';
export const APPLY = 'Apply';
export const ADD_SLOTS = 'Add Slots';
export const HE = 'he';
export const EN = 'en';
export const PATIENT = 'Patient';
export const MENTOR = 'Mentor';
