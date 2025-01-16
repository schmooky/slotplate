import { applyDefaultProps } from './props';
import * as components from '../components';
import invariant from './invariant';

export const TYPES = {
    BitmapText: 'BitmapText',
    Container: 'Container',
    Graphics: 'Graphics',
    NineSliceSprite: 'NineSliceSprite',
    Sprite: 'Sprite',
    AnimatedSprite: 'AnimatedSprite',
    Text: 'Text',
    TilingSprite: 'TilingSprite',
    MeshSimple: 'MeshSimple',
    MeshRope: 'MeshRope',
} as const;

type TypeKeys = keyof typeof TYPES;
type ComponentProps = Record<string, any>;
type Root = any;

const ELEMENTS: Record<TypeKeys, unknown> = Object.keys(TYPES).reduce((elements, type) => {
    const key = type as TypeKeys;
    return { ...elements, [key]: components[key] };
}, {} as Record<TypeKeys, unknown>);

export const TYPES_INJECTED: Record<string, {
    create: (props: ComponentProps, options: { root: Root }) => any;
    didMount?: () => void;
    willUnmount?: () => void;
    applyProps?: (instance: any, oldProps: ComponentProps, newProps: ComponentProps) => void;
    config?: unknown;
}> = {};

export function createElement(type: string, props: ComponentProps = {}, root: Root | null = null): any {
    const fn = ELEMENTS[type as TypeKeys] as ((root: Root, props: ComponentProps) => any) | undefined;

    let instance: any;
    let applyProps: (instance: any, oldProps: ComponentProps, newProps: ComponentProps) => void;

    if (typeof fn === 'function') {
        instance = fn(root, props);
    }

    if (!instance) {
        const injected = TYPES_INJECTED[type];

        if (injected) {
            instance = injected.create(props, { root });
            instance.didMount = injected.didMount ? injected.didMount.bind(instance) : undefined;
            instance.willUnmount = injected.willUnmount ? injected.willUnmount.bind(instance) : undefined;
            instance.applyProps = injected.applyProps ? injected.applyProps.bind(instance) : undefined;
            instance.config = injected.config;
        }
    }

    if (instance) {
        instance.__reactpixi = { root };

        applyProps = typeof instance?.applyProps === 'function' ? instance.applyProps : applyDefaultProps;
        applyProps(instance, {}, props);
    }

    return instance;
}

export function PixiComponent(
    type: string,
    lifecycle: {
        create: (props: ComponentProps, options: { root: Root }) => any;
        didMount?: () => void;
        willUnmount?: () => void;
        applyProps?: (instance: any, oldProps: ComponentProps, newProps: ComponentProps) => void;
        config?: unknown;
    }
): string {
    invariant(!!type, 'Expect type to be defined, got `%s`', type);
    invariant(!TYPES[type as TypeKeys], 'Component `%s` could not be created, already exists in default components.', type);

    TYPES_INJECTED[type] = lifecycle;

    return type;
}