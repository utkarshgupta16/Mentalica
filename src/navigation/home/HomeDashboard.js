/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {styles} from './homeDashboardStyle';
import convertLang, {MENTOR, PATIENT} from '../../utils/Strings';
import View from '../../components/wrapperComponent/ViewWrapper';
import Text from '../../components/wrapperComponent/TextWrapper';
import MentorsList from '../../components/mentorScreens/MentorsList';
import {useDispatch, useSelector} from 'react-redux';
import {getMentorSearchData, getProfileSlice} from '../../redux/HomeSlice';
import TabComponent from './TabComponent';
import AppointmentList from './AppointmentList';
import AllTabComponent from './AllTabComponent';
import {useTranslation} from 'react-i18next';
import ArticlesList from './ArticlesList.js';
import {
  Animated,
  FlatList,
  Pressable,
  TextInput,
  View as ViewComponent,
} from 'react-native';
import {TabContentLoading} from '../../components/SkeletonContentLoading';
import debounce from 'lodash.debounce';
import Colors from '../../customs/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SaveArticles from './SaveArticles';

const tabsWidth = {
  0: 50,
  1: 100,
  2: 70,
  3: 60,
  4: 80,
};
const dropdownSearchItems = {
  name: 'Enter name..',
  experties: 'Enter experties..',
  experience: 'Enter experience..',
};
const HomeDashboard = ({navigation}) => {
  const {t} = useTranslation();
  const {
    ALL,
    APPOINTMENTS,
    ARTICLES,
    HELLO,
    MENTORS_LIST,
    NO_DATA_FOUND,
    SAVED,
  } = convertLang(t);
  const startValue = useRef(new Animated.Value(300)).current;
  const [isShadowVisible, setIsShadowVisible] = useState(false);
  const [isMe, setProfileMe] = useState(false);
  const [showSearchBar, setSearchBar] = useState(false);
  const [showDropdown, setDropdown] = useState(false);
  const [searchText, setSearchText] = useState({});
  const [dropdownitems, setDropdownItems] = useState('name');
  const handleShadowVisible = isShadowVisible => {
    setIsShadowVisible(isShadowVisible);
  };

  const components = {
    [ALL]: <AllTabComponent handleShadowVisible={handleShadowVisible} />,
    [APPOINTMENTS]: (
      <AppointmentList
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),
    [ARTICLES]: (
      <ArticlesList
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),

    [SAVED]: (
      <SaveArticles
        handleShadowVisible={handleShadowVisible}
        navigation={navigation}
      />
    ),
    // [MENTORS_LIST]: (
    //   <MentorsList
    //     handleShadowVisible={handleShadowVisible}
    //     navigation={navigation}
    //   />
    // ),
  };
  const {email, type} = useSelector(state => state.auth);
  const {darkMode, profileData = {}} = useSelector(state => state.home);
  const [selectedTab, setSelectedTab] = useState({tabStr: APPOINTMENTS});

  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (Object.keys(profileData).length === 0) {
        try {
          setProfileMe(true);
          await dispatch(getProfileSlice({email, type: type}));
          setProfileMe(false);
        } catch (er) {
          setProfileMe(false);
        }
      }
    })();
  }, [email, type, dispatch]);

  const handleDropDownItemSelected = item => {
    setDropdownItems(item);
    setDropdown(false);
    if (Object.keys(searchText).length) {
      debouncedSearch('');
      setSearchText({});
    }
  };

  const debouncedSearch = useCallback(
    debounce(searchTerm => {
      dispatch(
        getMentorSearchData({
          searchText:
            dropdownitems === 'experties'
              ? searchTerm.toLowerCase()
              : searchTerm,
          type: dropdownitems,
        }),
      );
    }, 500),
    [dropdownitems],
  );

  return (
    <View style={styles.container}>
      <>
        {isMe ? (
          <ViewComponent style={styles.homeContentLoading}>
            <TabContentLoading height={20} length={2} tabsWidth={tabsWidth} />
          </ViewComponent>
        ) : (
          <View style={styles.searchIconCont}>
            {selectedTab.tabStr !== MENTORS_LIST || !showSearchBar ? (
              <Text style={styles.helloText}>
                {HELLO}, {profileData?.firstName}
              </Text>
            ) : (
              <>
                <Animated.View
                  style={{
                    transform: [
                      {
                        translateX: startValue,
                      },
                    ],
                    flex: 1,
                    height: 43,
                  }}>
                  <TextInput
                    placeholder={dropdownSearchItems[dropdownitems]}
                    onChangeText={text => {
                      setSearchText({...searchText, [dropdownitems]: text});
                      debouncedSearch(text);
                    }}
                    value={searchText[dropdownitems]}
                    style={styles.searchBar}
                  />
                </Animated.View>
                <Pressable onPress={() => setDropdown(!showDropdown)}>
                  <MaterialIcons
                    name="keyboard-arrow-down"
                    size={35}
                    color={Colors.darkPaleMintColor}
                    style={styles.icon}
                  />
                </Pressable>
              </>
            )}

            {showDropdown && showSearchBar ? (
              <View style={styles.selectSearch}>
                <View style={{backgroundColor: 'white', paddingHorizontal: 17}}>
                  <FlatList
                    showsVerticalScrollIndicator={false}
                    data={['name', 'experties', 'experience']}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index}
                    renderItem={({item, index}) => {
                      return (
                        <Pressable
                          onPress={() => handleDropDownItemSelected(item)}
                          style={styles.selectSearchItem}>
                          <Text
                            style={{
                              color:
                                dropdownitems === item ? 'white' : Colors.dune,
                            }}>
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </Text>
                          {dropdownitems === item ? (
                            <View style={{paddingLeft: 10}}>
                              <MaterialIcons
                                name={'check'}
                                size={16}
                                color={Colors.emerald}
                              />
                            </View>
                          ) : null}
                        </Pressable>
                      );
                    }}
                  />
                </View>
              </View>
            ) : null}
            {type === PATIENT && selectedTab.tabStr === MENTORS_LIST ? (
              <Pressable
                onPress={() => {
                  setSearchBar(pre => {
                    if (pre) {
                      Animated.timing(startValue, {
                        toValue: 300,
                        duration: 1000,
                        useNativeDriver: true,
                      }).start(() => {});
                    } else {
                      Animated.timing(startValue, {
                        toValue: 10,
                        duration: 1000,
                        useNativeDriver: true,
                      }).start(() => {});
                    }
                    return !pre;
                  });
                }}>
                <MaterialIcons
                  name="search"
                  size={30}
                  color={Colors.darkPaleMintColor}
                  style={styles.icon}
                />
              </Pressable>
            ) : null}
          </View>
        )}

        {type === MENTOR ? null : isMe ? (
          <ViewComponent style={styles.loadingText}>
            <TabContentLoading rx={15} length={5} tabsWidth={tabsWidth} />
          </ViewComponent>
        ) : (
          <TabComponent
            isShadowVisible={isShadowVisible}
            selectedTab={selectedTab}
            setSelectedTab={props => {
              if (type === PATIENT && props.tabStr !== MENTORS_LIST) {
                setSearchBar(false);
              }
              setSelectedTab(props);
            }}
          />
        )}
        {components[selectedTab.tabStr]}
      </>
    </View>
  );
};

export default HomeDashboard;
