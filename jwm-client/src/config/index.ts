const config = {
  isDev: import.meta.env.DEV,
  orgLink: import.meta.env.VITE_ORG_LINK,
  repositoryName: import.meta.env.VITE_REPOSITORY_NAME,
  buildVersion: import.meta.env.VITE_BUILD_VERSION,
  cfCaptchaSiteKey: import.meta.env.VITE_CF_CAPTCHA_SITE_KEY,
};

export { config };
