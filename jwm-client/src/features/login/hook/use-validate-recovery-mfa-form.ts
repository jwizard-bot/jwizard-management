import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateRecoveryMfaFormType = {
  mfaRecoveryCode: string;
};

const formSchema = Yup.object().shape({
  mfaRecoveryCode: Yup.string().required('MFA recovery code is required'),
});

const useValidateRecoveryMfaForm = (): UseFormReturn<ValidateRecoveryMfaFormType> => {
  return useForm<ValidateRecoveryMfaFormType>({ resolver: yupResolver(formSchema) });
};

export { useValidateRecoveryMfaForm };
