import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ChangeForgotPasswordReqDto } from '@/redux/api/forgot-password/type';
import { yupResolver } from '@hookform/resolvers/yup';

type ChangeForgotPasswordFormType = Omit<ChangeForgotPasswordReqDto, 'otaToken'>;

const formSchema = Yup.object().shape({
  newPassword: Yup.string()
    .required('New password is required')
    .min(10, 'Password must be at least 10 characters long')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/\d/, 'Password must contain at least one number')
    .matches(/[!@#$%^&*]/, 'Password must contain at least one special character'),
  confirmedNewPassword: Yup.string()
    .required('Confirmed new password is required')
    .oneOf([Yup.ref('newPassword')], 'Passwords do not match'),
});

const useChangeForgotPasswordForm = (): UseFormReturn<ChangeForgotPasswordFormType> =>
  useForm<ChangeForgotPasswordFormType>({
    resolver: yupResolver(formSchema),
  });

export { type ChangeForgotPasswordFormType, useChangeForgotPasswordForm };
