import React from 'react';
import { View } from 'react-native';
import { styles } from '../../styles';

const StatusDot = ({ style }) => <View style={[styles.statusDot, style]} />;

export default React.memo(StatusDot);
