import Box from "@mui/material/Box/Box";
import UploadAndDisplayImage from "../components/upload-button";
import { DisplayImages } from "../components/download-test";

export function Home() {
  return (
    <Box>
      <DisplayImages></DisplayImages>
      <UploadAndDisplayImage></UploadAndDisplayImage>
    </Box>
  )
}
