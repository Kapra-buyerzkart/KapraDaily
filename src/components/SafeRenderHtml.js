import React from 'react';
import RenderHtml from 'react-native-render-html';
import { openExternalUrl } from '../utils/safeUrl';

// Drop-in hardened replacement for <RenderHtml> when the HTML comes from the
// backend (legal pages, vouchers, ticket terms). It:
//   - strips tags that can embed active/remote content or build forms, and
//   - routes anchor taps through openExternalUrl, so javascript:/data:/file:
//     links are rejected instead of handed straight to Linking.
//
// Pass the same props you'd pass to RenderHtml (contentWidth, source, baseStyle…).

const IGNORED_DOM_TAGS = [
  'script',
  'iframe',
  'object',
  'embed',
  'form',
  'input',
  'button',
  'textarea',
  'style',
  'link',
  'meta',
  'base',
];

const SafeRenderHtml = ({ renderersProps, ignoredDomTags, ...props }) => {
  const safeRenderersProps = {
    ...renderersProps,
    a: {
      ...(renderersProps?.a || {}),
      // RNRenderHtml v6 anchor onPress: (event, href, htmlAttribs, target)
      onPress: (_event, href) => {
        openExternalUrl(href);
      },
    },
  };

  return (
    <RenderHtml
      ignoredDomTags={ignoredDomTags || IGNORED_DOM_TAGS}
      renderersProps={safeRenderersProps}
      {...props}
    />
  );
};

export default SafeRenderHtml;
