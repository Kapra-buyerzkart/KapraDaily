import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const AreaOption = ({ label, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[styles.row, selected && styles.rowSelected]}
    accessibilityRole="radio"
    accessibilityState={{ selected }}
    accessibilityLabel={label}
  >
    <Text
      style={[styles.label, selected ? styles.labelSelected : styles.labelIdle]}
      numberOfLines={1}
    >
      {label}
    </Text>
    <View style={[styles.indicator, selected && styles.indicatorSelected]}>
      {selected ? <Feather name="check" size={14} color="#0A2A20" /> : null}
    </View>
  </TouchableOpacity>
);

export default React.memo(AreaOption);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: '#E2DFD8',
    backgroundColor: '#FAF9F6',
  },
  rowSelected: {
    borderColor: '#0A2A20',
    backgroundColor: '#0A2A20',
  },
  label: {
    flex: 1,
    fontSize: 14,
  },
  labelIdle: {
    fontFamily: 'Lexend-Regular',
    color: '#12372A',
  },
  labelSelected: {
    fontFamily: 'Lexend-SemiBold',
    color: '#FFFFFF',
  },
  indicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#9E9E9E',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  indicatorSelected: {
    borderColor: '#FFFFFF',
    backgroundColor: '#FFFFFF',
  },
});
