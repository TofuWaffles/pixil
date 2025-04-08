import CircularProgress from "@mui/material/CircularProgress";
import Grid2 from "@mui/material/Grid2";

export default function LoadingIcon() {
  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minWidth: '100vw',
        minHeight: '100vh',
      }}
    >
      <CircularProgress />
    </Grid2>
  );
}
