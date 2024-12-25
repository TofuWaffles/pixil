import Box from "@mui/material/Box/Box";
import Navbar from "../components/navbar";
import TopBar from "../components/topbar";
import UploadAndDisplayImage from "../components/upload-button";

export function Home() {
  return (
    <Box>
      <TopBar></TopBar>
      <Navbar></Navbar>
      <UploadAndDisplayImage></UploadAndDisplayImage>
    </Box>
  )
}
