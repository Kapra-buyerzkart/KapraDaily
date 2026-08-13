import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Pdf from 'react-native-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-simple-toast';
import { useNavigation, useRoute } from '@react-navigation/native';
import icons from '@/assets/icons';
import { FONTS } from '../styles/typography';
import { COLORS } from '../styles/colors';
import { isSafeUrl, openExternalUrl } from '../utils/safeUrl';
import { isInvoiceGenerated } from '../utils/invoiceUrl';
import logger from '../utils/logger';

const buildFileName = (invoiceNumber, url) => {
  const fromNumber = (invoiceNumber || '').replace(/[^A-Za-z0-9-]+/g, '_');
  if (fromNumber) {
    return `${fromNumber.replace(/^_+|_+$/g, '')}.pdf`;
  }
  const fromUrl = (url || '').split('?')[0].split('/').pop();
  return fromUrl && fromUrl.toLowerCase().endsWith('.pdf')
    ? fromUrl
    : `invoice_${Date.now()}.pdf`;
};

const InvoiceViewerScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { invoiceUrl, invoiceNumber, title, orderId, orderNumber } =
    route.params || {};

  const invoiceGenerated = isInvoiceGenerated(invoiceUrl);
  const urlIsUsable = isSafeUrl(invoiceUrl) && invoiceGenerated;

  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(!urlIsUsable);
  const [pageInfo, setPageInfo] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const headerTitle = title || 'Invoice';

  const handleDownload = useCallback(async () => {
    if (downloading) {
      return;
    }
    if (!urlIsUsable) {
      Toast.show('Invoice not available', Toast.SHORT);
      return;
    }

    setDownloading(true);
    const fileName = buildFileName(invoiceNumber, invoiceUrl);

    try {
      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description: headerTitle,
            mime: 'application/pdf',
            mediaScannable: true,
            path: `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/${fileName}`,
          },
        }).fetch('GET', invoiceUrl);
        Toast.show('Invoice saved to Downloads', Toast.SHORT);
      } else {
        const res = await ReactNativeBlobUtil.config({
          fileCache: true,
          path: `${ReactNativeBlobUtil.fs.dirs.DocumentDir}/${fileName}`,
        }).fetch('GET', invoiceUrl);
        await ReactNativeBlobUtil.ios.previewDocument(res.path());
      }
    } catch (error) {
      logger.error('Failed to download invoice PDF:', error?.message);
      Toast.show("Couldn't download the invoice", Toast.SHORT);
    } finally {
      setDownloading(false);
    }
  }, [downloading, urlIsUsable, invoiceUrl, invoiceNumber, headerTitle]);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={styles.header}>
        <TouchableOpacity
          hitSlop={40}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Image
            source={icons.backArrowNew}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {headerTitle}
          </Text>
          {!!invoiceNumber && (
            <Text style={styles.headerSubtitle} numberOfLines={1}>
              {invoiceNumber}
            </Text>
          )}
        </View>
        <TouchableOpacity
          hitSlop={20}
          onPress={handleDownload}
          disabled={downloading || !urlIsUsable}
          style={styles.downloadButton}
          accessibilityRole="button"
          accessibilityLabel="Download invoice"
        >
          {downloading ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <Feather
              name="download"
              size={wp('5.6%')}
              color={urlIsUsable ? COLORS.black : COLORS.textMuted}
            />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.pdfWrapper}>
        {failed ? (
          <View style={styles.stateContainer}>
            <Text style={styles.errorTitle}>
              {invoiceGenerated
                ? 'Unable to open invoice'
                : 'Invoice not generated'}
            </Text>
            <Text style={styles.errorText}>
              {invoiceGenerated
                ? 'The invoice could not be loaded. You can try opening it in your browser instead.'
                : "The invoice for this order hasn't been generated yet. Please contact customer support for help."}
            </Text>
            {invoiceGenerated ? (
              <TouchableOpacity
                style={styles.browserButton}
                onPress={() => openExternalUrl(invoiceUrl)}
              >
                <Text style={styles.browserButtonText}>Open in browser</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.browserButton}
                onPress={() =>
                  navigation.navigate('SupportTicketScreen', {
                    orderId,
                    orderNumber,
                  })
                }
              >
                <Text style={styles.browserButtonText}>
                  Contact customer support
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <>
            <Pdf
              source={{ uri: invoiceUrl }}
              trustAllCerts={false}
              style={styles.pdf}
              onLoadComplete={numberOfPages => {
                setLoading(false);
                setPageInfo({ page: 1, total: numberOfPages });
              }}
              onPageChanged={(page, numberOfPages) =>
                setPageInfo({ page, total: numberOfPages })
              }
              onError={error => {
                logger.error(
                  'Failed to render invoice PDF:',
                  invoiceUrl,
                  error?.message,
                );
                setLoading(false);
                setFailed(true);
              }}
            />
            {loading && (
              <View style={styles.loaderOverlay}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loaderText}>Loading invoice…</Text>
              </View>
            )}
            {!loading && pageInfo?.total > 1 && (
              <View style={styles.pageBadge}>
                <Text style={styles.pageBadgeText}>
                  {pageInfo.page} / {pageInfo.total}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default InvoiceViewerScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: wp('5%'),
    paddingVertical: hp('2%'),
    backgroundColor: COLORS.white,
  },
  backButton: {
    padding: wp('1%'),
  },
  backIcon: {
    resizeMode: 'contain',
    tintColor: COLORS.black,
  },
  headerTextWrap: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.6%'),
    color: COLORS.black,
  },
  headerSubtitle: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3%'),
    color: COLORS.textMuted,
    marginTop: hp('0.2%'),
  },
  downloadButton: {
    width: wp('8%'),
    alignItems: 'flex-end',
  },
  pdfWrapper: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  pdf: {
    flex: 1,
    backgroundColor: '#EFEFF4',
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFEFF4',
  },
  loaderText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: COLORS.textMuted,
    marginTop: hp('1.2%'),
  },
  pageBadge: {
    position: 'absolute',
    bottom: hp('2.5%'),
    alignSelf: 'center',
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('0.8%'),
    borderRadius: wp('5%'),
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  pageBadgeText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.2%'),
    color: COLORS.white,
  },
  stateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp('10%'),
  },
  errorTitle: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('4.2%'),
    color: COLORS.black,
    textAlign: 'center',
  },
  errorText: {
    fontFamily: FONTS.gilroy.regular,
    fontSize: wp('3.4%'),
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: hp('1%'),
    lineHeight: wp('5%'),
  },
  browserButton: {
    marginTop: hp('2.5%'),
    paddingHorizontal: wp('8%'),
    paddingVertical: hp('1.4%'),
    borderRadius: wp('2%'),
    backgroundColor: COLORS.primary,
  },
  browserButtonText: {
    fontFamily: FONTS.gilroy.semiBold,
    fontSize: wp('3.6%'),
    color: COLORS.white,
  },
});
