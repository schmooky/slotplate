// Importing types and utilities explicitly from their respective modules
import { PixiComponent, TYPES } from './utils/element';
import { createRoot, render, unmountComponentAtNode } from './render';
import Stage from './stage';
import { PixiFiber } from './reconciler';
import { Context as AppContext, AppProvider, AppConsumer, withPixiApp } from './stage/provider';
import { useTick, useApp } from './hooks';
import { withFilters } from './hoc';
import { eventHandlers } from './utils/pixi';
import { applyDefaultProps } from './utils/props';

/**
 * -------------------------------------------
 * Public API (with ESM-style explicit exports)
 * -------------------------------------------
 */

// Re-exporting the individual parts of the API explicitly
export {
    createRoot,
    render,
    unmountComponentAtNode,
    Stage,
    withPixiApp,
    PixiComponent,
    PixiFiber,
    AppProvider,
    AppConsumer,
    AppContext,
    useTick,
    useApp,
    withFilters,
    applyDefaultProps,
    eventHandlers,
    TYPES,
};
