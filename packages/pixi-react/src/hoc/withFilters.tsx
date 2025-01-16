import { useMemo, useRef, ComponentType, ReactNode } from 'react';
import invariant from '../utils/invariant';
import { hasKey, isFunction, not } from '../helpers/index';

export const withFilters = <T extends Record<string, any>>(
    WrapperComponent: ComponentType<any>,
    filters: T
) => {
    invariant(
        typeof filters === 'object',
        'Second argument needs to be an indexed object with { prop: Filter }'
    );

    const keys = Object.keys(filters);

    const Wrapper: React.FC<{
        children?: ReactNode;
        apply?: (filterObj: Record<keyof T, InstanceType<T[keyof T]>>) => void;
        [key: string]: any;
    }> = ({ children, apply, ...props }) => {
        const filterList = useRef(
            useMemo(
                () =>
                    keys.map((prop) => {
                        const constructorArgs: any[] =
                            props?.[prop]?.construct || [];
                        return new filters[prop](...constructorArgs);
                    }),
                [keys, props]
            )
        );

        const filterObj = useMemo(
            () =>
                keys.reduce(
                    (all, c, i) => ({
                        ...all,
                        [c]: filterList.current[i],
                    }),
                    {} as Record<keyof T, InstanceType<T[keyof T]>>
                ),
            [keys]
        );

        const restProps = useMemo(
            () =>
                Object.keys(props)
                    .filter(not(hasKey(keys)))
                    .reduce(
                        (all, c) => ({ ...all, [c]: props[c] }),
                        {} as Record<string, any>
                    ),
            [props, keys]
        );

        keys.forEach((k, i) =>
            Object.assign(filterList.current[i], props[k])
        );

        if (apply && isFunction(apply)) {
            apply.call(WrapperComponent, filterObj);
        }

        return (
            <WrapperComponent {...restProps} filters={filterList.current}>
                {children}
            </WrapperComponent>
        );
    };

    Wrapper.displayName = 'FilterWrapper';

    return Wrapper;
};