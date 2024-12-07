import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { hp } from '../helpers/common';
import { theme } from '../constants/theme';

const Avatar = ({ uri, size = hp(3.5), style = {} }) => {
  const isUrl = typeof uri === 'string' && uri.startsWith('http');
  return (
    <Image
      source={isUrl ? { uri } : uri}
      transition={100}
      style={[styles.avatar, { height: size, width: size, borderRadius: size / 2 }, style]}
    />
  );
};

export default Avatar;

const styles = StyleSheet.create({
  avatar: {
    borderCurve: 'continuous',
    borderColor: theme.Colors.darkLight,
    borderWidth: 1,
  },
});
