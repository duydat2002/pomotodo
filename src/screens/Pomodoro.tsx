import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import Header from '@/components/Header';
import SafeView from '@/components/SafeView';

const Pomodoro = () => {
  const activedColors = useActivedColors();
  return (
    <SafeView>
      <Header leftIcon={'chevron-left'} title={'Sign Up'} />
      <Text style={{color: activedColors.text}}>Pomodoro</Text>
    </SafeView>
  );
};

export default Pomodoro;

const styles = StyleSheet.create({});
