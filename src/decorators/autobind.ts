namespace App {
    export function AutoBind(
        _target: any,
        _methodName: string,
        descriptor: PropertyDescriptor
      ) {
        const originalMethod = descriptor.value;
        return {
          configurable: true,
          enumerable: false,
          get() {
            return originalMethod.bind(this);
          },
        };
      }
}