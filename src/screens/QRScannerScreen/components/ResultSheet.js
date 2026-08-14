import React from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import COLORS from '@/styles/colors';
import { styles } from '../styles';
import VerdictBanner from './VerdictBanner';
import TicketSummary from './TicketSummary';
import BallPulse from '@/components/BallPulse';

const ResultSheet = ({
  validating,
  result,
  resultStyle,
  ticketInfo,
  cardAnim,
  iconAnim,
  progressAnim,
  onRetry,
  onScanAgain,
}) => {
  const isValid = result?.status === 'valid';

  return (
    <Animated.View
      style={[
        styles.resultWrap,
        {
          opacity: cardAnim,
          transform: [
            {
              translateY: cardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [28, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={styles.resultCard}>
        {validating || !result ? (
          <View style={styles.validatingRow}>
            <BallPulse color={COLORS.primary} />
            <Text style={styles.validatingText}>Validating ticket…</Text>
          </View>
        ) : (
          <>
            <VerdictBanner
              resultStyle={resultStyle}
              iconAnim={iconAnim}
              progressAnim={progressAnim}
              showProgress={isValid}
            />

            <View style={styles.cardBody}>
              <Text
                style={isValid ? styles.confirmText : styles.reasonText}
                numberOfLines={3}
              >
                {result.message}
              </Text>

              <TicketSummary
                ticketInfo={ticketInfo}
                accentColor={resultStyle.color}
                tintColor={resultStyle.tint}
              />

              <View style={styles.resultActions}>
                {result.status === 'error' ? (
                  <TouchableOpacity
                    style={styles.secondaryButton}
                    onPress={onRetry}
                  >
                    <Text style={styles.secondaryButtonText}>Retry</Text>
                  </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                  style={styles.primaryButton}
                  onPress={onScanAgain}
                >
                  <Text style={styles.primaryButtonText}>Scan Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>
    </Animated.View>
  );
};

export default React.memo(ResultSheet);
