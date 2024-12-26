import React from 'react';
import { rootStore } from '@src/stores/RootStore';
import { CommonSection } from '@src/reactComponents/reactModalWindows/rules/common.section';
import { InterfaceSection } from '@src/reactComponents/reactModalWindows/rules/interface.section';
import { BuyFeatureSection } from '@src/reactComponents/reactModalWindows/rules/buyFeature.section';
import { AutoplaySection } from '@src/reactComponents/reactModalWindows/rules/autoplay.section';
import { GameInfo } from '@src/reactComponents/reactModalWindows/rules/gameInfo.section';
import { BaseRuleSection } from '@slotplate/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { FsSection } from '@src/reactComponents/reactModalWindows/rules/fsSection';
import { PaylinesSection } from '@src/reactComponents/reactModalWindows/rules/paylines.section';

declare const GAME_VERSION: string;

const rulesPath = '/bang-bang/images';

export const gameRuleElements = (): React.ReactNode[] => [
  <CommonSection key="common" rtp={`${(rootStore.dataStore.rtp * 100)?.toFixed(2)}%`} />,
  <InterfaceSection key="interface" />,
  <BuyFeatureSection key="buyFeature" />,
  <BaseRuleSection key="wild1" header={simpleLocalize.getTranslation('menu.rules.wild.header')}
                   srcImage={`${rulesPath}/rules/wild.webp`}
                   description={simpleLocalize.getTranslation('menu.rules.wild.descriptionWild')} />,
  <BaseRuleSection key="wild2" header={simpleLocalize.getTranslation('paytable.high1.name')}
                   srcImage={`${rulesPath}/rules/h1.webp`}
                   description={simpleLocalize.getTranslation('menu.rules.wild.description2')} />,
  <BaseRuleSection key="cloningWild" header={simpleLocalize.getTranslation('menu.rules.cloningWild.header')}
                   srcImage={`${rulesPath}/rules/cloning_wild.webp`}
                   description={simpleLocalize.getTranslation('menu.rules.cloningWild.description')} />,
  <BaseRuleSection key="mystery" header={simpleLocalize.getTranslation('menu.rules.mystery.header')}
                   srcImage={`${rulesPath}/rules/scatter.webp`}
                   description={simpleLocalize.getTranslation('menu.rules.mystery.description')} />,
  <FsSection key={'fs'} path={rulesPath} />,
  <BaseRuleSection key="fsBonus" header={simpleLocalize.getTranslation('menu.rules.bonusGame.header')}
                   srcImage={`${rulesPath}/rules/capsule.webp`}
                   description={simpleLocalize.getTranslation('menu.rules.bonusGame.description')} />,
  <AutoplaySection key="autoplay" />,
  <PaylinesSection key="paylines" />,
  <GameInfo key="gameInfo" gameVersion={`v${GAME_VERSION}`} gameName={'Bang bang'} studioName={'Gambit'} />,
];
