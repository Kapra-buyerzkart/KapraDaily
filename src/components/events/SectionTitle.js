import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const SectionTitle = ({ title, actionLabel, onActionPress }) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    {!!actionLabel && (
      <TouchableOpacity onPress={onActionPress} hitSlop={10}>
        <Text style={styles.action}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Gilroy-Bold',
  },
  action: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    fontFamily: 'Gilroy-Medium',
  },
});

export default React.memo(SectionTitle);
