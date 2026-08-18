import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
  BottomSheetTextInput,
} from '@gorhom/bottom-sheet';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CART_COLORS,
  CART_RADIUS,
  CART_SPACING,
  CART_TYPE,
  MAX_FONT_SCALE,
  hitSlopTo,
  wp,
  hp,
} from '../../../styles/cartTheme';

const QUICK_PICKS = ['Biscuits', 'Cakes', 'Fruits', 'Snacks', 'Beverages'];

const QuickPick = ({ label, selected, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onPress}
    hitSlop={hitSlopTo(40)}
    style={[styles.chip, selected && styles.chipSelected]}
  >
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      style={[styles.chipText, selected && styles.chipTextSelected]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const SuggestProductsModal = forwardRef(function SuggestProductsModal(
  { requestText, setRequestText, isSubmittingRequest, onSubmit },
  ref,
) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['50%'], []);

  useImperativeHandle(ref, () => ({
    open: () => sheetRef.current?.present(),
    close: () => sheetRef.current?.dismiss(),
  }));

  const renderBackdrop = useCallback(
    backdropProps => (
      <BottomSheetBackdrop
        {...backdropProps}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [],
  );

  const trimmed = (requestText || '').trim();
  const canSubmit = trimmed.length > 0 && !isSubmittingRequest;

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handleIndicator}
    >
      <BottomSheetView style={styles.content}>
        <View style={styles.headerRow}>
          <View style={styles.headerDisc}>
            <MaterialCommunityIcons
              name="cart-plus"
              size={wp('5.2%')}
              color={CART_COLORS.primary}
            />
          </View>

          <View style={styles.headerCopy}>
            <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.title}>
              Didn't find your product?
            </Text>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={styles.subtitle}
            >
              Tell us what to stock and we'll try to add it
            </Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <MaterialIcons
            name="search"
            size={wp('5%')}
            color={CART_COLORS.textFaint}
          />
          <BottomSheetTextInput
            value={requestText}
            onChangeText={setRequestText}
            placeholder="eg: biscuits, cake, fruits ..."
            placeholderTextColor={CART_COLORS.textFaint}
            maxFontSizeMultiplier={MAX_FONT_SCALE}
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={canSubmit ? onSubmit : undefined}
          />
          {trimmed.length > 0 ? (
            <TouchableOpacity
              onPress={() => setRequestText('')}
              hitSlop={hitSlopTo(40)}
            >
              <MaterialIcons
                name="close"
                size={wp('4.6%')}
                color={CART_COLORS.textMuted}
              />
            </TouchableOpacity>
          ) : null}
        </View>

        <Text
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          style={styles.sectionLabel}
        >
          Popular requests
        </Text>

        <View style={styles.chipRow}>
          {QUICK_PICKS.map(item => (
            <QuickPick
              key={item}
              label={item}
              selected={trimmed.toLowerCase() === item.toLowerCase()}
              onPress={() => setRequestText(item)}
            />
          ))}
        </View>

        <View style={styles.noteRow}>
          <MaterialCommunityIcons
            name="information-outline"
            size={wp('4%')}
            color={CART_COLORS.textMuted}
          />
          <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.noteText}>
            We review every request and notify you once it's live
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
        >
          {isSubmittingRequest ? (
            <ActivityIndicator size="small" color={CART_COLORS.onPrimary} />
          ) : (
            <>
              <MaterialIcons
                name="send"
                size={wp('4.4%')}
                color={
                  canSubmit ? CART_COLORS.onPrimary : CART_COLORS.textFaint
                }
              />
              <Text
                maxFontSizeMultiplier={MAX_FONT_SCALE}
                style={[
                  styles.submitText,
                  !canSubmit && styles.submitTextDisabled,
                ]}
              >
                Send request
              </Text>
            </>
          )}
        </TouchableOpacity>
        <View style={{ height: hp('5%') }} />
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SuggestProductsModal;

const styles = StyleSheet.create({
  background: {
    backgroundColor: CART_COLORS.card,
    borderTopLeftRadius: CART_RADIUS.card,
    borderTopRightRadius: CART_RADIUS.card,
  },
  handleIndicator: {
    backgroundColor: CART_COLORS.graySoftColor,
    width: wp('12%'),
  },
  content: {
    paddingHorizontal: CART_SPACING.lg,
    paddingTop: CART_SPACING.xs,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.md,
    marginBottom: CART_SPACING.lg,
  },
  headerDisc: {
    width: wp('10%'),
    height: wp('10%'),
    borderRadius: CART_RADIUS.icon,
    backgroundColor: CART_COLORS.primaryTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...CART_TYPE.heading,
    color: CART_COLORS.textPrimary,
  },
  subtitle: {
    ...CART_TYPE.micro,
    color: CART_COLORS.textMuted,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    borderRadius: CART_RADIUS.input,
    backgroundColor: CART_COLORS.well,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.3%'),
  },
  input: {
    flex: 1,
    ...CART_TYPE.body,
    color: CART_COLORS.textPrimary,
    padding: 0,
  },
  sectionLabel: {
    ...CART_TYPE.micro,
    color: CART_COLORS.textMuted,
    marginTop: CART_SPACING.lg,
    marginBottom: CART_SPACING.sm,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: CART_SPACING.sm,
  },
  chip: {
    borderWidth: 1,
    borderColor: CART_COLORS.border,
    backgroundColor: CART_COLORS.card,
    borderRadius: CART_RADIUS.pill,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('0.7%'),
  },
  chipSelected: {
    borderColor: CART_COLORS.primaryEdge,
    backgroundColor: CART_COLORS.primaryTint,
  },
  chipText: {
    ...CART_TYPE.micro,
    color: CART_COLORS.textSecondary,
  },
  chipTextSelected: {
    color: CART_COLORS.primary,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: CART_SPACING.sm,
    marginTop: CART_SPACING.lg,
    paddingHorizontal: CART_SPACING.md,
    paddingVertical: hp('1.1%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.well,
  },
  noteText: {
    flex: 1,
    ...CART_TYPE.micro,
    color: CART_COLORS.textMuted,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: CART_SPACING.sm,
    marginTop: CART_SPACING.lg,
    paddingVertical: hp('1.6%'),
    borderRadius: CART_RADIUS.button,
    backgroundColor: CART_COLORS.primary,
  },
  submitBtnDisabled: {
    backgroundColor: CART_COLORS.well,
  },
  submitText: {
    ...CART_TYPE.cta,
    color: CART_COLORS.onPrimary,
  },
  submitTextDisabled: {
    color: CART_COLORS.textFaint,
  },
});
