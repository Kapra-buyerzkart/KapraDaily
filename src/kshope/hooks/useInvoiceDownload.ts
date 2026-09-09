import { useCallback, useState } from 'react';
import { Platform } from 'react-native';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Toast from 'react-native-simple-toast';
import {
  buildInvoiceFileName,
  INVOICE_NOT_GENERATED_MESSAGE,
  isInvoiceGenerated,
} from '../utils/invoiceUrl';
import { isSafeUrl } from '../../utils/safeUrl';
import logger from '../../utils/logger';

interface UseInvoiceDownloadArgs {
  invoiceUrl?: string | null;
  invoiceNumber?: string | null;
  description?: string;
}

export const useInvoiceDownload = ({
  invoiceUrl,
  invoiceNumber,
  description = 'Invoice',
}: UseInvoiceDownloadArgs) => {
  const [downloading, setDownloading] = useState(false);

  const canDownload = isSafeUrl(invoiceUrl) && isInvoiceGenerated(invoiceUrl);

  const downloadInvoice = useCallback(async () => {
    if (downloading) {
      return;
    }
    if (!canDownload || !invoiceUrl) {
      Toast.show(INVOICE_NOT_GENERATED_MESSAGE, Toast.LONG);
      return;
    }

    setDownloading(true);
    const fileName = buildInvoiceFileName(invoiceNumber, invoiceUrl);

    try {
      if (Platform.OS === 'android') {
        await ReactNativeBlobUtil.config({
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            title: fileName,
            description,
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
    } catch (error: any) {
      logger.error('[kshope] Failed to download invoice PDF:', error?.message);
      Toast.show("Couldn't download the invoice", Toast.SHORT);
    } finally {
      setDownloading(false);
    }
  }, [downloading, canDownload, invoiceUrl, invoiceNumber, description]);

  return { downloading, canDownload, downloadInvoice };
};
