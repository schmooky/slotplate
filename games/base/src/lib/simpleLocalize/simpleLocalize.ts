import { SimpleLocalize } from '@gambit/simple-localize';

declare const GAME_ENV: 'development' | 'production';
declare const I18_BASE_URL: string;

export const simpleLocalize = new SimpleLocalize(
  I18_BASE_URL,
  GAME_ENV,
  'bang-bang',
  new URLSearchParams(window.location.search).get('lng')?.toLowerCase() || 'en',
  'en',
);
