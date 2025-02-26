import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import React from "react";
import validateEmail from "../utils/ValidateEmail";
import validatePassword from "../utils/ValidatePassword";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Grid2 from "@mui/material/Grid2";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import PersonAdd from "@mui/icons-material/PersonAdd";


export default function CreateUserForm() {
  const theme = useTheme();
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [repeatPassword, setRepeatPassword] = React.useState("");
  const [repeatPasswordError, setRepeatPasswordError] = React.useState("");
  const [userType, setUserType] = React.useState(0);
  const [createUserError, setCreateUserError] = React.useState("");

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
        {
          (createUserError.length > 0) && <Alert severity="error" variant="filled" sx={{ m: 5 }}>{createUserError}</Alert>
        }
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
              checkEmail(email, setEmailError);
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
            onBlur={(event) => {
              setPassword(event.target.value);
              checkPassword(password, setPasswordError);
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
            onBlur={(event) => {
              setRepeatPassword(event.target.value);
              checkRepeatPassword(password, repeatPassword, setRepeatPasswordError);
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
          onClick={() => {
            checkEmail(email, setEmailError);
            checkPassword(password, setPasswordError);
            checkRepeatPassword(password, repeatPassword, setRepeatPasswordError);
            if (emailError !== "" || passwordError !== "" || repeatPasswordError !== "") {
              setCreateUserError("Some fields are invalid. Please correct them before submitting");
              return;
            }
            // TODO: Add create user http request here
            createUserOnClick({
              email: email,
              username: username,
              password: password,
              userType: userType,
            },
              setCreateUserError,
            )
          }}
        >
          <Typography textTransform={'capitalize'}>Create User</Typography>
        </Button>
      </Grid2>
    </Box >
  )
}

function checkEmail(email: string, setEmailError: React.Dispatch<React.SetStateAction<string>>) {
  if (email.length == 0) {
    setEmailError("A valid email address must be provided")
    return
  }
  if (!validateEmail(email)) {
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

interface NewUser {
  email: string,
  username: string,
  password: string,
  userType: number,
}

function createUserOnClick(user: NewUser, setCreateUserError: React.Dispatch<React.SetStateAction<string>>) {
  const createUser = async () => {
    try {
      const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/user", {
        method: "POST",
        body: JSON.stringify(user),
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
        case 409:
          setCreateUserError("User with the provided email already exists")
          break;
        default:
          setCreateUserError("An unexpected error occured. Please check the backend logs for more information");
          break;
      }
    }
  }

  createUser();
}
