import { SoundKey } from '@lib/sounds/soundsKeys';
import { SoundPack } from '@lib/sounds/types';

export const mainSoundConfig: Record<string, SoundPack[]> = {
  ambientGainNode: [
    // Music
    { fileName: 'sfx_b_music_regular.mp3', soundName: SoundKey.MusicRegular, loop: true, volume: 1 },
    { fileName: 'sfx_b_music_fastplay.mp3', soundName: SoundKey.MusicFastPlay, loop: true, volume: 1 },
    { fileName: 'sfx_b_music_free_spin.mp3', soundName: SoundKey.MusicFreeSpin, loop: true, volume: 1 },

    // Reels
    { fileName: 'sfx_b_reels_start.mp3', soundName: SoundKey.ReelsStart, loop: false, volume: 1 },
    { fileName: 'sfx_b_reels_loop.mp3', soundName: SoundKey.ReelsLoop, loop: true, volume: 1 },
    { fileName: 'sfx_b_reels_stop.mp3', soundName: SoundKey.ReelsStop, loop: false, volume: 1 },

    // Symbols
    { fileName: 'sfx_b_hi_symbol_1.mp3', soundName: SoundKey.HiSymbol1, loop: false, volume: 1 },
    { fileName: 'sfx_b_hi_symbol_2.mp3', soundName: SoundKey.HiSymbol2, loop: false, volume: 1 },
    { fileName: 'sfx_b_hi_symbol_3.mp3', soundName: SoundKey.HiSymbol3, loop: false, volume: 1 },
    { fileName: 'sfx_b_hi_symbol_4.mp3', soundName: SoundKey.HiSymbol4, loop: false, volume: 1 },
    { fileName: 'sfx_b_hi_symbol_5.mp3', soundName: SoundKey.HiSymbol5, loop: false, volume: 1 },
    { fileName: 'sfx_b_low_symbol.mp3', soundName: SoundKey.LowSymbol, loop: false, volume: 1 },
    { fileName: 'sfx_b_wild.mp3', soundName: SoundKey.Wild, loop: false, volume: 1 },

    // Buttons
    { fileName: 'sfx_b_bf_button.mp3', soundName: SoundKey.BFButtons, loop: false, volume: 1 },
    { fileName: 'sfx_b_bf_close_window.mp3', soundName: SoundKey.CloseBF, loop: false, volume: 1 },
    { fileName: 'sfx_b_bf_open_window.mp3', soundName: SoundKey.OpenBFPopup, loop: false, volume: 1 },
    { fileName: 'sfx_b_bf_switch_window.mp3', soundName: SoundKey.SwitchBFWindow, loop: false, volume: 1 },
    { fileName: 'sfx_b_button.mp3', soundName: SoundKey.ButtonClick, loop: false, volume: 1 },

    // Wins
    { fileName: 'sfx_b_big_win.mp3', soundName: SoundKey.BigWin, loop: false, volume: 1 },
    { fileName: 'sfx_b_total_win.mp3', soundName: SoundKey.TotalWin, loop: false, volume: 1 },
    { fileName: 'sfx_b_regular_win_start.mp3', soundName: SoundKey.RegularWinStart, loop: false, volume: 1 },
    { fileName: 'sfx_b_regular_win_loop.mp3', soundName: SoundKey.RegularWinLoop, loop: true, volume: 1 },
    { fileName: 'sfx_b_regular_win_stop.mp3', soundName: SoundKey.RegularWinStop, loop: false, volume: 1 },
    { fileName: 'sfx_bonus_confirm.mp3', soundName: SoundKey.WelcomeBonusFSPopupEnd, loop: false, volume: 1 },

    // Special Sounds
    { fileName: 'sfx_b_pop-up_fs.mp3', soundName: SoundKey.PopUpFS, loop: false, volume: 1 },
    { fileName: 'sfx_b_pop-up_skill.mp3', soundName: SoundKey.PopUpMystery, loop: false, volume: 1 },
    { fileName: 'sfx_b_quest_tap.mp3', soundName: SoundKey.QuestTap, loop: false, volume: 1 },
    { fileName: 'sfx_b_scatter_coin.mp3', soundName: SoundKey.ScatterCoin, loop: false, volume: 1 },
    { fileName: 'sfx_b_wild_cloning.mp3', soundName: SoundKey.CloningWild, loop: false, volume: 1 },
    { fileName: 'sfx_bonus_shot_empty.mp3', soundName: SoundKey.FSBonusShot, loop: false, volume: 1 },
    { fileName: 'sfx_bonus_shot_yes.mp3', soundName: SoundKey.FSBonusShotWin, loop: false, volume: 1 },

    // Features
    { fileName: 'sfx_b_wild_double.mp3', soundName: SoundKey.WildSkip, loop: false, volume: 1 },
    { fileName: 'sfx_b_bonus_x_win.mp3', soundName: SoundKey.CloningWildMultiplier, loop: false, volume: 1 },

    // Anticipation
    { fileName: 'sfx_b_ancisipation_loop.mp3', soundName: SoundKey.AnticipationLoop, loop: true, volume: 1 },
    { fileName: 'sfx_b_ancisipation_out.mp3', soundName: SoundKey.AnticipationOut, loop: false, volume: 1 },

    // Count Money
    { fileName: 'sfx_b_count_money.mp3', soundName: SoundKey.CountMoney, loop: true, volume: 1 },
  ],
};
