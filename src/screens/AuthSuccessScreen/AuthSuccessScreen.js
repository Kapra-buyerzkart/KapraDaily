import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation, useRoute } from '@react-navigation/native';

import ComingSoonModal from '@/components/ComingSoonModal';
import HomeWheelBottomSheetModal from '@/components/HomeWheelBottomSheetModal';

import { BrandMark } from './molecules';
import { LandingBackdrop, ServiceGrid } from './organisms';
import { PALETTE, SPACING } from './theme';
import useAuthSuccess from './useAuthSuccess';
import { extractCampaignAndRewards } from '@/api/spinWheelService';

const AuthSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const homeWheelModalRef = useRef(null);
  const [wheelVisibilityData, setWheelVisibilityData] = useState(null);
  const pendingActionRef = useRef(null);
  const visibilityDataRef = useRef(null);

  const handleEntitled = useCallback((visibilityData, normalAction) => {
    const campaignInfo = extractCampaignAndRewards(visibilityData);
    if (!Array.isArray(campaignInfo?.rewards) || campaignInfo.rewards.length < 3) {
      console.log(
        `[AuthSuccessScreen] Backend rewards count (${campaignInfo?.rewards?.length || 0}) < 3; bypassing spin wheel flow.`,
      );
      if (typeof normalAction === 'function') {
        normalAction();
      }
      return;
    }

    console.log(
      '[AuthSuccessScreen] Entitled to spin wheel with visibilityData:\n',
      JSON.stringify(visibilityData, null, 2),
    );
    pendingActionRef.current = normalAction;
    visibilityDataRef.current = visibilityData;
    setWheelVisibilityData(visibilityData);
    homeWheelModalRef.current?.present(visibilityData);
  }, []);

  const {
    tiles,
    handleSelect,
    isComingSoonVisible,
    closeComingSoon,
    isCheckingWheel,
  } = useAuthSuccess({
    onEntitled: handleEntitled,
  });

  const handleDismissWheelModal = useCallback(() => {
    if (typeof pendingActionRef.current === 'function') {
      const fn = pendingActionRef.current;
      pendingActionRef.current = null;
      fn();
    } else {
      navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
    }
  }, [navigation]);

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

      {/* Loading overlay during eligibility verification */}
      {isCheckingWheel && (
        <View style={styles.loadingBackdrop}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="small" color="#FF7300" />
            <Text style={styles.loadingText}>Checking rewards...</Text>
          </View>
        </View>
      )}

      {/* Home Game-Show Lucky Wheel Bottom Sheet Modal */}
      <HomeWheelBottomSheetModal
        ref={homeWheelModalRef}
        visibilityData={wheelVisibilityData}
        onDismiss={handleDismissWheelModal}
        onSpinSuccess={(wonPrize) => {
          console.log('[AuthSuccessScreen] Spin success:', wonPrize);
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
  loadingBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  loadingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  loadingText: {
    marginLeft: 12,
    fontSize: 14,
    color: '#212121',
    fontWeight: '600',
  },
});
