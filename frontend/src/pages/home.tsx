import Box from "@mui/material/Box/Box";
import Drawer from "../components/navbar";
import NavBar from "../components/topbar";
import UploadAndDisplayImage from "../components/upload-button";
import { DisplayImages } from "../components/download-test";

export function Home() {
  return (
    <Box>
      <NavBar></NavBar>
      <Drawer></Drawer>
      <DisplayImages></DisplayImages>
      <UploadAndDisplayImage></UploadAndDisplayImage>
    </Box>
  )
}
