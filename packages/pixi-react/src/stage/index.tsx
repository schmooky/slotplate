import { Application, Ticker, IApplicationOptions, RENDERER_TYPE } from 'pixi.js';
import React, { ReactNode, Component } from 'react';
import { PixiFiber } from '../reconciler';
import { AppProvider } from './provider';
import { TrackablePromise } from './promise';
import invariant from '../utils/invariant';
import { PROPS_CONTAINER } from '../utils/props';

type StageProps = {
    width?: number;
    height?: number;
    onMount?: (app: Application) => void;
    onUnmount?: (app: Application | null) => void;
    raf?: boolean;
    renderOnComponentChange?: boolean;
    children?: ReactNode;
    options?: IApplicationOptions & {
        resizeTo?: Window | HTMLElement;
        canvas?: HTMLCanvasElement;
    };
};

type StageState = {};

const noop = () => {};

export const getCanvasProps = (props: Partial<StageProps>) => {
    const reserved = [
        'width',
        'height',
        'onMount',
        'onUnmount',
        'raf',
        'renderOnComponentChange',
        'children',
        'options',
        ...Object.keys(PROPS_CONTAINER),
    ];

    return Object.keys(props)
        .filter((p) => !reserved.includes(p))
        .reduce((all, prop) => ({ ...all, [prop]: props[prop as keyof StageProps] }), {});
};

class Stage extends Component<StageProps, StageState> {
    static defaultProps: Partial<StageProps> = {
        width: 800,
        height: 600,
        onMount: noop,
        onUnmount: noop,
        raf: true,
        renderOnComponentChange: true,
    };

    private _canvas: HTMLCanvasElement | null = null;
    private _mediaQuery: MediaQueryList | null = null;
    private _ticker: Ticker | null = null;
    private _needsUpdate = true;
    private app: Application | null = null;
    private appReady: TrackablePromise<Application> | null = null;
    private mountNode: any = null;

    componentDidMount() {
        const { width, height, options } = this.props;

        if (this.app && this.appReady) {
            this.appReady.destroy();
            this.appReady = null;
        }

        this.app = new Application({
            width,
            height,
            canvas: this._canvas || undefined,
            ...options,
            autoDensity: options?.autoDensity !== false,
        });

        this.appReady = new TrackablePromise(this.app);

        this.appReady.promiseCallback = () => this._initStage();
    }

    componentDidUpdate(prevProps: StageProps) {
        if (this.appReady?.isPending) return;

        const { width, height, raf, renderOnComponentChange, options } = this.props;

        if (
            options?.resolution !== undefined &&
            prevProps.options?.resolution !== options.resolution
        ) {
            this.app!.renderer.resolution = options.resolution;
        }

        if (
            prevProps.height !== height ||
            prevProps.width !== width ||
            prevProps.options?.resolution !== options?.resolution
        ) {
            this.updateSize();
        }

        if (prevProps.raf !== raf) {
            this.app!.ticker[raf ? 'start' : 'stop']();
        }

        PixiFiber.updateContainer(this.getChildren(), this.mountNode, this);

        if (
            prevProps.width !== width ||
            prevProps.height !== height ||
            prevProps.raf !== raf ||
            prevProps.renderOnComponentChange !== renderOnComponentChange ||
            prevProps.options !== options
        ) {
            this._needsUpdate = true;
            this.renderStage();
        }
    }

    updateSize = () => {
        const { width, height, options } = this.props;

        if (!options?.resolution) {
            this.app!.renderer.resolution = window.devicePixelRatio;
        }

        this.app!.renderer.resize(width!, height!);
    };

    needsRenderUpdate = () => {
        this._needsUpdate = true;
    };

    renderStage = () => {
        const { renderOnComponentChange, raf } = this.props;

        if (!raf && renderOnComponentChange && this._needsUpdate) {
            this._needsUpdate = false;
            this.app!.renderer.render(this.app!.stage);
        }
    };

    getChildren() {
        const { children } = this.props;

        return <AppProvider value={this.app!}>{children}</AppProvider>;
    }

    componentWillUnmount() {
        if (this.appReady?.isPending) {
            this.appReady.destroy();
            this.appReady = null;
            this.app = null;
            return;
        }

        this.props.onUnmount!(this.app);

        if (this._ticker) {
            this._ticker.remove(this.renderStage);
            this._ticker.destroy();
        }

        this.app!.stage.off('__REACT_PIXI_REQUEST_RENDER__', this.needsRenderUpdate);

        PixiFiber.updateContainer(null, this.mountNode, this);

        if (this._mediaQuery) {
            this._mediaQuery.removeListener(this.updateSize);
            this._mediaQuery = null;
        }

        this.app!.destroy();
    }

    render() {
        const { options } = this.props;

        if (options && options.canvas) {
            invariant(
                options.canvas instanceof HTMLCanvasElement,
                'options.canvas needs to be a `HTMLCanvasElement`'
            );

            return null;
        }

        return <canvas {...getCanvasProps(this.props)} ref={(c) => (this._canvas = c)} />;
    }

    private _initStage() {
        const { onMount, options, raf, renderOnComponentChange } = this.props;

        // if (
        //     process.env.NODE_ENV === 'development' &&
        //     this.app!.renderer.type === RENDERER_TYPE.WEBGL
        // ) {
        //     if (this.app!.renderer.context?.extensions) {
        //         this.app!.renderer.context.extensions.loseContext = null;
        //     }
        // }

        this.app!.ticker.autoStart = false;
        this.app!.ticker[raf ? 'start' : 'stop']();

        this.app!.stage.__reactpixi = { root: this.app!.stage, app: this.app };
        this.mountNode = PixiFiber.createContainer(this.app!.stage);
        PixiFiber.updateContainer(this.getChildren(), this.mountNode, this);

        onMount!(this.app!);

        if (
            options?.autoDensity &&
            window.matchMedia &&
            options?.resolution === undefined
        ) {
            this._mediaQuery = window.matchMedia(
                `(-webkit-min-device-pixel-ratio: 1.3), (min-resolution: 120dpi)`
            );
            this._mediaQuery.addListener(this.updateSize);
        }

        if (renderOnComponentChange && !raf) {
            this._ticker = new Ticker();
            this._ticker.autoStart = true;
            this._ticker.add(this.renderStage);
            this.app!.stage.on('__REACT_PIXI_REQUEST_RENDER__', this.needsRenderUpdate);
        }

        this.updateSize();
        this.renderStage();
    }
}

export default Stage;