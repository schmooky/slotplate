import React from 'react';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import {
  InterfaceSymbolImage,
  InterfaceSymbolLayout,
  InterfaceSymbolPayout,
} from './rules.styled';

export interface SymbolDescription {
  icon: JSX.Element;
  description: string;
}

export const InterfaceSymbolCard: React.FC<SymbolDescription> = (properties: SymbolDescription) => (
    <InterfaceSymbolLayout>
      <InterfaceSymbolImage>{properties.icon}</InterfaceSymbolImage>
      <InterfaceSymbolPayout>
        {simpleLocalize.getTranslation(properties.description)}
      </InterfaceSymbolPayout>
    </InterfaceSymbolLayout>
);
