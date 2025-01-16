import React, { forwardRef, createContext, ReactNode, ComponentType } from 'react';

type ContextType = unknown;

const Context = createContext<ContextType>(null);
const AppProvider = Context.Provider;
const AppConsumer = Context.Consumer;

function withPixiApp<P>(BaseComponent: ComponentType<P & { app: ContextType }>): ComponentType<P> {
    const wrapper = forwardRef<any, P>((props, ref) => (
        <AppConsumer>
            {(app) => <BaseComponent {...props} ref={ref} app={app} />}
        </AppConsumer>
    ));

    wrapper.displayName = `withPIXIApp(${BaseComponent.displayName || BaseComponent.name})`;

    return wrapper;
}

export { withPixiApp, AppProvider, AppConsumer, Context };