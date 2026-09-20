import React, { Fragment } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MenuRow from '../molecules/MenuRow';

const MenuSection = ({ title, subtitle, items }) => (
  <View style={styles.section}>
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    <View style={styles.card}>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          <MenuRow
            label={item.label}
            icon={item.icon}
            tone={item.tone}
            textColor={item.textColor}
            onPress={item.onPress}
          />
          {index < items.length - 1 && !item.hideDividerAfter && (
            <View style={styles.divider} />
          )}
        </Fragment>
      ))}
    </View>
  </View>
);

export default React.memo(MenuSection);

const styles = StyleSheet.create({
  section: {
    marginTop: 18,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  title: {
    fontFamily: 'Lexend-SemiBold',
    fontSize: 12,
    color: '#555555',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: 11,
    color: '#999999',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ECECEC',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 64,
    marginRight: 14,
  },
});
