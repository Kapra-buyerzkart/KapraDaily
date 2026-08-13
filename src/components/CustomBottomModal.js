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

const CustomBottomModal = forwardRef((props, ref) => {
  const {
    snapPoints,
    data,
    renderContent,
    onClose,
    onChange,
    enablePanDownToClose = true,
    backgroundStyle,
    handleIndicatorStyle,
    keyboardBehavior = 'interactive',
    keyboardBlurBehavior = 'restore',
    bottomInset = 0,
  } = props;

  const sheetRef = useRef(null);
  const isOpenRef = useRef(false);
  const insets = useSafeAreaInsets();

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

  const handleSheetChange = useCallback(
    index => {
      isOpenRef.current = index >= 0;
      onChange?.(index);
      if (index === -1) {
        onClose?.();
      }
    },
    [onChange, onClose],
  );

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

  const renderSheetContent = useCallback(
    () => renderContent?.(data),
    [renderContent, data],
  );

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

export default React.memo(CustomBottomModal);
