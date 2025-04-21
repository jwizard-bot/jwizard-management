import { useMemo, useState } from 'react';
import { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

type Capitalize<S extends string> = S extends `${infer First}${infer Rest}`
  ? `${Uppercase<First>}${Rest}`
  : S;

type AddOnPrefix<K extends string> = `on${Capitalize<K>}`;

type ReturnProps<T extends FieldValues, K extends string> = {
  [P in AddOnPrefix<K>]: SubmitHandler<T>;
};

const useMultipleFormSubmissions = <T extends FieldValues, K extends string>(
  { formState: { isSubmitting } }: UseFormReturn<T>,
  handlers: Record<K, SubmitHandler<T>>
): [ReturnProps<T, K>, (handlerKey: K) => boolean] => {
  const [handler, setHandler] = useState<K>();

  const mappedHandlers = useMemo(() => {
    const result = {} as ReturnProps<T, K>;
    (Object.keys(handlers) as K[]).forEach(key => {
      const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
      result[`on${capitalizedKey}` as AddOnPrefix<K>] = async (data: T) => {
        setHandler(key);
        await handlers[key](data);
      };
    });
    return result;
  }, [handlers]);

  return [mappedHandlers, (handlerKey: K): boolean => handler === handlerKey && isSubmitting];
};

export { useMultipleFormSubmissions };
