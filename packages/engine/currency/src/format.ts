import {
  CurrencyCodeType,
  FormatterConfig,
  ISOCodeSide,
  PresetConfig,
} from "./config.js";
import { currencySymbols } from "./symbols.js";
import { withCurrencyCodePreset } from "./presets.js";

export class CurrencyFormatter {
  protected currencyCode: CurrencyCodeType;
  protected codeSide?: ISOCodeSide;
  protected decimalSeparator: string;
  protected realDelimiter: string;
  protected useCurrencyAffix?: boolean;
  protected addWhitespaceBetweenNumberAndAffix?: boolean;
  protected realDelimiterCount: number;
  protected omitDecimal: boolean;
  protected hideZeroDecimal: boolean;

  constructor(config: FormatterConfig) {
    const {
      currencyCode,
      codeSide = "left",
      decimalSeparator = ".",
      realDelimiter = ",",
      useCurrencyAffix = false,
      addWhitespaceBetweenNumberAndAffix = false,
      realDelimiterCount = 2,
      omitDecimal = false,
      hideZeroDecimal = false,
    } = config;

    this.currencyCode = currencyCode;
    this.codeSide = codeSide;
    this.decimalSeparator = decimalSeparator;
    this.realDelimiter = realDelimiter;
    this.useCurrencyAffix = useCurrencyAffix;
    this.addWhitespaceBetweenNumberAndAffix =
      addWhitespaceBetweenNumberAndAffix;
    this.realDelimiterCount = realDelimiterCount;
    this.omitDecimal = omitDecimal;
    this.hideZeroDecimal = hideZeroDecimal;
  }

  static fromPreset(
    currencyCode: CurrencyCodeType,
    preset: PresetConfig = withCurrencyCodePreset
  ) {
    return new CurrencyFormatter({ ...preset, currencyCode });
  }

  protected get currencyAffix() {
    return currencySymbols[this.currencyCode] ?? this.currencyCode;
  }

  formatCurrency(number: number): string {
    const formattedNumber = number.toFixed(2);

    // Split the number into the integer and decimal parts
    const [integerPartString, decimalPart] = formattedNumber.split(".");

    let integerPart = +(integerPartString ?? 0);

    const regex = new RegExp(
      String.raw`\B(?=(\d{${this.realDelimiterCount}})+(?!\d))`,
      "g"
    );
    const integerPartWithDelimiter = integerPart
      .toString()
      .replaceAll(regex, this.realDelimiter);

    // Add the decimal part and currency code if not omitted

    let formattedString = `${integerPartWithDelimiter}`;

    if (
      !this.omitDecimal &&
      decimalPart !== undefined &&
      !(this.hideZeroDecimal && Number(decimalPart) === 0)
    ) {
      formattedString += `${this.decimalSeparator}${decimalPart}`;
    }

    if (this.codeSide !== undefined && this.useCurrencyAffix) {
      if (this.codeSide === "left") {
        formattedString = `${this.currencyAffix}${
          this.addWhitespaceBetweenNumberAndAffix ? " " : ""
        }${formattedString}`;
      } else if (this.codeSide === "right") {
        formattedString = `${formattedString}${
          this.addWhitespaceBetweenNumberAndAffix ? " " : ""
        }${this.currencyAffix}`;
      }
      return formattedString;
    }

    return formattedString;
  }
}
