import { LandscapePaylineIcon } from '@src/reactComponents/reactModalWindows/rules/landscapePaylineIcon';
import { PortraitPaylineIcon } from '@src/reactComponents/reactModalWindows/rules/portraitPaylineIcon';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import React from 'react';
import { useResize } from '@gambit/react-components';
import { rootStore } from '@src/stores/RootStore';
import {
  PanelH2,
  PaylinesGrid,
  RuleSection,
} from './rules.styled';

export const PaylinesSection = () => {
  const { isPortrait } = useResize();

  return (
    <RuleSection>
      <PanelH2>{simpleLocalize.getTranslation('menu.rules.paylines.header')}</PanelH2>
      {
        isPortrait
          ? (
            <>
              <PaylinesGrid>
                {
                  rootStore.dataStore.payLinesForRules.map((element, index) => (
                    <PortraitPaylineIcon key={`portrait_${index}`}
                                         payline={[element[0], element[1], element[2], element[3], element[4]]} />))
                }
              </PaylinesGrid>
            </>
            )
          : (
            <>
              <PaylinesGrid>
                {
                  rootStore.dataStore.payLinesForRules.map((element, index) => (
                    <LandscapePaylineIcon key={`landscape_${index}`}
                                          payline={[element[0], element[1], element[2], element[3], element[4]]} />))
                }
              </PaylinesGrid>
            </>
            )
      }
    </RuleSection>
  );
};
