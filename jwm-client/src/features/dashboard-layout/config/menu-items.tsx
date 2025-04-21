import * as React from 'react';
import {
  Dashboard as DashboardIcon,
  LockPerson as LockPersonIcon,
  Settings as SettingsIcon,
  People as UsersIcon,
} from '@mui/icons-material';

type MenuItem = {
  text: string;
  icon: React.ReactElement;
  path: string;
  onlyForAdmin?: boolean;
  subItems?: {
    text: string;
    path: string;
    onlyForAdmin?: boolean;
  }[];
};

// path for subitem = path from root + subitem path
const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    text: 'Users',
    icon: <UsersIcon />,
    path: '/users',
    onlyForAdmin: true,
    subItems: [
      { text: 'Show users', path: '' },
      { text: 'Add new user', path: '/add' },
    ],
  },
  {
    text: 'Security',
    icon: <LockPersonIcon />,
    path: '/security',
    subItems: [
      { text: 'Sessions', path: '/sessions' },
      { text: 'Login history', path: '/login-history' },
      { text: 'System event log', path: '/system-event-log', onlyForAdmin: true },
    ],
  },
  {
    text: 'Account settings',
    icon: <SettingsIcon />,
    path: '/account-settings',
    subItems: [
      { text: 'General', path: '' },
      { text: 'MFA settings', path: '/mfa' },
    ],
  },
];

export { type MenuItem, menuItems };
