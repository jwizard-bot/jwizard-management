import { CfTokenProtected, LoggedUser } from '@/redux/api/type';

export type LoginReqDto = {
  login: string;
  password: string;
} & CfTokenProtected;

export type LoginResDto = {
  requireMfa: boolean;
  loggedUser: LoggedUser | null;
};

export type ValidateMfaResDto = {
  loggedUser: LoggedUser;
};

export type ChangeDefaultPasswordReqDto = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
} & CfTokenProtected;
