import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import styles from '../styles';
import AccordionSection from './AccordionSection';

const EventAccordions = ({ details, terms }) => (
  <View style={styles.accordionGroup}>
    <Animated.View entering={FadeInUp.delay(200).duration(400)}>
      <AccordionSection title="Details">
        {details || 'Details about this event will appear here.'}
      </AccordionSection>
    </Animated.View>
    <Animated.View entering={FadeInUp.delay(240).duration(400)}>
      <AccordionSection title="Terms & Conditions">
        {terms || 'Terms & conditions for this event will appear here.'}
      </AccordionSection>
    </Animated.View>
  </View>
);

export default React.memo(EventAccordions);
