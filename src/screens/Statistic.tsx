import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import SafeView from '@/components/SafeView';
import {useAppSelector} from '@/hooks';
import NetInfo from '@react-native-community/netinfo';

const Statistic = () => {
  const {netInfo} = useAppSelector(state => state.netInfo);
  const test = async () => {
    console.log(netInfo);

    const net = await NetInfo.fetch();

    console.log(net);
  };

  return (
    <SafeView>
      <Text onPress={test}>Statistic</Text>
    </SafeView>
  );
};

export default Statistic;

const styles = StyleSheet.create({});
