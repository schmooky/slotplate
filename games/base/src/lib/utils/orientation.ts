import { resizeObject } from '@slotplate/renderer';

export const orientation = () => (resizeObject.isPortrait ? 'portrait' : 'landscape');
