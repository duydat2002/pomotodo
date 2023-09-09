import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useActivedColors, useAppDispatch} from '@/hooks';
import {common} from '@/assets/styles';
import {IAuth} from '@/types';
import {EFontWeight} from '@/theme';
import {AntDesign, FontAwesome, Zocial} from '@expo/vector-icons';
import {useAuth} from '@/hooks';
import {setUser} from '@/store/user.slice';
import {validateEmail, validatePassword} from '@/utils';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import UButton from '@/components/UI/UButton';
import Seperator from '@/components/Layout/Seperator';
import SafeView from '@/components/Layout/SafeView';
import {AuthStackScreenProps} from '@/types/navigation';

const SignUp = () => {
  const dispatch = useAppDispatch();

  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AuthStackScreenProps<'SignUp'>['navigation']>();

  const [authForm, setAuthForm] = useState<IAuth>({
    email: '',
    password: '',
  });
  const [authErr, setAuthErr] = useState<IAuth>({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSign, setLoadingSign] = useState(false);

  const setEmail = (value: string) => {
    setAuthForm({...authForm, email: value});
  };

  const setPassword = (value: string) => {
    setAuthForm({...authForm, password: value});
  };

  const handleSignUp = async () => {
    // Check email/password
    const checkEmail = validateEmail(authForm.email);
    const checkPassword = validatePassword(authForm.password);

    setAuthErr({
      email: checkEmail,
      password: checkPassword,
    });

    if (checkEmail == '' && checkPassword == '') {
      const {signUp} = useAuth();

      setLoadingSign(true);

      const {user, err} = await signUp(authForm.email, authForm.password);

      if (err) {
        setAuthErr(err);
      } else {
        dispatch(setUser(user));
      }

      setLoadingSign(false);
    }
  };

  return (
    <SafeView>
      <Header title={'Sign Up'} hasBack />
      <View style={[common.container, {justifyContent: 'space-between'}]}>
        <Text
          style={[
            common.title,
            {width: '100%', color: activedColors.text, marginTop: 50},
          ]}>
          Create your{'\n'}Account
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
            onPress={handleSignUp}
            disabled={loadingSign}>
            <Text style={[common.buttonText, {color: '#fff'}]}>Sign up</Text>
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
            Already have an account?{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('SignIn');
            }}>
            <Text
              style={[
                common.text,
                {
                  color: activedColors.primaryDark,
                  fontWeight: EFontWeight.semibold,
                },
              ]}>
              Sign in
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeView>
  );
};

export default SignUp;

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
