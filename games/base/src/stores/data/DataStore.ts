import { makeObservable } from 'mobx';
import { ReelSymbol, ServerSymbols, symbolsMap } from '@lib/config/config';
import { CurrencyFormatter } from '@lib/format/format';
import { CurrencyCode } from '@lib/format/codes';
import { FormatterPresetName } from '@lib/format/presets';
import {
  BonusFeatureResponse,
  CloningWildResponse,
  FSBonusShootResponse,
  GameMode,
  HitResponse,
  PaylinesResponse,
  PositionResponse,
  ServerSymbolsPayTable,
  WildMimicryResultsResponse,
  WildTransformationResponse,
} from '@lib/nework/types';
import { PayoutSymbolPaytable } from '@components/reels/symbolsPayline.config';
import { SymbolsDescription } from '@src/reactComponents/reactModalWindows/paytable/paytable';

export class DataStore {
  constructor() {
    makeObservable(this);
  }

  withoutCurrency: CurrencyFormatter = CurrencyFormatter.fromPreset(
    CurrencyCode.DEMO,
    FormatterPresetName.WithoutCurrency,
  );

  defaultFormatter: CurrencyFormatter = CurrencyFormatter.fromPreset(CurrencyCode.DEMO, FormatterPresetName.Default);

  rulesFormatter: CurrencyFormatter = CurrencyFormatter.fromPreset(CurrencyCode.DEMO, FormatterPresetName.Rules);

  balanceFormatter: CurrencyFormatter = CurrencyFormatter.fromPreset(CurrencyCode.DEMO, FormatterPresetName.Balance);

  gameWinPreset: CurrencyFormatter = CurrencyFormatter.fromPreset(CurrencyCode.DEMO, FormatterPresetName.GameWinPreset);

  currency: CurrencyCode = CurrencyCode.DEMO;

  rtp = 95.5;

  sessionId = '';

  lobbyUrl = '';

  frame: ReelSymbol[][] = [];

  finalFrame: ReelSymbol[][] = [];

  payLines: PaylinesResponse[] = [];

  freeSpinsCount = 0;

  cwSpinsCount = 0;

  mysteryTriggerPosition: PositionResponse | null = null;

  mysteryFeatureData: BonusFeatureResponse | null = null;

  symbolPaytable = new Map<ReelSymbol, PayoutSymbolPaytable>();

  payForPaytable: SymbolsDescription = {
    highSymbols: [],
    lowSymbols: [],
  };

  nextGameMode: GameMode = 0;

  payLinesForRules: [number, number, number, number, number][] = [];

  totalWin = 0;

  win = 0;

  cloningWildTransformations: CloningWildResponse | null = null;

  cloningWildMultiplier: number | null = null;

  high2Transformations: CloningWildResponse[] | undefined = undefined;

  wildTransformations: WildTransformationResponse[] = [];

  fsBonusShootResult: FSBonusShootResponse | null = null;

  hits: HitResponse[] = [];

  setCurrency(value: string): void {
    this.currency = (value?.toUpperCase() as CurrencyCode) ?? CurrencyCode.DEMO;

    this.defaultFormatter = CurrencyFormatter.fromPreset(this.currency, FormatterPresetName.Default);

    this.withoutCurrency = CurrencyFormatter.fromPreset(this.currency, FormatterPresetName.WithoutCurrency);

    this.rulesFormatter = CurrencyFormatter.fromPreset(this.currency, FormatterPresetName.Rules);

    this.balanceFormatter = CurrencyFormatter.fromPreset(this.currency, FormatterPresetName.Balance);
  }

  setFrame(serverFrame: ServerSymbols[][], finalFrame: ServerSymbols[][]): void {
    this.frame = [];
    this.finalFrame = [];

    for (let reelIndex = 0; reelIndex < serverFrame.length; reelIndex += 1) {
      const frameColumn: ReelSymbol[] = [];
      const finalFrameColumn: ReelSymbol[] = [];

      for (let rowIndex = 0; rowIndex < (serverFrame![reelIndex] as ServerSymbols[]).length; rowIndex += 1) {
        const frameSymbol = symbolsMap.get(serverFrame![reelIndex]![rowIndex] as ServerSymbols);
        const finalFrameSymbol = symbolsMap.get(finalFrame![reelIndex]![rowIndex] as ServerSymbols);

        if (frameSymbol && finalFrameSymbol) {
          frameColumn.push(frameSymbol);
          finalFrameColumn.push(finalFrameSymbol);
        } else {
          throw new Error(`Reel symbol ${frameSymbol} does not exist`);
        }
      }

      this.frame.push(frameColumn);
      this.finalFrame.push(finalFrameColumn);
    }
  }

  setSymbolPaytable(serverSymbolPaytable: ServerSymbolsPayTable): void {
    Object.entries(serverSymbolPaytable).forEach(([ServerSymbol, payout]) => {
      const reelSymbol = symbolsMap.get(ServerSymbol as ServerSymbols);

      if (reelSymbol) {
        if (reelSymbol.match('high')) {
          this.payForPaytable.highSymbols.push([payout[5]!, payout[4]!, payout[3]!]);
        } else {
          this.payForPaytable.lowSymbols.push([payout[5]!, payout[4]!, payout[3]!]);
        }

        this.symbolPaytable.set(reelSymbol, {
          x3: payout[3]!,
          x4: payout[4]!,
          x5: payout[5]!,
        });
      } else {
        throw new Error(`Reel symbol ${serverSymbolPaytable} from server paytable does not exist`);
      }
    });

    this.payForPaytable.highSymbols.sort((a, b) => b[0] - a[0]);
    this.payForPaytable.lowSymbols.sort((a, b) => b[0] - a[0]);
  }

  setWildTransformations(wildMimicryResults: WildMimicryResultsResponse[] | undefined): void {
    this.wildTransformations = [];

    wildMimicryResults?.forEach((result) => {
      this.wildTransformations?.push({
        position: result.wildSymbolPositions,
        transformations: result.transformedSymbolsPositions,
      });
    });
  }
}
