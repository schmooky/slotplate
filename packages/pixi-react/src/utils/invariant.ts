export default function invariant(condition: boolean, format?: string, ...args: unknown[]): void {
    if (import.meta.env.MODE === 'production') {
        return;
    }

    if (!condition) {
        let error: Error;

        if (format === undefined) {
            error = new Error(
                'Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.'
            );
        } else {
            let argIndex = 0;
            error = new Error(format.replace(/%s/g, () => String(args[argIndex++])));
            error.name = 'Invariant Violation';
        }

        (error as any).framesToPop = 1;
        throw error;
    }
}