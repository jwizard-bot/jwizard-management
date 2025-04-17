import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type ValidateMfaFormType = {
  mfaCode: string;
};

const formSchema = Yup.object().shape({
  mfaCode: Yup.string().required('MFA code is required'),
});

const useValidateMfaForm = (): UseFormReturn<ValidateMfaFormType> => {
  return useForm<ValidateMfaFormType>({ resolver: yupResolver(formSchema) });
};

export { useValidateMfaForm };
