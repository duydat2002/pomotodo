import React, {ReactNode} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';

interface IProps {
  active: boolean;
  children: {
    header: ReactNode;
    dropdown: ReactNode;
  };
  style?: StyleProp<ViewStyle>;
}

const UDropdown: React.FC<IProps> = ({active, children, style}) => {
  return (
    <View>
      {children.header}
      <View
        style={[styles.dropView, style, {display: active ? 'flex' : 'none'}]}>
        {children.dropdown}
      </View>
    </View>
  );
};

export default UDropdown;

const styles = StyleSheet.create({
  dropView: {position: 'absolute', top: '100%'},
});
