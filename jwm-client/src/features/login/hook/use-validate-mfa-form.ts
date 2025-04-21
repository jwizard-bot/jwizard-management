import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useMutationForm } from '@/hook/use-mutation-form';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateMfaFormType = {
  mfaCode: string;
};

const formSchema = Yup.object().shape({
  mfaCode: Yup.string().required('MFA code is required'),
});

const useValidateMfaForm = (isMutationError: boolean): UseFormReturn<ValidateMfaFormType> =>
  useMutationForm<ValidateMfaFormType>({
    isMutationError,
    onErrorCallback: form => {
      form.resetField('mfaCode');
    },
    resolver: yupResolver(formSchema),
  });

export { useValidateMfaForm };
