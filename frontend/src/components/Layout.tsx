import { Box } from '@mui/material';
import MainDrawer from './Navbar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  const drawerWidth = 240;

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Drawer */}
      <MainDrawer />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          pt: '64px'
        }}
      >
        {/* Spacer for AppBar (optional) */}
        <Outlet />
      </Box>
    </Box>
  );
};
