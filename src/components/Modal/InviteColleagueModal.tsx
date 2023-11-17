import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import UModal from './UModal';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import UButton from '../UI/UButton';
import {IUser} from '@/types';

interface IProps {
  visible: boolean;
  user: IUser;
  loadingInvite: boolean;
  onInvite: () => void;
  onClose: () => void;
}

const InviteColleagueModal: React.FC<IProps> = ({
  visible,
  user,
  loadingInvite,
  onInvite,
  onClose,
}) => {
  const activedColors = useActivedColors();

  return (
    <UModal visible={visible} onClickOutside={onClose}>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text
            style={[
              common.text,
              {fontWeight: '700', marginBottom: 4, color: activedColors.text},
            ]}>
            Do you want to send a colleague invitation to this user?
          </Text>
          <View style={{width: '100%', marginTop: 20, alignItems: 'center'}}>
            <Image
              source={
                user.avatar
                  ? {
                      uri: user.avatar,
                    }
                  : require('@/assets/images/default-avatar.png')
              }
              style={{width: 150, height: 150, borderRadius: 150}}
            />
            <Text
              style={[
                common.subTitle,
                {
                  flexGrow: 1,
                  flexShrink: 1,
                  marginLeft: 4,
                  marginRight: 8,
                  color: activedColors.text,
                },
              ]}
              numberOfLines={1}>
              {user.username}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton
            primary
            style={{flex: 1}}
            onPress={onInvite}
            loading={loadingInvite}>
            <Text style={[common.text, {color: '#fff'}]}>Invite</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default InviteColleagueModal;

const styles = StyleSheet.create({});
