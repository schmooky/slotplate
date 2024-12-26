import React from 'react';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import {
  HorizontalInterfaceDivider,
  InfoContrast, InfoLiteContrast,
  InterfaceInfoContrast,
  InterfaceInfoPart,
  InterfaceSymbolGrid,
  PanelH2,
  RuleSection,
} from './rules.styled';
import BalanceSvg from './svg/rules/BalanceSvg';
import SpinIcon from './svg/rules/SpinIcon';
import MuteIcon from './svg/rules/MuteIcon';
import TurboIcon from './svg/rules/TurboIcon';
import AutoSpinIcon from './svg/rules/AutoSpinIcon';
import BetIcon from './svg/rules/BetIcon';
import MenuIcon from './svg/rules/MenuIcon';
import { InterfaceSymbolCard } from './interfaceSymbol.section';

const interfaceSymbols = [
  { icon: <SpinIcon />, content: 'menu.rules.interface.description.spin' },
  { icon: <MuteIcon />, content: 'menu.rules.interface.description.mute' },
  { icon: <TurboIcon />, content: 'menu.rules.interface.description.turbo' },
  { icon: <AutoSpinIcon />, content: 'menu.rules.interface.description.autospin' },
  { icon: <BetIcon />, content: 'menu.rules.interface.description.bet' },
  { icon: <MenuIcon />, content: 'menu.rules.interface.description.menu' },
];

export const InterfaceSection = () => (
    <RuleSection>
      <PanelH2>{simpleLocalize.getTranslation('menu.rules.interface.header')}</PanelH2>
      <InterfaceSymbolGrid>
        {interfaceSymbols.map((symbol, index) => (
          <InterfaceSymbolCard
            key={`high${index + 1}`}
            icon={symbol.icon}
            description={symbol.content}
          />
        ))}
      </InterfaceSymbolGrid>
      <HorizontalInterfaceDivider />
      <InterfaceInfoPart>
        <InterfaceInfoContrast>
          <InfoLiteContrast>
            {simpleLocalize.getTranslation('menu.rules.interface.panelDescription.bet')}
          </InfoLiteContrast>
        </InterfaceInfoContrast>
        <div>{simpleLocalize.getTranslation('menu.rules.interface.panelDescription.betDescription')}</div>
      </InterfaceInfoPart>

      <InterfaceInfoPart>
        <InterfaceInfoContrast>
          <InfoLiteContrast>
            {simpleLocalize.getTranslation('menu.rules.interface.panelDescription.lastWin')}
          </InfoLiteContrast>
        </InterfaceInfoContrast>
        <div>{simpleLocalize.getTranslation('menu.rules.interface.panelDescription.lastWinDescription')}</div>
      </InterfaceInfoPart>

      <InterfaceInfoPart>
        <InterfaceInfoContrast>
          <InfoContrast>
            <BalanceSvg style={{ width: '60%', height: '60%' }} />
          </InfoContrast>
        </InterfaceInfoContrast>
        <div>{simpleLocalize.getTranslation('menu.rules.interface.panelDescription.balance')}</div>
      </InterfaceInfoPart>
    </RuleSection>
);
