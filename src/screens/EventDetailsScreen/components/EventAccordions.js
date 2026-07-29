import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import HtmlBody from '@/components/HtmlBody';
import styles from '../styles';
import AccordionSection from './AccordionSection';

const BODY_MAX_HEIGHT = 280;

const EventAccordions = ({ details, terms, onExpand }) => (
  <View style={styles.accordionGroup}>
    <Animated.View entering={FadeInUp.delay(200).duration(400)}>
      <AccordionSection
        title="Details"
        maxHeight={details ? BODY_MAX_HEIGHT : undefined}
        onExpand={onExpand}
      >
        {details ? (
          <HtmlBody html={details} />
        ) : (
          'Details about this event will appear here.'
        )}
      </AccordionSection>
    </Animated.View>
    <Animated.View entering={FadeInUp.delay(240).duration(400)}>
      <AccordionSection
        title="Terms & Conditions"
        maxHeight={terms ? BODY_MAX_HEIGHT : undefined}
        onExpand={onExpand}
      >
        {terms ? (
          <HtmlBody html={terms} />
        ) : (
          'Terms & conditions for this event will appear here.'
        )}
      </AccordionSection>
    </Animated.View>
  </View>
);

export default React.memo(EventAccordions);
