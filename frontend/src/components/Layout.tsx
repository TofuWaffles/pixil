import React from 'react';
import { Box, Toolbar } from '@mui/material';
import MainDrawer from './navbar';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
        }}
      >
        {/* Spacer for AppBar (optional) */}
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

