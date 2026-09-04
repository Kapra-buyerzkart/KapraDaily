import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  AppText,
  Surface,
  Divider,
  IconDisc,
} from '../../../../components/atoms';
import ProfileAvatarBadge from '../../../../components/ProfileAvatarBadge';
import { PressableScale, RowChevron } from '../atoms';
import { useCountUp } from '../useCountUp';
import { BALANCE_COUNT_UP } from '../motion';
import { UI_COLORS, UI_RADIUS, UI_SPACING, wp } from '../../../../theme/tokens';

const formatCoins = (coins: any) => Number(coins || 0).toFixed(2);

interface Props {
  profile: any;
  walletData: any;
  onEditProfile: () => void;
  onWallet: () => void;
  onMeasure?: (bottom: number) => void;
  entering?: any;
}

const IdentityRow: React.FC<{ profile: any; onEditProfile: () => void }> = ({
  profile,
  onEditProfile,
}) => (
  <View style={styles.identityRow}>
    <ProfileAvatarBadge size={wp('13.5%')} />

    <View style={styles.copy}>
      <AppText variant="heading" numberOfLines={1}>
        {profile?.custName || 'User'}
      </AppText>
      <AppText variant="caption" tone="muted" numberOfLines={1}>
        {profile?.phoneNo || ''}
      </AppText>
    </View>

    <PressableScale
      to={0.94}
      contentStyle={styles.editChip}
      onPress={onEditProfile}
      accessibilityRole="button"
      accessibilityLabel="Edit profile"
    >
      <MaterialCommunityIcons
        name="pencil-outline"
        size={wp('3.2%')}
        color={UI_COLORS.textSecondary}
      />
      <AppText variant="micro" tone="secondary">
        Edit
      </AppText>
    </PressableScale>
  </View>
);

const WalletRow: React.FC<{
  profile: any;
  walletData: any;
  onPress: () => void;
}> = ({ profile, walletData, onPress }) => {
  const wallet = walletData?.wallet;
  const coins = Number(wallet?.bCoins ?? profile?.totalBCoins ?? 0);
  const worth = wallet?.bCoinValue;

  const counted = useCountUp(coins, BALANCE_COUNT_UP);
  const balance = formatCoins(counted);

  return (
    <PressableScale
      to={0.99}
      contentStyle={styles.walletRow}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`B Coin wallet, ${formatCoins(coins)} B Coins`}
    >
      <IconDisc size={wp('9.5%')} tone="neutral">
        <Image
          source={require('../../../../assets/icons/profile/udcoinUpdated.png')}
          style={styles.coin}
        />
      </IconDisc>

      <View style={styles.walletCopy}>
        <AppText variant="micro" tone="muted" style={styles.walletLabel}>
          UD COIN WALLET
        </AppText>
        <View style={styles.balanceRow}>
          <AppText variant="priceLarge" numberOfLines={1}>
            {balance}
          </AppText>
          <AppText variant="micro" tone="muted">
            B Coins
          </AppText>
          {worth !== undefined && worth !== null && (
            <AppText variant="micro" tone="faint" numberOfLines={1}>
              {`· ₹${worth}`}
            </AppText>
          )}
        </View>
      </View>

      <RowChevron />
    </PressableScale>
  );
};

const ProfileHeroCard: React.FC<Props> = ({
  profile,
  walletData,
  onEditProfile,
  onWallet,
  onMeasure,
  entering,
}) => {
  const handleLayout = React.useCallback(
    (event: any) => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View onLayout={handleLayout} entering={entering}>
      <Surface>
        <IdentityRow profile={profile} onEditProfile={onEditProfile} />
        <Divider inset={UI_SPACING.lg} />
        <WalletRow
          profile={profile}
          walletData={walletData}
          onPress={onWallet}
        />
      </Surface>
    </Animated.View>
  );
};

export default React.memo(ProfileHeroCard);

const styles = StyleSheet.create({
  identityRow: {
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
  editChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.xs,
    paddingHorizontal: UI_SPACING.md,
    paddingVertical: UI_SPACING.xs + 2,
    borderRadius: UI_RADIUS.pill,
    backgroundColor: UI_COLORS.well,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: UI_COLORS.border,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: UI_SPACING.md,
    paddingHorizontal: UI_SPACING.lg,
    paddingVertical: UI_SPACING.md + 2,
  },
  coin: {
    width: wp('6%'),
    height: wp('6%'),
    resizeMode: 'contain',
  },
  walletCopy: {
    flex: 1,
    gap: 1,
  },
  walletLabel: {
    letterSpacing: 0.6,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: UI_SPACING.xs,
  },
});
