import React from 'react';
import RenderHtml from 'react-native-render-html';
import { openExternalUrl } from '../utils/safeUrl';

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
