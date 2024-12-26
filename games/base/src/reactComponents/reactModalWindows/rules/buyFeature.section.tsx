import React, { FC } from 'react';

import { useResize } from '@slotplate/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import BuyIcon from '@src/reactComponents/reactModalWindows/rules/svg/rules/BuyIcon';
import {
  Container,
  Description,
  DescriptionContainer,
  ImageContainer,
  PanelH2,
  RuleSection,
} from './rules.styled';

export const BuyFeatureSection: FC = () => {
  const { isPortrait } = useResize();
  return (
    <RuleSection>
      <PanelH2>{simpleLocalize.getTranslation('menu.rules.buyFeature.header')}</PanelH2>
      <Container style={isPortrait ? { flexDirection: 'row' } : undefined}>
        <ImageContainer
          style={
            isPortrait
              ? {
                  display: 'block',
                  margin: '0 1.5rem 0 0',
                  width: '5.5rem',
                  height: '5.5rem',
                  aspectRatio: 1,
                }
              : { width: '5.5rem', height: '5.5rem' }
          }
        >
          <BuyIcon style={{ width: '100%', height: '100%' }} />
        </ImageContainer>
        <DescriptionContainer style={{ display: 'flex', alignItems: 'center' }}>
          <Description>
            {simpleLocalize.getTranslation('menu.rules.buyFeature.description1')}
          </Description>
        </DescriptionContainer>
      </Container>
      <DescriptionContainer style={{ marginTop: '2rem' }}>
        <Description>
          {simpleLocalize.getTranslation('menu.rules.buyFeature.description2')}
        </Description>
      </DescriptionContainer>
    </RuleSection>
  );
};
