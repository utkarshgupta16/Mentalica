export default convertString = convertLang => {
  const CHANGE_LANG = convertLang('Are you sure want to change language');
  const RESTART_APP = convertLang(
    'your app will be restarted when you changed language',
  );
  const PASSWORD_NOT_MATCH = convertLang('Password does not match.');
  const UPDATE_SLOTS = convertLang('Update Slots');
  const ADD_SLOTS = convertLang('Add Slots');
  const HOME = convertLang('Home');
  const HOME_TAB_ROUTE = 'HomeTabRoute';
  const INVOICING = convertLang('Invoicing');
  const STATS = convertLang('Stats');
  const MESSAGES = convertLang('Messages');
  const PROFILE = convertLang('Profile');
  const ALL = convertLang('All');
  const APPOINTMENTS = convertLang('Appointments');
  const ARTICLES = convertLang('Articles');
  const SAVED = convertLang('Saved');
  const MENTORS_LIST = convertLang('Mentors List');
  const HELLO = convertLang('Hello');
  const OKAY = convertLang('Okay');
  const HARDWARE_SUPPORT = convertLang(
    'Hardware to support video calls is not available',
  );
  const ERROR = convertLang('Error');
  const PERMISSIONS_ACCESS = convertLang(
    'Permission to access hardware was blocked, please grant manually',
  );
  const ONE_GRANTED = convertLang('One of the permissions was not granted');
  const PERMISSIONS_GRANTED = convertLang('Permission not granted');
  const YOU_JOINED_CALL = convertLang("You'll be joined to this video call");
  const ARE_YOU_JOIN = convertLang('Are you sure you want to join?');
  const YES = convertLang('Yes');
  const NO = convertLang('No');
  const RELOAD = convertLang('Reload');
  const NO_DATA_FOUND = convertLang('No data found');
  const ARE_YOU_LOGOUT = convertLang('Are you sure want to log out?');
  const LOGOUT = convertLang('Log Out');
  const NO_CANCEL = convertLang('No, Cancel');
  const I_AM_SPECIALIST = convertLang("I'm a specialist in");
  const I_WANT = convertLang('I want to address');
  const ACCOUNT_DETAILS = convertLang('Account Details');
  const PAYMENT = convertLang('Payment');
  const LINK_EXPIRED = convertLang('Meeting Link Expired');
  const PATIENT_EMAIL_ID = 'patientEmailId';
  const MENTOR_EMAIL_ID = 'mentorEmailId';
  const HEBREW = 'Hebrew';
  const ENGLISH = 'English';
  const SELECT_LANG = convertLang('Select Language');

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
