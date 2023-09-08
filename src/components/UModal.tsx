import React, {ReactNode} from 'react';
import {
  Modal,
  StyleProp,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';

interface IProps {
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  onRequestClose?: () => void;
  dismiss: () => void;
}

const UModal: React.FC<IProps> = ({
  visible,
  transparent = true,
  animationType = 'none',
  children,
  style,
  onRequestClose,
  dismiss,
}) => {
  return (
    <View>
      <Modal
        visible={visible}
        transparent={transparent}
        onRequestClose={onRequestClose}
        animationType={animationType}>
        <TouchableWithoutFeedback onPress={dismiss}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={[styles.modalContent, style]}>{children}</View>
      </Modal>
    </View>
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
    backgroundColor: '#f3f',
    height: 200,
    marginTop: 'auto',
  },
});
