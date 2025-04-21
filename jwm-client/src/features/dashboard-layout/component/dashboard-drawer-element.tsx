import * as React from 'react';
import { Dispatch, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hook/use-is-mobile';
import { setDashboardDrawerState, useMainSlice } from '@/redux/store/main-slice';
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { MenuItem } from '../config/menu-items';

type Props = {
  item: MenuItem;
  index: number;
  openSubMenu: Record<number, boolean>;
  setOpenSubMenu: Dispatch<React.SetStateAction<Record<number, boolean>>>;
};

const DashboardDrawerElement: React.FC<Props> = ({
  item: { text, icon, path, onlyForAdmin, subItems },
  index,
  openSubMenu,
  setOpenSubMenu,
}): React.ReactElement | null => {
  const { loggedUser } = useMainSlice();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();

  const hasSubitems = subItems && subItems.length > 0;

  const onCloseDrawer = (): void => {
    if (isMobile) {
      // close drawer only on mobile
      dispatch(setDashboardDrawerState(false));
    }
  };

  const allForAdmin = useMemo(
    () => subItems?.every(({ onlyForAdmin }) => !!onlyForAdmin) || onlyForAdmin,
    [subItems, onlyForAdmin]
  );

  const filteredSubItemsForAdmin = useMemo(
    () => subItems?.filter(({ onlyForAdmin }) => (onlyForAdmin ? loggedUser?.admin : true)) || [],
    [subItems]
  );

  const handleSubMenuClick = useCallback(
    (key: number) => {
      setOpenSubMenu(prev => ({
        ...prev,
        [key]: !prev[key],
      }));
    },
    [openSubMenu]
  );

  if (allForAdmin && !loggedUser?.admin) {
    // disable only for admin menu elements if user is not admin
    return null;
  }

  if (!hasSubitems) {
    return (
      <ListItemButton component={Link} to={path} onClick={onCloseDrawer}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    );
  }

  return (
    <>
      <ListItemButton onClick={() => handleSubMenuClick(index)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} sx={{ mr: 4 }} />
        {openSubMenu[index] ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItemButton>
      <Collapse in={openSubMenu[index]} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {filteredSubItemsForAdmin.map((subItem, subIndex) => (
            <ListItemButton
              key={subIndex}
              component={Link}
              onClick={onCloseDrawer}
              to={path + subItem.path}
              sx={{ pl: 4 }}>
              <ListItemText primary={subItem.text} />
            </ListItemButton>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export { DashboardDrawerElement };
