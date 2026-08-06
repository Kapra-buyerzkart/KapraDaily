import { View, Text, Pressable } from 'react-native';
import React, { Fragment } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';
import SectionHeader from '../../home/components/SectionHeader';
import { styles } from '../styles';
import { INK, MAX_FONT_SCALE } from '@/styles/homeTheme';

export default function ListSection({ title, items }) {
  return (
    <>
      <SectionHeader title={title} />
      <View>
        {items.map((item, index) => (
          <Fragment key={item.key}>
            {}
            <Pressable
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.listItem,
                pressed && styles.listItemPressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <View style={styles.listItemLeft}>
                <View style={styles.listIconWrapper}>{item.icon}</View>
                <Text
                  style={[
                    styles.listItemText,
                    item.textColor && { color: item.textColor },
                  ]}
                  numberOfLines={1}
                  maxFontSizeMultiplier={MAX_FONT_SCALE}
                >
                  {item.label}
                </Text>
              </View>
              {}
              <Ionicons
                name="chevron-forward"
                color={item.textColor || INK.faint}
                size={wp('3.8%')}
              />
            </Pressable>
            {index < items.length - 1 && !item.hideDividerAfter && (
              <View style={styles.divider} />
            )}
          </Fragment>
        ))}
      </View>
    </>
  );
}
