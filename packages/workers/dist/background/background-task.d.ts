/**
 * A class for executing a function in a Web Worker and returning the result as a Promise.
 * This is useful for offloading computationally expensive tasks to a background thread.
 *
 * @example
 * const worker = new WorkHandler();
 * const enhancedData = await worker.run(() => {
 *     const data = bigCalculation();
 *     return data;
 * });
 */
export declare class BackgroundTask {
    private worker?;
    /**
     * Executes the provided function in a Web Worker and returns the result as a Promise.
     * @template T The type of the result returned by the function.
     * @param task A function containing the logic to execute in the worker.
     * @returns A Promise that resolves with the result of the function.
     */
    run<T>(task: () => T): Promise<T>;
    /**
     * Terminates the worker if it exists.
     */
    terminateWorker(): void;
}
//# sourceMappingURL=background-task.d.ts.map