/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ORG_LINK: string;
  readonly VITE_REPOSITORY_NAME: string;
  readonly VITE_BUILD_VERSION: string;
  readonly VITE_CF_CAPTCHA_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
