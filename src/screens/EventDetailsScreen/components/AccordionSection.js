import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import COLORS from '@/styles/colors';
import styles from '../styles';

const AccordionSection = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen(prev => !prev);
  };

  return (
    <View style={styles.accordion}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.accordionHeader}
        onPress={toggle}
      >
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={COLORS.white}
        />
      </TouchableOpacity>
      {open && (
        <>
          <View style={styles.divider} />
          <View style={styles.accordionBody}>
            {typeof children === 'string' ? (
              <Text style={styles.accordionText}>{children}</Text>
            ) : (
              children
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default AccordionSection;
