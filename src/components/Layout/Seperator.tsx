import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  DimensionValue,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {useActivedColors} from '@/hooks';
import {EFontWeight} from '@/theme';

interface IProps {
  text?: string;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
}

const Seperator: React.FC<IProps> = ({text, height = 5, style}) => {
  const activedColors = useActivedColors();

  if (text) {
    return (
      <View style={[styles.seperatorWrapper, style]}>
        <View
          style={[
            styles.seperator,
            {height: height, backgroundColor: activedColors.border},
          ]}
        />
        <Text style={[styles.seperatorText, {color: activedColors.text}]}>
          {text}
        </Text>
        <View
          style={[
            styles.seperator,
            {height: height, backgroundColor: activedColors.border},
          ]}
        />
      </View>
    );
  } else {
    return (
      <View
        style={[
          styles.seperatorWrapper,
          {height: height, backgroundColor: activedColors.border},
          style,
        ]}></View>
    );
  }
};

export default Seperator;

const styles = StyleSheet.create({
  seperatorWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  seperator: {
    flex: 1,
    borderRadius: 4,
  },
  seperatorText: {
    fontWeight: EFontWeight.semibold,
    marginHorizontal: 15,
  },
});
