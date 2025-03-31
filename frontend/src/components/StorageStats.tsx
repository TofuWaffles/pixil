import { Box, Card, CardContent, LinearProgress, linearProgressClasses, styled, Typography } from "@mui/material";
import React from "react";
import { StorageStats } from "../types/Models";
import backendRequest from "../utils/BackendRequest";

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
  const [storageStats, setStorageStats] = React.useState<StorageStats>({
    capacity: 1,
    used: 1,
  });

  React.useEffect(() => {
    const fetchStorageStats = async () => {
      const response = await backendRequest(null, "GET", "/storage", true);
      setStorageStats(await response.json());
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
          <BorderLinearProgress variant="determinate" value={storageStats.used / storageStats.capacity * 100} />
          <Typography
            variant="subtitle1"
            sx={{
              marginTop: 2
            }}
          >
            {`Capacity: ${Math.round(storageStats.capacity / (10 ** 9))} GB`}
          </Typography>
          <Typography
            variant="subtitle1"
          >
            {`Used: ${Math.round(storageStats.used / (10 ** 9))} GB`}
          </Typography>
          <Typography
            variant="subtitle1"
          >
            {`Free: ${Math.round((storageStats.capacity - storageStats.used) / (10 ** 9))} GB`}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  )
}
