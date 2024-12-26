import { CurrencyCode } from './codes';
import { FormatterConfig } from './config';

export enum FormatterPresetName {
  Default = 'default',
  WithoutCurrency = 'withoutCurrency',
  Rules = 'rules',
  Balance = 'balancePreset',
  GameWinPreset = 'gameWinPreset',
}

export type FormatterConfigWithoutCurrencyCode = Omit<FormatterConfig, 'currencyCode'>;

export type CurrencyPreset = {
  default: FormatterConfigWithoutCurrencyCode;
  withoutCurrency: FormatterConfigWithoutCurrencyCode;
  rules: FormatterConfigWithoutCurrencyCode;
  balancePreset: FormatterConfigWithoutCurrencyCode;
  gameWinPreset: FormatterConfigWithoutCurrencyCode;
};

const globalDefaultPreset: FormatterConfigWithoutCurrencyCode = {
  codeSide: 'left',
  decimalSeparator: '.',
  useCurrencySymbol: true,
  addWhitespaceBetweenNumberAndAffix: true,
  realDelimiterCount: 3,
  shortMode: true,
  omitDecimal: false,
};

const withoutCurrencyPreset: FormatterConfigWithoutCurrencyCode = {
  codeSide: 'left',
  decimalSeparator: '.',
  useCurrencySymbol: true,
  addWhitespaceBetweenNumberAndAffix: true,
  realDelimiterCount: 3,
  shortMode: true,
  omitDecimal: false,
  useCurrency: false,
};

const rulesDefaultPreset: FormatterConfigWithoutCurrencyCode = {
  codeSide: 'left',
  decimalSeparator: '.',
  useCurrencySymbol: true,
  addWhitespaceBetweenNumberAndAffix: true,
  realDelimiterCount: 3,
  shortMode: false,
  omitDecimal: false,
};

const balancePreset: FormatterConfigWithoutCurrencyCode = {
  codeSide: 'left',
  decimalSeparator: '.',
  useCurrencySymbol: true,
  addWhitespaceBetweenNumberAndAffix: true,
  realDelimiterCount: 3,
  shortMode: false,
  omitDecimal: false,
};

export const globalPreset: CurrencyPreset = {
  default: globalDefaultPreset,
  withoutCurrency: withoutCurrencyPreset,
  rules: rulesDefaultPreset,
  balancePreset,
  gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
};

export const currencyPresets: Partial<Record<CurrencyCode, CurrencyPreset>> = {
  USD: {
    default: {
      ...globalDefaultPreset,
      shortMode: false,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      shortMode: false,
    },
    rules: rulesDefaultPreset,
    balancePreset,
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  EUR: {
    default: {
      ...globalDefaultPreset,
      shortMode: false,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      shortMode: false,
    },
    rules: rulesDefaultPreset,
    balancePreset,
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  DEMO: {
    default: {
      ...globalDefaultPreset,
      shortMode: false,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      shortMode: false,
    },
    rules: rulesDefaultPreset,
    balancePreset,
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  IRR: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  ALL: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  AOA: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  ARS: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  AMD: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  BDT: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  HUF: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  VND: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  GNF: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  ZWL: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  IDR: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  IQD: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  ISK: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  KZT: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  KES: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  COP: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  CDF: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  LAK: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  LBP: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  MGA: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  MNT: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  MMK: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  NPR: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  NGN: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  PKR: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  PYG: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  RSD: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  SDG: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  TZS: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  UGX: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  UZS: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  XOF: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  XAF: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  CLP: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  LKR: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  KRW: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
  JPY: {
    default: {
      ...globalDefaultPreset,
      omitDecimal: true,
    },
    withoutCurrency: {
      ...withoutCurrencyPreset,
      omitDecimal: true,
    },
    rules: {
      ...rulesDefaultPreset,
      omitDecimal: true,
    },
    balancePreset: {
      ...balancePreset,
      omitDecimal: true,
    },
    gameWinPreset: { ...withoutCurrencyPreset, shortMode: false },
  },
};
