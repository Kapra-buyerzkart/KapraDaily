import React from 'react';
import { View, StyleSheet } from 'react-native';
import IdentityRow from '../molecules/IdentityRow';
import WalletRow from '../molecules/WalletRow';

const ProfileHeroCard = ({
  profile,
  walletData,
  onEditProfile,
  onWallet,
}) => {
  return (
    <View style={styles.container}>
      <IdentityRow
        profile={profile}
        onEditProfile={onEditProfile}
      />
      <View style={styles.dashedDivider} />
      <WalletRow walletData={walletData} onPress={onWallet} />
    </View>
  );
};

export default React.memo(ProfileHeroCard);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  dashedDivider: {
    borderWidth: 0.75,
    borderColor: '#E2E2E2',
    borderStyle: 'dashed',
    marginHorizontal: 16,
    marginVertical: 4,
  },
});
