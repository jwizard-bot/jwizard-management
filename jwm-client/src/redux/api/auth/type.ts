import { LoggedUser } from '@/redux/api/type';

export type CfTokenProtected = {
  cfToken: string;
};

export type LoginReqDto = {
  login: string;
  password: string;
} & CfTokenProtected;

export type LoginResDto = {
  requireMfa: boolean;
  loggedUser: LoggedUser | null;
};

export type ValidateMfaReqDto = {
  mfaCode: string;
};

export type ValidateMfaResDto = {
  loggedUser: LoggedUser | null;
};

export type ChangeDefaultPasswordReqDto = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
} & CfTokenProtected;
