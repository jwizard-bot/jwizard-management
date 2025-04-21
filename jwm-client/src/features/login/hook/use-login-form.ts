import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useMutationForm } from '@/hook/use-mutation-form';
import { LoginReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
  login: Yup.string().required('Login is required'),
  password: Yup.string().required('Password is required'),
  cfToken: Yup.string().required('Verification is required'),
});

const useLoginForm = (isMutationError: boolean): UseFormReturn<LoginReqDto> =>
  useMutationForm<LoginReqDto>({
    isMutationError,
    onErrorCallback: form => {
      form.resetField('password');
    },
    resolver: yupResolver(formSchema),
  });

export { useLoginForm };
