import React from 'react';
import { View } from 'react-native';
import styles from '../styles';
import AccordionSection from './AccordionSection';

const EventAccordions = ({ details, terms }) => (
  <View style={styles.accordionGroup}>
    <AccordionSection title="Details">
      {details || 'Details about this event will appear here.'}
    </AccordionSection>
    <AccordionSection title="Terms & Conditions">
      {terms || 'Terms & conditions for this event will appear here.'}
    </AccordionSection>
  </View>
);

export default EventAccordions;
