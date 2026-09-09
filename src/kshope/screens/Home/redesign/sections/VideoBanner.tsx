import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useIsFocused } from '@react-navigation/native';
import Video, { ResizeMode } from 'react-native-video';
import { Shimmer } from '../../../../components/atoms';
import { logApi } from '../../../../utils/apiLog';
import { bannerMedia } from '../data/useHomeData';
import { GUTTER, RADIUS, SCREEN_WIDTH, SECTION_GAP } from '../theme';

type Props = {
  banner: any;
  onPressBanner?: (banner: any) => void;
};

const CARD_W = SCREEN_WIDTH - GUTTER * 2;

const VideoBanner: React.FC<Props> = ({ banner, onPressBanner }) => {
  const isFocused = useIsFocused();
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  const media = bannerMedia(banner);
  const uri = media?.uri;

  useEffect(() => {
    logApi('home/app_home_top_banner_top_section', uri ?? null);
  }, [uri]);

  useEffect(() => {
    setFailed(false);
    setReady(false);
  }, [uri]);

  if (!media || failed) {
    return null;
  }

  return (
    <View style={styles.section}>
      <TouchableOpacity
        activeOpacity={onPressBanner ? 0.9 : 1}
        disabled={!onPressBanner}
        onPress={() => onPressBanner?.(banner)}
        style={styles.card}
      >
        {media.isVideo ? (
          <Video
            source={{ uri: media.uri }}
            style={styles.media}
            resizeMode={ResizeMode.COVER}
            repeat
            muted
            controls={false}
            paused={!isFocused}
            playInBackground={false}
            playWhenInactive={false}
            ignoreSilentSwitch="ignore"
            disableFocus
            onReadyForDisplay={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        ) : (
          <Image
            source={media.source}
            style={styles.media}
            resizeMode="cover"
            onLoad={() => setReady(true)}
            onError={() => setFailed(true)}
          />
        )}
        {!ready && (
          <Shimmer
            tone="dark"
            radius={RADIUS.lg}
            style={[StyleSheet.absoluteFill, styles.placeholder]}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    // marginTop: SECTION_GAP,
  },
  card: {
    width: '100%',
    height: hp('6.5%'),
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  media: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    height: '100%',
  },
});

export default VideoBanner;
