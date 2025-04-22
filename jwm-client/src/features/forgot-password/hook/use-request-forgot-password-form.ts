import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { RequestForgotPasswordReqDto } from '@/redux/api/forgot-password/type';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
  login: Yup.string().required('Login is required'),
  cfToken: Yup.string().required('Verification is required'),
});

const useRequestForgotPasswordForm = (): UseFormReturn<RequestForgotPasswordReqDto> =>
  useForm<RequestForgotPasswordReqDto>({ resolver: yupResolver(formSchema) });

export { useRequestForgotPasswordForm };
