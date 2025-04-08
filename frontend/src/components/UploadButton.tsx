import { Box, Button, Snackbar, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Upload';
import { BackendApiContext } from "../App";
import React from "react";
import { GalleryRefreshContext } from "./Layout";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function UploadButton() {
  const backendApi = React.useContext(BackendApiContext);
  const [_, setGalleryRefresh] = React.useContext(GalleryRefreshContext);
  const [error, setError] = React.useState("");
  const allowedExt = new Set([
    "image/png",
    "image/jpg",
    "image/jpeg",
    "video/mp4",
    "video/mov"
  ]);

  return (
    <Box>
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<CloudUploadIcon />}
        sx={{
          m: 1,
          backgroundColor: "secondary.main",
        }}
      >
        Upload
        <VisuallyHiddenInput
          type="file"
          accept={[...allowedExt].join(',')}
          onChange={async (event) => {
            if (event.target.files == null) {
              return;
            }
            try {
              await backendApi.postMedia(event.target.files![0]);
              setGalleryRefresh((val) => !val);
            } catch (response: any) {
              setError("Something went wrong trying to upload the files.")
            }
          }}
          multiple
        />
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={error.length > 0}
        onClose={() => setError("")}
        autoHideDuration={5000}
        message={error}
      />
    </Box>
  )
}
