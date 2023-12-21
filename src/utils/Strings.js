export default convertString = convertLang => {
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
  const ENGLISH = 'English';
  const SELECT_LANG = convertLang && convertLang('Select Language');

  return {
    RESTART_APP,
    UPDATE_SLOTS,
    ADD_SLOTS,
    OKAY,
    SELECT_LANG,
    ENGLISH,
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
    MENTORS_LIST,
    HELLO,
    HARDWARE_SUPPORT,
    ERROR,
    PERMISSIONS_ACCESS,
    ONE_GRANTED,
    PASSWORD_NOT_MATCH,
    CHANGE_LANG,
  };
};

export const PATIENT = 'Patient';
export const MENTOR = 'Mentor';
export const FROM = 'From';
export const TO = 'To';
export const APPLY = 'Apply';
export const TODAY = 'Today';
export const TOMORROW = 'Tomorrow';
export const DAY_AFTER_TOMORROW = 'Day After Tomorrow';
export const ADD_SLOTS = 'Add Slots';
