import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import { StyleSheet, BackHandler, Platform } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

/**
 * CustomBottomModal
 *
 * A generic, reusable bottom sheet built on @gorhom/bottom-sheet.
 * Fully imperative: visibility is never driven by parent state, only by
 * ref methods (open/close/snapTo/expand/collapse). This avoids the
 * re-render churn and flicker that comes from toggling a boolean prop.
 */
const CustomBottomModal = forwardRef((props, ref) => {
  const {
    snapPoints,
    data,
    renderContent,
    onClose,
    enablePanDownToClose = true,
    backgroundStyle,
    handleIndicatorStyle,
    keyboardBehavior = 'interactive',
    keyboardBlurBehavior = 'restore',
    // Lifts the sheet (and dims everything except) this many px off the
    // bottom, e.g. to float it above a sticky checkout bar that should stay
    // visible and tappable underneath.
    bottomInset = 0,
  } = props;

  const sheetRef = useRef(null);
  // Tracks whether the sheet is currently presented so the Android back
  // button handler knows whether to intercept the press.
  const isOpenRef = useRef(false);
  const insets = useSafeAreaInsets();

  // Recomputed only when the caller passes a new snapPoints array.
  const resolvedSnapPoints = useMemo(
    () => snapPoints ?? ['50%'],
    [snapPoints],
  );

  const handleOpen = useCallback(() => {
    sheetRef.current?.present();
  }, []);

  const handleClose = useCallback(() => {
    sheetRef.current?.dismiss();
  }, []);

  const handleSnapTo = useCallback(index => {
    sheetRef.current?.snapToIndex(index);
  }, []);

  const handleExpand = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const handleCollapse = useCallback(() => {
    sheetRef.current?.collapse();
  }, []);

  // Expose a stable imperative API to the parent via ref.
  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
      snapTo: handleSnapTo,
      expand: handleExpand,
      collapse: handleCollapse,
    }),
    [handleOpen, handleClose, handleSnapTo, handleExpand, handleCollapse],
  );

  // Fires on every sheet position change, including user-driven pan-down
  // dismiss and backdrop press dismiss (index === -1 means fully closed).
  const handleSheetChange = useCallback(
    index => {
      isOpenRef.current = index >= 0;
      if (index === -1) {
        onClose?.();
      }
    },
    [onClose],
  );

  // Backdrop with a fade animation; tapping it dismisses the sheet. When a
  // bottomInset is set, stop the backdrop short of it so the content below
  // (e.g. the sticky checkout bar) stays visible and receives touches.
  const renderBackdrop = useCallback(
    backdropProps => (
      <BottomSheetBackdrop
        {...backdropProps}
        style={[backdropProps.style, bottomInset ? { bottom: bottomInset } : null]}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    [bottomInset],
  );

  // Render prop wrapper so FlatList/ScrollView content passed via
  // renderContent stays inside BottomSheetView's gesture context.
  const renderSheetContent = useCallback(
    () => renderContent?.(data),
    [renderContent, data],
  );

  // Android hardware back button should close the sheet instead of
  // navigating away, but only while the sheet is actually open.
  useEffect(() => {
    if (Platform.OS !== 'android') {
      return undefined;
    }

    const onBackPress = () => {
      if (isOpenRef.current) {
        handleClose();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );

    // Cleanup listener on unmount to avoid leaks/duplicate handlers.
    return () => subscription.remove();
  }, [handleClose]);

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={resolvedSnapPoints}
      bottomInset={bottomInset}
      enablePanDownToClose={enablePanDownToClose}
      enableDynamicSizing={false}
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      keyboardBehavior={keyboardBehavior}
      keyboardBlurBehavior={keyboardBlurBehavior}
      backgroundStyle={[styles.background, backgroundStyle]}
      handleIndicatorStyle={[styles.handleIndicator, handleIndicatorStyle]}
      style={styles.shadow}
    >
      <BottomSheetView
        style={[styles.content, { paddingBottom: insets.bottom }]}
      >
        {renderSheetContent()}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

CustomBottomModal.displayName = 'CustomBottomModal';

const styles = StyleSheet.create({
  background: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  handleIndicator: {
    backgroundColor: '#DADADA',
    width: wp('12%'),
  },
  content: {
    flex: 1,
  },
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
  },
});

// Memoized so the sheet only re-renders when its own props actually
// change, not whenever the parent screen re-renders for unrelated reasons.
export default React.memo(CustomBottomModal);
