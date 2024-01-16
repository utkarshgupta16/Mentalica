import React, {useEffect, useRef, useState} from 'react';
import {FlatList, Pressable, RefreshControl, Text, View} from 'react-native';
import Colors from '../../customs/Colors';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {dayNameArray, monthsArray} from '../../utils/default';
import {
  currentDayMonthYear,
  darkModeColor,
  doubleDigitConverter,
} from '../../utils/utils';
import {useSelector} from 'react-redux';
import CalendarList from './CalendarList';
import styles from './CustomCalendarStyle';
const CustomCalendar = props => {
  const {currentYear, currentMonth, currentDay} = currentDayMonthYear();
  const darkMode = useSelector(state => state.home.darkMode);
  const {onPress, selectedDayIndex, isLoading, selectedDay, updateData} =
    props || {};
  const [selectedMonth, setMonth] = useState(currentMonth);
  const [isShowYears, setShowYears] = useState(false);
  const [selectedYear, setYear] = useState(currentYear);
  let scrollPosition = 0;
  const listRef = useRef();
  const yearRef = useRef();
  const lastDayOfMonth = new Date(currentYear, selectedMonth + 1, 0).getDate();
  const selectedMonthNew =
    selectedMonth > 10 ? selectedMonth + 1 : `0${selectedMonth + 1}`;

  const onRowLayoutChange = (index, event) => {
    if (index <= selectedDayIndex) {
      scrollPosition = scrollPosition + event.nativeEvent.layout.x + 20;
      listRef?.current?.scrollToOffset({
        offset: scrollPosition,
        animated: true,
      });
    }
  };

  const arrowButton = ({
    onPress,
    opacity,
    iconName,
    isDisabled,
    style = {},
  }) => {
    return (
      <Pressable
        disabled={isDisabled}
        onPress={onPress}
        style={[
          styles.alignItemsCommon,
          {opacity},
          {
            backgroundColor: '#45f445d9',
            paddingVertical: 8,
            paddingHorizontal: 8,
            borderRadius: 6,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style,
        ]}>
        <MaterialIcons
          name={iconName}
          size={16}
          color={darkModeColor(darkMode)}
        />
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <View>
        {monthsArray.map((item, index) => {
          if (selectedMonth === index) {
            const opacityBack = index === 0 ? 0.5 : 1;
            const opacityForward = index === monthsArray.length - 1 ? 0.5 : 1;
            return (
              <View key={index} style={styles.monthContainerStyle}>
                {arrowButton({
                  isDisabled: index === 0,
                  iconName: 'arrow-back-ios',
                  opacity: opacityBack,
                  style: {paddingRight: 5},
                  onPress: () => {
                    const day = doubleDigitConverter(selectedDayIndex);
                    const month = doubleDigitConverter(index);
                    onPress(`${currentYear}-${month}-${day}`, selectedDayIndex);
                    setMonth(index - 1);
                  },
                })}
                <Text
                  style={[
                    styles.textStyle,
                    {color: darkModeColor(darkMode)},
                  ]}>{`${item}-${currentYear}`}</Text>
                {arrowButton({
                  isDisabled: monthsArray.length - 1 === index,
                  iconName: 'arrow-forward-ios',
                  opacity: opacityForward,
                  onPress: () => {
                    let monthItem = index + 1;
                    monthItem = monthItem + 1;
                    const day = doubleDigitConverter(selectedDayIndex);
                    const month = doubleDigitConverter(monthItem);
                    onPress(`${currentYear}-${month}-${day}`, selectedDayIndex);
                    setMonth(index + 1);
                  },
                })}
              </View>
            );
          }
          return null;
        })}
        <FlatList
          ref={listRef}
          data={Array.from(Array(lastDayOfMonth).keys()) || []}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          contentContainerStyle={{zIndex: 1}}
          renderItem={({item, index}) => {
            const day = index + 1 > 10 ? index + 1 : `0${index + 1}`;
            const backgroundColor =
              selectedDayIndex === item + 1
                ? Colors.emerald
                : Colors.transparent;
            const color =
              selectedDayIndex === item + 1
                ? Colors.white
                : darkModeColor(darkMode);

            return (
              <View
                key={index}
                onLayout={e => onRowLayoutChange(index, e)}
                style={[styles.alignItemsCommon, {marginLeft: 15}]}>
                <Pressable
                  onPress={() => {
                    onPress(
                      `${currentYear}-${selectedMonthNew}-${day}`,
                      item + 1,
                    );
                  }}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor,
                    },
                  ]}>
                  <Text style={[styles.textStyle, {color}]}>{item + 1}</Text>
                  {selectedDayIndex === currentDay ||
                  currentMonth !== selectedMonth ? null : currentDay ===
                    item + 1 ? (
                    <View style={styles.todayIndicator} />
                  ) : null}
                </Pressable>
                <Text
                  style={[
                    styles.monthYearText,
                    {color: darkModeColor(darkMode)},
                  ]}>
                  {
                    dayNameArray[
                      new Date(
                        `${currentYear}-${selectedMonth + 1}-${day}`,
                      ).getDay()
                    ]
                  }
                </Text>
              </View>
            );
          }}
        />
      </View>
      {/* <View style={styles.yearStyle}>
        {isShowYears ? (
          <View style={{backgroundColor: 'white', paddingHorizontal: 20}}>
            <FlatList
              ref={yearRef}
              showsVerticalScrollIndicator={false}
              data={Array.from(Array(100).keys()) || []}
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index}
              renderItem={({item, index}) => {
                let year = item + 1970;
                return (
                  <Pressable
                    onPress={() => {
                      setYear(year);
                      setShowYears(pre => !pre);
                    }}
                    style={{
                      marginTop: 10,
                      backgroundColor:
                        selectedYear === year
                          ? Colors.emerald
                          : Colors.transparent,
                    }}>
                    <Text
                      style={{
                        color:
                          selectedYear === year ? Colors.white : Colors.dune,
                      }}>
                      {year}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        ) : null}
      </View> */}
      <CalendarList {...props} />
      {/* {props?.data?.length ? (
        <CalendarList {...props} />
      ) : (
        <View style={{justifyContent: 'center', flex: 1, alignItems: 'center'}}>
          <Pressable
            onPress={() => {
              updateData(selectedDay, 'refreshing');
            }}>
            <MaterialIcons
              name="refresh"
              size={30}
              color={Colors.blueDarkColor}
            />
          </Pressable>
        </View>
      )} */}
    </View>
  );
};

export default CustomCalendar;
