import React, {useState, useEffect} from 'react';
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
import moment from 'moment';

const Home: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<HomeStackScreenProps<'Home'>['navigation']>();
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);
  const {tasks} = useAppSelector(state => state.tasks);
  const {hasNewNotification} = useAppSelector(state => state.notifications);

  const [totalProject, setTotalProject] = useState(0);
  const [totalTask, setTotalTask] = useState(0);
  const [dailyTask, setDailyTask] = useState(0);
  const [remainingTask, setRemainingTask] = useState(0);

  useEffect(() => {
    setTotalProject(projects?.length || 0); //Tổng số project
    setTotalTask(tasks?.length || 0); //Tổng số task

    let dailyTaskTemp = 0;
    let remainingTaskTemp = 0;
    tasks?.forEach(task => {
      if (task.deadline && moment(task.deadline).isSame(moment(), 'day'))
        dailyTaskTemp++;
      if (!task.isDone) remainingTaskTemp++;
    });
    setDailyTask(dailyTaskTemp); // Số task có deadline hôm nay
    setRemainingTask(remainingTaskTemp); //Số task chưa hoàn thành
  }, [projects, tasks]);

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
        {/* Thêm tổng số project, tổng số task */}
        <View style={{flexDirection: 'row', gap: 10}}>
          <View style={[styles.statBox, {backgroundColor: '#bacfff'}]}>
            <Text style={[common.text, {fontWeight: '600', color: '#fff'}]}>
              {'Total Projects'}
            </Text>
            <Text style={[common.text, {color: '#fff'}]}>
              {totalProject} projects
            </Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: '#fafafa'}]}>
            <Text style={[common.text, {fontWeight: '600', color: '#000'}]}>
              {'Total Tasks'}
            </Text>
            <Text style={[common.text, {color: '#000'}]}>
              {totalTask} tasks
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 10, marginTop: 15}}>
          <View style={[styles.statBox, {backgroundColor: '#fafafa'}]}>
            <Text style={[common.text, {fontWeight: '600', color: '#000'}]}>
              {'Daily Task(s)'}
            </Text>
            <Text style={[common.text, {color: '#000'}]}>
              {dailyTask} tasks
            </Text>
          </View>
          <View style={[styles.statBox, {backgroundColor: '#bacfff'}]}>
            <Text style={[common.text, {fontWeight: '600', color: '#fff'}]}>
              {'Remaining'}
            </Text>
            <Text style={[common.text, {color: '#fff'}]}>
              {remainingTask} tasks
            </Text>
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
