export type LoginReqDto = {
  login: string;
  password: string;
  cfToken: string;
};

export type LoginResDto = {
  authenticated: boolean;
  loggedUserData?: LoggedUserData;
};

export type LoggedUserData = {
  login: string;
  isAdmin: boolean;
  mfaEnabled: boolean;
  initPasswordChanged: boolean;
};
