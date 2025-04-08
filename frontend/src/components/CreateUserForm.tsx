import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import React, { useContext } from "react";
import validateEmail from "../utils/ValidateEmail";
import validatePassword from "../utils/ValidatePassword";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PersonAdd from "@mui/icons-material/PersonAdd";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import { BackendApiContext } from "../App";
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";

export default function CreateUserForm({ setUsersRefresh }: { setUsersRefresh: React.Dispatch<React.SetStateAction<boolean>> }) {
  const theme = useTheme();
  const backendApi = useContext(BackendApiContext);
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [repeatPasswordError, setRepeatPasswordError] = React.useState("");
  const [userType, setUserType] = React.useState(0);
  const [createUserError, setCreateUserError] = React.useState("");
  const [createUserSuccess, setCreateUserSuccess] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = React.useState(false);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundColor: theme.palette.background.paper
      }}>
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="50%"
        sx={{
          '& .MuiFormControl-root': {
            width: "100%"
          },
          '& .MuiOutlinedInput-root': {
            marginTop: 2,
            marginLeft: 2,
            marginRight: 2,
            width: "100%",
            height: "100%",
            backgroundColor: theme.palette.primary.light,
          },
          '& .MuiInputLabel-root': {
            marginTop: 2,
            marginLeft: 2,
            marginRight: 2,
          }
        }}
      >
        <SuccessBox message={createUserSuccess} />
        <ErrorBox message={createUserError} />
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-email">Email Address*</InputLabel>
          <OutlinedInput
            id="email"
            label="Email Address"
            autoFocus={true}
            fullWidth={true}
            error={emailError !== ""}
            onBlur={(event) => {
              setEmail(event.target.value)
              checkEmail(event.target.value, setEmailError);
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
        <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
          <OutlinedInput
            id="username"
            label="Username"
            autoFocus={false}
            onBlur={(event) => {
              setUsername(event.target.value)
            }}
          />
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-password">Password*</InputLabel>
          <OutlinedInput
            id="password"
            label="Password"
            autoFocus={false}
            error={passwordError !== ""}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={() => { setShowPassword((show) => !show) }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseUp={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onBlur={(event) => {
              setPassword(event.target.value);
              checkPassword(event.target.value, setPasswordError);
            }}
            onFocus={() => {
              setEmailError("");
            }}
          />
          {passwordError !== "" && (
            <FormHelperText error id="email-error">
              {passwordError}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="outlined-adornment-repeat-password">Retype Password*</InputLabel>
          <OutlinedInput
            id="repeat-password"
            label="Retype Password"
            autoFocus={false}
            error={repeatPasswordError !== ""}
            type={showRepeatPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showRepeatPassword ? 'hide the password' : 'display the password'
                  }
                  onClick={() => { setShowRepeatPassword((show) => !show) }}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseUp={(event) => event.preventDefault()}
                  edge="end"
                >
                  {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onBlur={(event) => {
              setRepeatPassword(event.target.value);
              checkRepeatPassword(password, event.target.value, setRepeatPasswordError);
            }}
            onFocus={() => {
              setRepeatPasswordError("");
            }}
          />
          {passwordError !== "" && (
            <FormHelperText error id="repeat-password-error">
              {repeatPasswordError}
            </FormHelperText>
          )}
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="outlined-adornment-user-type">User Type*</InputLabel>
          <Select
            variant="outlined"
            id="user-type"
            autoWidth
            defaultValue={0}
            value={userType}
            label="User Type"
            onChange={(event) => {
              setUserType(+event.target.value);
            }}
          >
            <MenuItem value={0}>Member</MenuItem>
            <MenuItem value={1}>Admin</MenuItem>
          </Select>
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
          endIcon={<PersonAdd />}
          onClick={async () => {
            checkEmail(email, setEmailError);
            checkPassword(password, setPasswordError);
            checkRepeatPassword(password, repeatPassword, setRepeatPasswordError);
            if (emailError !== "" || passwordError !== "" || repeatPasswordError !== "") {
              setCreateUserError("Some fields are invalid. Please correct them before submitting");
              return;
            }
            try {
              await backendApi.postUser(email, username, password, userType);
              setCreateUserSuccess("The new user has been created!");
              setCreateUserError("");
              setUsersRefresh((val) => !val)
            } catch (response: any) {
              switch (response.status) {
                case 409:
                  setCreateUserError("User with the provided email address already exists");
                  break;
                default:
                  setCreateUserError("An internal server error occured. You may want to check the backend logs to see what went wrong")
              }
            }
          }
          }
        >
          <Typography textTransform={'capitalize'}>Create User</Typography>
        </Button>
      </Grid2>
    </Box >
  )
}

function checkEmail(email: string, setEmailError: React.Dispatch<React.SetStateAction<string>>) {
  if (!validateEmail(email)) {
    console.log("Invalid email: ", email);

    setEmailError("Invalid email address entered.");
  } else {
    setEmailError("");
  }
}

function checkPassword(password: string, setPasswordError: React.Dispatch<React.SetStateAction<string>>) {
  if (!validatePassword(password)) {
    setPasswordError(
      `Password must have at least 4 characters, at least one UPPERCASE, one lowercase character, one digit, and one special character`);
  } else {
    setPasswordError("");
  }
}

function checkRepeatPassword(password: string, repeatPassword: string, setRepeatPasswordError: React.Dispatch<React.SetStateAction<string>>) {
  if (password !== repeatPassword) {
    setRepeatPasswordError("Passwords do not match");
  } else {
    setRepeatPasswordError("");
  }
}
