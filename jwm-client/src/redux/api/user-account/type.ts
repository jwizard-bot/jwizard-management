export type AccountEmailResDto = {
  email: string;
};

export type UpdateAccountEmailReqDto = {
  email: string | null;
};

export type SendTestEmailReqDto = {
  email: string;
};

export type ChangePasswordReqDto = {
  oldPassword: string;
  newPassword: string;
  confirmedNewPassword: string;
};
