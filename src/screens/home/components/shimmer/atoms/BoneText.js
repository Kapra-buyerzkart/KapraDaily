import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TYPE } from '@/styles/homeTheme';
import Bone from './Bone';
import { BONE_HEIGHT } from '../tokens';

const BoneText = ({ variant = 'body', width, tone, radius, line, style }) => (
  <View
    style={[styles.line, { height: line || TYPE[variant].lineHeight }, style]}
  >
    <Bone
      width={width}
      height={BONE_HEIGHT[variant]}
      tone={tone}
      radius={radius}
    />
  </View>
);

export default React.memo(BoneText);

const styles = StyleSheet.create({
  line: {
    justifyContent: 'center',
  },
});
