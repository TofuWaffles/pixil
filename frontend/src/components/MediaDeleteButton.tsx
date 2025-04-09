import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import { useContext, useState } from "react";
import { BackendApiContext } from "../App";
import ConfirmDialog from "./ConfirmDialog";
import Box from "@mui/material/Box";

export default function MediaDeleteButton({ mediaId }: { mediaId: number }) {
  const backendApi = useContext(BackendApiContext);
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <Tooltip title="Delete">
        <IconButton
          aria-label="delete media"
          sx={{
            color: "white",
            width: 100,
            height: 100
          }}
          onClick={async () => {
            await backendApi.deleteMedia(mediaId);
            window.location.href = "/";
          }}>
          <DeleteIcon sx={{ width: 40, height: 40 }} />
        </IconButton >
      </Tooltip>
      <ConfirmDialog
        title="Confirm Delete"
        message="Are you sure you want to this photo or video?"
        open={open}
        setOpen={setOpen}
        confirmOnClick={async () => {
          await backendApi.deleteMedia(mediaId);
          window.location.href = "/";
        }}
      />
    </Box>
  )
}
