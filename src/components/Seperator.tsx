import React from 'react';
import {StyleSheet, Text, View, DimensionValue} from 'react-native';
import {useActivedColors} from '@/hooks';
import {EFontWeight} from '@/theme';

interface IProps {
  text?: string;
  height?: DimensionValue;
}

const Seperator: React.FC<IProps> = ({text, height = 5}) => {
  const activedColors = useActivedColors();

  if (text) {
    return (
      <View style={styles.seperatorWrapper}>
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
