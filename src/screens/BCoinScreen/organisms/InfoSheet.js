import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import { CART_SPACING } from '@/styles/cartTheme';
import { hp } from '@/utils/responsive';

import { ChoiceChip, CoinText } from '../atoms';
import { SheetHeader } from '../molecules';
import { INFO_LANGUAGES, UD_COIN_TOKEN_INFO } from '../constants';
import { PALETTE, RADIUS } from '../theme';

const InfoSheet = ({ visible, onClose }) => {
  const modalRef = useRef(null);
  const [language, setLanguage] = useState(INFO_LANGUAGES[0].id);

  useEffect(() => {
    if (visible) {
      modalRef.current?.open();
    } else {
      modalRef.current?.close();
    }
  }, [visible]);

  const sections = useMemo(
    () => UD_COIN_TOKEN_INFO.filter(section => section.lang === language),
    [language],
  );

  return (
    <CustomModal
      ref={modalRef}
      position={MODAL_POSITION.BOTTOM}
      maxHeight={hp(85)}
      scrollable={false}
      onClose={onClose}
      contentStyle={styles.sheet}
    >
      <SheetHeader
        title="UD Coin & UD Token"
        caption="How earning and spending works"
        onClose={onClose}
      />

      <View style={styles.langRow}>
        {INFO_LANGUAGES.map(option => (
          <ChoiceChip
            key={option.id}
            label={option.label}
            isActive={language === option.id}
            accessibilityRole="button"
            accessibilityState={{ selected: language === option.id }}
            onPress={() => setLanguage(option.id)}
          />
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        {sections.map(section => (
          <View key={section.title} style={styles.card}>
            <View style={styles.accent} />
            <View style={styles.cardCopy}>
              <CoinText variant="heading" style={styles.cardTitle}>
                {section.title}
              </CoinText>
              <CoinText variant="body" tone="secondary" style={styles.cardBody}>
                {section.body}
              </CoinText>
            </View>
          </View>
        ))}
      </ScrollView>
    </CustomModal>
  );
};

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 6,
    paddingBottom: CART_SPACING.md,
  },
  langRow: {
    flexDirection: 'row',
    gap: CART_SPACING.sm,
    paddingHorizontal: CART_SPACING.xl,
    paddingTop: CART_SPACING.lg,
  },
  scroll: {
    maxHeight: hp(62),
  },
  body: {
    paddingHorizontal: CART_SPACING.xl,
    paddingTop: CART_SPACING.lg,
    paddingBottom: CART_SPACING.sm,
    gap: CART_SPACING.md,
  },
  card: {
    flexDirection: 'row',
    borderRadius: RADIUS.card,
    backgroundColor: PALETTE.well,
    overflow: 'hidden',
  },
  accent: {
    width: 3,
    backgroundColor: PALETTE.lineStrong,
  },
  cardCopy: {
    flex: 1,
    padding: CART_SPACING.lg,
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardBody: {
    lineHeight: 20,
  },
});

export default React.memo(InfoSheet);
