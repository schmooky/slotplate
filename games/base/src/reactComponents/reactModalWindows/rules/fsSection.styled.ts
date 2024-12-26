import styled from '@emotion/styled';

export const FSMultiplier = styled.p`
    color: #ffcc18;
    font-weight: 600;
    font-size: 1.67rem;
    
    @media screen and (orientation: landscape) {
        margin-right: 1rem;
        font-size: 1.34rem;
    }
`;

export const FSPayout = styled.span`
    font-weight: 600;
    font-size: 1.34rem;
    color: #FFFFFF;
    margin-right: 0.5rem;

    @media only screen and (orientation: portrait) {
        margin-right: 0;
        font-size: 2rem;
    }
    
`;

export const FSText = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;

    font-size: 1rem;
    font-weight: 500;

    @media only screen and (orientation: portrait) {
        margin-right: 0;
        font-size: 1.167rem;
    }
`;

export const VerticalDividerContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const VerticalDivider = styled.p`
    width: 0;
    height: 1.5rem;
    border: 1px dashed #808080;
`;

export const FSPayoutMultipliersPortrait = styled.div`
    display: none;
    width: 100%;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 1rem 1rem 1.5rem 1.5rem;
    justify-items: center;
    align-items: center;
    grid-row-gap: 0.5rem;

    margin: 2rem 0 2rem 0;

    @media only screen and (orientation: portrait) {
        display: grid;
    }
`;

export const PayoutMultipliersPortraitContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 70%;
    
    @media screen and (orientation: portrait) {
        width: 100%;
        justify-content: space-around;
    }
`;

export const FSPayoutContainer = styled.div`
  display: flex;
`;
