import React from 'react';
import { Description, DescriptionContainer, FONT_SIZES, RuleSection } from './rules.styled';

export interface GameInfoProperty {
    gameName: string;
    gameVersion: string;
    studioName: string;
}

export const GameInfo: React.FC<GameInfoProperty> = (properties:GameInfoProperty) => (
  <RuleSection style={{ marginBottom: `${FONT_SIZES.h2 * 4.5}rem` }}>
    <DescriptionContainer>
      <Description style={{ fontSize: '1rem' }}>
          {properties.gameVersion} <span style={{ color: '#3E484C', fontSize: '0.8rem' }}>|</span> {properties.gameName} {' '}
        <span style={{ color: '#3E484C', fontSize: '0.8rem' }}>|</span> {properties.studioName}{' '}
      </Description>
    </DescriptionContainer>
  </RuleSection>
);
