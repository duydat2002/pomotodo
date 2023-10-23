import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {BarChart, LineChart, PieChart} from 'react-native-gifted-charts';

const FocusTimeChart = () => {
  const data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];

  return (
    <View>
      <BarChart data={data} />
      <LineChart data={data} />
      <PieChart data={data} />
    </View>
  );
};

export default FocusTimeChart;

const styles = StyleSheet.create({});
