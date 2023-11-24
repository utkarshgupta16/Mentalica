import React, {useState} from 'react';
import {styles} from './patientDashboardStyle';
// import {View} from 'react-native';
import convertLang from '../../../utils/Strings';
import PatientDashboardTabs from '../../PatientDashboardTabs';
import {useTranslation} from 'react-i18next';
import View from "../../../components/ViewWrapper"
const TabComponent = ({selectedTab, setSelectedTab}) => {
  const {t} = useTranslation();
    const {
        ALL,
        APPOINTMENTS,
        ARTICLES,
        MENTORS_LIST,
        SAVED,
      }=convertLang(t)
  return (
    <View style={styles.tabs}>
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
