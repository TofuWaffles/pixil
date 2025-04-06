import IconButton from "@mui/material/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import backendRequest from "../utils/BackendRequest";
import Tooltip from "@mui/material/Tooltip";

export default function MediaDeleteButton({ mediaId }: { mediaId: number }) {
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
          const response = await backendRequest(null, "DELETE", `/media?id=${mediaId}`, true);

          if (response.ok) {
            window.location.href = "/";
          } else {
            console.log("Unable to archive media: ", response.text);

          }
        }}>
        <DeleteIcon sx={{ width: 40, height: 40 }} />
      </IconButton >
    </Tooltip>
  )
}
