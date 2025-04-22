import { CfTokenProtected } from '@/redux/api/type';

export type RequestForgotPasswordReqDto = {
  login: string;
} & CfTokenProtected;

export type ChangeForgotPasswordReqDto = {
  newPassword: string;
  confirmedNewPassword: string;
  otaToken: string;
};
