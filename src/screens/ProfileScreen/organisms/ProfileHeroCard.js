import React from 'react';
import Animated from 'react-native-reanimated';
import { Surface, Divider } from '../atoms';
import IdentityRow from '../molecules/IdentityRow';
import WalletRow from '../molecules/WalletRow';
import { CART_SPACING } from '@/styles/cartTheme';

const ProfileHeroCard = ({
  profile,
  isPrivileged,
  walletData,
  onEditProfile,
  onWallet,
  onMeasure,
  entering,
}) => {
  const handleLayout = React.useCallback(
    event => {
      const { y, height } = event.nativeEvent.layout;
      onMeasure?.(y + height);
    },
    [onMeasure],
  );

  return (
    <Animated.View onLayout={handleLayout} entering={entering}>
      <Surface>
        <IdentityRow
          profile={profile}
          isPrivileged={isPrivileged}
          onEditProfile={onEditProfile}
        />
        <Divider inset={CART_SPACING.lg} />
        <WalletRow walletData={walletData} onPress={onWallet} />
      </Surface>
    </Animated.View>
  );
};

export default React.memo(ProfileHeroCard);
