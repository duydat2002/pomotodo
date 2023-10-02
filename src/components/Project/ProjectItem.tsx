import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
} from 'react-native';
import {useActivedColors} from '@/hooks';
import {common} from '@/assets/styles';
import {secondsFormatToHM} from '@/utils';
import SwipeableItem, {
  useSwipeableItemParams,
} from 'react-native-swipeable-item';
import {IProject} from '@/types';
import {AntDesign, FontAwesome} from '@expo/vector-icons';

interface IProps {
  item: IProject;
  onPress?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectItem: React.FC<IProps> = ({item, onPress, onEdit, onDelete}) => {
  const activedColors = useActivedColors();

  return (
    <SwipeableItem
      key={item.id}
      item={item}
      renderUnderlayLeft={() => (
        <UnderlayLeft onEdit={onEdit} onDelete={onDelete} />
      )}
      snapPointsLeft={[100]}>
      <TouchableHighlight
        underlayColor={activedColors.backgroundSec}
        activeOpacity={0.7}
        onPress={onPress}>
        <View
          style={[styles.item, {backgroundColor: activedColors.background}]}>
          <View style={[styles.color, {backgroundColor: item.color}]}></View>
          <Text style={[common.text, {color: activedColors.text, flex: 1}]}>
            {item.name}
          </Text>
          <Text style={[common.small, {color: activedColors.textSec}]}>
            {secondsFormatToHM(item.totalTime)}
          </Text>
          <Text
            style={[
              common.small,
              {color: activedColors.textSec, marginLeft: 10},
            ]}>
            {item.totalTask}
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
    height: 50,
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
