import { UseFormReturn, useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ChangeDefaultPasswordReqDto } from '@/redux/api/auth/type';
import { yupResolver } from '@hookform/resolvers/yup';

const formSchema = Yup.object().shape({
  oldPassword: Yup.string().required('Old password is required'),
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
  cfToken: Yup.string().required('Verification is required'),
});

const useChangeDefaultPasswordForm = (): UseFormReturn<ChangeDefaultPasswordReqDto> => {
  return useForm<ChangeDefaultPasswordReqDto>({ resolver: yupResolver(formSchema) });
};

export { useChangeDefaultPasswordForm };
