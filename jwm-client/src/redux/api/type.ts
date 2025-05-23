export type LoggedUser = {
  login: string;
  hasDefaultPassword: boolean;
  admin: boolean;
};

export type CfTokenProtected = {
  cfToken: string;
};
