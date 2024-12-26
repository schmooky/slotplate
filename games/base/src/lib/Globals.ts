import SceneManager from './SceneManager';
import { GameApplication } from '../application';

interface GlobalsParameters {
  scene?: SceneManager;
  gameApp?: GameApplication;
}

export const Globals: GlobalsParameters = {};
