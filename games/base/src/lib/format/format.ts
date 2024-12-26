import { CurrencyCode } from './codes';
import { FormatterConfig, ISOCodeSide } from './config';
import { FormatterConfigWithoutCurrencyCode, FormatterPresetName, currencyPresets, globalPreset } from './presets';
import { currencySymbols } from './symbols';

export class CurrencyFormatter {
  private currencyCode: CurrencyCode;
  private codeSide?: ISOCodeSide;
  private decimalSeparator: string;
  private realDelimiter: string;
  private useCurrencySymbol?: boolean;
  private addWhitespaceBetweenNumberAndAffix?: boolean;
  private realDelimiterCount: number;
  private shortMode: boolean;
  private omitDecimal: boolean;
  private useCurrency: boolean;

  constructor(config: FormatterConfig) {
    const {
      currencyCode,
      codeSide,
      decimalSeparator = '.',
      realDelimiter = ',',
      useCurrencySymbol = false,
      addWhitespaceBetweenNumberAndAffix = true,
      realDelimiterCount = 3,
      shortMode = false,
      omitDecimal = false,
      useCurrency = true,
    } = config;

    this.currencyCode = currencyCode;
    this.codeSide = codeSide;
    this.decimalSeparator = decimalSeparator;
    this.realDelimiter = realDelimiter;
    this.useCurrencySymbol = useCurrencySymbol;
    this.addWhitespaceBetweenNumberAndAffix = addWhitespaceBetweenNumberAndAffix;
    this.realDelimiterCount = realDelimiterCount;
    this.omitDecimal = omitDecimal;
    this.shortMode = shortMode;
    this.useCurrency = useCurrency;
  }

  static fromPreset(currencyCode: CurrencyCode, kind?: FormatterPresetName) {
    const preset: FormatterConfigWithoutCurrencyCode = currencyPresets[currencyCode]?.[kind] ?? globalPreset[kind];

    return new CurrencyFormatter({ ...preset, currencyCode });
  }

  get currencyAffix() {
    return this.useCurrency
      ? this.useCurrencySymbol
        ? (currencySymbols[this.currencyCode] ?? this.currencyCode)
        : this.currencyCode
      : '';
  }

  formatCurrency(number: number): string {
    if (number === undefined) return undefined;
    const formattedNumber = number.toFixed(2);

    // Split the number into the integer and decimal parts
    const [integerPartString, decimalPart] = formattedNumber.split('.');
    let shortModeAffix = '';
    let integerPart = +integerPartString;

    if (this.shortMode) {
      const lookup = [
        { value: 1, symbol: '' },
        { value: 1e3, symbol: 'k' },
        { value: 1e6, symbol: 'm' },
      ];

      const item = lookup
        .slice()
        .reverse()
        .find(function (item) {
          return integerPart >= item.value;
        });
      integerPart = item ? integerPart / item.value : integerPart;
      const stringIntegerPart = String(integerPart);
      const indexIfPoint = stringIntegerPart.indexOf('.');

      if (item && indexIfPoint !== -1) {
        integerPart = +stringIntegerPart.slice(0, indexIfPoint + 2);
      }

      shortModeAffix = item ? item.symbol : '';
    }

    const regex = new RegExp(String.raw`\B(?=(\d{${this.realDelimiterCount}})+(?!\d))`, 'g');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const integerPartWithDelimiter = integerPart.toString().replaceAll(regex, this.realDelimiter);

    // Add the decimal part and currency code if not omitted

    let formattedString = `${integerPartWithDelimiter}`;

    if (!(this.shortMode && shortModeAffix !== '') && !this.omitDecimal && decimalPart !== undefined) {
      formattedString += `${this.decimalSeparator}${decimalPart}`;
    }

    if (this.codeSide !== undefined) {
      if (this.codeSide === 'left') {
        formattedString = `${this.currencyAffix}${
          this.addWhitespaceBetweenNumberAndAffix ? ' ' : ''
        }${formattedString}${shortModeAffix}`;
      } else if (this.codeSide === 'right') {
        formattedString = `${formattedString}${shortModeAffix}${
          this.addWhitespaceBetweenNumberAndAffix ? ' ' : ''
        }${this.currencyAffix}`;
      }
      return formattedString;
    } else {
      formattedString = `${formattedString}${shortModeAffix}`;
    }
    return formattedString;
  }
}
