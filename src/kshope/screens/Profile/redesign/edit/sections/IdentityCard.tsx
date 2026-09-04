import React from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { AppText, Surface } from '../../../../../components/atoms';
import ProfileAvatarBadge from '../../../../../components/ProfileAvatarBadge';
import { UI_SPACING, wp } from '../../../../../theme/tokens';

interface Props {
  name: string;
  phone?: string;
  onMeasure?: (bottom: number) => void;
  entering?: any;
}

const IdentityCard: React.FC<Props> = ({
  name,
  phone,
  onMeasure,
  entering,
}) => {
  const trimmed = (name || '').trim();

  const handleLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View onLayout={handleLayout} entering={entering}>
      <Surface>
        <View style={styles.row}>
          <ProfileAvatarBadge size={wp('13.5%')} />

          <View style={styles.copy}>
            <AppText
              variant="heading"
              tone={trimmed ? 'primary' : 'faint'}
              numberOfLines={1}
            >
              {trimmed || 'Your name'}
            </AppText>
            {!!phone && (
              <AppText variant="caption" tone="muted" numberOfLines={1}>
                {phone}
              </AppText>
            )}
          </View>
        </View>
      </Surface>
    </Animated.View>
  );
};

export default React.memo(IdentityCard);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.lg - 2,
  },
  copy: {
    flex: 1,
    gap: 1,
  },
});
