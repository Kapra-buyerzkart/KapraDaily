import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HOME_FONTS } from '../../../Home/redesign/theme';
import { TRACKER_STEPS } from '../data/selectors';
import { ORDER_COLORS, fs, s } from './theme';

type Props = {
  step: number;
};

const OrderTracker: React.FC<Props> = ({ step }) => (
  <View style={styles.wrap} testID="order-tracker">
    <View style={styles.rail}>
      {TRACKER_STEPS.map((label, index) => {
        const done = index <= step;
        return (
          <React.Fragment key={label}>
            {index > 0 ? (
              <View
                style={[
                  styles.connector,
                  done ? styles.connectorDone : null,
                ]}
              />
            ) : null}
            <Ionicons
              name="checkmark-circle"
              size={fs(17)}
              color={done ? ORDER_COLORS.accent : ORDER_COLORS.rail}
            />
          </React.Fragment>
        );
      })}
    </View>
    <View style={styles.labels}>
      {TRACKER_STEPS.map((label, index) => (
        <Text
          key={label}
          numberOfLines={1}
          style={[
            styles.label,
            index === 0 ? styles.labelFirst : null,
            index === TRACKER_STEPS.length - 1 ? styles.labelLast : null,
            index <= step ? styles.labelDone : null,
          ]}
        >
          {label}
        </Text>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  wrap: { marginTop: s(14) },
  rail: { flexDirection: 'row', alignItems: 'center' },
  connector: {
    flex: 1,
    height: s(2),
    backgroundColor: ORDER_COLORS.rail,
  },
  connectorDone: { backgroundColor: ORDER_COLORS.accent },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: s(6),
  },
  label: {
    flex: 1,
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(9),
    color: ORDER_COLORS.inkMuted,
    textAlign: 'center',
  },
  labelFirst: { textAlign: 'left' },
  labelLast: { textAlign: 'right' },
  labelDone: { color: ORDER_COLORS.ink },
});

export default OrderTracker;
