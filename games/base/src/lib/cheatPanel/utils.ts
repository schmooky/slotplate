import { CheatBody } from '@lib/cheatPanel/types';
import { rootStore } from '@src/stores/RootStore';

export const createCheatRequest =
  (cheatBody: CheatBody): (() => Promise<Response>) =>
  () =>
    fetch(`https://test-partner-dev.geekslots.studio/api/sessions/${rootStore.dataStore.sessionId}/cheats/v2`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cheatBody),
    });

export const deleteCheatRequest = (): (() => Promise<Response>) => () =>
  fetch(`https://test-partner-dev.geekslots.studio/api/sessions/${rootStore.dataStore.sessionId}/cheats`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
