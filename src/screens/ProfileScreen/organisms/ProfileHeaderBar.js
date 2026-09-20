import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ProfileHeaderBar = ({
  name,
  onBack,
  backgroundStyle,
  borderStyle,
  titleStyle,
  nameStyle,
}) => {
  const insets = useSafeAreaInsets();

  const dynamicHeaderStyle = [
    styles.header,
    backgroundStyle,
    { paddingTop: insets.top ? insets.top + 8 : 14 },
  ];

  return (
    <Animated.View style={dynamicHeaderStyle}>
      <TouchableOpacity
        onPress={onBack}
        style={styles.backBtn}
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      >
        <Feather name="chevron-left" size={24} color="#12372A" />
      </TouchableOpacity>

      <View style={styles.centerTitleBlock} pointerEvents="none">
        <Animated.Text
          style={[styles.title, titleStyle]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          Profile
        </Animated.Text>
        {name ? (
          <Animated.Text
            style={[styles.title, styles.swapName, nameStyle]}
            numberOfLines={1}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
          >
            {name}
          </Animated.Text>
        ) : null}
      </View>

      <View style={styles.rightPlaceholder} />

      <Animated.View style={[styles.border, borderStyle]} />
    </Animated.View>
  );
};

export default React.memo(ProfileHeaderBar);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    zIndex: 10,
  },
  backBtn: {
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 2,
  },
  centerTitleBlock: {
    position: 'absolute',
    left: 48,
    right: 48,
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: wp('6%'),
    color: '#12372A',
    textAlign: 'center',
  },
  swapName: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  rightPlaceholder: {
    width: 38,
    height: 38,
  },
  border: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
});
