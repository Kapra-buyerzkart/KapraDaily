import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';
import { styles, GRAY_300 } from '../styles';

const SuggestProductsModal = forwardRef(function SuggestProductsModal(
  { requestText, setRequestText, isSubmittingRequest, onSubmit },
  ref,
) {
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ['45%'], []);

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

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={0}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.suggestSheetBackground}
      handleIndicatorStyle={styles.suggestSheetHandle}
    >
      <BottomSheetView style={styles.sendContainer}>
        <Text style={styles.sendContainerTextOne}>Didnt Find Your Product!</Text>
        <Text style={styles.sendContainerTextTwo}>
          Tell us which product you want in our app
        </Text>
        <View style={styles.sendContainerInnerView}>
          <TextInput
            placeholderTextColor={GRAY_300}
            placeholder="eg: biscuit, caske, fruits ..."
            style={styles.sendTextInput}
            value={requestText}
            onChangeText={setRequestText}
          />
          <TouchableOpacity
            onPress={onSubmit}
            disabled={isSubmittingRequest}
            style={styles.sendButton}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default SuggestProductsModal;
