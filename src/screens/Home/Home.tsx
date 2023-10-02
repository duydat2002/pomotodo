import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';
import {useActivedColors, useAppSelector} from '@/hooks';
import {Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {HomeStackScreenProps} from '@/types';

const Home = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<HomeStackScreenProps<'Home'>['navigation']>();

  const {user} = useAppSelector(state => state.user);
  const {hasNewNotification} = useAppSelector(state => state.notifications);

  if (!user) return <View />;

  return (
    <SafeView>
      <Header title={user.username}>
        {{
          leftChild: (
            <Image
              source={
                user.avatar
                  ? {
                      uri: user.avatar,
                    }
                  : require('@/assets/images/default-avatar.png')
              }
              style={{width: 25, height: 25, borderRadius: 25}}
            />
          ),
          rightChild: (
            <View style={{flexDirection: 'row', gap: 15}}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('Colleagues');
                }}>
                <MaterialIcons
                  name="groups"
                  size={24}
                  color={activedColors.text}
                />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('Notification');
                }}>
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color={activedColors.text}
                />
                {hasNewNotification && (
                  <View
                    style={{
                      position: 'absolute',
                      width: 8,
                      height: 8,
                      borderRadius: 8,
                      backgroundColor: activedColors.error,
                      top: 2,
                      right: 2,
                    }}
                  />
                )}
              </TouchableOpacity>
            </View>
          ),
        }}
      </Header>
      <View style={{flex: 1, width: '100%', marginTop: 20}}></View>
    </SafeView>
  );
};

export default Home;

const styles = StyleSheet.create({});
