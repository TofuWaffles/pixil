import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Upload';
import { useContext } from "react";
import { BackendApiContext } from "../App";


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
  const backendApi = useContext(BackendApiContext);
  return (
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
        onChange={async (event) => {
          if (event.target == null) {
            return;
          }
          try {
            await backendApi.postMedia(event.target.files![0]);
            window.location.reload();
          } catch (statusCode: any) {
            console.log(statusCode);
          }
        }}
        multiple
      />
    </Button>
  )
}
