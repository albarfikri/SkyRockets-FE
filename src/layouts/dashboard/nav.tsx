import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import React, { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    isOpen?: boolean;
    info?: React.ReactNode;
    children?: { path: string; title: string, icon?: React.ReactNode }[];
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid var(--layout-nav-border-color, ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)})`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});

  const toggleSubmenu = (key: string) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const renderNavItem = (item: NavContentProps['data'][number], level = 0) => {
    const isActive = item.path === pathname;
    const hasChildren = (item.children ?? []).length > 0;
    const isOpen = openSubmenus[item.path] || false;

    return (
      <Box key={item.path}>
        <ListItem disableGutters disablePadding sx={{ mb: 1 }}>
          <ListItemButton
            component={RouterLink}
            href={item.path}
            sx={{
              pl: 2 + level * 2,
              py: 1,
              gap: 2,
              pr: 1.5,
              borderRadius: 0.75,
              typography: 'body2',
              fontWeight: isActive ? 'fontWeightSemiBold' : 'fontWeightMedium',
              bgcolor: isActive ? 'var(--layout-nav-item-active-bg)' : 'transparent',
              color: isActive
                ? 'var(--layout-nav-item-active-color)'
                : 'var(--layout-nav-item-color)',
              '&:hover': {
                bgcolor: 'var(--layout-nav-item-hover-bg)',
              },
            }}
            onClick={hasChildren ? () => toggleSubmenu(item.path) : undefined}
          >
            <Box component="span" sx={{ width: 24, height: 24 }}>
              {item.icon}
            </Box>
            <Box component="span" flexGrow={1}>
              {item.title}
            </Box>
            {item.info}
            {hasChildren && (isOpen ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
        </ListItem>

        {hasChildren && isOpen && (
          <Box sx={{ pl: 3 }}>
            {item.children?.map((child: any) => renderNavItem(child, level + 1))}
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      {slots?.topArea}
      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Logo />

          {slots?.topArea}
          <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => renderNavItem(item))}
          </Box>
        </Box>
      </Scrollbar>
      {slots?.bottomArea}
      <NavUpgrade />
    </>
  );
}
