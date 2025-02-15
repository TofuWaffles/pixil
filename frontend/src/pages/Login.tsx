import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";

export default function Login() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

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
      <FormControl sx={{ m: 1, width: "60%", backgroundColor: theme.palette.primary.light }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
        <OutlinedInput
          id="email"
          label="Email Address"
          autoFocus={true}
        />
      </FormControl>
      <FormControl sx={{ m: 1, width: "60%", backgroundColor: theme.palette.primary.light }} variant="outlined">
        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? 'text' : 'password'}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? 'hide the password' : 'display the password'
                }
                onClick={handleClickShowPassword}
                onMouseDown={(event) => event.preventDefault()}
                onMouseUp={(event) => event.preventDefault()}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label="Password"
        />
      </FormControl>
    </Grid2>
  )
}
