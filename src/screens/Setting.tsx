import SafeView from '@/components/Layout/SafeView';
import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import QRCode from 'react-qr-code';

const Setting = () => {
  const [value, setValue] = useState('Hello');

  return (
    <SafeView>
      <Text>Setting</Text>
      <View style={{width: 300, height: 300, marginVertical: 30}}>
        <QRCode value={value} size={300} />
      </View>
      <Text
        onPress={() =>
          setValue(
            value == 'Hello' ? JSON.stringify({name: 'cac', age: 21}) : 'Hello',
          )
        }>
        Change
      </Text>
    </SafeView>
  );
};

export default Setting;

const styles = StyleSheet.create({});
