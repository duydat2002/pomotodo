import React, {useState, useEffect} from 'react';
import SafeView from '@/components/Layout/SafeView';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  FlatList,
} from 'react-native';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import {common} from '@/assets/styles';
import {useActivedColors, useAppSelector} from '@/hooks';
import {generatorId, validateEmail} from '@/utils';
import {useNotification} from '@/hooks/useNotification';
import {useUser} from '@/hooks/useUser';
import ColleagueItem from '@/components/Home/ColleagueItem';
import {useColleague} from '@/hooks/useColleague';

const Colleagues: React.FC = () => {
  const activedColors = useActivedColors();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const {createNotification} = useNotification();
  const {addColleague} = useColleague();
  const {getUserByUsername} = useUser();

  const [username, setUsername] = useState('');
  const [disable, setDisable] = useState(false);

  const handleInvite = async () => {
    setDisable(true);

    if (username == user!.username) {
      ToastAndroid.show('It you!', ToastAndroid.SHORT);
    } else {
      let alreadyOnTeam = false;
      colleagues?.forEach(item => {
        if (item.colleagueUsername == username) {
          ToastAndroid.show(
            'This user is already on your colleague!',
            ToastAndroid.SHORT,
          );
          alreadyOnTeam = true;
          return;
        }
      });

      if (!alreadyOnTeam) {
        const receiver = await getUserByUsername(username);

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
            subType: 'invite',
            isRead: false,
            isResponded: false,
            content: 'invited you to team',
            createdAt: new Date().toISOString(),
          });
        }
      }
    }

    setDisable(false);
  };

  return (
    <SafeView>
      <Header hasBack title="Colleagues"></Header>
      <View style={[common.container]}>
        <View
          style={{width: '100%', flexDirection: 'row', alignItems: 'center'}}>
          <UInput
            style={{flex: 1}}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username">
            {{
              rightChild: (
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleInvite}
                  disabled={disable}>
                  <Text
                    style={[
                      common.text,
                      {
                        color: disable
                          ? activedColors.primaryLight
                          : activedColors.primaryDark,
                      },
                    ]}>
                    Invite
                  </Text>
                </TouchableOpacity>
              ),
            }}
          </UInput>
        </View>
        <View style={{flex: 1, width: '100%', marginTop: 20}}>
          <FlatList
            data={colleagues}
            renderItem={colleague => (
              <ColleagueItem colleague={colleague.item} />
            )}
          />
        </View>
      </View>
    </SafeView>
  );
};

export default Colleagues;

const styles = StyleSheet.create({});
