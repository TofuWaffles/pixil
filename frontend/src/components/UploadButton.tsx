import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Upload';
import backendRequest from "../utils/BackendRequest";


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
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
      sx={{ backgroundColor: "secondary.main" }}
    >
      Upload
      <VisuallyHiddenInput
        type="file"
        onChange={async (event) => {
          if (event.target == null) {
            return;
          }
          const data = new FormData();
          data.append('file', event.target.files![0])
          data.append('name', 'User media')
          data.append('desc', 'A piece of media uploaded by the user')
          try {
            await backendRequest(data, "POST", "/media", true);
          } catch (statusCode: any) {
            console.log(statusCode);

          }
        }}
        multiple
      />
    </Button>
  )
}
