import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from "@mui/material/Tooltip";
import { useContext } from "react";
import { BackendApiContext } from "../App";

export default function MediaDeleteButton({ mediaId }: { mediaId: number }) {
  const backendApi = useContext(BackendApiContext);

  return (
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
  )
}
