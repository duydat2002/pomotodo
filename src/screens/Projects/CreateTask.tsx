import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {Feather} from '@expo/vector-icons';
import {useActivedColors} from '@/hooks';
import {useNavigation} from '@react-navigation/native';
import SafeView from '@/components/SafeView';
import Header from '@/components/Header';
import {common} from '@/assets/styles';
import {ProjectsStackScreenProps} from '@/types/navigation';

const CreateTask = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateTask'>['navigation']>();

  return (
    <SafeView>
      <Header title="Create Task">
        {{
          leftChild: (
            <Feather
              name="x"
              size={24}
              color={activedColors.text}
              onPress={() => navigation.goBack()}
            />
          ),
        }}
      </Header>
      <View style={[common.container]}>
        <ScrollView></ScrollView>
      </View>
    </SafeView>
  );
};

export default CreateTask;

const styles = StyleSheet.create({});
