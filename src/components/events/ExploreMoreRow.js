import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import CONFIG from '../../globals/config';

const ExploreMoreRow = ({ items }) => {
  if (!items || items.length === 0) return null;

  return (
    <View style={styles.row}>
      {items?.map((item, index) => (
        <View key={item?.catName ?? index} style={styles.tile}>
          {!item?.isActive && (
            <View style={styles.soonBadge}>
              <Text style={styles.soonText}>Soon</Text>
            </View>
          )}
          {item?.catImageUrl ? (
            <Image
              source={{ uri: CONFIG.image_base_url + item.catImageUrl }}
              style={styles.icon}
              resizeMode="contain"
            />
          ) : null}
          <Text style={styles.label}>{item?.catName}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginTop: 12,
  },
  tile: {
    flex: 1,
    alignItems: 'flex-start',
    borderRadius: 14,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  icon: {
    width: 20,
    height: 20,
  },
  soonBadge: {
    position: 'absolute',
    top: 10,
    right: 5,
    backgroundColor: 'rgba(154,92,255,0.18)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  soonText: {
    color: '#C9A6FF',
    fontSize: 9,
    fontFamily: 'Gilroy-Bold',
    letterSpacing: 0.3,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Gilroy-SemiBold',
    lineHeight: 16,
    marginTop: 10,
  },
});

export default React.memo(ExploreMoreRow);
