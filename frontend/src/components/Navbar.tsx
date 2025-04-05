import * as React from 'react';
import { styled, useTheme, Theme, CSSObject, responsiveFontSizes } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import UploadButton from './UploadButton';
import Logo from './Logo';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PhotoAlbum from '@mui/icons-material/PhotoAlbum';
import parseJwt from '../utils/ParseJWT';
import getCookie from '../utils/GetCookie';
import { AccessTokenClaims } from '../types/Models';
import { AdminPanelSettings, Logout } from '@mui/icons-material';
import removeCookie from '../utils/RemoveCookie';
import Tooltip from '@mui/material/Tooltip';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.paper,
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.secondary.main,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.primary.dark,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...openedMixin(theme),
          '& .MuiDrawer-paper': openedMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

function DrawerItem({
  name,
  icon,
  open,
  onClick
}: {
  name: string,
  icon: React.ReactElement,
  open: boolean,
  onClick: React.MouseEventHandler<HTMLDivElement> | undefined
}) {
  return (
    <ListItem key={name} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
        sx={[
          {
            minHeight: 48,
            px: 2.5,
          },
          open
            ? {
              justifyContent: 'initial',
            }
            : {
              justifyContent: 'center',
            },
        ]}
        onClick={onClick}
      >
        <ListItemIcon
          sx={[
            {
              minWidth: 0,
              justifyContent: 'center',
            },
            open
              ? {
                mr: 3,
              }
              : {
                mr: 'auto',
              },
          ]}
        >
          {icon}
        </ListItemIcon>
        <ListItemText
          primary={name}
          sx={[
            open
              ? {
                opacity: 1,
              }
              : {
                opacity: 0,
              },
          ]}
        />
      </ListItemButton>
    </ListItem>
  )
}

export default function MainDrawer() {
  let theme = useTheme();
  theme = responsiveFontSizes(theme);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const accessTokenClaims: AccessTokenClaims = parseJwt(getCookie("Access-Token")!);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Logo />
          <Typography variant="h5" noWrap component="div">
            {`Hello, ${accessTokenClaims.username}`}
          </Typography>
          <div className='absolute right-5'>
            <UploadButton />
            {accessTokenClaims.userType == 1 &&
              <Tooltip title="Admin Settings">
                <IconButton
                  sx={{
                    m: 1
                  }}
                  onClick={() => window.location.href = "/admin"}
                >
                  <AdminPanelSettings />
                </IconButton>
              </Tooltip>
            }
            <Tooltip title="Logout">
              <IconButton
                sx={{
                  m: 1
                }}
                onClick={() => {
                  removeCookie("Access-Token");
                  window.location.href = "/login";
                }}
              >
                <Logout />
              </IconButton>
            </Tooltip>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <DrawerItem
            name={'Home'}
            icon={<HomeIcon />}
            open={open}
            onClick={() => { navigate("/") }}
          />
          <DrawerItem
            name={'Search'}
            icon={<SearchIcon />}
            open={open}
            onClick={() => { navigate("/search") }}
          />
          <DrawerItem
            name={'Albums'}
            icon={<PhotoAlbum />}
            open={open}
            onClick={() => { navigate("/albums") }}
          />
        </List>
      </Drawer>
    </Box>
  );
}
