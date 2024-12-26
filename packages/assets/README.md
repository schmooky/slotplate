# @slotplate/assetsLoader

assetsLoader is a package for loading assets: images, spine, fonts

## Installation

```bash
npm install --save @slotplate/assets
```

### Example

How to use:
```javascript
export enum GameBundle {
  TEST = 'test',
}

export const bundles: AssetsBundle[] = [
  {
    name: GameBundle.TEST,
    assets: [
      createBaseJSON('bgData', 'spine/bg/bg.json'),
      createBaseJSON('bgAtlas', 'spine/bg/bg.atlas'),

      createBaseJSON('Vallkorn', 'assets/fonts/Vollkorn-Regular.ttf'),
    ],
  },
];

await assetsLoader.init(bundles);
await assetsLoader.loadBundle(GameBundle.TEST, onProgress, bundleLoaded);
```