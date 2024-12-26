export interface PayoutSymbolPaytable {
  x3: number;
  x4: number;
  x5: number;
}

export const symbolPaytableColors = new Map<
  string,
  {
    textColor: string;
    priceShadowColor: string;
    highSymbolTextShadowColor?: string;
  }
>([
  ['high1', { textColor: '#ffb0b0', priceShadowColor: '#eb1700', highSymbolTextShadowColor: '#a600ff' }],
  ['high2', { textColor: '#b069f6', priceShadowColor: '#a600ff', highSymbolTextShadowColor: '#a600ff' }],
  ['high3', { textColor: '#25ff4e', priceShadowColor: '#00e61b', highSymbolTextShadowColor: '#04ff00' }],
  ['high4', { textColor: '#f77016', priceShadowColor: '#ff4000' }],
  ['high5', { textColor: '#88acff', priceShadowColor: '#0008ff', highSymbolTextShadowColor: '#0008ff' }],
  ['low', { textColor: '#88acff', priceShadowColor: '#0008ff' }],
  ['cloningWild', { textColor: '#88acff', priceShadowColor: '', highSymbolTextShadowColor: '#88acff' }],
  ['scatter', { textColor: '#f77016', priceShadowColor: '', highSymbolTextShadowColor: '#ff4000' }],
  ['wild', { textColor: '#7901ff', priceShadowColor: '' }],
]);

export const multiplierData = new Map<string, { y: number; letterSpacing?: number }>([
  ['x5', { y: 0 }],
  ['x4', { y: 93 }],
  ['x3', { y: 186, letterSpacing: 18 }],
]);
