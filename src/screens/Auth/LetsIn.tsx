import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useActivedColors} from '@/hooks';
import {EFontWeight} from '@/theme';
import {common} from '@/assets/styles';
import Header from '@/components/Header';
import UButton from '@/components/UButton';
import Seperator from '@/components/Seperator';
import SafeView from '@/components/SafeView';

const LetsIn: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation = useNavigation();

  return (
    <SafeView>
      <Header
        title={'Lets In'}
        onPressLeft={() => {
          console.log('cac');
        }}
      />
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
            ]}>
            <Image
              style={[common.buttonIcon, {marginRight: 10}]}
              source={require('@/assets/images/facebook-icon.png')}
            />
            <Text
              style={[styles.continueButtonText, {color: activedColors.text}]}>
              Continue with Facebook
            </Text>
          </UButton>
          <UButton
            style={[
              styles.continueButton,
              {
                borderColor: activedColors.border,
                backgroundColor: activedColors.border,
              },
            ]}>
            <Image
              style={[common.buttonIcon, {marginRight: 10}]}
              source={require('@/assets/images/google-icon.png')}
            />
            <Text
              style={[styles.continueButtonText, {color: activedColors.text}]}>
              Continue with Google
            </Text>
          </UButton>
          <Seperator text="OR" />
          <UButton
            primary
            style={{borderRadius: 40}}
            onPress={() => {
              navigation.navigate('SignIn' as never);
            }}>
            <Text style={[common.buttonText, {color: '#fff'}]}>
              Sign in with password
            </Text>
          </UButton>
        </View>
        <View style={{flexDirection: 'row', marginBottom: 40}}>
          <Text style={[common.text, {color: activedColors.texSec}]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              navigation.navigate('SignUp' as never);
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
