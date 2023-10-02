import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import {IColleague, IUser} from '@/types';
import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

interface IProps {
  colleague: IColleague;
}

const ColleagueItem: React.FC<IProps> = ({colleague}) => {
  const activedColors = useActivedColors();

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
      }}>
      <Image
        source={
          colleague.colleagueAvatar
            ? {
                uri: colleague.colleagueAvatar,
              }
            : require('@/assets/images/default-avatar.png')
        }
        style={{width: 50, height: 50, borderRadius: 50}}
      />
      <View style={{flex: 1, marginHorizontal: 16}}>
        <Text style={[common.text, {color: activedColors.text}]}>
          {colleague.colleagueUsername}
        </Text>
        <Text style={[common.small, {color: activedColors.textSec}]}>
          {colleague.colleagueEmail}
        </Text>
      </View>
      {!colleague.isAccept && (
        <Text style={[common.text, {color: activedColors.error}]}>Pending</Text>
      )}
    </View>
  );
};

export default ColleagueItem;

const styles = StyleSheet.create({});
