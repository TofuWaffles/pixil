import Box from "@mui/material/Box/Box";
import UploadAndDisplayImage from "../components/upload-button";
import { Gallery } from "../components/Gallery";

export function Home() {
  return (
    <Box>
      <Gallery></Gallery>
      <UploadAndDisplayImage></UploadAndDisplayImage>
    </Box>
  )
}
