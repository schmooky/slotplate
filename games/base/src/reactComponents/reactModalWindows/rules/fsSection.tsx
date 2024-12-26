import React, { FC } from 'react';
import { BaseRuleSection } from '@gambit/react-components';
import { simpleLocalize } from '@lib/simpleLocalize/simpleLocalize';

export interface CustomSectionProperties {
  path: string;
}

export const FsSection: FC<CustomSectionProperties> = (properties: CustomSectionProperties) =>

  (
    <div>
      <BaseRuleSection key="fsBull" header={simpleLocalize.getTranslation('menu.rules.freespins.header')}
                       srcImage={`${properties.path}/rules/h3.webp`}
                       description={simpleLocalize.getTranslation('menu.rules.freespins.descriptionBull')} />
    </div>
  );
