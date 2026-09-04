import React from 'react';
import { Linking } from 'react-native';
import RenderHtml, { RenderHTMLProps } from 'react-native-render-html';

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

const isSafeUrl = (url?: string) =>
  !!url && /^(https?:|mailto:|tel:)/i.test(url.trim());

const SafeHtml: React.FC<RenderHTMLProps> = ({
  renderersProps,
  ignoredDomTags,
  ...props
}) => (
  <RenderHtml
    ignoredDomTags={ignoredDomTags || IGNORED_DOM_TAGS}
    renderersProps={{
      ...renderersProps,
      a: {
        ...(renderersProps?.a || {}),
        onPress: (_event: any, href: string) => {
          if (isSafeUrl(href)) {
            Linking.openURL(href).catch(() => {});
          }
        },
      },
    }}
    {...props}
  />
);

export default SafeHtml;
