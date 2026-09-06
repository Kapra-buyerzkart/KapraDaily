import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { AppText } from '../../../../../components/atoms';
import {
  UI_COLORS,
  UI_RADIUS,
  UI_SPACING,
  hp,
} from '../../../../../theme/tokens';

interface Props {
  visible: boolean;
  value: Date;
  onChange: (next: Date) => void;
  onCancel: () => void;
  onConfirm: (next: Date) => void;
}

const DobSheet: React.FC<Props> = ({
  visible,
  value,
  onChange,
  onCancel,
  onConfirm,
}) => {
  if (Platform.OS === 'android') {
    if (!visible) return null;
    return (
      <DateTimePicker
        value={value}
        mode="date"
        display="spinner"
        maximumDate={new Date()}
        onChange={(event, selected) => {
          if (event.type === 'set' && selected) onConfirm(selected);
          else onCancel();
        }}
      />
    );
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onCancel}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel} style={styles.action}>
              <AppText variant="label" tone="muted">
                Cancel
              </AppText>
            </TouchableOpacity>

            <AppText variant="heading">Select Date of Birth</AppText>

            <TouchableOpacity
              onPress={() => onConfirm(value)}
              style={styles.action}
            >
              <AppText variant="labelStrong" tone="brand">
                Done
              </AppText>
            </TouchableOpacity>
          </View>

          <View style={styles.picker}>
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_event, selected) => selected && onChange(selected)}
              textColor={UI_COLORS.textPrimary}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default React.memo(DobSheet);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: UI_COLORS.overlay,
  },
  sheet: {
    backgroundColor: UI_COLORS.card,
    borderTopLeftRadius: UI_RADIUS.card,
    borderTopRightRadius: UI_RADIUS.card,
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: UI_COLORS.border,
  },
  action: {
    paddingVertical: UI_SPACING.xs,
  },
  picker: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: UI_SPACING.lg,
    backgroundColor: UI_COLORS.card,
  },
});
