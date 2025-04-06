import { createTheme } from "@mui/material";
import AppRoutes from "./Routes";
import { ThemeProvider } from "@emotion/react";
import BackendApi from "./api/Backend";
import React from "react";

export const BackendApiContext = React.createContext(new BackendApi());

export default function App() {
  const backendApi = new BackendApi();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#dda25e",
        light: "#f0d6b6",
        dark: "#d17f2f",
        contrastText: "#000000"
      },
      secondary: {
        main: "#5e99dd",
        light: "#81b7e7",
        dark: "#4d7abd",
        contrastText: "#000000",
      },
      background: {
        default: "#fefae0",
        paper: "#fbf1b8"
      }
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <BackendApiContext.Provider value={backendApi}>
        <AppRoutes></AppRoutes>
      </BackendApiContext.Provider>
    </ThemeProvider>
  )
}
