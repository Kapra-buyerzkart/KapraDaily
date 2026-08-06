import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import COLORS from '@/styles/colors';
import SafeRenderHtml from '@/components/SafeRenderHtml';

const DEFAULT_CONTENT_WIDTH = Dimensions.get('window').width - 76;

const baseStyle = {
  color: 'rgba(255,255,255,0.7)',
  fontSize: 13,
  lineHeight: 20,
  fontFamily: 'Gilroy-Medium',
};

const tagsStyles = {
  p: { marginTop: 0, marginBottom: 8 },
  ul: { marginTop: 0, marginBottom: 0, paddingLeft: 0, listStyleType: 'none' },
  ol: { marginTop: 0, marginBottom: 4 },
  li: { marginBottom: 6 },
  strong: { color: COLORS.white, fontFamily: 'Gilroy-Bold' },
  b: { color: COLORS.white, fontFamily: 'Gilroy-Bold' },
  a: { color: '#F5C542' },
};

const sanitizeHtml = html =>
  typeof html === 'string'
    ? html
        .replace(/""/g, '"')
        .replace(/\sstyle="[^"]*"/gi, '')
        .replace(/\sclass="[^"]*"/gi, '')
    : '';

const HtmlBody = ({ html, contentWidth = DEFAULT_CONTENT_WIDTH }) => {
  const cleaned = useMemo(() => sanitizeHtml(html), [html]);
  return (
    <SafeRenderHtml
      contentWidth={contentWidth}
      source={{ html: cleaned }}
      baseStyle={baseStyle}
      tagsStyles={tagsStyles}
    />
  );
};

export default React.memo(HtmlBody);
