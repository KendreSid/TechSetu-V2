import { ui, defaultLang, languages, type Lang } from './ui';

/** Every translation key, taken from the default language so TypeScript catches typos. */
type Key = keyof (typeof ui)[typeof defaultLang];

/**
 * Reads the language from the first part of the address.
 * "/mr/articles/x" gives "mr"; "/" or "/articles/x" gives the default language.
 */
export function getLangFromUrl(url: URL): Lang {
  const first = url.pathname.split('/')[1];
  return first in languages ? (first as Lang) : defaultLang;
}

/**
 * Returns a function t(key) that gives the text in the chosen language.
 * If a key is missing in that language, falls back to the default language
 * so a visitor never sees an empty gap.
 */
export function useTranslations(lang: Lang) {
  return (key: Key): string => ui[lang][key] ?? ui[defaultLang][key];
}

/** Removes the language prefix: "/mr/articles/x" becomes "/articles/x". */
export function stripLang(pathname: string): string {
  const parts = pathname.split('/');
  if (parts[1] in languages && parts[1] !== defaultLang) parts.splice(1, 1);
  return parts.join('/') || '/';
}

/** Adds the language prefix for non-default languages: ("/", "mr") gives "/mr/". */
export function localizedPath(path: string, lang: Lang): string {
  if (lang === defaultLang) return path;
  return `/${lang}${path === '/' ? '/' : path}`;
}
