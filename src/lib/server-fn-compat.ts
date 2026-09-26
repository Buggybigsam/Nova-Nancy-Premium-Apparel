/**
 * Client-safe, isomorphic createServerFn replacement for static SPA builds.
 * Executes the function handler directly in the browser without requiring a Node.js SSR server.
 */
export function createServerFn(_opts?: { method?: "GET" | "POST" }) {
  let validatorFn: ((data: unknown) => unknown) | null = null;

  const builder = {
    middleware: () => builder,
    inputValidator: (fn: (data: unknown) => unknown) => {
      validatorFn = fn;
      return builder;
    },
    validator: (fn: (data: unknown) => unknown) => {
      validatorFn = fn;
      return builder;
    },
    handler: (fn: (ctx: { data: unknown; context: Record<string, unknown> }) => Promise<unknown>) => {
      const runner = async (args?: { data?: unknown } | unknown) => {
        const inputData =
          args != null && typeof args === "object" && "data" in (args as Record<string, unknown>)
            ? (args as { data: unknown }).data
            : args;
        const validated = validatorFn ? validatorFn(inputData) : inputData;
        return fn({ data: validated, context: {} });
      };
      runner.url = "";
      return runner;
    },
  };

  return builder;
}

export function useServerFn<T>(fn: T): T {
  return fn;
}

