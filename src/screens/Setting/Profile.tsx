import React, {useState, useEffect} from 'react';
import Header from '@/components/Layout/Header';
import SafeView from '@/components/Layout/SafeView';
import UInput from '@/components/UI/UInput';
import {useActivedColors, useAppSelector} from '@/hooks';
import {MaterialIcons} from '@expo/vector-icons';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import UButton from '@/components/UI/UButton';
import {common} from '@/assets/styles';
import * as ImagePicker from 'expo-image-picker';
import {useStorage} from '@/hooks/useStorage';
import {useUser} from '@/hooks/useUser';

const Profile = () => {
  const activedColors = useActivedColors();

  const {user} = useAppSelector(state => state.user);

  const [uriAvatar, setUriAvatar] = useState('');
  const [username, setUsername] = useState('');
  const [errUsername, setErrUsername] = useState('');
  const [fullname, setFullname] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser, getUserByUsername} = useUser();
  const {setUserAvatar} = useStorage();

  useEffect(() => {
    if (user) {
      setUriAvatar(user.avatar || '');
      setUsername(user.username);
      setFullname(user.fullname || '');
    }
  }, []);

  const changeAvatar = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });

        if (!result.canceled) {
          const uri = result.assets[0].uri;
          setUriAvatar(uri);
        }
      }
    } catch (error) {
      console.log('lol', error);
    }
  };

  const saveProfile = async () => {
    setIsLoading(true);
    setErrUsername('');

    if (username != user?.username) {
      const checkUser = await getUserByUsername(username);

      if (checkUser) {
        setErrUsername('Username is already in use by another user');
        setIsLoading(false);
        return;
      } else {
        setErrUsername('');
      }
    }

    let urlAvatar;
    if (uriAvatar != user?.avatar) {
      urlAvatar = await setUserAvatar(user!.id, uriAvatar);
    }

    await updateUser(user!.id, {
      avatar: urlAvatar || user?.avatar,
      username: username,
      fullname: fullname,
    });
    setIsLoading(false);
  };

  return (
    <SafeView>
      <Header title={'Profile'} hasBack />
      <View style={{flex: 1, width: '100%'}}>
        <View style={styles.content}>
          <TouchableOpacity activeOpacity={0.8} onPress={changeAvatar}>
            <Image
              source={
                uriAvatar
                  ? {
                      uri: uriAvatar,
                    }
                  : require('@/assets/images/default-avatar.png')
              }
              style={styles.avatar}
            />
            <MaterialIcons
              style={[
                styles.editIcon,
                {backgroundColor: activedColors.primary},
              ]}
              name="edit"
              size={18}
              color="#fff"
            />
          </TouchableOpacity>
          <UInput
            style={{marginTop: 40}}
            value={username}
            onChangeText={setUsername}
            placeholder="Username..."
          />
          <Text
            style={[
              common.small,
              {
                color: activedColors.error,
                alignSelf: 'flex-start',
                marginLeft: 14,
              },
            ]}>
            {errUsername}
          </Text>
          <UInput
            style={{marginTop: 10}}
            value={fullname}
            onChangeText={setFullname}
            placeholder="Fullname..."
          />
        </View>
        <View style={{flexShrink: 0, marginBottom: 20, marginHorizontal: 16}}>
          <UButton
            primary
            loading={isLoading}
            style={{backgroundColor: activedColors.primary}}
            onPress={saveProfile}>
            <Text style={[common.text, {color: '#fff'}]}>Save</Text>
          </UButton>
        </View>
      </View>
    </SafeView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 3,
    borderRadius: 4,
  },
});
