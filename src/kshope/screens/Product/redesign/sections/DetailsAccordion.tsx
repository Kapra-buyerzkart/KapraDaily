import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { HOME_FONTS, fs, s } from '../../../Home/redesign/theme';
import { ChevronIcon } from '../icons';
import { PDP_COLORS } from '../theme';

type Props = {
  description: string;
};

const DetailsAccordion: React.FC<Props> = ({ description }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setExpanded(current => !current)}
        style={styles.header}
      >
        <Text style={styles.title}>Product Details</Text>
        <ChevronIcon
          width={8}
          height={14}
          style={{ transform: [{ rotate: expanded ? '-90deg' : '90deg' }] }}
        />
      </TouchableOpacity>

      <Text style={styles.body} numberOfLines={expanded ? undefined : 3}>
        {description || 'No description available.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: s(11),
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: PDP_COLORS.cardBorder,
    borderRadius: s(10),
    paddingHorizontal: s(15),
    paddingTop: s(9),
    paddingBottom: s(12),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  title: {
    fontFamily: HOME_FONTS.medium,
    fontSize: fs(15),
    lineHeight: fs(15) * 1.3,
    color: PDP_COLORS.black,
  },
  body: {
    fontFamily: HOME_FONTS.regular,
    fontSize: fs(12),
    lineHeight: fs(12) * 1.4,
    color: PDP_COLORS.muted,
    marginTop: s(9),
  },
});

export default DetailsAccordion;
