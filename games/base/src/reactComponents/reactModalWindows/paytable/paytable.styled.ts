import styled from '@emotion/styled';

export const PanelH2 = styled.h2`
  font-style: normal;
  font-weight: 700;
  font-size: 1.625rem;
  line-height: calc(${1.625 * 3.1}rem);
  margin-bottom: calc(${1.625 / 2}rem);
  color: #ffffff;
`;

export const InSectionDivider = styled.div`
  height: calc(${1.625 * 1.5}rem);
`;

export const SymbolGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-row-gap: calc(${1.625 * 1.2}rem);
  grid-column-gap: calc(${1.625 / 1.3}rem);

  @media screen and (orientation: portrait) {
    grid-template-columns: 1fr;
  }
`;

export const HighSymbols = styled.section`
  margin-bottom: calc(${1.625 * 1.5}rem);
`;

export const LowSymbols = styled.section``;
