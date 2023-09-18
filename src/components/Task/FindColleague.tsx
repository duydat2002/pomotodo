import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import {IColleague} from '@/types';

interface IProps {
  findColleague: IColleague[];
  onClickColleague: (colleague: IColleague) => void;
}

const FindColleague: React.FC<IProps> = ({findColleague, onClickColleague}) => {
  const activedColors = useActivedColors();

  return (
    <View
      style={[
        common.shadow,
        styles.wrapper,
        {backgroundColor: activedColors.background},
      ]}>
      <FlatList
        onStartShouldSetResponder={() => true}
        data={findColleague}
        renderItem={colleague => (
          <TouchableHighlight
            underlayColor={activedColors.backgroundSec}
            onPress={() => onClickColleague(colleague.item)}>
            <View style={styles.item}>
              <Image
                source={
                  colleague.item.colleagueAvatar
                    ? {
                        uri: colleague.item.colleagueAvatar,
                      }
                    : require('@/assets/images/default-avatar.png')
                }
                style={styles.image}
              />
              <Text
                style={{
                  marginLeft: 4,
                  marginVertical: 8,
                  color: activedColors.text,
                }}>
                {colleague.item.colleagueUsername}
              </Text>
            </View>
          </TouchableHighlight>
        )}
      />
    </View>
  );
};

export default FindColleague;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: '100%',
    left: 0,
    right: 0,
    maxHeight: 150,
    borderRadius: 8,
    paddingVertical: 8,
    zIndex: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  image: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
});
