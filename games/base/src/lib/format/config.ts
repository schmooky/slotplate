import { CurrencyCode } from './codes';

export type ISOCodeSide = 'left' | 'right';

export interface AffixConfig {
  currencyCode: CurrencyCode;
  codeSide?: ISOCodeSide;
  useCurrencySymbol?: boolean;
  addWhitespaceBetweenNumberAndAffix?: boolean;
  useCurrency?: boolean;
}

export interface NumberConfig {
  decimalSeparator: string;
  realDelimiter?: string;
  realDelimiterCount?: number;
  shortMode?: boolean;
  omitDecimal?: boolean;
}

export type FormatterConfig = NumberConfig & AffixConfig;
