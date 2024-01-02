import convertLang from '../utils/Strings';

export const specialities = [
  {label: 'Anxiety', value: 'anxiety'},
  {label: 'Fear', value: 'fear'},
  {label: 'Danger', value: 'danger'},
  {label: 'Disappointment', value: 'disappointment'},
  {label: 'Loneliness', value: 'loneliness'},
  {label: 'Hate', value: 'hate'},
  {label: 'Abandoned', value: 'abandoned'},
  {label: 'Trauma', value: 'trauma'},
  {label: 'Shocked', value: 'shocked'},
  {label: 'Pain', value: 'pain'},
  {label: 'Anger', value: 'anger'},
  {label: 'Depressed', value: 'depressed'},
  {label: 'Sadness', value: 'sadness'},
];

export const educationList = [
  {
    label: "Associate's Degree",
    value: 'associate degree',
  },
  {
    label: "Bachelor's Degree",
    value: 'bachelor degree',
  },
  {
    label: "Master's Degree",
    value: 'master degree',
  },
  {
    label: 'Doctorate/Ph.D',
    value: 'doctorate/ph.d',
  },
  {
    label: 'Professional Degree',
    value: 'professional degree',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

export const languageList = [
  {
    label: 'English',
    value: 'English',
  },
  {
    label: 'Hindi',
    value: 'Hindi',
  },
];

export const slotsData = [
  {
    value: '10:00-10:30',
    label: '10:00-10:30',
  },
  {
    value: '11:00-11:30',
    label: '11:00-11:30',
  },
  {
    value: '12:00-12:30',
    label: '12:00-12:30',
  },
  {
    value: '13:00-13:30',
    label: '13:00-13:30',
  },
  {
    value: '14:00-14:30',
    label: '14:00-14:30',
  },
  {
    value: '15:00-15:30',
    label: '15:00-15:30',
  },
  {
    value: '16:00-16:30',
    label: '16:00-16:30',
  },
  {
    value: '17:00-17:30',
    label: '17:00-17:30',
  },
  {
    value: '18:00-18:30',
    label: '18:00-18:30',
  },
];

export const articlesData = [
  {
    id: 1,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 2,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 3,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 4,
    title: 'The healing power of nature',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
  {
    id: 5,
    title: 'Celabrating the small wins',
    author: 'Sara Fawler',
    image:
      'https://thumbs.dreamstime.com/z/single-green-leafe-peeple-tree-background-white-single-green-leafe-peeple-tree-184432850.jpg',
  },
  {
    id: 6,
    title: 'How loneliness can affect your brain',
    author: 'Sara Fawler',
    image:
      'https://hips.hearstapps.com/hmg-prod/images/woman-praying-in-a-dark-place-royalty-free-image-543574284-1549494908.jpg?crop=0.66667xw:1xh;center,top&resize=640:*',
  },
];

export const PAYMENT_DETAIL_ITEM_PATIENT = [
  'Edit payment information',
  'Payment methods',
  'Payment history',
];

export const PAYMENT_DETAIL_ITEM_MENTOR = [
  'Edit fiscal information',
  'Banking information',
];

export const PROFILE_DETAILS = [
  {label: 'Edit profile', screen: 'EditProfilePatient'},
  {label: 'Contact details', screen: ''},
  {label: 'Password', screen: ''},
];
export const LANG_OPTION = [
  {label: 'English', value: 'English'},
  {label: 'Hebrew', value: 'Hebrew'},
];

export const FEEL_ITEMS = t => {
  const {
    HATE,
    ABANDONED,
    SADNESS,
    DEPRESSED,
    ANGER,
    PAIN,
    SHOCKED,
    DANGER,
    TRAUMA,
    FEAR,
    LONELINESS,
    ANXIETY,
    DISAAPOINTMENT,
  } = convertLang(t);
  return [
    {label: ANXIETY, value: 'anxiety'},
    {label: FEAR, value: 'fear'},
    {label: DANGER, value: 'danger'},
    {label: DISAAPOINTMENT, value: 'disappointment'},
    {label: LONELINESS, value: 'loneliness'},
    {label: HATE, value: 'hate'},
    {label: ABANDONED, value: 'abandoned'},
    {label: TRAUMA, value: 'trauma'},
    {label: SHOCKED, value: 'shocked'},
    {label: PAIN, value: 'pain'},
    {label: ANGER, value: 'anger'},
    {label: DEPRESSED, value: 'depressed'},
    {label: SADNESS, value: 'sadnesss'},
  ];
};

export const TYPE_OF_ITEMS = t => {
  const {PATIENT, MENTOR} = convertLang(t);
  return [
    {
      label: PATIENT,
      value: PATIENT,
    },
    {
      label: MENTOR,
      value: MENTOR,
    },
  ];
};

export const LANGUAGE_LIST = t => {
  const {ENGLISH, HINDI} = convertLang(t);
  return [
    {
      label: ENGLISH,
      value: ENGLISH,
    },
    {
      label: HINDI,
      value: HINDI,
    },
  ];
};

export const GENDER_ITEM = t => {
  const {MAlE, FEMAlE} = convertLang(t);
  return [
    {label: MAlE, value: 'male'},
    {label: FEMAlE, value: 'female'},
  ];
};

export const DUTY_ITEM = t => {
  const {CIVILIAN, SOLDIER, STUDENT} = convertLang(t);
  return [
    {label: CIVILIAN, value: 'civilian'},
    {label: SOLDIER, value: 'soldier'},
    {label: STUDENT, value: 'student'},
  ];
};
