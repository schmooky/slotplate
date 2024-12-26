import React from 'react';
import { SymbolDescription } from '@src/reactComponents/reactModalWindows/paytable/paytable';
import { rootStore } from '@src/stores/RootStore';
import {
  SymbolCombo,
  SymbolContainer,
  SymbolCount,
  SymbolHeader,
  SymbolImage,
  SymbolLayout,
  SymbolPayout,
} from './symbol.styled';

interface SymbolInterface {
  symbol: string;
  payouts: SymbolDescription;
}

export const symbolNamesForPaytable = new Map<string, string>([
  ['high1.webp', 'Mafia'],
  ['high2.webp', 'Gangster'],
  ['high3.webp', 'Bull'],
  ['high4.webp', 'Robber'],
  ['high5.webp', 'Thief'],
]);

export const SymbolCard: React.FC<SymbolInterface> = (properties: SymbolInterface) => (
  <SymbolLayout>
    <SymbolContainer>
      <SymbolImage
        src={`images/paytable/${properties.symbol}`}
        alt={`${properties.symbol}`}
      />
    </SymbolContainer>
    <div>
      <SymbolHeader>{symbolNamesForPaytable.get(properties.symbol)}</SymbolHeader>
      <SymbolCombo>
        <SymbolCount>x5</SymbolCount>
        <SymbolPayout>
          {`${rootStore.dataStore.withoutCurrency
            .formatCurrency(+properties.payouts[0] * rootStore.balanceStore.visibleBet)
            .replace('.00', '')}`}
        </SymbolPayout>
      </SymbolCombo>
      <SymbolCombo>
        <SymbolCount>x4</SymbolCount>
        <SymbolPayout>
          {`${rootStore.dataStore.withoutCurrency
            .formatCurrency(+properties.payouts[1] * rootStore.balanceStore.visibleBet)
            .replace('.00', '')}`}
        </SymbolPayout>
      </SymbolCombo>
      <SymbolCombo>
        <SymbolCount>x3</SymbolCount>
        <SymbolPayout>
          {`${rootStore.dataStore.withoutCurrency
            .formatCurrency(+properties.payouts[2] * rootStore.balanceStore.visibleBet)
            .replace('.00', '')}`}
        </SymbolPayout>
      </SymbolCombo>
    </div>
  </SymbolLayout>
);
