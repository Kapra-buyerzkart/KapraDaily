import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { AppText } from '../../components/atoms';
import SafeHtml from '../../components/SafeHtml';
import { AppIcons } from '../../assets/icons';
import {
  UI_COLORS,
  UI_SPACING,
  UI_TYPE,
  hitSlopTo,
  hp,
} from '../../theme/tokens';
import { getGeneralSettingsApi } from '../../../api/userService';
import TERMS_OF_USE from '../../../screens/TermsOfUseScreen/termsContent';

interface Section {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  footer?: string[];
}

const FALLBACK_SECTIONS: Record<string, Section[]> = {
  terms: TERMS_OF_USE as Section[],
};

const pickSetting = (items: any[], keys: string[]) => {
  for (const key of keys) {
    const match = items.find(
      item => String(item?.stName || '').toLowerCase() === key,
    );
    if (match?.stValue) {
      return String(match.stValue);
    }
  }
  return '';
};

const LegalContentScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const { settingKeys = [], title = '', fallback = '' } = route.params || {};

  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await getGeneralSettingsApi();
        const items = response?.data?.items || [];
        if (!cancelled) {
          setContent(pickSetting(items, settingKeys));
        }
      } catch {
        if (!cancelled) {
          setContent('');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchContent();
    return () => {
      cancelled = true;
    };
  }, [settingKeys]);

  const sections = !content ? FALLBACK_SECTIONS[fallback] : undefined;

  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={hitSlopTo(24)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppIcons.ArrowBack size={22} color={UI_COLORS.textPrimary} />
        </TouchableOpacity>
        <AppText variant="heading" accessibilityRole="header">
          {title}
        </AppText>
        <View style={styles.headerSpacer} />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={UI_COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.body}
          showsVerticalScrollIndicator={false}
        >
          {content ? (
            <SafeHtml
              contentWidth={width - UI_SPACING.xl * 2}
              source={{ html: content }}
              baseStyle={baseHtml}
            />
          ) : sections ? (
            sections.map(section => (
              <View key={section.title} style={styles.section}>
                <AppText variant="bodyStrong" style={styles.sectionTitle}>
                  {section.title}
                </AppText>

                {section.paragraphs?.map(paragraph => (
                  <AppText
                    key={paragraph}
                    variant="body"
                    tone="secondary"
                    style={styles.paragraph}
                  >
                    {paragraph}
                  </AppText>
                ))}

                {section.bullets?.map(bullet => (
                  <View key={bullet} style={styles.bulletRow}>
                    <AppText variant="body" tone="secondary">
                      {'•'}
                    </AppText>
                    <AppText variant="body" tone="secondary" style={styles.bulletText}>
                      {bullet}
                    </AppText>
                  </View>
                ))}

                {section.footer?.map(paragraph => (
                  <AppText
                    key={paragraph}
                    variant="body"
                    tone="secondary"
                    style={styles.paragraph}
                  >
                    {paragraph}
                  </AppText>
                ))}
              </View>
            ))
          ) : (
            <AppText variant="body" tone="muted" style={styles.empty}>
              No content available.
            </AppText>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LegalContentScreen;

const baseHtml = {
  ...UI_TYPE.body,
  color: UI_COLORS.textSecondary,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: UI_COLORS.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: hp('1.2%'),
    backgroundColor: UI_COLORS.card,
    gap: UI_SPACING.sm,
  },
  backBtn: {
    padding: UI_SPACING.xs,
  },
  headerSpacer: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    paddingHorizontal: UI_SPACING.xl,
    paddingBottom: hp('5%'),
    paddingTop: UI_SPACING.md,
  },
  section: {
    marginBottom: UI_SPACING.xxl,
  },
  sectionTitle: {
    marginBottom: UI_SPACING.sm,
  },
  paragraph: {
    marginBottom: UI_SPACING.sm,
  },
  bulletRow: {
    flexDirection: 'row',
    paddingLeft: UI_SPACING.sm,
    marginBottom: UI_SPACING.xs,
    gap: UI_SPACING.sm,
  },
  bulletText: {
    flex: 1,
  },
  empty: {
    textAlign: 'center',
    marginTop: hp('5%'),
  },
});
