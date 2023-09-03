import React, {ReactNode} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useActivedColors} from '@/hooks';
import {FontAwesome} from '@expo/vector-icons';
import {common} from '@/assets/styles';
import {useNavigation} from '@react-navigation/native';

interface IProps {
  title?: string;
  children?: {
    leftChild?: ReactNode;
    rightChild?: ReactNode;
  };
  hasBack?: boolean;
}

const Header: React.FC<IProps> = ({title, children, hasBack = false}) => {
  const activedColors = useActivedColors();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {children?.leftChild}
      {hasBack && (
        <FontAwesome
          name="chevron-left"
          style={{fontSize: 20, color: activedColors.text}}
          onPress={() => navigation.goBack()}
        />
      )}
      <Text style={[styles.title, {color: activedColors.text}]}>{title}</Text>
      {children?.rightChild}
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
