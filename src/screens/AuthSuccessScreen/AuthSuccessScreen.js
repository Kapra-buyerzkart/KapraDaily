import React from 'react';
import { ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ComingSoonModal from '@/components/ComingSoonModal';

import { BrandMark } from './molecules';
import { LandingBackdrop, ServiceGrid } from './organisms';
import { PALETTE, SPACING } from './theme';
import useAuthSuccess from './useAuthSuccess';

const AuthSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const {
    sources,
    openKapra,
    openKshope,
    openTickets,
    openD2c,
    isComingSoonVisible,
    closeComingSoon,
  } = useAuthSuccess();

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
        <ServiceGrid
          sources={sources}
          openKapra={openKapra}
          openKshope={openKshope}
          openTickets={openTickets}
          openD2c={openD2c}
        />
      </ScrollView>

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
    paddingTop: 20,
    backgroundColor: PALETTE.canvas,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
});
