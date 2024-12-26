import styled from '@emotion/styled';

export const SymbolLayout = styled.div`
  display: flex;
  height: 100%;
`;

export const SymbolContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 11.2rem;
  margin-right: ${1.625 * 0.85}rem;
`;

export const SymbolImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;

export const SymbolHeader = styled.p`
  margin-bottom: 0.67rem;

  font-size: 1.5rem;
  line-height: 1.815rem;
  font-weight: 700;
`;

export const SymbolCount = styled.p`
  color: #ffcc18;
  align-self: center;
  margin-right: ${1.625 * 0.85}rem;

  font-size: 1.5rem;
  line-height: 1.815rem;
  font-weight: 600;
`;

export const SymbolPayout = styled.p`
  color: #ffffff;
  align-self: center;

  font-size: 1.5rem;
  line-height: 1.815rem;
  font-weight: 400;
`;

export const SymbolCombo = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
`;
