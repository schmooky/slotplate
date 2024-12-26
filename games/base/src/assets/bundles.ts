import { createBaseJSON } from '@slotplate/assets';

export enum GameBundle {
  PRELOAD = 'load-preload',
  MAIN = 'load-main',
}

enum SpineQuality {
  High = '1',
  Medium = '0.75',
  Low = '0.5',
}

const quality = SpineQuality.High;

export const bundles = [
  {
    name: GameBundle.PRELOAD,
    assets: [
      createBaseJSON('bgData', 'spine/bg/bg.json'),
      createBaseJSON('bgAtlas', `spine/bg/${quality}/bg.atlas`),

      createBaseJSON('high2Data', 'spine/high_2/high_2.json'),
      createBaseJSON('high2Atlas', `spine/high_2/${quality}/high_2.atlas`),

      createBaseJSON('high3Data', 'spine/high_3/high_3.json'),
      createBaseJSON('high3Atlas', `spine/high_3/${quality}/high_3.atlas`),

      createBaseJSON('gambitLogoData', 'spine/splash_screen/gambit.json'),
      createBaseJSON('leftWallPortraitData', 'spine/splash_screen/left_wall_splashscreen_portrait.json'),
      createBaseJSON('rightWallPortraitData', 'spine/splash_screen/right_wall_splashscreen_portrait.json'),
      createBaseJSON('splashLogoLandscapeData', 'spine/splash_screen/logo_splashscreen_landscape.json'),
      createBaseJSON('splashLogoPortraitData', 'spine/splash_screen/logo_splashscreen_portrait.json'),
      createBaseJSON('splashScreenAtlas', `spine/splash_screen/${quality}/splash_screen.atlas`),
    ],
  },
  {
    name: GameBundle.MAIN,
    assets: [
      createBaseJSON('buyFeatureData', 'spine/bf/buy_feature.json'),
      createBaseJSON('announcersData', 'spine/bf/anounsers.json'),
      createBaseJSON('buyFeatureDataAtlas', `spine/bf/${quality}/by_feature_fix_new.atlas`),

      createBaseJSON('bfButtonData', 'spine/bf_btn/bf_btn.json'),
      createBaseJSON('bfButtonAtlas', `spine/bf_btn/${quality}/bf_btn.atlas`),

      createBaseJSON('fsAimData', 'spine/fs_aim/aim.json'),
      createBaseJSON('fsAimAtlas', `spine/fs_aim/${quality}/aim.atlas`),

      createBaseJSON('fsQuestionData', 'spine/fs_question/fs_question.json'),
      createBaseJSON('fsQuestionAtlas', `spine/fs_question/${quality}/question_fs.atlas`),

      createBaseJSON('fsSmokeData', 'spine/fs_smoke/fs_smoke.json'),
      createBaseJSON('fsSmokeAtlas', `spine/fs_smoke/${quality}/fs_smoke.atlas`),

      createBaseJSON('high1Data', 'spine/high_1/high_1.json'),
      createBaseJSON('high1Atlas', `spine/high_1/${quality}/high_1.atlas`),

      createBaseJSON('high3CracksData', 'spine/high_3/high_3_cracks.json'),

      createBaseJSON('high4Data', 'spine/high_4/high_4.json'),
      createBaseJSON('high4Atlas', `spine/high_4/${quality}/high_4.atlas`),

      createBaseJSON('high5Data', 'spine/high_5/high_5.json'),
      createBaseJSON('high5Atlas', `spine/high_5/${quality}/high_5.atlas`),

      createBaseJSON('low1Data', 'spine/low_symbols/low_1.json'),
      createBaseJSON('low2Data', 'spine/low_symbols/low_2.json'),
      createBaseJSON('low3Data', 'spine/low_symbols/low_3.json'),
      createBaseJSON('low4Data', 'spine/low_symbols/low_4.json'),
      createBaseJSON('lowQuestionData', 'spine/low_symbols/question.json'),
      createBaseJSON('lowQuestionGoldData', 'spine/low_symbols/question_gold.json'),
      createBaseJSON('lowSymbolAtlas', `spine/low_symbols/${quality}/low_symbol.atlas`),

      createBaseJSON('cloningWildData', 'spine/cloning_wild/cloning_wild2.json'),
      createBaseJSON('cloningWildChangeData', 'spine/cloning_wild/change.json'),
      createBaseJSON('cloningWildMultiplier', 'spine/cloning_wild/x2.json'),
      createBaseJSON('cloningWildAtlas', `spine/cloning_wild/${quality}/crystal.atlas`),

      createBaseJSON('wildData', 'spine/wild/wild.json'),
      createBaseJSON('wildAtlas', `spine/wild/${quality}/wild.atlas`),
      createBaseJSON('scatterData', 'spine/scatter/scatter.json'),
      createBaseJSON('scatterAtlas', `spine/scatter/${quality}/scatter.atlas`),

      createBaseJSON('logoData', 'spine/logo/logo.json'),
      createBaseJSON('logoAtlas', `spine/logo/${quality}/logo.atlas`),

      createBaseJSON('payLinesData', 'spine/payline/paylines.json'),
      createBaseJSON('payLinesAtlas', `spine/payline/${quality}/paylines.atlas`),

      createBaseJSON('paytableData', 'spine/paytable/paytable.json'),
      createBaseJSON('paytableAtlas', `spine/paytable/${quality}/paytable.atlas`),

      createBaseJSON('bigWinData', 'spine/popups/big_win.json'),
      createBaseJSON('cellPopupData', 'spine/popups/cell_popup.json'),
      createBaseJSON('coinBigWinData', 'spine/popups/coin_big_win.json'),
      createBaseJSON('glowUpBigWinData', 'spine/popups/glow_up_big_win.json'),
      createBaseJSON('hudBigWinData', 'spine/popups/hud_big_win.json'),
      createBaseJSON('hudFSData', 'spine/popups/hud_freespin.json'),
      createBaseJSON('regularWinData', 'spine/cloning_wild/regular_win.json'),
      createBaseJSON('popupAtlas', `spine/popups/${quality}/popup.atlas`),

      createBaseJSON('reelsData', 'spine/reels/reels.json'),
      createBaseJSON('reelsAtlas', `spine/reels/${quality}/reels.atlas`),

      createBaseJSON('anticipationData', 'spine/reels/anticipation.json'),
      createBaseJSON('anticipationAtlas', `spine/reels/${quality}/anticipation.atlas`),

      createBaseJSON('skipVfxData', 'spine/skip_vfx/skip_vfx.json'),
      createBaseJSON('skipVfxH2', 'spine/skip_vfx/skip_vfx_h2.json'),
      createBaseJSON('skipVfxAtlas', `spine/skip_vfx/${quality}/skip_vfx.atlas`),

      createBaseJSON('spinButtonData', 'spine/spin_button/spin_button.json'),
      createBaseJSON('spinButtonAtlas', `spine/spin_button/${quality}/spin_button.atlas`),

      createBaseJSON('blueFont', 'fonts/blueFont.fnt'),
      createBaseJSON('greenFont', 'fonts/greenFont.fnt'),
      createBaseJSON('cloningWildFont', 'fonts/cloningWildFont.fnt'),
      createBaseJSON('ArchivoNarrow', 'fonts/ArchivoNarrow.ttf'),
      createBaseJSON('MartianMono', 'fonts/MartianMono.ttf'),

      createBaseJSON('balanceIcon', 'uiSvg/balanceIcon.svg'),
      createBaseJSON('menuIcon', 'uiSvg/menuIcon.svg'),
      createBaseJSON('betIcon', 'uiSvg/betIcon.svg'),
      createBaseJSON('buttonBg', 'uiSvg/buttonBg.svg'),
      createBaseJSON('soundOnIcon', 'uiSvg/soundOnIcon.svg'),
      createBaseJSON('soundOffIcon', 'uiSvg/soundOffIcon.svg'),
      createBaseJSON('autoplayIcon', 'uiSvg/autoplayIcon.svg'),
      createBaseJSON('turboIcon', 'uiSvg/turboIcon.svg'),
      createBaseJSON('unionButtonBg', 'uiSvg/unionButtonBg.svg'),
    ],
  },
];
