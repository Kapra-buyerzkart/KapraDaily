import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuRow from '../molecules/MenuRow';
import { FONTS } from '@/styles/typography';

const MenuSection = ({ title, items }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.itemsContainer}>
      {items.map(item => (
        <MenuRow
          key={item.key}
          label={item.label}
          icon={item.icon}
          badge={item.badge}
          tone={item.tone}
          textColor={item.textColor}
          onPress={item.onPress}
        />
      ))}
    </View>
  </View>
);

export default React.memo(MenuSection);

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13.5,
    fontFamily: FONTS.gilroy.medium,
    color: '#666666',
    marginLeft: 20,
    marginBottom: 6,
  },
  itemsContainer: {
    backgroundColor: '#FFFFFF',
  },
});
