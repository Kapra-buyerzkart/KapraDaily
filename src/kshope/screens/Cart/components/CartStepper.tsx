import React from 'react';
import { View, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppText } from '../../../components/atoms';
import {
  UI_COLORS,
  UI_SPACING,
  hp,
  wp,
} from '../../../theme/tokens';

const STEPS = ['Address', 'Summary', 'Payment'];
const NODE = 20;

interface CartStepperProps {
  current?: number;
}

const CartStepper: React.FC<CartStepperProps> = ({ current = 1 }) => (
  <View style={styles.container}>
    <View style={styles.track}>
      {STEPS.map((step, index) => (
        <React.Fragment key={step}>
          {index > 0 && (
            <View
              style={[styles.line, index <= current && styles.lineActive]}
            />
          )}
          <View style={styles.node}>
            {index < current && (
              <View style={styles.dotDone}>
                <MaterialCommunityIcons
                  name="check"
                  size={wp('3%')}
                  color={UI_COLORS.onPrimary}
                />
              </View>
            )}
            {index === current && (
              <View style={styles.dotCurrentHalo}>
                <View style={styles.dotCurrentCore} />
              </View>
            )}
            {index > current && <View style={styles.dotUpcoming} />}
          </View>
        </React.Fragment>
      ))}
    </View>

    <View style={styles.labels}>
      {STEPS.map((step, index) => (
        <AppText
          key={step}
          variant={index === current ? 'captionStrong' : 'caption'}
          tone={index <= current ? 'brand' : 'faint'}
          style={[
            styles.label,
            index === 0 && styles.labelStart,
            index === STEPS.length - 1 && styles.labelEnd,
          ]}
        >
          {step}
        </AppText>
      ))}
    </View>
  </View>
);

export default React.memo(CartStepper);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: UI_SPACING.xxl,
    marginTop: hp('1%'),
  },
  track: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  node: {
    width: NODE,
    height: NODE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    height: 2,
    borderRadius: 1,
    marginHorizontal: UI_SPACING.xs,
    backgroundColor: UI_COLORS.border,
  },
  lineActive: {
    backgroundColor: UI_COLORS.primary,
  },
  dotDone: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: UI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrentHalo: {
    width: NODE,
    height: NODE,
    borderRadius: NODE / 2,
    backgroundColor: UI_COLORS.primaryTint,
    borderWidth: 2,
    borderColor: UI_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrentCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: UI_COLORS.primary,
  },
  dotUpcoming: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: UI_COLORS.card,
    borderWidth: 2,
    borderColor: UI_COLORS.borderStrong,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: UI_SPACING.sm,
  },
  label: {
    flex: 1,
    textAlign: 'center',
  },
  labelStart: {
    textAlign: 'left',
  },
  labelEnd: {
    textAlign: 'right',
  },
});
