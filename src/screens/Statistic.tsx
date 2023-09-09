import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import SafeView from '@/components/Layout/SafeView';
import CalendarPicker, {
  CustomDatesStylesFunc,
  DateChangedCallback,
} from 'react-native-calendar-picker';
import {useActivedColors, useAppSelector} from '@/hooks';
import {common} from '@/assets/styles';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import moment, {Moment} from 'moment';

const Statistic = () => {
  const activedColors = useActivedColors();
  const {theme} = useAppSelector(state => state.theme);

  const [key, setKey] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Moment | null>(null);

  const onDateChange: DateChangedCallback = date => {
    setSelectedDate(date);
  };

  useEffect(() => {
    setKey(Math.random());
  }, [theme]);

  return (
    <SafeView>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text
            style={[
              common.text,
              {fontWeight: '700', marginBottom: 4, color: activedColors.text},
            ]}>
            Deadline
          </Text>
          <Text style={[common.text, {color: activedColors.text}]}>
            {selectedDate?.format('dddd, D MMMM') || 'Someday'}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 15,
          }}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(moment())}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#3cb44b',
              }}>
              <Feather name="sun" size={20} color="#fff" />
            </View>
            <Text style={{color: activedColors.text}}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(moment().add(1, 'day'))}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f58231',
              }}>
              <MaterialCommunityIcons
                name="weather-sunset"
                size={20}
                color="#fff"
              />
            </View>
            <Text style={{color: activedColors.text}}>Tomorow</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(moment().add(7, 'day'))}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#93b0f3',
              }}>
              <MaterialCommunityIcons
                name="calendar-arrow-right"
                size={20}
                color="#fff"
              />
            </View>
            <Text style={{color: activedColors.text}}>Next week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(null)}
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 40,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#5249ca',
              }}>
              <MaterialCommunityIcons
                name="calendar-month"
                size={20}
                color="#fff"
              />
            </View>
            <Text style={{color: activedColors.text}}>Someday</Text>
          </TouchableOpacity>
        </View>
        <View>
          <CalendarPicker
            key={key}
            onDateChange={onDateChange}
            selectedStartDate={selectedDate?.toDate()}
            startFromMonday
            textStyle={{color: activedColors.text}}
            todayBackgroundColor="#3cb44b"
            // todayTextStyle={{color: activedColors.primary}}
            selectedDayColor={activedColors.primary}
            selectedDayTextColor="#fff"
            previousComponent={
              <Feather
                name="chevron-left"
                size={24}
                color={activedColors.text}
              />
            }
            nextComponent={
              <Feather
                name="chevron-right"
                size={24}
                color={activedColors.text}
              />
            }
          />
        </View>
      </View>
    </SafeView>
  );
};

export default Statistic;

const styles = StyleSheet.create({});
