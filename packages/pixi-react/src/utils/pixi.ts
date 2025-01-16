import { Point, ObservablePoint } from 'pixi.js';
import invariant from './invariant';
import isNil from 'lodash.isnil';

export function parsePoint(value: unknown): number[] {
  let arr: number[] = [];

  if (typeof value === 'string') {
    arr = value.split(',').map(Number);
  } else if (typeof value === 'number') {
    arr = [value];
  } else if (Array.isArray(value)) {
    arr = value.map(Number);
  } else if (value !== null && typeof value === 'object' && 'x' in value && 'y' in value) {
    const x = (value as { x: unknown; y: unknown }).x || 0;
    const y = (value as { x: unknown; y: unknown }).y || 0;
    arr = [x, y].map(Number);
  }

  return arr.filter((p) => !isNil(p) && !isNaN(p));
}

export function pointsAreEqual(oldValue: number[], newValue: number[]): boolean {
  if (oldValue.length !== newValue.length) {
    return false;
  }
  return oldValue.every((val, i) => val === newValue[i]);
}

export function isPointType(value: unknown): value is Point | ObservablePoint {
  return value instanceof Point || value instanceof ObservablePoint;
}

export const eventHandlers: string[] = [
  'click',
  'mousedown',
  'mousemove',
  'mouseout',
  'mouseover',
  'mouseup',
  'mouseupoutside',
  'tap',
  'touchstart',
  'touchmove',
  'touchend',
  'touchendoutside',
  'pointercancel',
  'pointerout',
  'pointerover',
  'pointertap',
  'pointerdown',
  'pointerup',
  'pointerupoutside',
  'pointermove',
  'rightclick',
  'rightdown',
  'rightup',
  'rightupoutside',
  'touchcancel',
  'touchendoutside',
  'touchmove',
  'touchstart',
];

export function setValue(instance: Record<string, any>, prop: string, value: unknown): void {
  if (isPointType(instance[prop]) && isPointType(value)) {
    instance[prop].copyFrom(value as Point | ObservablePoint);
  } else if (isPointType(instance[prop])) {
    const coordinates = parsePoint(value);
    invariant(
      coordinates.length > 0 && coordinates.length < 3,
      'The property `%s` is a `Point` and must be set to a comma-separated string of '
      + 'either coordinates, an array containing coordinates, or a Point.',
      prop,
      JSON.stringify(value),
      typeof value
    );
    instance[prop].set(coordinates[0] || 0, coordinates[1] || 0);
  } else {
    instance[prop] = value;
  }
}