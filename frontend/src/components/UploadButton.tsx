import { Alert, Box, Button, Snackbar, styled } from "@mui/material";
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
  const [uploadSuccess, setUploadSuccess] = React.useState(false);
  const [uploading, setUploading] = React.useState(false)
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
              setUploading(true);
              await backendApi.postMedia(event.target.files![0]);
              setUploadSuccess(true);
              setGalleryRefresh((val) => !val);
            } catch (response: any) {
              setError("Something went wrong trying to upload the files.")
            } finally {
              setUploading(false);
            }
          }}
          multiple
        />
      </Button>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={uploading}
        onClose={() => setUploading(false)}
        message="Uploading..."
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={uploadSuccess}
        onClose={() => setUploadSuccess(false)}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setUploadSuccess(false)}
          severity="success"
          variant="filled"
        >
          Uploaded successfully!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={error.length > 0}
        onClose={() => setError("")}
        autoHideDuration={5000}
      >
        <Alert
          onClose={() => setError("")}
          severity="error"
          variant="filled"
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  )
}
