import React from 'react';

/** Free-tier hosts (e.g. Render) sleep after idle; first request can take ~30–60s. */
export default function AuthColdStartNotice() {
  return (
    <p className="text-sm text-center text-amber-900 bg-amber-50 border border-amber-200 rounded-md px-3 py-2 max-w-md mx-auto leading-snug">
      The API may be waking up from sleep (free hosting). The{' '}
      <strong>first sign-in after a while can take up to a minute</strong>—keep this tab open and
      wait; it is not frozen.
    </p>
  );
}
