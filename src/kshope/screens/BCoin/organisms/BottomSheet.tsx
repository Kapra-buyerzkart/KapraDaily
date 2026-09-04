import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import { hp } from '../../../theme/tokens';
import { PALETTE, RADIUS, SPACING } from '../theme';

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  maxHeightPercent?: number;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({
  visible,
  onClose,
  maxHeightPercent = 85,
  children,
}) => (
  <Modal
    visible={visible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.overlay}>
      <TouchableOpacity
        style={styles.dismissArea}
        activeOpacity={1}
        onPress={onClose}
      />

      <View style={[styles.sheet, { maxHeight: hp(`${maxHeightPercent}%`) }]}>
        <View style={styles.handleHitArea}>
          <View style={styles.handle} />
        </View>
        {children}
      </View>
    </View>
  </Modal>
);

export default React.memo(BottomSheet);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: PALETTE.overlay,
    justifyContent: 'flex-end',
  },
  dismissArea: {
    flex: 1,
  },
  sheet: {
    backgroundColor: PALETTE.surface,
    borderTopLeftRadius: RADIUS.card,
    borderTopRightRadius: RADIUS.card,
    paddingBottom: SPACING.md,
  },
  handleHitArea: {
    width: '100%',
    paddingVertical: 10,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: PALETTE.lineStrong,
  },
});
