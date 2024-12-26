import { Phase } from '@src/flow/types';

export async function high2(): Promise<Phase.Wild> {
  await new Promise<void>((resolve) => {
    resolve();
  });

  return Phase.Wild;
}
