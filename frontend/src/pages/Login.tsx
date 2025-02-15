import Grid2 from "@mui/material/Grid2";
import useTheme from "@mui/material/styles/useTheme";
import TextField from "@mui/material/TextField";

export default function Login() {
  const theme = useTheme();

  return (
    <Grid2
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: '100vh',
        backgroundColor: theme.palette.background.paper
      }}
    >
      <TextField id="email" label="Email Address" variant="filled" sx={{
        width: "60%",
        backgroundColor: theme.palette.primary.light,
        margin: "10px"
      }} />
      <TextField id="password" label="Password" variant="filled" sx={{
        width: "60%",
        backgroundColor: theme.palette.primary.light,
        margin: "10px"
      }} />
    </Grid2>
  )
}
