export type RevalidateResDto = {
  loggedIn: boolean;
  expired: boolean;
};

export type CsrfResDto = {
  csrfToken: string;
  headerName: string;
};
