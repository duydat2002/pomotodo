import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import {FontAwesome} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  leftIcon?: keyof typeof FontAwesome.glyphMap;
  rightIcon?: keyof typeof FontAwesome.glyphMap;
  title?: string;
  onPressLeft?: () => void;
  onPressRight?: () => void;
}

const Header: React.FC<IProps> = ({
  leftIcon,
  rightIcon,
  title,
  onPressLeft,
  onPressRight,
}) => {
  const activedColors = useActivedColors();
  const navigation = useNavigation();

  const onBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {leftIcon && (
        <TouchableOpacity style={styles.button} onPress={onPressLeft || onBack}>
          <FontAwesome
            name={leftIcon}
            style={{fontSize: 20, color: activedColors.text}}
          />
        </TouchableOpacity>
      )}
      <Text style={[styles.title, {color: activedColors.text}]}>{title}</Text>
      {rightIcon && (
        <TouchableOpacity style={styles.button} onPress={onPressRight}>
          <FontAwesome
            name={rightIcon}
            style={{fontSize: 20, color: activedColors.text}}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    height: 50,
    paddingHorizontal: 20,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  title: {
    flex: 1,
    marginLeft: 10,
    ...common.subTitle,
  },
});
