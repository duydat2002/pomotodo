import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  deleteAllData,
  useActivedColors,
  useAppDispatch,
  useAppSelector,
} from '@/hooks';
import SafeView from '@/components/Layout/SafeView';
import Header from '@/components/Layout/Header';
import {common} from '@/assets/styles';
import {Entypo, Feather} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {SettingStackScreenProps} from '@/types';
import {
  setAutoStartBreaktime,
  setAutoStartNextPomodoro,
  setDisableBreaktime,
} from '@/store/setting.slice';
import SelectThemeModal from '@/components/Modal/SelectThemeModal';
import {changeTheme} from '@/store/theme.slice';
import UButton from '@/components/UI/UButton';
import auth from '@react-native-firebase/auth';
import {setUser} from '@/store/user.slice';

const Setting = () => {
  const activedColors = useActivedColors();
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<SettingStackScreenProps<'Setting'>['navigation']>();

  const {user} = useAppSelector(state => state.user);
  const {theme} = useAppSelector(state => state.theme);
  const {disableBreaktime, autoStartBreaktime, autoStartNextPomodoro} =
    useAppSelector(state => state.setting);

  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>(
    'system',
  );
  const [activeThemeModal, setActiveThemeModal] = useState(false);

  useEffect(() => {
    setThemeMode(theme.system ? 'system' : theme.mode);
  }, [theme]);

  const toggleDisableBreaktime = () => {
    dispatch(setDisableBreaktime(!disableBreaktime));
  };

  const toggleAutoStartBreaktime = () => {
    dispatch(setAutoStartBreaktime(!autoStartBreaktime));
  };

  const toggleAutoStartNextPomodoro = () => {
    dispatch(setAutoStartNextPomodoro(!autoStartNextPomodoro));
  };

  const hanldeSelectTheme = (theme: 'dark' | 'light' | 'system') => {
    dispatch(
      changeTheme({
        system: theme == 'system',
        mode: theme == 'system' ? 'light' : theme,
      }),
    );
  };

  const logout = async () => {
    if (auth().currentUser) {
      await auth().signOut();
    }
    await deleteAllData(['theme', 'netInfo']);
    dispatch(setUser(null));
  };

  return (
    <SafeView>
      <Header title={'Setting'} />
      <View
        style={{
          flex: 1,
          width: '100%',
          backgroundColor: activedColors.background,
        }}>
        <View style={{flex: 1}}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={{marginTop: 15}}
            onPress={() => navigation.navigate('Profile')}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 8,
                backgroundColor: activedColors.backgroundLight,
              }}>
              <Image
                source={
                  user?.avatar
                    ? {
                        uri: user.avatar,
                      }
                    : require('@/assets/images/default-avatar.png')
                }
                style={{width: 40, height: 40, borderRadius: 40}}
              />
              <Text
                style={[
                  common.text,
                  {
                    flexGrow: 1,
                    marginLeft: 10,
                    fontWeight: '600',
                    color: activedColors.text,
                  },
                ]}>
                {user?.username}
              </Text>
              <Entypo
                name="chevron-right"
                size={24}
                color={activedColors.text}
              />
            </View>
          </TouchableOpacity>
          <View
            style={{
              marginTop: 15,
              backgroundColor: activedColors.backgroundLight,
            }}>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Disable breaktime
              </Text>
              <Switch
                style={{backgroundColor: 'transparent'}}
                trackColor={{
                  false: '#9e9e9e',
                  true: activedColors.primaryLight,
                }}
                thumbColor={disableBreaktime ? activedColors.primary : '#fff'}
                onValueChange={toggleDisableBreaktime}
                value={disableBreaktime}
              />
            </View>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Auto start next Pomodoro
              </Text>
              <Switch
                style={{backgroundColor: 'transparent'}}
                trackColor={{
                  false: '#9e9e9e',
                  true: activedColors.primaryLight,
                }}
                thumbColor={
                  autoStartNextPomodoro ? activedColors.primary : '#fff'
                }
                onValueChange={toggleAutoStartNextPomodoro}
                value={autoStartNextPomodoro}
              />
            </View>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Auto start breaktime
              </Text>
              <Switch
                style={{backgroundColor: 'transparent'}}
                trackColor={{
                  false: '#9e9e9e',
                  true: activedColors.primaryLight,
                }}
                thumbColor={autoStartBreaktime ? activedColors.primary : '#fff'}
                onValueChange={toggleAutoStartBreaktime}
                value={autoStartBreaktime}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: 15,
              backgroundColor: activedColors.backgroundLight,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.item]}
              onPress={() => setActiveThemeModal(true)}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Theme
              </Text>
              <Text style={[common.text, {color: activedColors.text}]}>
                {themeMode}
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: 15,
              backgroundColor: activedColors.backgroundLight,
            }}>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Instructions for use
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={activedColors.textSec}
              />
            </View>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Help and feedback
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={activedColors.textSec}
              />
            </View>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Official Site
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={activedColors.textSec}
              />
            </View>
            <View style={[styles.item]}>
              <Text style={[common.text, {color: activedColors.text}]}>
                Vote app now
              </Text>
              <Feather
                name="chevron-right"
                size={24}
                color={activedColors.textSec}
              />
            </View>
          </View>
        </View>
        <View style={{flexShrink: 0, marginBottom: 20, marginHorizontal: 16}}>
          <UButton
            primary
            style={{backgroundColor: activedColors.primary}}
            onPress={logout}>
            <Text style={[common.text, {color: '#fff'}]}>Sign out</Text>
          </UButton>
        </View>
      </View>
      <View style={{position: 'absolute'}}>
        <SelectThemeModal
          visible={activeThemeModal}
          theme={themeMode}
          onSelect={hanldeSelectTheme}
          onClose={() => setActiveThemeModal(false)}
        />
      </View>
    </SafeView>
  );
};

export default Setting;

const styles = StyleSheet.create({
  item: {
    marginVertical: 10,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
