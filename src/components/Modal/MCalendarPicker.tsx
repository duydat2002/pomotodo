import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import UButton from '../UI/UButton';
import {Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import CalendarPicker, {
  DateChangedCallback,
} from 'react-native-calendar-picker';
import moment, {Moment} from 'moment';

interface IProps {
  onClickOutside?: () => void;
  onClose: () => void;
  onSave: (date: Date | null) => void;
}

const MCalendarPicker: React.FC<IProps> = ({
  onClickOutside,
  onClose,
  onSave,
}) => {
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
    <UModal visible onClickOutside={onClickOutside}>
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
        <View style={[styles.pickContainer]}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(moment())}
            style={[styles.flexCenter]}>
            <View style={[styles.pickItem, {backgroundColor: '#3cb44b'}]}>
              <Feather name="sun" size={20} color="#fff" />
            </View>
            <Text style={{color: activedColors.text}}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setSelectedDate(moment().add(1, 'day'))}
            style={[styles.flexCenter]}>
            <View style={[styles.pickItem, {backgroundColor: '#f58231'}]}>
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
            style={[styles.flexCenter]}>
            <View style={[styles.pickItem, {backgroundColor: '#93b0f3'}]}>
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
            style={[styles.flexCenter]}>
            <View style={[styles.pickItem, {backgroundColor: '#5249ca'}]}>
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
        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton
            primary
            style={{flex: 1}}
            onPress={() => onSave(selectedDate?.toDate() || null)}>
            <Text style={[common.text, {color: '#fff'}]}>Done</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default MCalendarPicker;

const styles = StyleSheet.create({
  flexCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    marginBottom: 20,
  },
  pickItem: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
});
