import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Projects = () => {
  const navigation = useNavigation();

  return (
    <View style={{backgroundColor: '#333', flex: 1}}>
      <Text>Projects</Text>
      <Pressable
        onPress={() => {
          navigation.navigate('Tasks' as never);
        }}>
        <Text>Tasks</Text>
      </Pressable>
    </View>
  );
};

export default Projects;

const styles = StyleSheet.create({});
