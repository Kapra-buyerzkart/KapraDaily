import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Pdf from 'react-native-pdf';
import { AppIcons } from '../../assets/icons';
import HelpSupportModal, {
  HelpSupportModalRef,
} from '../../components/HelpSupportModal';
import { DESIGN_COLORS, dp } from './detailsStyles';
import { invoiceStyles as s } from './invoiceStyles';
import { isInvoiceGenerated } from '../../utils/invoiceUrl';
import { useInvoiceDownload } from '../../hooks/useInvoiceDownload';
import { isSafeUrl, openExternalUrl } from '../../../utils/safeUrl';
import logger from '../../../utils/logger';

interface InvoiceViewerParams {
  invoiceUrl?: string;
  invoiceNumber?: string;
  title?: string;
}

const InvoiceViewerScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { invoiceUrl, invoiceNumber, title } = (route.params ||
    {}) as InvoiceViewerParams;

  const invoiceGenerated = isInvoiceGenerated(invoiceUrl);
  const urlIsUsable = isSafeUrl(invoiceUrl) && invoiceGenerated;

  const helpSheetRef = useRef<HelpSupportModalRef>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(!urlIsUsable);
  const [pageInfo, setPageInfo] = useState<{
    page: number;
    total: number;
  } | null>(null);
  const headerTitle = title || 'Invoice';

  const { downloading, downloadInvoice } = useInvoiceDownload({
    invoiceUrl,
    invoiceNumber,
    description: headerTitle,
  });

  return (
    <SafeAreaView style={s.screen} edges={['top']}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={DESIGN_COLORS.screen}
      />

      <View style={s.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={s.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <AppIcons.ArrowBack color={DESIGN_COLORS.ink} size={dp(24)} />
        </TouchableOpacity>

        <View style={s.headerTextWrap}>
          <Text style={s.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
          {!!invoiceNumber && (
            <Text style={s.headerSubtitle} numberOfLines={1}>
              {invoiceNumber}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={s.downloadButton}
          activeOpacity={0.85}
          onPress={downloadInvoice}
          disabled={downloading || !urlIsUsable}
          accessibilityRole="button"
          accessibilityLabel="Download invoice"
        >
          {downloading ? (
            <ActivityIndicator size="small" color={DESIGN_COLORS.orange} />
          ) : (
            <AppIcons.Download
              size={dp(22)}
              color={urlIsUsable ? DESIGN_COLORS.ink : DESIGN_COLORS.muted}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={s.pdfWrapper}>
        {failed ? (
          <View style={s.stateContainer}>
            <View style={s.stateIconTile}>
              <AppIcons.Invoice size={dp(26)} color={DESIGN_COLORS.muted} />
            </View>
            <Text style={s.errorTitle}>
              {invoiceGenerated
                ? 'Unable to open invoice'
                : 'Invoice not generated'}
            </Text>
            <Text style={s.errorText}>
              {invoiceGenerated
                ? 'The invoice could not be loaded. You can try opening it in your browser instead.'
                : "The invoice for this order hasn't been generated yet. Please contact customer support for help."}
            </Text>
            {invoiceGenerated ? (
              <TouchableOpacity
                style={s.actionButton}
                activeOpacity={0.85}
                onPress={() => openExternalUrl(invoiceUrl)}
              >
                <Text style={s.actionButtonText}>Open in browser</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={s.actionButton}
                activeOpacity={0.85}
                onPress={() => helpSheetRef.current?.open()}
              >
                <Text style={s.actionButtonText}>Contact customer support</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Pdf
              source={{ uri: invoiceUrl }}
              trustAllCerts={false}
              style={s.pdf}
              onLoadComplete={numberOfPages => {
                setLoading(false);
                setPageInfo({ page: 1, total: numberOfPages });
              }}
              onPageChanged={(page, numberOfPages) =>
                setPageInfo({ page, total: numberOfPages })
              }
              onError={(error: any) => {
                logger.error(
                  '[kshope] Failed to render invoice PDF:',
                  error?.message,
                );
                setLoading(false);
                setFailed(true);
              }}
            />
            {loading && (
              <View style={s.loaderOverlay}>
                <ActivityIndicator size="large" color={DESIGN_COLORS.orange} />
                <Text style={s.loaderText}>Loading invoice…</Text>
              </View>
            )}
            {!loading && (pageInfo?.total ?? 0) > 1 && (
              <View style={s.pageBadge}>
                <Text style={s.pageBadgeText}>
                  {`${pageInfo?.page} / ${pageInfo?.total}`}
                </Text>
              </View>
            )}
          </>
        )}
      </View>

      <HelpSupportModal ref={helpSheetRef} />
    </SafeAreaView>
  );
};

export default InvoiceViewerScreen;
