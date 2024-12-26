import { CurrencyFormatter } from "../format.js";
import { PresetConfig } from "../config.js";

describe("CurrencyFormatter", () => {
  test("default preset with symbol", () => {
    const formatter = CurrencyFormatter.fromPreset("USD");

    const value = formatter.formatCurrency(228.11);
    expect(value).toEqual("$ 228.11");
  });

  test("validate currency code case", () => {
    const formatterIrrUpperCase = CurrencyFormatter.fromPreset('IRR');
    const irrCodeUpperCase = formatterIrrUpperCase.formatCurrency(0);
    expect(irrCodeUpperCase).toEqual("IRR 0.00");

    const formatterIrrLowerCase = CurrencyFormatter.fromPreset('irr');
    const irrCodeLowerCase = formatterIrrLowerCase.formatCurrency(0);
    expect(irrCodeLowerCase).toEqual("irr 0.00");

    const formatterUSDSymbol = CurrencyFormatter.fromPreset('USD');
    const usdSymbol = formatterUSDSymbol.formatCurrency(0);
    expect(usdSymbol).toEqual("$ 0.00");

    const formatterUSDLowerCase = CurrencyFormatter.fromPreset('usd');
    const usdLowerCase = formatterUSDLowerCase.formatCurrency(0);
    expect(usdLowerCase).toEqual("usd 0.00");
  });

  test("default preset without symbol", () => {
    const formatter = CurrencyFormatter.fromPreset("IRR");

    const value = formatter.formatCurrency(228.0);
    expect(value).toEqual("IRR 228.00");
  });

  test("custom preset without symbol", () => {
    const preset: PresetConfig = {
      codeSide: "left",
      decimalSeparator: ".",
      useCurrencyAffix: false,
      addWhitespaceBetweenNumberAndAffix: false,
      realDelimiterCount: 3,
      omitDecimal: false,
    };
    const formatter = CurrencyFormatter.fromPreset("USD", preset);

    const value = formatter.formatCurrency(228.11);
    expect(value).toEqual("228.11");
  });

  test("custom preset with omit decimal", () => {
    const preset: PresetConfig = {
      codeSide: "left",
      decimalSeparator: ".",
      useCurrencyAffix: false,
      addWhitespaceBetweenNumberAndAffix: false,
      realDelimiterCount: 3,
      omitDecimal: true,
    };
    const formatter = CurrencyFormatter.fromPreset("USD", preset);

    const value = formatter.formatCurrency(228.9);
    expect(value).toEqual("228");
  });

  test("change real delimiter and decimalSeparator", () => {
    const preset: PresetConfig = {
      decimalSeparator: ",",
      realDelimiter: ".",
      useCurrencyAffix: false,
      addWhitespaceBetweenNumberAndAffix: false,
      realDelimiterCount: 3,
      omitDecimal: false,
    };
    const formatter = CurrencyFormatter.fromPreset("USD", preset);

    const value = formatter.formatCurrency(2282.9);
    expect(value).toEqual("2.282,90");
  });

  test("space between number and affix", () => {
    const preset: PresetConfig = {
      decimalSeparator: ",",
      realDelimiter: ".",
      useCurrencyAffix: true,
      addWhitespaceBetweenNumberAndAffix: true,
      realDelimiterCount: 3,
      omitDecimal: false,
    };
    const formatterWithSpace = CurrencyFormatter.fromPreset("IRR", preset);
    const valueWithSpace = formatterWithSpace.formatCurrency(322);

    const formatterWithoutSpace = CurrencyFormatter.fromPreset("IRR", {
      ...preset,
      addWhitespaceBetweenNumberAndAffix: false,
    });
    const valueWithoutSpace = formatterWithoutSpace.formatCurrency(322);

    expect(valueWithoutSpace).toEqual("IRR322,00");
    expect(valueWithSpace).toEqual("IRR 322,00");
  });

  test("side currency code", () => {
    const preset: PresetConfig = {
      decimalSeparator: ",",
      codeSide: "left",
      realDelimiter: ".",
      useCurrencyAffix: true,
      addWhitespaceBetweenNumberAndAffix: true,
      realDelimiterCount: 3,
      omitDecimal: false,
    };
    const formatterLeftSide = CurrencyFormatter.fromPreset("IRR", preset);
    const leftSideCurrencyCodeWithValue = formatterLeftSide.formatCurrency(322);

    const formatterRightSide = CurrencyFormatter.fromPreset("IRR", {
      ...preset,
      codeSide: "right",
    });
    const rightSideCurrencyCodeWithValue =
      formatterRightSide.formatCurrency(322);

    expect(rightSideCurrencyCodeWithValue).toEqual("322,00 IRR");
    expect(leftSideCurrencyCodeWithValue).toEqual("IRR 322,00");
  });

  test("real delimiter count", () => {
    let preset: PresetConfig = {
      decimalSeparator: ",",
      realDelimiter: ".",
      useCurrencyAffix: false,
      realDelimiterCount: 3,
      omitDecimal: true,
    };
    let formatter = CurrencyFormatter.fromPreset("IRR", preset);
    let value = formatter.formatCurrency(32200);

    expect(value[2] === ".").toEqual(true);

    preset = { ...preset, realDelimiterCount: 2 };
    formatter = CurrencyFormatter.fromPreset("IRR", preset);
    value = formatter.formatCurrency(32200);

    expect(value[1] === ".").toEqual(true);
  });
});
