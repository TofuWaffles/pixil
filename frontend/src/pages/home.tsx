import Box from "@mui/material/Box/Box";
import Navbar from "../components/navbar";
import TopBar from "../components/topbar";
import UploadAndDisplayImage from "../components/upload-button";
import { DownloadImageTest } from "../components/download-test";

export function Home() {
  return (
    <Box>
      <TopBar></TopBar>
      <Navbar></Navbar>
      <DownloadImageTest></DownloadImageTest>
      <UploadAndDisplayImage></UploadAndDisplayImage>
    </Box>
  )
}
