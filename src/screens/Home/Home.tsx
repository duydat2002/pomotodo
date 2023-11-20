import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import {
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {HomeStackScreenProps} from '@/types';
import {common} from '@/assets/styles';
import ProjectItemBox from '@/components/Project/ProjectItemBox';
import {setProject} from '@/store/projects.slice';

const Home: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<HomeStackScreenProps<'Home'>['navigation']>();
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);
  const {hasNewNotification} = useAppSelector(state => state.notifications);

  const handleClickProjectItem = (projectId: string) => {
    if (projects) {
      const index = projects.findIndex(item => item.id == projectId);
      const project = index != -1 ? projects[index] : null;
      dispatch(setProject(project));
    }
    navigation.navigate('ProjectsStack', {
      screen: 'Tasks',
      params: {projectId},
      initial: false,
    });
  };

  if (!user) return <View />;

  return (
    <SafeView hasDismissKeyboard={false}>
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
      <ScrollView
        style={{flex: 1, width: '100%', marginTop: 20, paddingHorizontal: 16}}>
        <View style={{flexDirection: 'row', gap: 10}}>
          <View style={[styles.statBox, {backgroundColor: '#bacfff'}]}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome5 name="tasks" size={22} color="#fff" />
              <Text
                style={[
                  common.text,
                  {fontWeight: '600', marginLeft: 10, color: '#fff'},
                ]}>
                {'Daily Task(s)'}
              </Text>
            </View>
            <Text style={[common.text, {color: '#fff'}]}>12 tasks</Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: '#fafafa'}]}>
            <View style={{flexDirection: 'row'}}>
              <FontAwesome name="spinner" size={24} color="#000" />
              <Text
                style={[
                  common.text,
                  {fontWeight: '600', marginLeft: 10, color: '#000'},
                ]}>
                {'In Progress'}
              </Text>
            </View>
            <Text style={[common.text, {color: '#000'}]}>9 tasks</Text>
          </View>
        </View>
        <Text
          style={[
            common.subTitle,
            {marginVertical: 20, color: activedColors.text},
          ]}>
          My Projects
        </Text>
        <View
          style={{
            flexWrap: 'wrap',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {projects ? (
            projects.map(project => (
              <ProjectItemBox
                key={project.id}
                project={project}
                onPress={handleClickProjectItem}
              />
            ))
          ) : (
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={[common.text, {color: activedColors.text}]}>
                You don't have any project yet.
              </Text>
              <Text style={[common.text, {color: activedColors.text}]}>
                {"Let's create a "}
                <Text
                  style={[
                    common.text,
                    {color: activedColors.primary, fontWeight: '600'},
                  ]}
                  onPress={() =>
                    navigation.navigate('ProjectsStack', {
                      screen: 'CreateProject',
                      initial: false,
                    })
                  }>
                  new project
                </Text>
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeView>
  );
};

export default Home;

const styles = StyleSheet.create({
  statBox: {
    flex: 1,
    borderRadius: 10,
    padding: 16,
  },
});
