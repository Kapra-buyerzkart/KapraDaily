import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { styles } from '../styles';
import icons from '@/assets/icons';
import { MAX_FONT_SCALE } from '@/styles/homeTheme';
import { PRESS_IN, PRESS_OUT } from '../motion';

const ACTIONS = [
  {
    key: 'orders',
    icon: icons.myorder,
    label: 'My\nOrders',
    a11y: 'My Orders',
  },
  {
    key: 'address',
    icon: icons.savedAddress,
    label: 'Saved\nAddress',
    a11y: 'Saved Address',
  },
  {
    key: 'co-partner',
    icon: icons.coPartnerdashboard,
    label: 'Co-Partner\nDashboard',
    a11y: 'Co-Partner Dashboard',
  },
  {
    key: 'refer',
    icon: icons.referNearn,
    label: 'Refer &\nEarn',
    a11y: 'Refer and Earn',
  },
];

// Only the well scales — the label underneath stays put. Scaling the whole
// column would drag the text off its baseline and make the row look like it
// were breathing.
const QuickAction = ({ icon, label, a11y, onPress }) => {
  const scale = useSharedValue(1);
  const wellStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withTiming(0.94, PRESS_IN);
      }}
      onPressOut={() => {
        scale.value = withSpring(1, PRESS_OUT);
      }}
      style={styles.quickActionItem}
      accessibilityRole="button"
      accessibilityLabel={a11y}
    >
      <Animated.View style={[styles.quickActionWell, wellStyle]}>
        <Image source={icon} style={styles.quickActionIcon} />
      </Animated.View>
      <Text
        style={styles.quickActionText}
        numberOfLines={2}
        maxFontSizeMultiplier={MAX_FONT_SCALE}
      >
        {label}
      </Text>
    </Pressable>
  );
};

export default function ProfileQuickActions({
  onMyOrders,
  onSavedAddress,
  onCoPartnerDashboard,
  onRefer,
}) {
  const handlers = {
    orders: onMyOrders,
    address: onSavedAddress,
    'co-partner': onCoPartnerDashboard,
    refer: onRefer,
  };

  return (
    <View style={styles.quickActionsRow}>
      {ACTIONS.map(action => (
        <QuickAction
          key={action.key}
          icon={action.icon}
          label={action.label}
          a11y={action.a11y}
          onPress={handlers[action.key]}
        />
      ))}
    </View>
  );
}
