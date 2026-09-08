import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from '@sbaiahmed1/react-native-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';

import BallPulse from '@/components/BallPulse';

import { sheetStyles } from '../../styles';
import {
  AREA_MAP_ILLUSTRATION,
  AREA_SHEET_EYEBROW,
  AREA_SHEET_SUBTITLE,
  AREA_SHEET_TITLE,
} from '../../constants';
import {
  COLORS,
  RADIUS,
  SPACING,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  hitSlopTo,
} from '../../theme';
import { LocText } from '../atoms';
import { AreaOptionRow } from '../molecules';

const keyExtractor = (item, index) => index.toString();

const AreaSelectionSheet = ({
  visible,
  onClose,
  listOfLocations,
  selectedLocation,
  onSelectArea,
  onSkip,
  onApply,
  applyLoading,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <BlurView
          style={sheetStyles.blur}
          blurType="light"
          blurAmount={1}
          overlayColor={Platform.OS === 'ios' ? undefined : 'transparent'}
          reducedTransparencyFallbackColor="black"
        />
        <View
          style={[
            sheetStyles.sheet,
            styles.sheet,
            { paddingBottom: SPACING.lg + insets.bottom },
          ]}
        >
          <TouchableOpacity
            style={styles.grabZone}
            onPress={onClose}
            activeOpacity={0.6}
            hitSlop={hitSlopTo(24)}
          >
            <View style={styles.grabber} />
          </TouchableOpacity>

          <View style={styles.headline}>
            <Image
              source={AREA_MAP_ILLUSTRATION}
              style={styles.illustration}
              resizeMode="contain"
            />

            <View style={styles.headlineCopy}>
              <LocText variant="micro" tone="brand" style={styles.eyebrow}>
                {AREA_SHEET_EYEBROW}
              </LocText>
              <LocText
                variant="display"
                tone="primary"
                numberOfLines={1}
                adjustsFontSizeToFit
                style={styles.title}
              >
                {AREA_SHEET_TITLE}
              </LocText>
            </View>

            <LocText variant="caption" tone="muted" style={styles.subtitle}>
              {AREA_SHEET_SUBTITLE}
            </LocText>
          </View>

          <FlatList
            data={listOfLocations}
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <AreaOptionRow
                item={item}
                isSelected={
                  !!selectedLocation &&
                  selectedLocation?.pincodeAreaId == item?.pincodeAreaId
                }
                onPress={onSelectArea}
              />
            )}
            keyExtractor={keyExtractor}
          />

          {listOfLocations && listOfLocations.length > 1 && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.button, styles.skipButton]}
                onPress={onSkip}
                activeOpacity={0.85}
              >
                <LocText variant="cta" tone="brand">
                  Skip
                </LocText>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.applyButton]}
                onPress={onApply}
                activeOpacity={0.85}
                disabled={applyLoading}
              >
                {applyLoading ? (
                  <BallPulse color={COLORS.onBrand} size="small" />
                ) : (
                  <>
                    <LocText variant="cta" tone="onBrand">
                      Apply
                    </LocText>
                    <Ionicons
                      name="arrow-forward"
                      size={16}
                      color={COLORS.onBrand}
                      style={styles.applyArrow}
                    />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(AreaSelectionSheet);

const ILLUSTRATION_WIDTH = Math.round(WINDOW_WIDTH * 0.36);
const ILLUSTRATION_HEIGHT = Math.round(ILLUSTRATION_WIDTH * (109 / 130));

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    alignItems: 'stretch',
    paddingTop: SPACING.sm,
    maxHeight: WINDOW_HEIGHT * 0.8,
  },
  grabZone: {
    alignSelf: 'center',
    paddingVertical: SPACING.sm,
  },
  grabber: {
    width: 44,
    height: 4,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.lineStrong,
  },
  headline: {
    marginTop: SPACING.md,
  },
  headlineCopy: {
    paddingRight: ILLUSTRATION_WIDTH - SPACING.xl,
  },
  eyebrow: {
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  title: {
    marginTop: SPACING.xs,
  },
  subtitle: {
    marginTop: SPACING.sm,
    maxWidth: '82%',
  },
  illustration: {
    position: 'absolute',
    top: -SPACING.sm,
    right: -SPACING.xl,
    width: ILLUSTRATION_WIDTH,
    height: ILLUSTRATION_HEIGHT,
  },
  list: {
    marginTop: SPACING.xl,
  },
  listContent: {
    paddingBottom: SPACING.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: SPACING.lg,
  },
  button: {
    height: 52,
    borderRadius: RADIUS.button,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: SPACING.xxl,
  },
  skipButton: {
    minWidth: WINDOW_WIDTH * 0.28,
    backgroundColor: COLORS.brandWash,
  },
  applyButton: {
    minWidth: WINDOW_WIDTH * 0.34,
    marginLeft: SPACING.lg,
    backgroundColor: COLORS.brand,
  },
  applyArrow: {
    marginLeft: SPACING.sm,
  },
});
