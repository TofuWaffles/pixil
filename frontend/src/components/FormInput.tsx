import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import useTheme from "@mui/material/styles/useTheme";
import FormHelperText from "@mui/material/FormHelperText";
import React from "react";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";

interface FormInputProps {
  label: string,
  onBlur: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined,
  onFocus: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> | undefined,
  errorMessage: string,
  width: string | number,
  password: boolean,
}

export default function FormInput(props: FormInputProps) {
  const { label, onBlur, onFocus, errorMessage, width, password } = props;
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const theme = useTheme();

  return (
    <FormControl sx={{ m: 2, backgroundColor: theme.palette.primary.light, width: width }} variant="outlined">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        label={label}
        autoFocus={true}
        fullWidth={true}
        error={errorMessage !== ""}
        onBlur={onBlur}
        onFocus={onFocus}
        type={password && !showPassword ? "password" : "text"}
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
      />
      {(errorMessage !== "") && (
        <FormHelperText error id="email-error">
          {errorMessage}
        </FormHelperText>
      )}
    </FormControl>
  )
}
