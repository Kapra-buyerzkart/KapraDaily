import React from 'react';
import { View } from 'react-native';
import Surface from '@/screens/cart/components/atoms/Surface';
import CartText from '@/screens/cart/components/atoms/CartText';
import Divider from '@/screens/cart/components/atoms/Divider';
import SectionHeading from '@/screens/cart/components/atoms/SectionHeading';
import ReasonBullet from '../atoms/ReasonBullet';
import { styles } from '../../styles';

const ReasonsCard = ({ title, reasons }) => (
  <Surface style={styles.section}>
    <View style={styles.card}>
      <SectionHeading title={title} />

      <View style={styles.reasonGroup}>
        {reasons.map((reason, index) => (
          <View key={reason.id}>
            {index > 0 ? <Divider style={styles.reasonSeparator} /> : null}
            <View style={styles.reasonRow}>
              <ReasonBullet icon={reason.icon} />
              <View style={styles.reasonCopy}>
                <CartText variant="labelStrong">{reason.title}</CartText>
                <CartText variant="caption" tone="muted">
                  {reason.description}
                </CartText>
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  </Surface>
);

export default React.memo(ReasonsCard);
