import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useMutationForm } from '@/hook/use-mutation-form';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateRecoveryMfaFormType = {
  mfaRecoveryCode: string;
};

const formSchema = Yup.object().shape({
  mfaRecoveryCode: Yup.string().required('MFA recovery code is required'),
});

const useValidateRecoveryMfaForm = (
  isMutationError: boolean
): UseFormReturn<ValidateRecoveryMfaFormType> =>
  useMutationForm<ValidateRecoveryMfaFormType>({
    isMutationError,
    onErrorCallback: form => {
      form.resetField('mfaRecoveryCode');
    },
    resolver: yupResolver(formSchema),
  });

export { useValidateRecoveryMfaForm };
