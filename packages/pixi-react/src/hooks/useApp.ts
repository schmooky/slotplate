import { Application } from 'pixi.js';
import { useContext } from 'react';
import invariant from '../utils/invariant';
import { Context } from '../stage/provider';

export function useApp(): Application {
    const app = useContext(Context) as Application | null;

    invariant(
        app instanceof Application,
        'No Context found with `%s`. Make sure to wrap component with `%s`',
        'Application',
        'AppProvider'
    );

    return app;
}