import React, { useEffect } from 'react';
import { SymbolCard } from '@src/reactComponents/reactModalWindows/paytable/symbol';
import { rootStore } from '@src/stores/RootStore';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { AnalyticsManager } from '@lib/analytics/analyticsManager';
import {
  HighSymbols,
  InSectionDivider,
  LowSymbols,
  PanelH2,
  SymbolGrid,
} from './paytable.styled';

export type SymbolDescription = [number, number, number];

export interface SymbolsDescription {
  highSymbols: Array<SymbolDescription>;
  lowSymbols: Array<SymbolDescription>;
}

export const Paytable: React.FC = () => {
  const { highSymbols, lowSymbols } = rootStore.dataStore.payForPaytable;

  useEffect(() => {
    AnalyticsManager.instance.logPaytableClick();
  }, []);

  return (
    <div>
      <HighSymbols>
        <PanelH2>{simpleLocalize.getTranslation('menu.paytable.high')}</PanelH2>
        <SymbolGrid>
          {highSymbols.map((symbol, index) => (
            <SymbolCard
              key={`high${index + 1}`}
              payouts={symbol}
              symbol={`high${index + 1}.webp`}
            />
          ))}
        </SymbolGrid>
      </HighSymbols>
      <LowSymbols>
        <PanelH2>{simpleLocalize.getTranslation('menu.paytable.low')}</PanelH2>
        <SymbolGrid style={{ marginBottom: `${1.625 * 5}rem` }}>
          {lowSymbols.map((symbol, index) => (
            <SymbolCard
              key={`low${index + 1}`}
              payouts={symbol}
              symbol={`low${index + 1}.webp`}
            />
          ))}
        </SymbolGrid>
        <InSectionDivider />
      </LowSymbols>
    </div>
  );
};
