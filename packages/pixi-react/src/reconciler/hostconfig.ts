import performanceNow from 'performance-now';
import {
    ContinuousEventPriority,
    DiscreteEventPriority,
    DefaultEventPriority,
} from 'react-reconciler/constants';
import invariant from '../utils/invariant';
import { createElement } from '../utils/element';
import { CHILDREN, applyDefaultProps } from '../utils/props';

const NO_CONTEXT = {};

type HostContext = typeof NO_CONTEXT;

interface PixiElement {
    visible?: boolean;
    config?: {
        destroy?: boolean;
        destroyChildren?: boolean;
        destroyTexture?: boolean;
        destroyTextureSource?: boolean;
    };
    children?: PixiElement[];
    applyProps?: (instance: any, oldProps: any, newProps: any) => boolean;
    didMount?: (child: PixiElement, parent: PixiElement) => void;
    willUnmount?: (child: PixiElement, parent: PixiElement) => void;
    destroy: (options?: {
        children?: boolean;
        texture?: boolean;
        textureSource?: boolean;
    }) => void;
    addChild?: (child: PixiElement) => void;
    removeChild?: (child: PixiElement) => void;
    addChildAt?: (child: PixiElement, index: number) => void;
    getChildIndex?: (child: PixiElement) => number;
    __reactpixi?: {
        root?: {
            emit: (event: string, payload: any) => void;
        };
    };
}

function getEventPriority(): number {
    if (typeof window === 'undefined') {
        return DefaultEventPriority;
    }

    const name = window?.event?.type;

    switch (name) {
        case 'click':
        case 'contextmenu':
        case 'dblclick':
        case 'pointercancel':
        case 'pointerdown':
        case 'pointerup':
            return DiscreteEventPriority;
        case 'pointermove':
        case 'pointerout':
        case 'pointerover':
        case 'pointerenter':
        case 'pointerleave':
        case 'wheel':
            return ContinuousEventPriority;
        default:
            return DefaultEventPriority;
    }
}

function appendChild(parent: PixiElement, child: PixiElement): void {
    if (parent.addChild) {
        parent.addChild(child);

        if (typeof child.didMount === 'function') {
            child.didMount(child, parent);
        }
    }
}

function willUnmountRecursive(child: PixiElement, parent: PixiElement): void {
    child.willUnmount?.(child, parent);

    if (child.config?.destroyChildren !== false && child.children?.length) {
        [...child.children].forEach((c) => willUnmountRecursive(c, child));
    }
}

function removeChild(parent: PixiElement, child: PixiElement): void {
    willUnmountRecursive(child, parent);

    parent.removeChild?.(child);

    const {
        destroy = true,
        destroyChildren = true,
        destroyTexture = false,
        destroyTextureSource = false,
    } = child.config ?? {};

    if (destroy) {
        child.destroy({
            children: destroyChildren,
            texture: destroyTexture,
            textureSource: destroyTextureSource,
        });
    }
}

function insertBefore(
    parent: PixiElement,
    child: PixiElement,
    beforeChild: PixiElement
): void {
    invariant(child !== beforeChild, 'Cannot insert node before itself');

    const childExists = parent.children?.indexOf(child) !== -1;

    if (childExists) {
        parent.removeChild?.(child);
    }

    const index = parent.getChildIndex?.(beforeChild) ?? -1;

    parent.addChildAt?.(child, index);

    parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'insertBefore' });
}

function diffProperties(
    pixiElement: PixiElement,
    type: string,
    lastProps: Record<string, any>,
    nextProps: Record<string, any>
): Array<any> | null {
    let updatePayload: Array<any> | null = null;

    for (const propKey in lastProps) {
        if (
            nextProps.hasOwnProperty(propKey) ||
            !lastProps.hasOwnProperty(propKey) ||
            lastProps[propKey] === null
        ) {
            continue;
        }
        if (propKey !== CHILDREN) {
            if (!updatePayload) {
                updatePayload = [];
            }
            updatePayload.push(propKey, null);
        }
    }

    for (const propKey in nextProps) {
        const nextProp = nextProps[propKey];
        const lastProp = lastProps ? lastProps[propKey] : undefined;

        if (
            !nextProps.hasOwnProperty(propKey) ||
            nextProp === lastProp ||
            (nextProp === null && lastProp === null)
        ) {
            continue;
        }

        if (propKey !== CHILDREN) {
            if (!updatePayload) {
                updatePayload = [];
            }
            updatePayload.push(propKey, nextProp);
        }
    }

    return updatePayload;
}

let prepareChanged: Array<any> | null = null;

const HostConfig = {
    getRootHostContext(): HostContext {
        return NO_CONTEXT;
    },

    getChildHostContext(parentHostContext: HostContext): HostContext {
        return parentHostContext;
    },

    getChildHostContextForEventComponent(parentHostContext: HostContext): HostContext {
        return parentHostContext;
    },

    getPublicInstance(instance: any): any {
        return instance;
    },

    getCurrentEventPriority(): number {
        return getEventPriority();
    },

    prepareForCommit(): null {
        return null;
    },

    resetAfterCommit(): void {},

    createInstance: createElement,

    hideInstance(instance: PixiElement): void {
        instance.visible = false;
    },

    unhideInstance(instance: PixiElement, props: Record<string, any>): void {
        const visible = props?.visible ?? true;
        instance.visible = visible;
    },

    finalizeInitialChildren(): boolean {
        return false;
    },

    prepareUpdate(
        pixiElement: PixiElement,
        type: string,
        oldProps: Record<string, any>,
        newProps: Record<string, any>
    ): Array<any> | null {
        prepareChanged = diffProperties(pixiElement, type, oldProps, newProps);
        return prepareChanged;
    },

    shouldSetTextContent(): boolean {
        return false;
    },

    shouldDeprioritizeSubtree(type: string, props: Record<string, any>): boolean {
        const isAlphaVisible = props.alpha === undefined || props.alpha > 0;
        const isRenderable = props.renderable === undefined || props.renderable === true;
        const isVisible = props.visible === undefined || props.visible === true;

        return !(isAlphaVisible && isRenderable && isVisible);
    },

    createTextInstance(): void {
        invariant(
            false,
            `Error trying to add text node`,
            'Text strings as children of a Pixi component is not supported.'
        );
    },

    unhideTextInstance(): void {},

    mountEventComponent(): void {},

    updateEventComponent(): void {},

    handleEventTarget(): void {},

    scheduleTimeout: setTimeout,

    cancelTimeout: clearTimeout,

    noTimeout: -1,

    warnsIfNotActing: false,

    now: performanceNow,

    isPrimaryRenderer: false,

    supportsMutation: true,

    supportsPersistence: false,

    supportsHydration: false,

    supportsMicrotasks: true,

    scheduleMicrotask: queueMicrotask,

    appendInitialChild(parent: PixiElement, child: PixiElement): void {
        appendChild(parent, child);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendInitialChild' });
    },

    appendChild(parent: PixiElement, child: PixiElement): void {
        appendChild(parent, child);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChild' });
    },

    appendChildToContainer(parent: PixiElement, child: PixiElement): void {
        appendChild(parent, child);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'appendChildToContainer' });
    },

    removeChild(parent: PixiElement, child: PixiElement): void {
        removeChild(parent, child);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChild' });
    },

    removeChildFromContainer(parent: PixiElement, child: PixiElement): void {
        removeChild(parent, child);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'removeChildFromContainer' });
    },

    insertBefore,

    insertInContainerBefore(parent: PixiElement, child: PixiElement, beforeChild: PixiElement): void {
        insertBefore(parent, child, beforeChild);
        parent.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'insertInContainerBefore' });
    },

    commitUpdate(
        instance: PixiElement,
        updatePayload: Array<any> | null,
        type: string,
        oldProps: Record<string, any>,
        newProps: Record<string, any>
    ): void {
        let applyProps = instance?.applyProps || applyDefaultProps;
        const changed = applyProps(instance, oldProps, newProps);

        if (changed || prepareChanged) {
            instance.__reactpixi?.root?.emit(`__REACT_PIXI_REQUEST_RENDER__`, { detail: 'commitUpdate' });
        }
    },

    commitMount(): void {},

    commitTextUpdate(): void {},

    resetTextContent(): void {},

    clearContainer(): void {},

    getFundamentalComponentInstance(): never {
        throw new Error('Not yet implemented.');
    },

    mountFundamentalComponent(): never {
        throw new Error('Not yet implemented.');
    },

    shouldUpdateFundamentalComponent(): never {
        throw new Error('Not yet implemented.');
    },

    unmountFundamentalComponent(): never {
        throw new Error('Not yet implemented.');
    },

    getInstanceFromNode(): never {
        throw new Error('Not yet implemented.');
    },

    isOpaqueHydratingObject(): never {
        throw new Error('Not yet implemented');
    },

    makeOpaqueHydratingObject(): never {
        throw new Error('Not yet implemented.');
    },

    makeClientIdInDEV(): never {
        throw new Error('Not yet implemented');
    },

    beforeActiveInstanceBlur(): void {},

    afterActiveInstanceBlur(): void {},

    detachDeletedInstance(): void {},

    preparePortalMount(): void {},
};

export default HostConfig;