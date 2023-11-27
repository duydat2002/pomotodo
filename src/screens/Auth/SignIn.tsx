import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useActivedColors, useAppDispatch} from '@/hooks';
import {common} from '@/assets/styles';
import {Zocial, AntDesign, FontAwesome} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {EFontWeight} from '@/theme';
import {validateEmail, validatePassword} from '@/utils';
import {setUser} from '@/store/user.slice';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import UButton from '@/components/UI/UButton';
import Seperator from '@/components/Layout/Seperator';
import SafeView from '@/components/Layout/SafeView';
import {AuthStackScreenProps} from '@/types';
import {useAuth} from '@/hooks/useAuth';

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AuthStackScreenProps<'SignIn'>['navigation']>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSignIn, setLoadingSignIn] = useState(false);

  const handleSignIn = async () => {
    setLoadingSignIn(true);

    const checkEmail = validateEmail(email);
    const checkPassword = validatePassword(password);

    setErrEmail(checkEmail);
    setErrPassword(checkPassword);

    if (checkEmail == '' && checkPassword == '') {
      const {signIn} = useAuth();

      const user = await signIn(email, password);
      if (user) {
        dispatch(setUser(user));
      } else {
        setErrPassword('Your password is incorrect.');
      }
    }

    setLoadingSignIn(false);
  };

  return (
    <SafeView>
      <Header title={'Sign In'} hasBack />
      <View style={[common.container, {justifyContent: 'space-between'}]}>
        <Text
          style={[
            common.title,
            {width: '100%', color: activedColors.text, marginTop: 50},
          ]}>
          Login to your{'\n'}Account
        </Text>
        <View style={{width: '100%'}}>
          <UInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            keyboardType="email-address">
            {{
              leftChild: (
                <Zocial
                  style={{marginRight: 10}}
                  name="email"
                  size={20}
                  color={activedColors.text}
                />
              ),
            }}
          </UInput>
          <Text
            style={[
              common.small,
              {color: activedColors.error, paddingHorizontal: 15},
            ]}>
            {errEmail}
          </Text>
          <UInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry={!showPassword}>
            {{
              leftChild: (
                <AntDesign
                  style={{marginRight: 10}}
                  name="lock"
                  size={20}
                  color={activedColors.text}
                />
              ),
              // rightChild: (
              //   <FontAwesome
              //     style={{marginLeft: 10}}
              //     name={showPassword ? 'eye' : 'eye-slash'}
              //     size={20}
              //     color={activedColors.text}
              //     onPress={() => setShowPassword(!showPassword)}
              //   />
              // ),
            }}
          </UInput>
          <Text
            style={[
              common.small,
              {color: activedColors.error, paddingHorizontal: 15},
            ]}>
            {errPassword}
          </Text>
          <UButton
            primary
            loading={loadingSignIn}
            style={{borderRadius: 40, marginTop: 50}}
            onPress={handleSignIn}>
            <Text style={[common.buttonText, {color: '#fff'}]}>Sign In</Text>
          </UButton>
        </View>
        <Seperator text="or continue with" />
        <View style={styles.buttons}>
          <UButton
            style={{
              width: 'auto',
              paddingHorizontal: 20,
              borderColor: activedColors.border,
              backgroundColor: activedColors.border,
            }}>
            <Image
              style={common.buttonIcon}
              source={require('@/assets/images/facebook-icon.png')}
            />
          </UButton>
          <UButton
            style={{
              width: 'auto',
              paddingHorizontal: 20,
              borderColor: activedColors.border,
              backgroundColor: activedColors.border,
            }}>
            <Image
              style={common.buttonIcon}
              source={require('@/assets/images/google-icon.png')}
            />
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

export default SignIn;

const styles = StyleSheet.create({
  buttons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  input: {
    marginTop: 5,
    marginBottom: 5,
  },
});
