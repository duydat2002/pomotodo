import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useActivedColors, useAppDispatch} from '@/hooks';
import {common} from '@/assets/styles';
import {EFontWeight} from '@/theme';
import {AntDesign, FontAwesome, Zocial} from '@expo/vector-icons';
import {setUser} from '@/store/user.slice';
import {validateEmail, validatePassword} from '@/utils';
import Header from '@/components/Layout/Header';
import UInput from '@/components/UI/UInput';
import UButton from '@/components/UI/UButton';
import Seperator from '@/components/Layout/Seperator';
import SafeView from '@/components/Layout/SafeView';
import {AuthStackScreenProps} from '@/types';
import {useAuth} from '@/hooks/useAuth';

const SignUp = () => {
  const dispatch = useAppDispatch();

  const activedColors = useActivedColors();
  const navigation =
    useNavigation<AuthStackScreenProps<'SignUp'>['navigation']>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errEmail, setErrEmail] = useState('');
  const [errPassword, setErrPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loadingSignup, setLoadingSignup] = useState(false);

  const handleSignUp = async () => {
    setLoadingSignup(true);

    // Check email/password
    const checkEmail = validateEmail(email);
    const checkPassword = validatePassword(password);

    setErrEmail(checkEmail);
    setErrPassword(checkPassword);

    if (checkEmail == '' && checkPassword == '') {
      const {signUp} = useAuth();

      const {user, err} = await signUp(email, password);

      if (err) {
        setErrEmail(err.email);
        setErrPassword(err.password);
      } else {
        dispatch(setUser(user));
        navigation.navigate('FillProfile');
      }

      setLoadingSignup(false);
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
            loading={loadingSignup}
            style={{borderRadius: 40, marginTop: 50}}
            onPress={handleSignUp}>
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
