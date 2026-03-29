export const supportedKoppaLocales = ["en", "de"] as const;

export type KoppaLocale = (typeof supportedKoppaLocales)[number];

export const defaultKoppaLocale: KoppaLocale = "en";
export const KOPPAJS_LOCALE_STORAGE_KEY = "koppajs-locale";
export const KOPPAJS_LOCALE_CHANGE_EVENT = "koppajs-locale-change";

declare global {
  interface Window {
    __KOPPAJS_LOCALE__?: KoppaLocale;
  }
}

export const normalizeKoppaLocale = (locale?: string | null): KoppaLocale => {
  return locale === "de" ? "de" : "en";
};

const readStoredLocale = (): KoppaLocale => {
  if (typeof window === "undefined" || !("localStorage" in window)) {
    return defaultKoppaLocale;
  }

  return normalizeKoppaLocale(
    window.localStorage.getItem(KOPPAJS_LOCALE_STORAGE_KEY),
  );
};

export const getKoppaLocale = (): KoppaLocale => {
  if (typeof window === "undefined") {
    return defaultKoppaLocale;
  }

  if (!window.__KOPPAJS_LOCALE__) {
    window.__KOPPAJS_LOCALE__ = readStoredLocale();
  }

  return window.__KOPPAJS_LOCALE__;
};

export const syncKoppaDocumentLanguage = (
  documentRef: Document = document,
): void => {
  documentRef.documentElement.lang = getKoppaLocale();
};

export const setKoppaLocale = (locale: string): KoppaLocale => {
  if (typeof window === "undefined") {
    return normalizeKoppaLocale(locale);
  }

  const nextLocale = normalizeKoppaLocale(locale);
  const currentLocale = getKoppaLocale();

  if (currentLocale === nextLocale) {
    syncKoppaDocumentLanguage();
    return currentLocale;
  }

  window.__KOPPAJS_LOCALE__ = nextLocale;

  if ("localStorage" in window) {
    window.localStorage.setItem(KOPPAJS_LOCALE_STORAGE_KEY, nextLocale);
  }

  syncKoppaDocumentLanguage();

  if ("dispatchEvent" in window) {
    window.dispatchEvent(
      new CustomEvent(KOPPAJS_LOCALE_CHANGE_EVENT, {
        detail: { locale: nextLocale },
      }),
    );
  }

  return nextLocale;
};
