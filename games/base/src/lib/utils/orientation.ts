import { resizeObject } from '@gambit/game-renderer';

export const orientation = () => (resizeObject.isPortrait ? 'portrait' : 'landscape');
