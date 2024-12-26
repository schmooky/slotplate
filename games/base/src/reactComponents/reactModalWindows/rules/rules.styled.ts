import styled from '@emotion/styled';

export const FONT_SIZES = {
  h1: 2.125,
  h2: 1.625,
  h3: 1.5,
  h4: 1.375,
  h5: 1.25,

  titleLg: 1.125,
  title: 1,
  titleSm: 0.875,

  subtitleLg: 0.75,
  subtitle: 0.625,
  subtitleSm: 0.5,
};

export const PanelWrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    padding: calc(${FONT_SIZES.h2 / 1.08}rem);

    ::-webkit-scrollbar {
        width: calc(${FONT_SIZES.h2 / 25}rem);
    }

    ::-webkit-scrollbar-track {
        background: rgba(62, 72, 77, 1);
        width: calc(${FONT_SIZES.h2 / 25}rem);
    }

    ::-webkit-scrollbar-thumb {
        border: calc(${FONT_SIZES.h2 / 6}rem) solid rgba(83, 97, 102, 1);
        border-radius: calc(${FONT_SIZES.h2 / 4.3}rem);
        background-clip: content-box;
    }

    font-family: 'Inter';
    font-style: normal;
    font-weight: 400;
    word-wrap: normal;

    &:after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 5rem;
        right: 0;
        height: 9%;
        background: linear-gradient(180deg, rgba(31, 36, 38, 0) 0%, #1f2426 100%);

        @media screen and (orientation: portrait) {
            left: 0;
            background: none;
            background: linear-gradient(180deg, rgba(31, 36, 38, 0) 0%, #1f2426 100%);
        }
    }
`;

export const PanelH2 = styled.h2`
    font-family: 'Inter';
    font-style: normal;
    font-weight: 700;
    font-size: calc(${FONT_SIZES.h2}rem);
    color: #ffffff;
    margin-bottom: calc(${FONT_SIZES.h2 / 1.08}rem);
`;

export const CommonDescription = styled.p`
    font-size: calc(${FONT_SIZES.h2 / 1.2}rem);
    white-space: pre-line;
`;

export const StyledMetrics = styled.div`
    margin-top: calc(${FONT_SIZES.h2 * 1.25}rem);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

export const StyledMetric = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const StyledMetricName = styled.p``;

export const StyledMetricValue = styled(StyledMetricName)`
    font-weight: 600;
    white-space: nowrap;
`;

export const PaylinesGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-row-gap: 0.834rem;
    grid-column-gap: 0.834rem;
    margin: calc(${FONT_SIZES.h2 / 1.08}rem) 0;

    & > svg {
        width: 100%;
    }
    
    @media screen and (orientation: portrait) {
        grid-template-columns: 1fr 1fr 1fr;
    }
`;

export const HorizontalDivider = styled.div`
    width: 100%;
    height: 0;

    border-top: calc(${FONT_SIZES.h2 / 25}rem) dashed #808080;
`;

export const RuleSection = styled.section`
    margin-top: calc(${FONT_SIZES.h2 * 1.25}rem);
    font-size: calc(${FONT_SIZES.h2 / 1.2}rem);
`;

export const ImageContainer = styled.div`
    margin: 0 1.5rem 0 0;

    @media only screen and (orientation: portrait) {
        display: flex;
        justify-content: center;
        margin: calc(${FONT_SIZES.h2 / 1.08}rem);
    }
`;

export const ImageBlock = styled.div`
    width: 15rem;

    @media only screen and (orientation: portrait) {
        width: 20rem;
    }
`;

export const Container = styled.div`
    display: flex;
    flex-direction: row;

    @media only screen and (orientation: portrait) {
        flex-direction: column;
    }
`;

export const DescriptionContainer = styled.div``;

export const Description = styled.p`
    white-space: pre-line;
`;

export const ItemImage = styled.img``;

export const InterfaceSymbolGrid = styled.div`
    margin-bottom: calc(${FONT_SIZES.h2 * 1.25}rem);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-row-gap: calc(${FONT_SIZES.h2 * 1.2}rem);
    grid-column-gap: calc(${FONT_SIZES.h2 / 1.3}rem);

    @media screen and (orientation: portrait) {
        display: grid;
        grid-template-columns: 1fr;
    }
`;

export const HorizontalInterfaceDivider = styled.div`
    width: 100%;
    height: 0;
    margin-bottom: calc(${FONT_SIZES.h2 * 1.25}rem);
    border-top: calc(${FONT_SIZES.h2 / 25}rem) dashed #808080;
`;

export const InterfaceInfoPart = styled.div`
    display: flex;
    flex-flow: row;
    gap: calc(${FONT_SIZES.h2 / 2}rem);
    align-items: center;
    margin-bottom: calc(${FONT_SIZES.h2 / 1.6}rem);
`;

export const InterfaceInfoContrast = styled.div`
    background: #111314;
    border-radius: calc(${FONT_SIZES.h2 / 6.5}rem);
    width: 5.5rem;
    display: flex;
    align-items: center;
`;

export const InfoLiteContrast = styled.div`
    display: -webkit-inline-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: calc(${FONT_SIZES.h4 / 2.4}rem);
    height: 10vh;
    width: 15vw;
    line-height: 0;
    border-radius: calc(${FONT_SIZES.h4 / 3}rem);

    font-size: calc(${FONT_SIZES.h4 / 1.2}rem);
    font-weight: 300;


    @media screen and (orientation: portrait) {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 6vh;
        width: 25vw;
    }
`;

export const InfoContrast = styled.div`
    display: -webkit-inline-box;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: calc(${FONT_SIZES.h2 / 2.4}rem);
    height: 10vh;
    width: 15vw;
    line-height: 0;
    border-radius: calc(${FONT_SIZES.h2 / 3}rem);

    font-size: calc(${FONT_SIZES.h2 / 1.2}rem);

    @media screen and (orientation: portrait) {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        height: 6vh;
        width: 25vw;
    }
`;

export const InfoContrastBetContainer = styled.div`
    svg {
        margin-bottom: 0.1rem;
        width: 2rem;
        height: 2rem;
        aspect-ratio: 1/1;
    }

    @media screen and (max-width: 1000px) and (orientation: landscape) {
        svg {
            margin-left: 0.5rem;
        }
    }
`;

export const InterfaceSymbolLayout = styled.div`
    display: flex;
    height: 100%;
`;

export const InterfaceSymbolImage = styled.div`
    aspect-ratio: 1/1;
    border-radius: ${FONT_SIZES.h2 / 4}rem;
    margin-right: ${FONT_SIZES.h2 / 2}rem;
    grid-template-columns: auto 1fr;
    width: 5.5rem;
    height: 5.5rem;

    & > svg {
        width: 100%;
        height: 100%;
    }
`;

export const InterfaceSymbolPayout = styled.p`
    color: #ffffff;
    align-self: center;
    margin-right: ${FONT_SIZES.h2 / 2}rem;
    line-height: ${FONT_SIZES.h2 / 1.1}rem;
    font-weight: 500;
`;
