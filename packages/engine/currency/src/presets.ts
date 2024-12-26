import { PresetConfig } from "./config.js";

export const withCurrencyCodePreset: PresetConfig = {
  codeSide: "left",
  decimalSeparator: ".",
  useCurrencyAffix: true,
  addWhitespaceBetweenNumberAndAffix: true,
  realDelimiterCount: 3,
  omitDecimal: false,
};

export const withoutCurrencyCodePreset: PresetConfig = {
  decimalSeparator: ".",
  useCurrencyAffix: false,
  realDelimiterCount: 3,
  omitDecimal: false,
};
