import React, {useState} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useActivedColors, useAppDispatch} from '@/hooks';
import {common} from '@/assets/styles';
import {IAuth} from '@/types';
import {Zocial, AntDesign, FontAwesome} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {EFontWeight} from '@/theme';
import {validateEmail, validatePassword} from '@/utils';
import {useAuth} from '@/hooks';
import {setUser} from '@/store/user.slice';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import UButton from '@/components/UI/UButton';
import Seperator from '@/components/Layout/Seperator';
import SafeView from '@/components/Layout/SafeView';
import {AuthStackScreenProps} from '@/types';

const SignIn: React.FC = () => {
  const dispatch = useAppDispatch();
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AuthStackScreenProps<'SignIn'>['navigation']>();

  const [authForm, setAuthForm] = useState<IAuth>({
    email: '',
    password: '',
  });
  const [authErr, setAuthErr] = useState<IAuth>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const setEmail = (value: string) => {
    setAuthForm({...authForm, email: value});
  };

  const setPassword = (value: string) => {
    setAuthForm({...authForm, password: value});
  };

  const handleSignIn = async () => {
    const checkEmail = validateEmail(authForm.email);
    const checkPassword = validatePassword(authForm.password);

    setAuthErr({
      email: checkEmail,
      password: checkPassword,
    });

    if (checkEmail == '' && checkPassword == '') {
      const {signIn} = useAuth();

      const user = await signIn(authForm.email, authForm.password);
      if (user) {
        dispatch(setUser(user));
        console.log(user);
      } else {
        setAuthErr({
          email: '',
          password:
            'Your password is incorrect. Please check your password again.',
        });
      }
    }
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
            value={authForm.email}
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
            {authErr.email}
          </Text>
          <UInput
            style={styles.input}
            value={authForm.password}
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
              rightChild: (
                <FontAwesome
                  style={{marginLeft: 10}}
                  name={showPassword ? 'eye' : 'eye-slash'}
                  size={20}
                  color={activedColors.text}
                  onPress={() => setShowPassword(!showPassword)}
                />
              ),
            }}
          </UInput>
          <Text
            style={[
              common.small,
              {color: activedColors.error, paddingHorizontal: 15},
            ]}>
            {authErr.password}
          </Text>
          <UButton
            primary
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
