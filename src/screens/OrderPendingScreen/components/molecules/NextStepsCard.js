import React from 'react';
import { View } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import StepBullet from '../atoms/StepBullet';
import { styles } from '../../styles';

const NextStepsCard = ({ title, steps }) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <SectionHeading
        title={title}
        right={
          <CartText variant="micro" tone="faint">
            {steps.length} steps
          </CartText>
        }
      />

      <View style={styles.stepGroup}>
        {steps.map((step, index) => (
          <View key={step.id}>
            {index > 0 ? <Divider style={styles.stepSeparator} /> : null}
            <View style={styles.stepRow}>
              <StepBullet icon={step.icon} />
              <View style={styles.stepCopy}>
                <CartText variant="labelStrong">{step.title}</CartText>
                <CartText variant="caption" tone="muted">
                  {step.description}
                </CartText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  </Surface>
);

export default React.memo(NextStepsCard);
