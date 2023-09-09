import {common} from '@/assets/styles';
import React, {ReactNode, useState} from 'react';
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import SafeView from '@/components/Layout/SafeView';

interface IProps {
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onRequestClose?: () => void;
  onClickOutside?: () => void;
}

const UModal: React.FC<IProps> = ({
  visible,
  transparent = true,
  animationType = 'none',
  children,
  style,
  onRequestClose,
  onClickOutside,
}) => {
  return (
    <SafeView>
      <Modal
        statusBarTranslucent={true}
        visible={visible}
        transparent={transparent}
        onRequestClose={onRequestClose}
        animationType={animationType}>
        <TouchableWithoutFeedback onPress={onClickOutside}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalContent, style]}>{children}</View>
      </Modal>
    </SafeView>
  );
};

export default UModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    justifyContent: 'center',
    marginTop: 'auto',
  },
});
