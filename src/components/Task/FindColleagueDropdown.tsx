import {AntDesign} from '@expo/vector-icons';
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleProp,
  ViewStyle,
  FlatList,
} from 'react-native';
import {useActivedColors, useAppSelector} from '@/hooks';
import {IUser} from '@/types';
import UDropdown from '../UI/UDropdown';
import {common} from '@/assets/styles';
import {TouchableHighlight} from 'react-native-gesture-handler';

interface IProps {
  assigneeUser: IUser | null;
  projectColleagues: IUser[];
  onClickColleague: (colleague: IUser | null) => void;
  activeFindColleague: boolean;
  setActiveFindColleague: (value: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const FindColleagueDropdown: React.FC<IProps> = ({
  activeFindColleague,
  setActiveFindColleague,
  style,

  assigneeUser,
  projectColleagues,
  onClickColleague,
}) => {
  const activedColors = useActivedColors();

  // const [findColleague, setFindColleague] = useState<IUser[] | null>(null);
  // const [searchInput, setSearchInput] = useState('d');

  // useEffect(() => {
  //   const colleaguesTemp: IUser[] | undefined = projectColleagues?.filter(
  //     item => {
  //       if (searchInput.trim() != '') {
  //         return item.username
  //           .toLowerCase()
  //           .includes(searchInput.trim().toLowerCase());
  //       } else {
  //         return false;
  //       }
  //     },
  //   );

  //   setFindColleague(
  //     colleaguesTemp && colleaguesTemp.length > 0 ? colleaguesTemp : null,
  //   );
  // }, [searchInput]);

  return (
    <UDropdown
      active={activeFindColleague}
      style={[{right: 0, zIndex: 1000}, style]}>
      {{
        header: assigneeUser ? (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setActiveFindColleague(!activeFindColleague)}>
            <Image
              source={
                assigneeUser?.avatar
                  ? {
                      uri: assigneeUser.avatar,
                    }
                  : require('@/assets/images/default-avatar.png')
              }
              style={{width: 25, height: 25, borderRadius: 25}}
            />
            <Text
              style={[
                common.text,
                {marginLeft: 10, color: activedColors.textSec},
              ]}>
              {assigneeUser?.username}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            onPress={() => setActiveFindColleague(!activeFindColleague)}>
            <Text
              style={[
                common.text,
                {paddingVertical: 2, color: activedColors.textSec},
              ]}>
              Unassigned
            </Text>
          </TouchableOpacity>
        ),
        dropdown: (
          <View
            style={[
              common.shadow,
              {
                width: 200,
                backgroundColor: activedColors.modal,
                borderRadius: 8,
              },
            ]}>
            <TouchableHighlight
              style={{flex: 1}}
              underlayColor={activedColors.backgroundSec}
              onPress={() => onClickColleague(null)}>
              <View style={styles.item}>
                <Text
                  style={[
                    common.text,
                    {paddingVertical: 4, color: activedColors.text},
                  ]}>
                  Unassigned
                </Text>
              </View>
            </TouchableHighlight>
            <FlatList
              onStartShouldSetResponder={() => true}
              keyExtractor={item => item.id}
              data={projectColleagues}
              renderItem={colleague => (
                <TouchableHighlight
                  underlayColor={activedColors.backgroundSec}
                  onPress={() => onClickColleague(colleague.item)}>
                  <View style={styles.item}>
                    <Image
                      source={
                        colleague.item.avatar
                          ? {
                              uri: colleague.item.avatar,
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
                      {colleague.item.username}
                    </Text>
                  </View>
                </TouchableHighlight>
              )}
            />
          </View>
        ),
      }}
    </UDropdown>
  );
};

export default FindColleagueDropdown;

const styles = StyleSheet.create({
  item: {
    flex: 1,
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
