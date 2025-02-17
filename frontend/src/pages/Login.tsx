import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Box, Button, FormHelperText, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import validateEmail from "../utils/ValidateEmail";
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [emailValid, setEmailValid] = React.useState(true);
  const [passwordValid, setPasswordValid] = React.useState(true);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100%"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundColor: theme.palette.background.paper
      }}>
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="60%"
        sx={{
          minHeight: '100vh',
        }}
      >
        <FormControl sx={{ m: 2, width: "80%", backgroundColor: theme.palette.primary.light }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
          <OutlinedInput
            id="email"
            label="Email Address"
            autoFocus={true}
            fullWidth={true}
            error={!emailValid}
            onBlur={(event) => {
              setEmail(event.target.value)
              if (validateEmail(email)) {
                setEmailValid(true)
              } else {
                setEmailValid(false)
              }
            }}
          />
          {!emailValid && (
            <FormHelperText error id="email-error">
              Email address is invalid
            </FormHelperText>
          )}
        </FormControl>
        <FormControl sx={{ m: 2, width: "80%", backgroundColor: theme.palette.primary.light }} variant="outlined">
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
            fullWidth={true}
            error={!passwordValid}
            onBlur={(event) => {
              setPassword(event.target.value)
              if (password.length == 0) {
                setPasswordValid(false)
              } else {
                setPasswordValid(true)
              }
            }}
          />
          {!passwordValid && (
            <FormHelperText error id="password-error">
              Password must not be empty
            </FormHelperText>
          )}
        </FormControl>
        <Button sx={{
          m: 5,
          padding: 2,
          backgroundColor: theme.palette.secondary.main,
          '&:hover': {
            backgroundColor: theme.palette.secondary.dark,
          },
          color: theme.palette.secondary.contrastText
        }}
          endIcon={<LoginIcon />}
        >
          <Typography textTransform={'capitalize'}>Login</Typography>
        </Button>
      </Grid2>
    </Box>
  )
}
