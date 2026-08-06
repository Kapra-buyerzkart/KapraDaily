import React from 'react';

export default function lazyScreen(req) {
  let Resolved = null;

  function LazyScreen(props) {
    if (Resolved === null) {
      const mod = req();
      Resolved = mod && mod.__esModule ? mod.default : mod;
    }
    return <Resolved {...props} />;
  }

  return LazyScreen;
}

export function lazyNamedScreen(req, exportName) {
  let Resolved = null;

  function LazyNamedScreen(props) {
    if (Resolved === null) Resolved = req()[exportName];
    return <Resolved {...props} />;
  }

  return LazyNamedScreen;
}
