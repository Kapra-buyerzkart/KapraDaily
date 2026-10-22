import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation, useRoute } from '@react-navigation/native';

import ComingSoonModal from '@/components/ComingSoonModal';
import OrderGiftCartCelebration from '@/components/OrderGiftCartCelebration';

import { BrandMark } from './molecules';
import { LandingBackdrop, ServiceGrid } from './organisms';
import { PALETTE, SPACING } from './theme';
import useAuthSuccess from './useAuthSuccess';

const AuthSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const { tiles, handleSelect, isComingSoonVisible, closeComingSoon } =
    useAuthSuccess();

  return (
    <View style={styles.screen}>
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />

      <LandingBackdrop />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + SPACING.lg,
            paddingBottom: insets.bottom + SPACING.xxxl,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <BrandMark />
        <ServiceGrid tiles={tiles} onSelect={handleSelect} />
      </ScrollView>

      {/* Onboarding Welcome Spin & Celebration */}
      <OrderGiftCartCelebration
        mode="onboarding"
        isNewRegistration={Boolean(route?.params?.isNewRegistration)}
        onComplete={() => {
          navigation.navigate('SpinWheelRewardsScreen', {
            source: 'ONBOARDING',
            theme: 'welcome',
          });
        }}
        onTrackOrder={() => {
          // Secondary button in onboarding mode dismisses celebration
        }}
        onSkip={() => {
          // Secondary button in onboarding mode dismisses celebration
        }}
      />

      <ComingSoonModal
        visible={isComingSoonVisible}
        onClose={closeComingSoon}
      />
    </View>
  );
};

export default AuthSuccessScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: PALETTE.canvas,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
});
