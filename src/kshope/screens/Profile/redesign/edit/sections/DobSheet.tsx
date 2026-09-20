import React from 'react';
import {
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { EDIT_COLORS, EDIT_FONTS } from '../editTheme';

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
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Select Date of Birth</Text>

            <TouchableOpacity
              onPress={() => onConfirm(value)}
              style={styles.action}
            >
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.picker}>
            <DateTimePicker
              value={value}
              mode="date"
              display="spinner"
              maximumDate={new Date()}
              onChange={(_event, selected) => selected && onChange(selected)}
              textColor={EDIT_COLORS.textPrimary}
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
    backgroundColor: 'rgba(12, 56, 46, 0.45)',
  },
  sheet: {
    backgroundColor: EDIT_COLORS.card,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? hp('4%') : hp('2%'),
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('1.8%'),
    borderBottomWidth: 1,
    borderBottomColor: EDIT_COLORS.border,
  },
  action: {
    paddingVertical: hp('0.5%'),
    paddingHorizontal: wp('2%'),
  },
  cancelText: {
    fontFamily: EDIT_FONTS.body,
    fontSize: wp('3.5%'),
    color: EDIT_COLORS.textMuted,
  },
  headerTitle: {
    fontFamily: EDIT_FONTS.heading,
    fontSize: wp('4.6%'),
    color: EDIT_COLORS.textPrimary,
  },
  doneText: {
    fontFamily: EDIT_FONTS.bodySemiBold,
    fontSize: wp('3.5%'),
    color: EDIT_COLORS.emerald,
  },
  picker: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('2%'),
    backgroundColor: EDIT_COLORS.card,
  },
});
