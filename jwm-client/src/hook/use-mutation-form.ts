import { useEffect } from 'react';
import { FieldValues, UseFormProps, UseFormReturn, useForm } from 'react-hook-form';

type Props<T extends FieldValues> = {
  isMutationError: boolean;
  onErrorCallback?: (form: UseFormReturn<T>) => void;
} & UseFormProps<T>;

const useMutationForm = <T extends FieldValues>({
  isMutationError,
  onErrorCallback = () => {},
  ...formConfig
}: Props<T>): UseFormReturn<T> => {
  const form = useForm<T>(formConfig);

  useEffect(() => {
    if (isMutationError) {
      onErrorCallback(form);
    }
  }, [isMutationError]);

  return form;
};

export { useMutationForm };
