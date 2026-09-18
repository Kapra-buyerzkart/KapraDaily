import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { CopyIcon } from '../icons';
import { PDP_COLORS } from '../theme';

type Props = {
  sku?: string;
  description?: string;
};

export const ProductInfoSection: React.FC<Props> = ({ sku, description }) => {
  const [copied, setCopied] = useState(false);

  const cleanSku = (sku || '').trim();
  const cleanDesc = (description || '').trim();

  // If neither exists, remove block as per user rule
  if (!cleanSku && !cleanDesc) {
    return null;
  }

  const handleCopy = () => {
    if (!cleanSku) return;
    Clipboard.setString(cleanSku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Product</Text>
        {cleanSku ? (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleCopy}
            style={styles.skuBadge}
          >
            <Text style={styles.skuText} numberOfLines={1}>
              {cleanSku}
            </Text>
            <CopyIcon
              width={13}
              height={13}
              color={copied ? PDP_COLORS.savingsGreen : PDP_COLORS.skuText}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {cleanDesc ? (
        <Text style={styles.description}>{cleanDesc}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(16),
    paddingTop: s(18),
    paddingBottom: s(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: s(8),
  },
  title: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(24),
    lineHeight: fs(24) * 1.2,
    color: '#1A1A1A',
  },
  skuBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PDP_COLORS.skuBg,
    borderRadius: s(4),
    borderWidth: 1,
    borderColor: PDP_COLORS.skuBorder,
    paddingHorizontal: s(8),
    paddingVertical: s(4),
    gap: s(6),
  },
  skuText: {
    fontFamily: HOME_FONTS.lexendBold,
    fontSize: fs(10.5),
    color: PDP_COLORS.skuText,
    letterSpacing: 0.4,
  },
  description: {
    fontFamily: HOME_FONTS.lexend,
    fontSize: fs(11.5),
    lineHeight: fs(11.5) * 1.45,
    color: '#606C68',
  },
});

export default ProductInfoSection;
