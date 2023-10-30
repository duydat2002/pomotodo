import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {useActivedColors, useAppSelector} from '@/hooks';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {AntDesign, Feather, MaterialIcons, Octicons} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {COLORS_LIST} from '@/constants';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import {generatorId} from '@/utils';
import {IProject, IUser, ProjectsStackScreenProps} from '@/types';
import {useProject} from '@/hooks/useProject';
import AssigneeUserItem from '@/components/Task/AssigneeUserItem';
import FindColleague from '@/components/Task/FindColleague';
import UButton from '@/components/UI/UButton';
import {useNotification} from '@/hooks/useNotification';

const CreateProject = () => {
  const activedColors = useActivedColors();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateProject'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateProject'>['route']>();

  const {user} = useAppSelector(state => state.user);
  const {projects} = useAppSelector(state => state.projects);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {createProject, updateProject} = useProject();
  const {createNotification} = useNotification();

  const [project, setProject] = useState<IProject>({
    id: generatorId(),
    name: '',
    color: COLORS_LIST[0],
    totalTime: 0,
    remainingTime: 0,
    elapsedTime: 0,
    totalTask: 0,
    taskComplete: 0,
    ownerId: user!.id,
    team: [user!.id],
    createdAt: '',
  });
  const [teamInput, setTeamInput] = useState('');
  const [oldTeam, setOldTeam] = useState(['']);
  const [team, setTeam] = useState<IUser[]>([]);
  const [teamIds, setTeamIds] = useState([user!.id]);
  const [findTeam, setFindTeam] = useState<IUser[] | null>(null);
  const [error, setError] = useState('');
  const [validProject, setValidProject] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (route.params?.projectId) {
      const projectFilter = projects?.filter(
        item => item.id == route.params!.projectId,
      );

      if (!projectFilter || projectFilter.length == 0) {
        setValidProject(false);
      } else {
        const projectTemp = projectFilter[0];
        setProject(projectTemp);
        setOldTeam(projectTemp.team);

        const teamTemp: IUser[] = [user!];
        if (colleagues) {
          projectTemp.team.forEach(id => {
            const index = colleagues.findIndex(item => item.colleagueId == id);

            if (index != -1) {
              const colleague = colleagues[index];
              teamTemp.push({
                id: colleague.colleagueId,
                username: colleague.colleagueUsername,
                avatar: colleague.colleagueAvatar,
                email: colleague.colleagueEmail,
              });
            }
          });
        }
        setTeam(teamTemp);
      }
    } else {
      setTeam([user!]);
    }
    setIsLoading(false);
  }, [isFocused]);

  useEffect(() => {
    const colleaguesTemp: IUser[] | undefined = colleagues
      ?.filter(item => {
        if (teamInput.trim() != '' && item.isAccept) {
          return item.colleagueUsername
            .toLowerCase()
            .includes(teamInput.trim().toLowerCase());
        } else {
          return false;
        }
      })
      ?.map(item => ({
        id: item.colleagueId,
        username: item.colleagueUsername,
        avatar: item.colleagueAvatar,
        email: item.colleagueEmail,
      }));

    setFindTeam(
      colleaguesTemp && colleaguesTemp.length > 0 ? colleaguesTemp : null,
    );
  }, [teamInput]);

  useEffect(() => {
    const teamIdsTemp = team.map(item => item.id);
    setTeamIds(teamIdsTemp);
  }, [team]);

  const setName = (name: string) => {
    setProject({...project, name});
  };

  const setColor = (color: string) => {
    setProject({...project, color});
  };

  const hanldeSaveProject = async () => {
    if (project.name == '') {
      setError('Please enter project name');
    } else {
      if (route.params?.projectId) {
        updateProject(route.params.projectId, {
          name: project.name,
          color: project.color,
          team: teamIds,
        });
      } else {
        createProject({
          id: generatorId(),
          name: project.name,
          color: project.color,
          totalTime: 0,
          remainingTime: 0,
          elapsedTime: 0,
          totalTask: 0,
          taskComplete: 0,
          ownerId: user!.id,
          team: teamIds,
          createdAt: new Date().toISOString(),
        });
      }

      // Check add/ remove
      const promise: any[] = [];
      // Add
      teamIds.forEach(item => {
        if (item != user?.id && !oldTeam.includes(item)) {
          promise.push(
            createNotification({
              id: generatorId(),
              senderId: user!.id,
              senderUsername: user!.username,
              senderAvatar: user!.avatar,
              receiverId: item,
              type: 'assign',
              subType: 'add',
              isRead: false,
              content: 'added you to',
              projectId: project.id,
              projectName: project.name,
              createdAt: new Date().toISOString(),
            }),
          );
        }
      });

      // Delete
      oldTeam.forEach(item => {
        if (item != user?.id && !teamIds.includes(item)) {
          promise.push(
            createNotification({
              id: generatorId(),
              senderId: user!.id,
              senderUsername: user!.username,
              senderAvatar: user!.avatar,
              receiverId: item,
              type: 'assign',
              subType: 'remove',
              isRead: false,
              content: 'removed you from',
              projectId: project.id,
              projectName: project.name,
              createdAt: new Date().toISOString(),
            }),
          );
        }
      });

      await Promise.all(promise);
      navigation.navigate('Projects');
    }
  };

  const onDeleteTeam = (id: string) => {
    const teamTemp = team.filter(item => item.id != id);

    setTeam(teamTemp);
  };

  const onClickColleague = (colleague: IUser) => {
    const check = team.findIndex(item => item.id == colleague.id);

    if (check == -1) {
      setTeam([...team, colleague]);
    }

    setTeamInput('');
    setFindTeam(null);
  };

  if (!validProject) {
    return (
      <SafeView>
        <Header
          title={
            route.params?.projectId ? 'Edit Project' : 'Create New Project'
          }>
          {{
            leftChild: (
              <Feather
                name="x"
                size={24}
                color={activedColors.text}
                onPress={() => navigation.navigate('Projects')}
              />
            ),
          }}
        </Header>
        <View style={[common.container]}>
          <Text style={[common.text, {color: activedColors.text}]}>
            Project not found The project doesn't seem to exist or you don't
            have permission to access it.
          </Text>
        </View>
      </SafeView>
    );
  }

  return (
    <SafeView>
      <Header
        title={route.params?.projectId ? 'Edit Project' : 'Create New Project'}>
        {{
          leftChild: (
            <Feather
              name="x"
              size={24}
              color={activedColors.text}
              onPress={() => navigation.navigate('Projects')}
            />
          ),
          rightChild: (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('HomeStack', {screen: 'Colleagues'})
              }>
              <Octicons
                name="person-add"
                size={22}
                color={activedColors.text}
              />
            </TouchableOpacity>
          ),
        }}
      </Header>
      {isLoading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size={30} color={activedColors.textSec} />
        </View>
      ) : (
        <View style={[common.container]}>
          <UInput
            value={project.name}
            onChangeText={setName}
            placeholder="Projet name"
            style={{marginTop: 20}}>
            {{
              leftChild: (
                <View
                  style={[
                    styles.colorWrapperInput,
                    {backgroundColor: project.color},
                  ]}
                />
              ),
            }}
          </UInput>
          <Text
            style={[
              common.small,
              styles.errorText,
              {
                color: activedColors.error,
              },
            ]}>
            {error}
          </Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 20}}>
            {COLORS_LIST.map(item => (
              <View key={item} style={styles.itemWrapper}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setColor(item)}
                  style={[styles.colorItem, {backgroundColor: item}]}>
                  {project.color == item && (
                    <Feather name="check" size={24} color="#fff" />
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
          <View
            style={[
              styles.assigneeWrap,
              {backgroundColor: activedColors.input},
            ]}>
            <View style={styles.assigneeHeader}>
              <MaterialIcons
                name="groups"
                size={20}
                color={activedColors.textSec}
              />
              <Text
                style={[
                  common.text,
                  styles.title,
                  {color: activedColors.text},
                ]}>
                Team
              </Text>
              <Text style={[common.text, {color: activedColors.textSec}]}>
                {team.length}
              </Text>
            </View>
            <View
              style={{
                width: '100%',
                height: 2,
                marginTop: 4,
                backgroundColor: activedColors.background,
              }}
            />
            <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
              <AntDesign
                name="adduser"
                size={20}
                color={activedColors.textSec}
              />
              <View style={{flex: 1, width: 'auto', marginLeft: 8}}>
                <UInput
                  value={teamInput}
                  onChangeText={setTeamInput}
                  placeholder="Enter username..."
                />
                {findTeam && (
                  <FindColleague
                    findColleague={findTeam}
                    onClickColleague={onClickColleague}
                  />
                )}
              </View>
            </View>
            <ScrollView
              style={{
                height: 150,
                borderRadius: 8,
                backgroundColor: activedColors.background,
              }}>
              <View
                onStartShouldSetResponder={() => true}
                style={styles.assigneeList}>
                {team.map(item => (
                  <AssigneeUserItem
                    key={item.id}
                    user={item}
                    ownerId={user!.id}
                    onDelete={onDeleteTeam}
                  />
                ))}
              </View>
            </ScrollView>
          </View>
          <UButton
            primary
            style={{
              width: '100%',
              paddingHorizontal: 16,
              marginBottom: 10,
              marginTop: 'auto',
            }}
            onPress={hanldeSaveProject}>
            <Text style={[common.text, {color: '#fff'}]}>Save</Text>
          </UButton>
        </View>
      )}
    </SafeView>
  );
};

export default CreateProject;

const styles = StyleSheet.create({
  colorWrapperInput: {
    width: 20,
    height: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  itemWrapper: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  colorItem: {
    width: 40,
    height: 40,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: 6,
  },
  title: {
    flex: 1,
    marginLeft: 20,
  },
  assigneeWrap: {
    width: '100%',
    marginTop: 20,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  assigneeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  assigneeList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    padding: 16,
  },
});
