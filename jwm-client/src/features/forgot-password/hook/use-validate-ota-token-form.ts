import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useMutationForm } from '@/hook/use-mutation-form';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateOtaTokenFormType = {
  otaToken: string;
};

const formSchema = Yup.object().shape({
  otaToken: Yup.string().required('OTA token is required'),
});

const useValidateOtaTokenForm = (
  isMutationError: boolean
): UseFormReturn<ValidateOtaTokenFormType> =>
  useMutationForm<ValidateOtaTokenFormType>({
    isMutationError,
    onErrorCallback: form => {
      form.resetField('otaToken');
    },
    resolver: yupResolver(formSchema),
  });

export { type ValidateOtaTokenFormType, useValidateOtaTokenForm };
