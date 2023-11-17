import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import {common} from '@/assets/styles';
import SafeView from '@/components/Layout/SafeView';
import * as ImagePicker from 'expo-image-picker';
import {useActivedColors, useAppSelector} from '@/hooks';
import {Feather, Ionicons, MaterialIcons} from '@expo/vector-icons';
import {useNavigation, useRoute} from '@react-navigation/native';
import {HomeStackScreenProps, IUser} from '@/types';
import {
  BarCodeScanningResult,
  Camera,
  CameraType,
  FlashMode,
} from 'expo-camera';
import {BarCodeScanner} from 'expo-barcode-scanner';
import {APP_QR_ID} from '@/constants';
import {useColleague} from '@/hooks/useColleague';
import {generatorId} from '@/utils';
import QRModal from '@/components/Modal/QRModal';
import InviteColleagueModal from '@/components/Modal/InviteColleagueModal';
import {useUser} from '@/hooks/useUser';
import {useNotification} from '@/hooks/useNotification';

const JoinColleague: React.FC = () => {
  const activedColors = useActivedColors();
  const navigation =
    useNavigation<HomeStackScreenProps<'JoinColleague'>['navigation']>();
  const route = useRoute<HomeStackScreenProps<'JoinColleague'>['route']>();

  const {getUser} = useUser();
  const {addColleague} = useColleague();
  const {createNotification} = useNotification();

  const {user} = useAppSelector(state => state.user);
  const {colleagues} = useAppSelector(state => state.colleagues);

  const [type, setType] = useState(CameraType.back);
  const [flashMode, setFlashMode] = useState(FlashMode.off);
  const [permission, requestPermission] = Camera.useCameraPermissions();

  const [activeModal, setActiveModal] = useState(false);
  const [activeQRCode, setActiveQRCode] = useState(false);
  const [userQR, setUserQR] = useState<IUser | null>(null);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);

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
      ToastAndroid.show('Invalid QR Code!', ToastAndroid.SHORT);
    }
  };

  const checkData = async (data: string) => {
    try {
      setLoadingQR(true);
      const qrData = JSON.parse(data);

      if (
        typeof qrData == 'object' &&
        'id' in qrData &&
        qrData.id == APP_QR_ID &&
        'userId' in qrData
      ) {
        const userTemp = await getUser(qrData.userId);

        if (userTemp) {
          setUserQR(userTemp);
          setActiveModal(true);
        } else {
          setActiveModal(false);
          ToastAndroid.show('This user was not found!', ToastAndroid.SHORT);
        }
      } else {
        setActiveModal(false);
        ToastAndroid.show('Invalid QR Code!', ToastAndroid.SHORT);
      }
    } catch (error) {
      setActiveModal(false);
      ToastAndroid.show('Invalid QR Code!', ToastAndroid.SHORT);
    } finally {
      setLoadingQR(false);
    }
  };

  const handleInvite = async () => {
    setLoadingInvite(true);

    if (userQR?.username == user!.username) {
      ToastAndroid.show('It you!', ToastAndroid.SHORT);
    } else {
      let alreadyOnTeam = false;
      colleagues?.forEach(item => {
        if (item.colleagueUsername == userQR?.username) {
          ToastAndroid.show(
            'This user is already on your colleague!',
            ToastAndroid.SHORT,
          );
          alreadyOnTeam = true;
          return;
        }
      });

      if (!alreadyOnTeam) {
        await addColleague({
          id: generatorId(),
          userId: user!.id,
          colleagueId: userQR!.id,
          colleagueUsername: userQR!.username,
          colleagueAvatar: userQR!.avatar,
          colleagueEmail: userQR!.email,
          isAccept: false,
        });
        await createNotification({
          id: generatorId(),
          senderId: user!.id,
          senderUsername: user!.username,
          senderAvatar: user!.avatar,
          receiverId: userQR!.id,
          type: 'invite',
          subType: 'invite',
          isRead: false,
          isResponded: false,
          content: 'invited you to team',
          createdAt: new Date().toISOString(),
        });
      }
    }

    setLoadingInvite(false);
    setActiveModal(false);
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
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
          }}>
          <Text
            style={[
              common.text,
              {
                textAlign: 'center',
                marginBottom: 20,
                color: activedColors.text,
              },
            ]}>
            We need your permission to show the camera
          </Text>
          <Button onPress={requestPermission} title="grant permission" />
        </View>
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
            onPress={() => setActiveQRCode(true)}
            style={[styles.button, {width: 'auto', paddingHorizontal: 10}]}>
            <Text style={{color: '#fff'}}>My QR code</Text>
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
        {loadingQR && (
          <View style={{alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator size={40} color={activedColors.textSec} />
          </View>
        )}
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
          {userQR && (
            <InviteColleagueModal
              visible={activeModal}
              user={userQR}
              onClose={() => setActiveModal(false)}
              onInvite={handleInvite}
              loadingInvite={loadingInvite}
            />
          )}
          {activeQRCode && (
            <QRModal
              value={JSON.stringify({id: APP_QR_ID, userId: user!.id})}
              onClickOutside={() => setActiveQRCode(false)}
              onClose={() => setActiveQRCode(false)}
            />
          )}
        </View>
      </SafeView>
    </View>
  );
};

export default JoinColleague;

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
