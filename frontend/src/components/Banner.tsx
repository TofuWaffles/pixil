import BannerImage from "../assets/banner-transparent.png";
import Box from "@mui/material/Box";

export default function Banner() {
  return (
    <Box
      sx={{
        width: "25vw",
        m: 5,
      }}
      color="inherit"
      aria-label="banner"
      component="img"
      alt="Pixil banner image"
      src={BannerImage}
    />
  )
}
