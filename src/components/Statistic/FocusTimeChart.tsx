import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';

const FocusTimeChart = () => {
  const data = [{value: 50}];

  return (
    <View>
      <BarChart data={data} />
    </View>
  );
};

export default FocusTimeChart;

const styles = StyleSheet.create({});
