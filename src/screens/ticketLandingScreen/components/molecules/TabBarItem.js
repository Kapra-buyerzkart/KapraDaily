import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { CountBadge, TicketText } from '../atoms';

const ICON_SIZE = wp('6.12%');

const TabBarItem = ({ icon, label, badgeCount = 0, iconStyle, onPress }) => (
  <TouchableOpacity style={styles.item} activeOpacity={0.8} onPress={onPress}>
    <View>
      <Image
        source={icon}
        style={iconStyle ?? styles.tabImage}
        resizeMode="contain"
      />
      <CountBadge count={badgeCount} />
    </View>
    <TicketText variant="tabLabel" style={styles.label}>
      {label}
    </TicketText>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  label: {
    marginTop: 5,
  },
  tabImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
});

export default React.memo(TabBarItem);
