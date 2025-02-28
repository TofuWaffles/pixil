import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Alert, Box, Button, FormHelperText, Typography } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Grid2 from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import React, { SetStateAction } from "react";
import validateEmail from "../utils/ValidateEmail";
import LoginIcon from '@mui/icons-material/Login';

export default function Login() {
  const theme = useTheme();
  const [showPassword, setShowPassword] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [loginError, setLoginError] = React.useState("");
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
        {
          (loginError.length > 0) && <Alert severity="error" variant="filled" sx={{ m: 5 }}>{loginError}</Alert>
        }
        <FormControl sx={{ m: 2, width: "80%", backgroundColor: theme.palette.primary.light }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-email">Email Address</InputLabel>
          <OutlinedInput
            id="email"
            label="Email Address"
            autoFocus={true}
            fullWidth={true}
            error={emailError !== ""}
            // TODO: Fix semi-broken onBlur check
            onBlur={(event) => {
              setEmail(event.target.value)
              if (validateEmail(event.target.value)) {
                setEmailError("Invalid email entered. Email must be in the form of johndoe@mail.com");
              } else {
                setEmailError("");
              }
            }}
            onFocus={() => {
              setEmailError("");
            }}
          />
          {emailError !== "" && (
            <FormHelperText error id="email-error">
              {emailError}
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
            error={passwordError !== ""}
            onBlur={(event) => {
              setPassword(event.target.value)
              if (event.target.value === "") {
                setPasswordError("Password must not be empty");
              } else {
                setPasswordError("");
              }
            }}
            onFocus={() => {
              setPasswordError("");
            }}
          />
          {passwordError !== "" && (
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
          onClick={() => {
            if (emailError !== "" || passwordError !== "") {
              setLoginError("Please correct the email or password fields before logging in");
              return;
            }
            loginOnClick(email, password, setLoginError);
          }}
        >
          <Typography textTransform={'capitalize'}>Login</Typography>
        </Button>
      </Grid2>
    </Box>
  )
}

const loginOnClick = (email: string, password: string, setLoginError: React.Dispatch<SetStateAction<string>>) => {
  const fetchToken = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      });
      if (!response.ok) {
        throw response.status
      }

      const jsonResponse: { token: string } = await response.json()

      console.log(jsonResponse.token);
    } catch (errStatus: any) {
      switch (errStatus) {
        case 401:
        case 404:
          setLoginError("Invalid email address or password entered.");
          break;
        default:
          setLoginError("An unexpected error occured. Please let the administrator know if the issue persists.");
          break;
      }
    }
  }

  fetchToken();
}
