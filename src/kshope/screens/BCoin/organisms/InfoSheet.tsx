import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

import { AppText } from '../../../components/atoms';
import { hp } from '../../../theme/tokens';
import { ChoiceChip } from '../atoms';
import { SheetHeader } from '../molecules';
import { UD_COIN_TOKEN_INFO, INFO_LANGUAGES } from '../constants';
import { PALETTE, RADIUS, SPACING } from '../theme';
import BottomSheet from './BottomSheet';

interface InfoSheetProps {
  visible: boolean;
  onClose: () => void;
}

const InfoSheet: React.FC<InfoSheetProps> = ({ visible, onClose }) => {
  const [language, setLanguage] = useState(INFO_LANGUAGES[0].id);

  const sections = useMemo(
    () => UD_COIN_TOKEN_INFO.filter(section => section.lang === language),
    [language],
  );

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeightPercent={85}>
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
              <AppText variant="heading" style={styles.cardTitle}>
                {section.title}
              </AppText>
              <AppText variant="body" tone="secondary" style={styles.cardBody}>
                {section.body}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>
    </BottomSheet>
  );
};

export default React.memo(InfoSheet);

const styles = StyleSheet.create({
  langRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
  },
  scroll: {
    maxHeight: hp('62%'),
  },
  body: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
    gap: SPACING.md,
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
    padding: SPACING.lg,
  },
  cardTitle: {
    marginBottom: 6,
  },
  cardBody: {
    lineHeight: 20,
  },
});
