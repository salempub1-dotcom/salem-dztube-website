// User-supplied publisher ID. Verification only: no advertising SDK is loaded.
export const ADSENSE_PUBLISHER_ID = 'ca-pub-4932171916184035';
export const adsenseVerificationMeta = () => process.env.VERCEL_ENV === 'preview' ? '' : `<meta name="google-adsense-account" content="${ADSENSE_PUBLISHER_ID}">`;
export const adsenseAdsTxt = () => process.env.VERCEL_ENV === 'preview'
  ? '# Preview deployment: advertising disabled.\n'
  : `google.com, ${ADSENSE_PUBLISHER_ID.replace(/^ca-/, '')}, DIRECT, f08c47fec0942fa0\n`;
