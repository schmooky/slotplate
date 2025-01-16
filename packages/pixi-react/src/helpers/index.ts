export const isFunction = (...args: unknown[]): boolean =>
    args.every((v) => typeof v === 'function');

export const isObject = (obj: unknown): boolean =>
    Object.prototype.toString.call(obj) === '[object Object]';

export const hasKey = (collection: object | any[]): (key: string) => boolean => {
    let coll: string[];

    if (Array.isArray(collection)) {
        coll = collection as string[];
    } else if (isObject(collection)) {
        coll = Object.keys(collection);
    } else {
        throw new Error('collection needs to be an Array or Object');
    }

    const index: Record<string, boolean> = {};

    for (const key of coll) {
        index[key] = true;
    }

    return (key: string): boolean => typeof index[key] !== 'undefined';
};

export const not = <T extends unknown[]>(
    boolFn: (...args: T) => boolean
): ((...args: T) => boolean) => (...args: T) => !boolFn(...args);

export const lcFirst = (value: string): string =>
    value.charAt(0).toLowerCase() + value.substring(1);