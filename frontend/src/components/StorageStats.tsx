import { Box, Card, CardContent, Grid2, LinearProgress, linearProgressClasses, styled, Typography } from "@mui/material";
import React, { useContext } from "react";
import { StorageStats } from "../types/Models";
import { BackendApiContext } from "../App";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[200],
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#1a90ff',
    ...theme.applyStyles('dark', {
      backgroundColor: '#308fe8',
    }),
  },
}));

export default function StorageInfo() {
  const backendApi = useContext(BackendApiContext);
  const [storageStats, setStorageStats] = React.useState<StorageStats>({
    capacity: 1,
    used: 1,
  });

  React.useEffect(() => {
    const fetchStorageStats = async () => {
      const storage = await backendApi.getStorage();
      setStorageStats(storage);
    }

    fetchStorageStats();
  }, [])

  return (
    <Box>
      <Card sx={{
        width: "90vw",
      }}>
        <CardContent>
          <Typography gutterBottom variant="h4">Storage</Typography>
          <Typography
            variant="subtitle1"
            sx={{
              marginTop: 2
            }}
          >
            {`Capacity: ${Math.round(storageStats.capacity / (10 ** 9))} GB`}
          </Typography>
          <BorderLinearProgress variant="determinate" value={storageStats.used / storageStats.capacity * 100} />
          <Grid2 container columns={2} direction="row">
            <Typography
              width="50%"
              variant="subtitle1"
            >
              {`Used: ${Math.round(storageStats.used / (10 ** 9))} GB (${Math.round(storageStats.used / storageStats.capacity * 100)}%)`}
            </Typography>
            <Typography
              width="50%"
              align="right"
              variant="subtitle1"
            >
              {`Free: ${Math.round((storageStats.capacity - storageStats.used) / (10 ** 9))} GB (${Math.round((storageStats.capacity - storageStats.used) / storageStats.capacity * 100)}%)`}
            </Typography>
          </Grid2>
        </CardContent>
      </Card>
    </Box>
  )
}
