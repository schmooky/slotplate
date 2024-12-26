import React from 'react';
import { HintContainer, HintInner, HintText } from '@components/hint/styles';

interface HintProperties {
  hintText: string;
  style?: React.CSSProperties;
}

export const Hint = React.forwardRef<HTMLDivElement, HintProperties>((properties, reference) => (
  <HintContainer>
    <HintInner
      style={properties.style}
      ref={reference}
    >
      <HintText>{properties.hintText}</HintText>
    </HintInner>
  </HintContainer>
));
