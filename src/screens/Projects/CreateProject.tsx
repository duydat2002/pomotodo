import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import {useActivedColors, useAppDispatch, useAppSelector} from '@/hooks';
import {useIsFocused, useNavigation, useRoute} from '@react-navigation/native';
import {AntDesign, Feather, MaterialIcons} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {EFontWeight} from '@/theme';
import {COLORS_LIST} from '@/constants';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import {generatorId, validateEmail} from '@/utils';
import {IColleague, IProject, IUser, ProjectsStackScreenProps} from '@/types';
import {useProject} from '@/hooks/useProject';
import AssigneeUserItem from '@/components/Task/AssigneeUserItem';
import FindColleague from '@/components/Task/FindColleague';
import {useNotification} from '@/hooks/useNotification';
import {useUser} from '@/hooks/useUser';
import {useColleague} from '@/hooks/useColleague';

const CreateProject = () => {
  const activedColors = useActivedColors();
  const isFocused = useIsFocused();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateProject'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'CreateProject'>['route']>();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {getUserByUsername} = useUser();
  const {createProject, updateProject} = useProject();
  const {addColleague} = useColleague();
  const {createNotification} = useNotification();

  const [project, setProject] = useState<IProject>({
    id: generatorId(),
    name: '',
    color: COLORS_LIST[0],
    totalTime: 0,
    elapsedTime: 0,
    totalTask: 0,
    taskComplete: 0,
    ownerId: user!.id,
    team: [user!.id],
    createdAt: '',
  });
  const [teamInput, setTeamInput] = useState('');
  const [team, setTeam] = useState<IUser[]>([]);
  const [teamIds, setTeamIds] = useState([user!.id]);
  const [findTeam, setFindTeam] = useState<IUser[] | null>(null);
  const [error, setError] = useState('');
  const [disableInvite, setDisableInvite] = useState(false);

  useEffect(() => {
    if (route.params?.project) {
      const project = route.params.project;
      setProject(project);

      const teamTemp: IUser[] = [user!];
      if (colleagues) {
        project.team.forEach(id => {
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
    } else {
      setTeam([user!]);
    }
  }, [isFocused]);

  useEffect(() => {
    const colleaguesTemp: IUser[] | undefined = colleagues
      ?.filter(item => {
        if (teamInput.trim() != '') {
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
      if (route.params?.project) {
        updateProject(route.params.project.id, {
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
          elapsedTime: 0,
          totalTask: 0,
          taskComplete: 0,
          ownerId: user!.id,
          team: teamIds,
          createdAt: new Date().toISOString(),
        });
      }
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

  const handleInvite = async () => {
    setDisableInvite(true);

    if (teamInput == user!.username) {
      ToastAndroid.show('It you!', ToastAndroid.SHORT);
    } else {
      let alreadyOnTeam = false;
      colleagues?.forEach(item => {
        if (item.colleagueUsername == teamInput) {
          ToastAndroid.show(
            'This user is already on your colleague!',
            ToastAndroid.SHORT,
          );
          alreadyOnTeam = true;
          return;
        }
      });

      if (!alreadyOnTeam) {
        const receiver = await getUserByUsername(teamInput);

        if (!receiver) {
          ToastAndroid.show('This user was not found!', ToastAndroid.SHORT);
        } else {
          await addColleague({
            id: generatorId(),
            userId: user!.id,
            colleagueId: receiver.id,
            colleagueUsername: receiver.username,
            colleagueAvatar: receiver.avatar,
            colleagueEmail: receiver.email,
            isAccept: false,
          });
          await createNotification({
            id: generatorId(),
            senderId: user!.id,
            senderUsername: user!.username,
            senderAvatar: user!.avatar,
            receiverId: receiver.id,
            type: 'invite',
            isRead: false,
            isResponded: false,
            content: 'invited you to team',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    setDisableInvite(false);
  };

  return (
    <SafeView>
      <Header
        title={route.params?.project ? 'Edit Project' : 'Create New Project'}>
        {{
          leftChild: (
            <Feather
              name="x"
              size={24}
              color={activedColors.text}
              onPress={() => navigation.goBack()}
            />
          ),
          rightChild: (
            <TouchableOpacity onPress={hanldeSaveProject}>
              <Text
                style={[
                  common.text,
                  {
                    color: activedColors.primaryDark,
                    fontWeight: EFontWeight.semibold,
                  },
                ]}>
                {route.params?.project ? 'Edit' : 'Create'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      </Header>
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
          style={[styles.assigneeWrap, {backgroundColor: activedColors.input}]}>
          <View style={styles.assigneeHeader}>
            <MaterialIcons
              name="groups"
              size={20}
              color={activedColors.textSec}
            />
            <Text
              style={[common.text, styles.title, {color: activedColors.text}]}>
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
            <AntDesign name="adduser" size={20} color={activedColors.textSec} />
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
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleInvite}
              disabled={disableInvite}>
              <Text
                style={[
                  common.text,
                  {
                    color: disableInvite
                      ? activedColors.primaryLight
                      : activedColors.primaryDark,
                  },
                ]}>
                Invite
              </Text>
            </TouchableOpacity>
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
      </View>
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
