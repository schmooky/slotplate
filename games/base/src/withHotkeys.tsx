import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { rootStore } from '@src/stores/RootStore';
import { gameEventHandler } from '@lib/gameEventHandler/gameEventHandler';
import { gameSettingStore } from '@src/stores/gameSettings/GameSettingStore';
import { Phase } from '@src/flow/types';

export const withHotkeys = (Component: React.ComponentType) => () => {
  useHotkeys(
    'space',
    (event) => {
      if (!gameSettingStore.isSpaceBarToSpin || rootStore.stateMachine.phase === Phase.BuyFeatureIdle) return;

      if (!event.repeat && !rootStore.modalStatusStore.isModalWindowOpened) {
        gameEventHandler.onBtnSpinClick();
      }
    },
    {
      keydown: true,
    },
    [],
  );

  return <Component />;
};
