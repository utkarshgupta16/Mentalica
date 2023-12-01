import React, {useState} from 'react';
import {styles} from './patientDashboardStyle';
import {View} from 'react-native';
import convertLang from '../../../utils/Strings';
import PatientDashboardTabs from '../../PatientDashboardTabs';
import {useTranslation} from 'react-i18next';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from '../../../utils/Responsive';
import {useSelector} from 'react-redux';

const TabComponent = ({isShadowVisible, selectedTab, setSelectedTab}) => {
  const {darkMode} = useSelector(state => state.home);

  const {t} = useTranslation();
  const {ALL, APPOINTMENTS, ARTICLES, MENTORS_LIST, SAVED} = convertLang(t);
  return (
    <View
      style={{
        marginBottom: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 10,
        paddingBottom: hp(2),
        paddingHorizontal: wp(2),
        backgroundColor: darkMode ? '#000' : '#fff',
        shadowColor:
          isShadowVisible && darkMode == false
            ? '#000'
            : isShadowVisible && darkMode == true
            ? '#fff'
            : null,
        shadowOffset: isShadowVisible
          ? {
              width: 0,
              height: 2,
            }
          : {
              width: 0,
              height: 0,
            },
        shadowOpacity: isShadowVisible ? 0.5 : 0,
        shadowRadius: isShadowVisible ? 1 : 0,
        elevation: isShadowVisible ? 2 : 0,
      }}>
      <PatientDashboardTabs
        selectedTab={selectedTab}
        title={ALL}
        tab={ALL}
        onPress={() => {
          setSelectedTab({tabStr: ALL});
        }}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        title={APPOINTMENTS}
        tab={APPOINTMENTS}
        onPress={() => {
          setSelectedTab({tabStr: APPOINTMENTS});
        }}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        title={ARTICLES}
        tab={ARTICLES}
        onPress={() => {
          setSelectedTab({tabStr: ARTICLES});
        }}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        tab={SAVED}
        title={SAVED}
        onPress={() => {
          setSelectedTab({tabStr: SAVED});
        }}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        tab={MENTORS_LIST}
        title={MENTORS_LIST}
        onPress={() => {
          setSelectedTab({tabStr: MENTORS_LIST});
        }}
      />
    </View>
  );
};

export default TabComponent;
