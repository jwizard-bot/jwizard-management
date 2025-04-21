import { useEffect } from 'react';
import { FieldValues, UseFormProps, UseFormReturn } from 'react-hook-form';
import { useMutationForm } from '@/hook/use-mutation-form';

type Props<T extends FieldValues, U> = {
  isMutationError?: boolean;
  onFetchData: () => U | undefined;
  onSuccessCallback: (form: UseFormReturn<T>, data: U) => void;
  onErrorCallback?: (form: UseFormReturn<T>) => void;
} & UseFormProps<T>;

const useQueryMutationForm = <T extends FieldValues, U>({
  isMutationError = false,
  onFetchData,
  onSuccessCallback,
  onErrorCallback = () => {},
  ...formConfig
}: Props<T, U>): [UseFormReturn<T>, boolean] => {
  const data = onFetchData();
  const form = useMutationForm({ isMutationError, onErrorCallback, ...formConfig });

  useEffect(() => {
    if (data) {
      onSuccessCallback(form, data);
    }
  }, [data]);

  return [form, !!data];
};

export { useQueryMutationForm };
