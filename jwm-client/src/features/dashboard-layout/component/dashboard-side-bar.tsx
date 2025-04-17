import * as React from 'react';
import { useState } from 'react';
import { useDialogContext } from '@/component/dialog';
import { useIsMobile } from '@/hook/use-is-mobile';
import { useMainSlice } from '@/redux/store/main-slice';
import { Logout as LogoutIcon } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from '@mui/material';
import { menuItems } from '../config/menu-items';
import { DashboardDrawerElement } from './dashboard-drawer-element';

type Props = {
  sidebarWidth: number;
};

const DashboardSideBar: React.FC<Props> = ({ sidebarWidth }): React.ReactElement | null => {
  const { dashboardDrawerOpen } = useMainSlice();
  const { setOpen } = useDialogContext();
  const isMobile = useIsMobile();

  const [openSubMenu, setOpenSubMenu] = useState<Record<number, boolean>>({});

  if (!dashboardDrawerOpen && !isMobile) {
    return null;
  }

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={dashboardDrawerOpen}
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: sidebarWidth, boxSizing: 'border-box' },
      }}>
      <Toolbar />
      <Box display="flex" overflow="auto" height="100%" flexDirection="column">
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((menuItem, index) => (
            <DashboardDrawerElement
              key={menuItem.path}
              item={menuItem}
              index={index}
              openSubMenu={openSubMenu}
              setOpenSubMenu={setOpenSubMenu}
            />
          ))}
        </List>
        <Divider />
        <List>
          <ListItemButton onClick={setOpen}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};

export { DashboardSideBar };
