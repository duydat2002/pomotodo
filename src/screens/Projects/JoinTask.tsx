import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ToastAndroid,
} from 'react-native';
import {common} from '@/assets/styles';
import SafeView from '@/components/Layout/SafeView';
import * as ImagePicker from 'expo-image-picker';
import {useActivedColors} from '@/hooks';
import {Feather, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {IQR, ProjectsStackScreenProps} from '@/types';
import {
  BarCodeScanningResult,
  Camera,
  CameraType,
  FlashMode,
} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import JoinTaskModal from '@/components/Modal/JoinTaskModal';
import {APP_QR_ID} from '@/constants';

const JoinTask = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<ProjectsStackScreenProps<'JoinTask'>['navigation']>();
  const route = useRoute<ProjectsStackScreenProps<'JoinTask'>['route']>();

  const [data, setData] = useState<IQR | null>(null);
  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [activeModal, setActiveModal] = useState(false);

  const handleBarCodeScanned = ({data}: BarCodeScanningResult) => {
    checkData(data);
  };

  const openImage = async () => {
    try {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status === 'granted') {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          quality: 1,
        });

        if (!result.canceled) {
          const uri = result.assets[0].uri;

          const results = await BarCodeScanner.scanFromURLAsync(uri);
          checkData(results[0].data);
        }
      }
    } catch (error) {
      console.debug(error);
    }
  };

  const checkData = (data: string) => {
    try {
      const value = JSON.parse(data);

      if (
        typeof value == 'object' &&
        'id' in value &&
        value.id == APP_QR_ID &&
        'project' in value &&
        'task' in value &&
        'owner' in value
      ) {
        setData(value);
        setActiveModal(true);
      } else {
        setActiveModal(false);
        ToastAndroid.show('Invalid QR Code!', ToastAndroid.SHORT);
      }
    } catch (error) {
      setActiveModal(false);
      ToastAndroid.show('Invalid QR Code!', ToastAndroid.SHORT);
    }
  };

  function toggleCameraType() {
    setType(type == CameraType.back ? CameraType.front : CameraType.back);
  }

  const toggleFlash = () => {
    if (type == CameraType.back) {
      setFlashMode(
        flashMode == FlashMode.off ? FlashMode.torch : FlashMode.off,
      );
    } else {
      setFlashMode(FlashMode.off);
    }
  };

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <SafeView>
        <Text style={{textAlign: 'center'}}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </SafeView>
    );
  }

  return (
    <View style={{flex: 1, width: '100%'}}>
      <Camera
        style={styles.camera}
        type={type}
        flashMode={flashMode}
        ratio="16:9"
        barCodeScannerSettings={{
          barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
        }}
        onBarCodeScanned={handleBarCodeScanned}></Camera>
      <SafeView style={[styles.container]}>
        <View style={[styles.buttonsTop]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
            style={[styles.button]}>
            <Feather name="x" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={toggleFlash}
            style={[styles.button]}>
            <Ionicons
              name={
                flashMode == FlashMode.off
                  ? 'ios-flash-off-outline'
                  : 'ios-flash'
              }
              size={24}
              color="#fff"
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.buttonsBottom]}>
          <TouchableOpacity activeOpacity={0.8} onPress={openImage} style={{}}>
            <View style={[styles.button]}>
              <MaterialIcons name="photo-library" size={24} color="#fff" />
            </View>
            <Text style={[styles.text]}>Library</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} onPress={toggleCameraType}>
            <View style={[styles.button]}>
              <Ionicons
                name="md-camera-reverse-outline"
                size={24}
                color="#fff"
              />
            </View>
            <Text style={[styles.text]}>Reverse</Text>
          </TouchableOpacity>
        </View>
        <View style={{position: 'absolute'}}>
          <JoinTaskModal
            visible={activeModal}
            value={data}
            onClickOutside={() => setActiveModal(false)}
            onClose={() => setActiveModal(false)}
          />
        </View>
      </SafeView>
    </View>
  );
};

export default JoinTask;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  camera: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 40,
    backgroundColor: '#00000040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonsTop: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  buttonsBottom: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  text: {
    ...common.small,
    color: '#fff',
    textAlign: 'center',
  },
});
