import React, {useState} from 'react';
import {styles} from './patientDashboardStyle';
import {View} from 'react-native';
import {
  ALL,
  APPOINMENTS,
  ARTICLES,
  MENTORS_LIST,
  SAVED,
} from '../../../utils/Strings';
import PatientDashboardTabs from '../../PatientDashboardTabs';
const TabComponent = ({selectedTab, setSelectedTab}) => {
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
        title={APPOINMENTS}
        tab={APPOINMENTS}
        onPress={() => {
          setSelectedTab({tabStr: APPOINMENTS});
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
