import React from 'react';

import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { Container, Description, DescriptionContainer, PanelH2, RuleSection } from './rules.styled';

export const AutoplaySection: React.FC = () => (
    <RuleSection>
      <PanelH2>{simpleLocalize.getTranslation('menu.rules.autoplay.header')}</PanelH2>
      <Container>
        <DescriptionContainer>
          <Description
            dangerouslySetInnerHTML={{
              __html: simpleLocalize
                .getTranslation('menu.rules.autoplay.description')
                .replace(
                  '<img>',
                  '<img style="width: 5%; display: inline-block" src="images/rules/aspin.svg" alt="aspin" />',
                )
                .replace(
                  '[Start]',
                  `<span style="display: inline-block; color: #ffcc18;font-weight: bold;">[${simpleLocalize.getTranslation(
                    'menu.rules.autoplay.start',
                  )}]</span>`,
                ),
            }}
          />
        </DescriptionContainer>
      </Container>
    </RuleSection>
);
