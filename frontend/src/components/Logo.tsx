import { useNavigate } from "react-router-dom";
import LogoImage from "../assets/logo-transparent.png";
import Box from "@mui/material/Box";


export default function Logo() {
  const navigate = useNavigate();

  return (
    <Box
      component="img"
      sx={{
        height: 20,
        width: 20,
      }}
      alt="Logo image to return to home page."
      src={LogoImage}
      onClick={() => {
        navigate("/");
      }}
    />
  )
}
