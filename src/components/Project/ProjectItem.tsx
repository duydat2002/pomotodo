import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useActivedColors, useAppSelector} from '@/hooks';
import {common} from '@/assets/styles';
import {secondsFormatToHM} from '@/utils';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import {IProject, IUser} from '@/types';
import {AntDesign, FontAwesome} from '@expo/vector-icons';

interface IProps {
  project: IProject;
  onPress?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectItem: React.FC<IProps> = ({
  project,
  onPress,
  onEdit,
  onDelete,
}) => {
  const activedColors = useActivedColors();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const [teamText, setTeamText] = useState('');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    setHasPermission(false);
    let ownerUsername = '';

    if (project.ownerId == user?.id) {
      ownerUsername = 'you';
      setHasPermission(true);
    } else if (colleagues) {
      const owner = colleagues.filter(
        item => item.colleagueId == project.ownerId,
      );
      if (owner.length != 0) ownerUsername = owner[0].colleagueUsername;
    }

    if (project.team.length == 1) {
      setTeamText(ownerUsername);
    } else {
      setTeamText(`${ownerUsername} and ${project.team.length - 1} other(s)`);
    }
  }, [project]);

  return (
    <SwipeableItem
      key={project.id}
      item={project}
      renderUnderlayLeft={() => (
        <UnderlayLeft onEdit={onEdit} onDelete={onDelete} />
      )}
      snapPointsLeft={[hasPermission ? 100 : 0]}>
      <TouchableHighlight
        underlayColor={activedColors.backgroundSec}
        activeOpacity={0.7}
        onPress={onPress}>
        <View
          style={[styles.item, {backgroundColor: activedColors.background}]}>
          <View style={[styles.color, {backgroundColor: project.color}]}></View>
          <View style={{flex: 1}}>
            <Text style={[common.text, {color: activedColors.text}]}>
              {project.name}
            </Text>
            <Text style={[common.small, {color: activedColors.textSec}]}>
              {teamText}
            </Text>
          </View>
          <Text style={[common.small, {color: activedColors.textSec}]}>
            {secondsFormatToHM(project.totalTime)}
          </Text>
          <Text
            style={[
              common.small,
              {color: activedColors.textSec, marginLeft: 10},
            ]}>
            {project.totalTask}
          </Text>
        </View>
      </TouchableHighlight>
    </SwipeableItem>
  );
};

export default ProjectItem;

interface IUnderlayLeftProps {
  onEdit: () => void;
  onDelete: () => void;
}
const UnderlayLeft: React.FC<IUnderlayLeftProps> = ({onEdit, onDelete}) => {
  const activedColors = useActivedColors();
  const {close} = useSwipeableItemParams<IProps>();

  const handleEdit = () => {
    onEdit();
    close();
  };

  const handleDelete = () => {
    onDelete();
    close();
  };

  return (
    <View style={{flex: 1, alignSelf: 'flex-end'}}>
      <View style={styles.underleftWrapper}>
        <TouchableOpacity style={styles.button} onPress={handleEdit}>
          <AntDesign name="edit" size={20} color={activedColors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <FontAwesome name="trash-o" size={20} color={activedColors.text} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    // height: 50,
  },
  color: {
    width: 16,
    height: 16,
    borderRadius: 16,
    marginRight: 8,
  },

  underleftWrapper: {
    width: 100,
    height: '100%',
    flexDirection: 'row',
  },
  button: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
