import Box from '@mui/material/Box';
import MainDrawer from './Navbar';
import { Outlet } from 'react-router-dom';
import React from 'react';

export const GalleryRefreshContext = React.createContext<[boolean, React.Dispatch<React.SetStateAction<boolean>>]>([
  false,
  () => { },
]);

export default function MainLayout() {
  const drawerWidth = 240;
  const [galleryRefresh, setGalleryRefresh] = React.useState(false);

  return (
    <GalleryRefreshContext.Provider value={[galleryRefresh, setGalleryRefresh]}>
      <div className='h-screen bg-background-main'>
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
      </div>
    </GalleryRefreshContext.Provider>
  );
};
