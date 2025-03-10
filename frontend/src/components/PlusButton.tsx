import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import UploadIcon from '@mui/icons-material/Upload';

export default function PlusButton() {
  return (
    <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="Plus button"
        sx={{ float: 'right', position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <UploadSpeedDial />
      </SpeedDial>
    </Box>
  );
}

function UploadSpeedDial() {
  return (
    <SpeedDialAction
      key="upload"
      icon={<UploadIcon />}
      tooltipTitle="Upload"
    />
  )
}
