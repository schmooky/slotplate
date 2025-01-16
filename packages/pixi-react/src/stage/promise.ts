/**
 * Error object thrown if the promise is cancelled.
 */

export interface Cancellation {
    wasCancelled: boolean
}


/**
 * A promise that can be cancelled (primarily to be used in backend calls).
 *
 * When the promise is cancelled it will reject with a Cancellation error.
 */
export class CancellablePromise<T> implements Promise<T> {
    private static seq = 0
    readonly id = CancellablePromise.seq++
    private readonly promise: Promise<T>
    private rejectInnerPromise?: (reason?: any) => void
    private hasFinished = false

    constructor(orgPromise: Promise<T>) {
        this.promise = new Promise<T>((resolve, reject) => {
            this.rejectInnerPromise = reject
            orgPromise.then(
                r => resolve(r),
                e => reject(e)
            ).finally(() => this.hasFinished = true)
        })
    }

    cancel() {
        if (!this.hasFinished) {
            // console.log('Cancel Promise:', this.id)
            this.rejectInnerPromise && this.rejectInnerPromise({wasCancelled: true})
        }
    }

    readonly [Symbol.toStringTag]: string

    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): Promise<T | TResult> {
        return this.promise.catch(onrejected)
    }

    finally(onfinally?: (() => void) | undefined | null): Promise<T> {
        return this.promise.finally(onfinally)
    }

    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): Promise<TResult1 | TResult2> {
        return this.promise.then(onfulfilled, onrejected)
    }
}

export class TrackablePromise<T>
{
    isPending;
    isRejected;
    isFulfilled;
    promise: CancellablePromise<T> | null = null;
    promiseCallback = null;
    constructor(promise: Promise<T>)
    {
        this.isPending = true;
        this.isRejected = false;
        this.isFulfilled = false;
        this.promise = new CancellablePromise(promise);

        this.promise
            .then((value) =>
            {
                this.promiseCallback?.(value);
                this.isFulfilled = true;
                this.isPending = false;

                return value;
            })
            .catch((error) =>
            {
                this.isRejected = true;
                this.isPending = false;
                throw error;
            });
    }

    destroy()
    {
        this.promise?.cancel();
        this.isPending = false;
        this.isRejected = false;
        this.isFulfilled = false;
    }
}
