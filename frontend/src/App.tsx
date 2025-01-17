import { createTheme } from "@mui/material";
import AppRoutes from "./Routes";
import { ThemeProvider } from "@emotion/react";

export default function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#dda25e",
        light: "#f0d6b6",
        dark: "#d17f2f",
        contrastText: "#000000"
      },
      secondary: {
        main: "#b2cf33",
        light: "#c6e558",
        dark: "#93a121",
        contrastText: "#000000",
      },
    }
  });
  return (
    <ThemeProvider theme={theme}>
      <AppRoutes></AppRoutes>
    </ThemeProvider>
  )
}
