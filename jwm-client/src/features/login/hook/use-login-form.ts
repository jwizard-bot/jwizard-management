import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { LoginReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
  login: Yup.string().required('Login is required'),
  password: Yup.string().required('Password is required'),
  cfToken: Yup.string().required('Verification is required'),
});

const useLoginForm = (): UseFormReturn<LoginReqDto> => {
  return useForm<LoginReqDto>({ resolver: yupResolver(formSchema) });
};

export { useLoginForm };
