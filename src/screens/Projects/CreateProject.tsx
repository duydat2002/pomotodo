import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  useActivedColors,
  useAppDispatch,
  useAppSelector,
  useProject,
} from '@/hooks';
import {useNavigation} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {EFontWeight} from '@/theme';
import {COLORS_LIST} from '@/constants';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import {addProject} from '@/store/projects.slice';
import {generatorId} from '@/utils';
import {ProjectsStackScreenProps} from '@/types';

const CreateProject = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'CreateProject'>['navigation']>();
  const dispatch = useAppDispatch();

  const {user} = useAppSelector(state => state.user);
  const {netInfo} = useAppSelector(state => state.netInfo);
  const {projects} = useAppSelector(state => state.projects);

  const [name, setName] = useState('');
  const [color, setColor] = useState(COLORS_LIST[0]);
  const [error, setError] = useState('');

  const hanldeCreateProject = async () => {
    if (name == '') {
      setError('Please enter project name');
    } else {
      dispatch(
        addProject({
          id: generatorId(),
          name,
          color,
          totalTime: 0,
          elapsedTime: 0,
          totalTask: 0,
          taskComplete: 0,
          ownerId: user!.id,
          createdAt: new Date(),
        }),
      );
      navigation.navigate('Projects');
    }
  };

  return (
    <SafeView>
      <Header title="Create New Project">
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
            <TouchableOpacity onPress={hanldeCreateProject}>
              <Text
                style={[
                  common.text,
                  {
                    color: activedColors.primaryDark,
                    fontWeight: EFontWeight.semibold,
                  },
                ]}>
                Done
              </Text>
            </TouchableOpacity>
          ),
        }}
      </Header>
      <View style={[common.container]}>
        <UInput
          value={name}
          onChangeText={setName}
          placeholder="Projet name"
          style={{marginTop: 20}}>
          {{
            leftChild: (
              <View
                style={[
                  styles.colorWrapperInput,
                  {
                    backgroundColor: color,
                  },
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
                style={[
                  styles.colorItem,
                  {
                    backgroundColor: item,
                  },
                ]}>
                {color == item && (
                  <Feather name="check" size={24} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
          ))}
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
});
