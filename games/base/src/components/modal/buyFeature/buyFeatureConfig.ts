export interface ButtonConfig {
  name: string;
  clickAnimationNames?: string[];
}

export type ButtonPositionConfig = Map<string, { x: number; y: number; width?: number; height?: number }>;

export const buttonPositionConfig: ButtonPositionConfig = new Map([
  ['btnCloseBF', { x: 405, y: -310 }],
  ['btnRightArrowCoefFS', { x: 350, y: -150 }],
  ['btnLeftArrowCoefFS', { x: -390, y: -150 }],
  ['btnRightArrowBetFS', { x: 350, y: 150 }],
  ['btnLeftArrowBetFS', { x: -390, y: 150 }],
  ['btnBuy', { x: -10, y: 540, width: 350, height: 160 }],
]);

export const buttonsConfig: ButtonConfig[] = [
  {
    name: 'btnCloseBF',
    clickAnimationNames: ['hide', 'btn_buy_hide'],
  },
  {
    name: 'btnBuy',
    clickAnimationNames: ['btn_buy_ckick'],
  },
  {
    name: 'btnRightArrowCoefFS',
  },
  {
    name: 'btnLeftArrowCoefFS',
  },
  {
    name: 'btnRightArrowBetFS',
  },
  {
    name: 'btnLeftArrowBetFS',
  },
];
