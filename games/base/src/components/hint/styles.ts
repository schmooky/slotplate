import styled from '@emotion/styled';

export const HintContainer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
  pointer-events: none;
`;

export const HintInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  position: absolute;
  top: -20%;
  min-width: 22.67rem;
  max-width: 70%;
  min-height: 2.58rem;

  backdrop-filter: blur(4px);
  z-index: 1000;
  border-radius: 0.67rem;
  box-shadow: 0 0.42rem 2.5rem 0 #00000059;
`;

export const HintText = styled.p`
  max-width: 100%;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.2rem;
  margin: 0.6667rem 1rem;
  text-align: center;
`;
