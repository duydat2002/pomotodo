import React, {useRef} from 'react';
import {StyleSheet, Text, View, ToastAndroid} from 'react-native';
import {common} from '@/assets/styles';
import {useActivedColors} from '@/hooks';
import UButton from '../UI/UButton';
import UModal from './UModal';
import QRCode from 'react-qr-code';
import {captureRef} from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';

interface IProps {
  value: string;
  onClickOutside?: () => void;
  onClose: () => void;
}

const QRModal: React.FC<IProps> = ({value, onClickOutside, onClose}) => {
  const activedColors = useActivedColors();

  const viewToSnapshot = useRef<View>(null);

  const snapshot = async () => {
    try {
      const {status} = await MediaLibrary.requestPermissionsAsync();

      if (status === 'granted') {
        const uri = await captureRef(viewToSnapshot);
        MediaLibrary.saveToLibraryAsync(uri);

        ToastAndroid.show('QR Saved!', ToastAndroid.SHORT);
      }
    } catch (error) {
      console.debug(error);
    }
  };

  return (
    <UModal visible onClickOutside={onClickOutside}>
      <View
        style={[
          common.shadow,
          {
            padding: 24,
            borderRadius: 16,
            backgroundColor: activedColors.input,
          },
        ]}>
        <View style={{alignItems: 'center', marginBottom: 20}}>
          <Text
            style={[
              common.text,
              {fontWeight: '700', marginBottom: 4, color: activedColors.text},
            ]}>
            QR Code
          </Text>
          <Text style={[common.text, {color: activedColors.text}]}>
            Scan the QR code to join colleague
          </Text>
        </View>
        <View ref={viewToSnapshot} style={styles.qrWrapper}>
          <QRCode value={value} size={250} />
        </View>
        <View style={{flexDirection: 'row', gap: 20, marginTop: 20}}>
          <UButton style={{flex: 1, backgroundColor: '#fff'}} onPress={onClose}>
            <Text style={[common.text, {color: activedColors.error}]}>
              Cancel
            </Text>
          </UButton>
          <UButton primary style={{flex: 1}} onPress={snapshot}>
            <Text style={[common.text, {color: '#fff'}]}>Save to gallery</Text>
          </UButton>
        </View>
      </View>
    </UModal>
  );
};

export default QRModal;

const styles = StyleSheet.create({
  qrWrapper: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
  },
});
