import { LoggedUser } from '@/redux/api/type';

export type RevalidateResDto = {
  exists: boolean;
  loggedUser: LoggedUser | null;
  requireMfa: boolean;
  expired: boolean;
};

export type CsrfResDto = {
  csrfToken: string;
  headerName: string;
};
