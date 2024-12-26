import React from 'react';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';
import { rootStore } from '@src/stores/RootStore';
import {
  CommonDescription,
  HorizontalDivider,
  PanelH2,
  RuleSection,
  StyledMetric,
  StyledMetricName,
  StyledMetricValue,
  StyledMetrics,
} from './rules.styled';

export interface CommonSectionProperty {
  rtp: string;
}

export const CommonSection: React.FC<CommonSectionProperty> = (properties: CommonSectionProperty) => (
    <RuleSection>
      <PanelH2>{simpleLocalize.getTranslation('menu.rules.common.header')}</PanelH2>
      <CommonDescription style={{ whiteSpace: 'pre-line' }}>
        {simpleLocalize.getTranslation('menu.rules.common.description')}
      </CommonDescription>
      <StyledMetrics>
        <StyledMetric style={{ gridColumn: 1, gridRow: 1 }}>
          <StyledMetricName>
            {simpleLocalize.getTranslation('menu.rules.common.metrics.volatility')}
          </StyledMetricName>
          <StyledMetricValue>
            {simpleLocalize.getTranslation('menu.rules.common.metrics.volatilityType')}
          </StyledMetricValue>
        </StyledMetric>
        <HorizontalDivider style={{ gridColumn: 1, gridRow: 2 }} />
        <StyledMetric style={{ gridColumn: 1, gridRow: 3 }}>
          <StyledMetricName>
            {simpleLocalize.getTranslation('menu.rules.common.metrics.rtp')}
          </StyledMetricName>
          <StyledMetricValue>{properties.rtp}</StyledMetricValue>
        </StyledMetric>
        <HorizontalDivider />
        <StyledMetric style={{ gridColumn: 2, gridRow: 1 }}>
          <StyledMetricName>
            {simpleLocalize.getTranslation('menu.rules.common.metrics.minBet')}
          </StyledMetricName>
          <StyledMetricValue>
            {`${rootStore.dataStore.rulesFormatter.formatCurrency(rootStore.balanceStore.allowedBets[0] as number)}`}
          </StyledMetricValue>
        </StyledMetric>
        <HorizontalDivider style={{ gridColumn: 2, gridRow: 2 }} />
        <StyledMetric style={{ gridColumn: 2, gridRow: 3 }}>
          <StyledMetricName>
            {simpleLocalize.getTranslation('menu.rules.common.metrics.maxBet')}
          </StyledMetricName>
          <StyledMetricValue>{`${rootStore.dataStore.rulesFormatter.formatCurrency(
            rootStore.balanceStore.allowedBets.at(-1) as number,
          )}`}</StyledMetricValue>
        </StyledMetric>
      </StyledMetrics>
    </RuleSection>
);
