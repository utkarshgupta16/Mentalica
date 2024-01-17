/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {View} from 'react-native';
import convertLang from '../../utils/Strings';
import PatientDashboardTabs from '../../components/PatientDashboardTabs';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import Colors from '../../customs/Colors';

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
        justifyContent: 'space-around',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: darkMode ? Colors.black : Colors.white,
        shadowColor:
          isShadowVisible && darkMode === false
            ? Colors.black
            : isShadowVisible && darkMode === true
            ? Colors.white
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
      {/* <PatientDashboardTabs
        selectedTab={selectedTab}
        title={ALL}
        tab={ALL}
        onPress={() => {
          setSelectedTab({tabStr: ALL});
        }}
        darkMode={darkMode}
      /> */}
      <PatientDashboardTabs
        selectedTab={selectedTab}
        title={APPOINTMENTS}
        tab={APPOINTMENTS}
        onPress={() => {
          setSelectedTab({tabStr: APPOINTMENTS});
        }}
        darkMode={darkMode}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        title={ARTICLES}
        tab={ARTICLES}
        onPress={() => {
          setSelectedTab({tabStr: ARTICLES});
        }}
        darkMode={darkMode}
      />
      <PatientDashboardTabs
        selectedTab={selectedTab}
        tab={SAVED}
        title={SAVED}
        onPress={() => {
          setSelectedTab({tabStr: SAVED});
        }}
        darkMode={darkMode}
      />
      {/* <PatientDashboardTabs
        selectedTab={selectedTab}
        tab={MENTORS_LIST}
        title={MENTORS_LIST}
        onPress={() => {
          setSelectedTab({tabStr: MENTORS_LIST});
        }}
        darkMode={darkMode}
      /> */}
    </View>
  );
};

export default TabComponent;
