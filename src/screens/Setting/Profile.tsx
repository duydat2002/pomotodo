import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const Profile = () => {
  return (
    <SafeView>
      <Header title={'Profile'} hasBack />
      <View style={{flex: 1, width: '100%'}}></View>
    </SafeView>
  );
};

export default Profile;

const styles = StyleSheet.create({});
