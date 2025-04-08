import BannerImage from "../assets/banner.png";
import Box from "@mui/material/Box";

export default function Banner() {
  return (
    <Box
      color="inherit"
      aria-label="banner"
      component="img"
      alt="Pixil banner image"
      src={BannerImage}
    />
  )
}
