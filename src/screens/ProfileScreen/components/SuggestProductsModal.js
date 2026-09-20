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

const QUICK_PICKS = ['Gold Coins', 'Diamond Rings', 'Bangles', 'Chains', 'Earrings'];

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
              name="diamond-stone"
              size={wp('5.2%')}
              color="#0C382E"
            />
          </View>

          <View style={styles.headerCopy}>
            <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.title}>
              Looking for a piece?
            </Text>
            <Text
              maxFontSizeMultiplier={MAX_FONT_SCALE}
              style={styles.subtitle}
            >
              Tell our jewellers what you're seeking and we'll craft it
            </Text>
          </View>
        </View>

        <View style={styles.inputCard}>
          <MaterialIcons
            name="search"
            size={wp('5%')}
            color="#9E9E9E"
          />
          <BottomSheetTextInput
            value={requestText}
            onChangeText={setRequestText}
            placeholder="eg: solitaire ring, floral bangle ..."
            placeholderTextColor="#9E9E9E"
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
                color="#666666"
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
            color="#666666"
          />
          <Text maxFontSizeMultiplier={MAX_FONT_SCALE} style={styles.noteText}>
            Our jewellery specialists review each request promptly
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.88}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
        >
          {isSubmittingRequest ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons
                name="send"
                size={wp('4.4%')}
                color={canSubmit ? '#FFFFFF' : '#9E9E9E'}
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  handleIndicator: {
    backgroundColor: '#D8D4CC',
    width: 44,
    height: 4,
    borderRadius: 2,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  headerDisc: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E8F2EE',
    borderWidth: 1,
    borderColor: '#D1E6DD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: 22,
    lineHeight: 26,
    color: '#12372A',
    letterSpacing: -0.2,
  },
  subtitle: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    lineHeight: 16,
    color: '#666666',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#ECE7DE',
    borderRadius: 14,
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 14,
    paddingVertical: hp('1.3%'),
  },
  input: {
    flex: 1,
    fontFamily: 'Lexend-Regular',
    fontSize: 13.5,
    color: '#12372A',
    padding: 0,
  },
  sectionLabel: {
    fontFamily: 'Lexend-Medium',
    fontSize: 12,
    color: '#12372A',
    marginTop: 16,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    borderColor: '#ECE7DE',
    backgroundColor: '#FAF8F5',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: hp('0.7%'),
  },
  chipSelected: {
    borderColor: '#0C382E',
    backgroundColor: '#E8F2EE',
  },
  chipText: {
    fontFamily: 'Lexend-Regular',
    fontSize: 12,
    color: '#555555',
  },
  chipTextSelected: {
    color: '#0C382E',
    fontFamily: 'Lexend-Medium',
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: hp('1.1%'),
    borderRadius: 12,
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#ECE7DE',
  },
  noteText: {
    flex: 1,
    fontFamily: 'Lexend-Regular',
    fontSize: 11.5,
    color: '#666666',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 16,
    height: hp('5.6%'),
    borderRadius: 14,
    backgroundColor: '#0C382E',
  },
  submitBtnDisabled: {
    backgroundColor: '#D1DDD8',
  },
  submitText: {
    fontFamily: 'Lexend-Medium',
    fontSize: 14,
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  submitTextDisabled: {
    color: '#888888',
  },
});
