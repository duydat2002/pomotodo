import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useActivedColors, useAppDispatch} from '@/hooks';
import {EFontWeight} from '@/theme';
import {common} from '@/assets/styles';
import {generatorId} from '@/utils';
import {AuthStackScreenProps} from '@/types';
import {setUser} from '@/store/user.slice';
import Header from '@/components/Layout/Header';
import UButton from '@/components/UI/UButton';
import Seperator from '@/components/Layout/Seperator';
import SafeView from '@/components/Layout/SafeView';
import {getUniqueId} from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {useAuth} from '@/hooks/useAuth';

GoogleSignin.configure({
  webClientId:
    '374578291201-u0epgegr9g1igrqkb8gbhuikijut4kdn.apps.googleusercontent.com',
  offlineAccess: true,
});

const LetsIn: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AuthStackScreenProps<'LetsIn'>['navigation']>();
  const dispatch = useAppDispatch();

  const {googleSignin, facebookSignin} = useAuth();

  const noSignIn = async () => {
    const id = await getUniqueId();
    dispatch(
      setUser({
        id, // Id is unique phone id
        username: `user-${id}`,
      }),
    );
  };

  const onGoogleButtonPress = async () => {
    const user = await googleSignin();
    if (user) {
      dispatch(setUser(user));
    }
  };

  const onFacebookButtonPress = async () => {
    const user = await facebookSignin();
    if (user) {
      dispatch(setUser(user));
    }
  };

  return (
    <SafeView>
      {/* <Header title={'Lets In'}>
        {{
          rightChild: (
            <TouchableOpacity activeOpacity={0.7} onPress={noSignIn}>
              <Text style={[common.text, {color: activedColors.primaryDark}]}>
                Skip
              </Text>
            </TouchableOpacity>
          ),
        }}
      </Header> */}
      <Header title={'Lets In'} />
      <View style={[common.container, {justifyContent: 'space-between'}]}>
        <Text
          style={[common.title, {color: activedColors.text, marginTop: 150}]}>
          Let's you in
        </Text>
        <View style={{width: '100%'}}>
          <UButton
            style={[
              styles.continueButton,
              {
                borderColor: activedColors.border,
                backgroundColor: activedColors.border,
              },
            ]}
            onPress={onFacebookButtonPress}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={[common.buttonIcon, {marginRight: 10}]}
                source={require('@/assets/images/facebook-icon.png')}
              />
              <Text
                style={[
                  styles.continueButtonText,
                  {color: activedColors.text},
                ]}>
                Continue with Facebook
              </Text>
            </View>
          </UButton>
          <UButton
            style={[
              styles.continueButton,
              {
                borderColor: activedColors.border,
                backgroundColor: activedColors.border,
              },
            ]}
            onPress={onGoogleButtonPress}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={[common.buttonIcon, {marginRight: 10}]}
                source={require('@/assets/images/google-icon.png')}
              />
              <Text
                style={[
                  styles.continueButtonText,
                  {color: activedColors.text},
                ]}>
                Continue with Google
              </Text>
            </View>
          </UButton>
          <Seperator text="OR" />
          <UButton
            primary
            style={{borderRadius: 40}}
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text style={[common.buttonText, {color: '#fff'}]}>
              Sign in with password
            </Text>
          </UButton>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 40}}>
          <Text style={[common.text, {color: activedColors.textSec}]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('SignUp');
            }}>
            <Text
              style={[
                common.text,
                {
                  color: activedColors.primaryDark,
                  fontWeight: EFontWeight.semibold,
                },
              ]}>
              Sign up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

export default LetsIn;

const styles = StyleSheet.create({
  continueButton: {
    marginTop: 15,
  },
  continueButtonText: {
    color: '#ff4b4b',
    ...common.buttonText,
  },
});
