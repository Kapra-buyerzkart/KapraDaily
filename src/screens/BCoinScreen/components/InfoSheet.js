import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import CustomModal, { MODAL_POSITION } from '@/components/modal/CustomModal';
import { FONTS } from '@/styles/typography';
import { hp } from '@/utils/responsive';

import SheetHeader from './SheetHeader';
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
        {INFO_LANGUAGES.map(option => {
          const isActive = language === option.id;
          return (
            <Pressable
              key={option.id}
              style={[styles.langChip, isActive && styles.langChipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              onPress={() => setLanguage(option.id)}
            >
              <Text
                style={[styles.langText, isActive && styles.langTextActive]}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
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
              <Text style={styles.cardTitle}>{section.title}</Text>
              <Text style={styles.cardBody}>{section.body}</Text>
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
    paddingBottom: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  langChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.surface,
  },
  langChipActive: {
    borderColor: PALETTE.orange,
    backgroundColor: PALETTE.orangeTint,
  },
  langText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: 12.5,
    color: PALETTE.textSecondary,
  },
  langTextActive: {
    color: PALETTE.orange,
  },
  scroll: {
    maxHeight: hp(62),
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  card: {
    flexDirection: 'row',
    borderRadius: RADIUS.lg,
    backgroundColor: PALETTE.canvas,
    overflow: 'hidden',
  },
  accent: {
    width: 3,
    backgroundColor: PALETTE.gold,
  },
  cardCopy: {
    flex: 1,
    padding: 14,
  },
  cardTitle: {
    fontFamily: FONTS.gilroy.bold,
    fontSize: 14.5,
    color: PALETTE.textPrimary,
    marginBottom: 6,
  },
  cardBody: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: 13,
    lineHeight: 20,
    color: PALETTE.textSecondary,
  },
});

export default React.memo(InfoSheet);
