import { Button, styled } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/Upload';


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
        onChange={(event) => {
          if (event.target == null) {
            return;
          }
          const data = new FormData();
          data.append('file', event.target.files![0])
          data.append('name', 'User media')
          data.append('desc', 'A piece of media uploaded by the user')
          fetch(import.meta.env.VITE_BACKEND_URL + "/media", {
            method: 'POST',
            headers: {
              'Accept': 'application/json',
            },
            body: data
          }).then((response) => {
            console.log(event.target.files![0]);
            console.log(response)
          })
        }}
        multiple
      />
    </Button>
  )
}
