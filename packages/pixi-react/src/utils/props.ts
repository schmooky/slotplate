import { eventHandlers, setValue } from './pixi';
import invariant from './invariant';
import { not, hasKey } from '../helpers/index.ts';
import { Texture, Container, DisplayObject } from 'pixi.js';

export const CHILDREN = 'children';

export const PROPS_RESERVED: Record<string, boolean> = {
  [CHILDREN]: true,
  parent: true,
  localColor: true,
  localAlpha: true,
  groupAlpha: true,
  groupColor: true,
  groupColorAlpha: true,
  localBlendMode: true,
  groupBlendMode: true,
  localVisibleRenderable: true,
  groupVisibleRenderable: true,
  renderPipeId: true,
  includeInBuild: true,
  measurable: true,
  isSimple: true,
  updateTick: true,
  localTransform: true,
  relativeGroupTransform: true,
  groupTransform: true,
  worldTransform: true,
  worldVisible: true,
};

export const PROPS_CONTAINER: Partial<Record<keyof Container, any>> = {
  alpha: 1,
  cacheAsBitmap: false,
  cursor: null,
  filterArea: null,
  filters: null,
  hitArea: null,
  interactive: false,
  mask: null,
  pivot: 0,
  position: 0,
  renderable: true,
  rotation: 0,
  scale: 1,
  skew: 0,
  transform: null,
  visible: true,
  x: 0,
  y: 0,
};

export const getTextureFromProps = (
  elementType: string,
  root: Container,
  props: Record<string, any> = {}
): Texture | null => {
  const emitChange = (texture: Texture) => {
    requestAnimationFrame(() => {
      texture?.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`);
    });
  };

  const check = (
    inType: string,
    validator: { typeofs: string[]; instanceofs: any[] }
  ): any => {
    if (Object.prototype.hasOwnProperty.call(props, inType)) {
      const valid =
        validator.typeofs.some((t) => typeof props[inType] === t) ||
        validator.instanceofs.some((i) => props[inType] instanceof i);

      invariant(valid, `${elementType} ${inType} prop is invalid`);

      return props[inType];
    }
  };

  if (props.texture) {
    invariant(
      props.texture instanceof Texture,
      `${elementType} texture needs to be typeof \`Texture\``
    );

    return props.texture;
  }

  const result =
    check('image', { typeofs: ['string'], instanceofs: [HTMLImageElement] }) ||
    check('video', { typeofs: ['string'], instanceofs: [HTMLVideoElement] }) ||
    check('source', {
      typeofs: ['string', 'number'],
      instanceofs: [
        HTMLImageElement,
        HTMLVideoElement,
        HTMLCanvasElement,
        Texture,
      ],
    });

  invariant(!!result, `${elementType} could not get texture from props`);

  const texture = Texture.from(result);

  texture.__reactpixi = { root };
  texture.once('update', emitChange);

  emitChange(texture);

  return texture;
};

const filterProps = not(
  hasKey<string>([
    ...Object.keys(PROPS_RESERVED),
    ...eventHandlers.map((handler) => String(handler)),
  ])
);

export const applyDefaultProps = (
  instance: Container,
  oldProps: Record<string, any>,
  newProps: Record<string, any>
): boolean => {
  let changed = false;

  invariant(
    Container.prototype.isPrototypeOf(instance),
    'instance needs to be typeof `Container`, got `%s`',
    typeof instance
  );

  if (!newProps.ignoreEvents) {
    const hasRemoveListener =
      typeof (instance as any).removeListener === 'function';
    const hasOn = typeof (instance as any).on === 'function';

    for (let i = 0; i < eventHandlers.length; i++) {
      const evt = eventHandlers[i]!;

      if (oldProps[evt] !== newProps[evt]) {
        changed = true;

        if (typeof oldProps[evt] === 'function' && hasRemoveListener) {
          (instance as any).removeListener(evt, oldProps[evt]);
        }

        if (typeof newProps[evt] === 'function' && hasOn) {
          (instance as any).on(evt, newProps[evt]);
        }
      }
    }
  }

  const newPropKeys = Object.keys(newProps || {});

  if (newProps.overwriteProps) {
    for (let i = 0; i < newPropKeys.length; i++) {
      const p = newPropKeys[i]!;

      if (oldProps[p] !== newProps[p]) {
        changed = true;
        setValue(instance, p, newProps[p]);
      }
    }
    return changed;
  }

  const props = newPropKeys.filter(filterProps);

  for (let i = 0; i < props.length; i++) {
    const prop = props[i]!;
    const value = newProps[prop];

    if (newProps[prop] !== oldProps[prop]) {
      changed = true;
    }

    if (value !== undefined) {
      setValue(instance, prop, value);
    } else if (prop in PROPS_CONTAINER) {
      changed = true;
      setValue(instance, prop, PROPS_CONTAINER[prop as keyof Container<DisplayObject>]);
    }
  }

  return changed;
};