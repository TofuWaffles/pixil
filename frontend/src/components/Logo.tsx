import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/logo-transparent.png";
import Box from "@mui/material/Box";


export default function Logo() {
  const navigate = useNavigate();

  return (
    <Box
      color="inherit"
      aria-label="logo"
      component="img"
      sx={{
        mr: 2,
        height: 30,
        width: 30,
        "&:hover": {
          cursor: "pointer",
        },
      }}
      alt="Logo image to return to home page."
      src={LogoImage}
      onClick={() => {
        navigate("/");
      }}
    />
  )
}
