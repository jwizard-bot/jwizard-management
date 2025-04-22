import { UseFormReturn } from 'react-hook-form';
import * as Yup from 'yup';
import { useMutationForm } from '@/hook/use-mutation-form';
import { ChangePasswordReqDto } from '@/redux/api/user-account/type';
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
});

const useChangePasswordForm = (isMutationError: boolean): UseFormReturn<ChangePasswordReqDto> =>
  useMutationForm<ChangePasswordReqDto>({
    isMutationError,
    onErrorCallback: form => {
      form.resetField('oldPassword');
    },
    resolver: yupResolver(formSchema),
  });

export { useChangePasswordForm };
