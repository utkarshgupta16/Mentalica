import React from 'react';
import {useSelector} from 'react-redux';
import {MENTOR} from '../../utils/Strings';
import ProfileMentor from '../profile/ProfileMentor';
import ProfilePatient from '../profile/ProfilePatient';

const Profile = () => {
  const {loginFrom} = useSelector(state => state.auth);
  let content = <ProfilePatient />;
  if (loginFrom === MENTOR) {
    content = <ProfileMentor />;
  }
  return content;
};

export default Profile;
