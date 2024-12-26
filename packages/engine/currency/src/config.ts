export type ISOCodeSide = "left" | "right";

export interface AffixConfig {
  codeSide?: ISOCodeSide;
  useCurrencyAffix?: boolean;
  addWhitespaceBetweenNumberAndAffix?: boolean;
}
export interface NumberConfig {
  decimalSeparator: string;
  realDelimiter?: string;
  realDelimiterCount?: number;
  omitDecimal?: boolean;
  hideZeroDecimal?: boolean;
}

export type FormatterConfig = PresetConfig & { currencyCode: CurrencyCodeType };
export type PresetConfig = NumberConfig & AffixConfig;
export type CurrencyCodeType = "EUR" | "USD" | string;
