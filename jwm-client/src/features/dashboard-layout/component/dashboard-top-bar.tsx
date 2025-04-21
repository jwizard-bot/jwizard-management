import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDialogContext } from '@/component/dialog';
import { toggleDashboardDrawerState, useMainSlice } from '@/redux/store/main-slice';
import {
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';

const DashboardTopBar: React.FC = (): React.ReactElement | null => {
  const { loggedUser } = useMainSlice();
  const { setOpen } = useDialogContext();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLButtonElement) | null>(null);
  const navigate = useNavigate();

  const handleMenuClose = (): void => setAnchorEl(null);

  if (!loggedUser) {
    return null;
  }

  const { login, admin } = loggedUser;

  const accountType = useMemo(() => (admin ? 'admin' : 'user'), [loggedUser]);

  return (
    <AppBar position="fixed" sx={{ zIndex: theme => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          edge="start"
          sx={{ mr: 2 }}
          onClick={() => dispatch(toggleDashboardDrawerState())}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          JWizard Management Panel
        </Typography>
        <Box>
          <Button onClick={e => setAnchorEl(e.currentTarget)} color="inherit">
            <Typography
              variant="body1"
              textTransform="none"
              sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
              {login} ({accountType})
            </Typography>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontWeight: 'normal',
              }}>
              {login.charAt(0)}
            </Avatar>
          </Button>
          <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}>
            <ListItem>
              <Typography color="textSecondary" pr={1}>
                Logged as:
              </Typography>
              {login}
            </ListItem>
            <ListItem>
              <Typography color="textSecondary" pr={1}>
                Account type:
              </Typography>
              {accountType}
            </ListItem>
            <Divider />
            <MenuItem
              onClick={(): void => {
                navigate('/account-settings');
                handleMenuClose();
              }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={setOpen}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export { DashboardTopBar };
