import { Ticker } from 'pixi.js';
import { useEffect, useRef } from 'react';
import { useApp } from './useApp';
import invariant from '../utils/invariant';

const ticker = new Ticker();

type Callback = (delta: number, ticker: Ticker) => void;

export function useTick(callback: Callback, enabled: boolean = true): void {
    invariant(typeof callback === 'function', '`useTick` needs a callback function.');

    const savedRef = useRef<Callback | null>(null);

    useEffect(() => {
        savedRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (enabled) {
            const tick = (delta: number) => savedRef.current?.(delta, ticker);

            ticker.add(tick);

            return () => {
                ticker.remove(tick);
            };
        }
    }, [enabled]);
}