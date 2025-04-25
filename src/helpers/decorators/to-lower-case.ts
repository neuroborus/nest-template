/**
 * Decorator that automatically lowercases a string property when it's set.
 */
export function ToLowerCase(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol): void {
    const privateKey = Symbol();

    Object.defineProperty(target, propertyKey, {
      get() {
        return this[privateKey];
      },
      set(value: string) {
        this[privateKey] =
          typeof value === 'string' ? value.toLowerCase() : value;
      },
      enumerable: true,
      configurable: true,
    });
  };
}
