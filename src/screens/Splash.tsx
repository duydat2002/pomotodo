import React from 'react';
import {StyleSheet, Image} from 'react-native';
import LottieView from 'lottie-react-native';
import {LinearGradient} from 'expo-linear-gradient';
import {SafeAreaView} from 'react-native-safe-area-context';

const Splash = () => {
  return (
    <LinearGradient
      style={styles.wrapper}
      colors={['#93b0f3', '#7393dd']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}>
      <SafeAreaView style={[styles.container]}>
        <Image style={styles.logo} source={require('@/assets/images/p.png')} />
        <LottieView
          style={styles.loading}
          autoPlay
          loop
          source={require('@/assets/lotties/spinner.json')}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrapper: {
    flex: 1,
  },
  logo: {
    width: 200,
    height: 200,
    marginTop: 100,
  },
  loading: {
    width: 100,
    height: 100,
    marginBottom: 50,
  },
});
