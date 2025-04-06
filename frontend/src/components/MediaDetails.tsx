import MoreVert from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import React, { ReactElement, useContext } from "react";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DateFormat from "../types/DateFormat";
import { Media } from "../types/Models";
import Tooltip from "@mui/material/Tooltip";
import { BackendApiContext } from "../App";

export default function MediaDetails({ mediaID }: { mediaID: number }) {
  const backendApi = useContext(BackendApiContext);
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = React.useState<Media>({
    id: -1,
    fileName: "None",
    ownerEmail: "None",
    fileType: "None",
    status: -1,
    createdAt: 0,
    tags: [],
  });

  React.useEffect(() => {
    const fetchImage = async () => {
      try {
        const details: Media = await backendApi.getMediaDetails(mediaID);
        setDetails(details);
      } catch (err: any) {
        console.log(err);
      }
    }
    fetchImage()
  }, []);

  let tagChips: ReactElement[] = [];
  details.tags.forEach((tag, i) => {
    tagChips.push(<Chip
      key={tag + i}
      sx={{
        padding: 1,
        margin: 0.5,
        marginTop: 0,
        marginBottom: 0,
      }}
      label={tag}
    />)
  })

  return (
    <Box>
      <Tooltip title="Details">
        <IconButton
          sx={{
            color: "white",
            width: 100,
            height: 100,
            right: 0,
          }}
          aria-label="more details"
          onClick={() => setOpen(true)}
        >
          <MoreVert />
        </IconButton>
      </Tooltip>
      <Dialog
        sx={{
          minHeight: "75vh",
          minWidth: "75vh",
        }}
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="media-details-dialog"
      >
        <DialogTitle
          sx={{
            margin: 1,
          }}
          id="media-details-title"
        >
          {"More Details"}
        </DialogTitle>
        <DialogContent>
          <DetailHeader text="File Name" />
          <DetailContent content={details.fileName} />
          <DetailHeader text="Created At" />
          <DetailContent content={details.createdAt.toLocaleString('en-US', DateFormat)} />
          <DetailHeader text="Tags" />
          <List>
            {tagChips}
          </List>
        </DialogContent>
      </Dialog>
    </Box >
  )
}

function DetailHeader({ text }: { text: string }) {
  return (
    <Typography
      sx={{
        margin: 1,
        marginBottom: 0.5,
      }}
      variant="h6"
    >{text}
    </Typography>
  );
}

function DetailContent({ content }: { content: string }) {
  return (
    <Typography
      sx={{
        margin: 1,
      }}
      variant="body1"
    >
      {content}
    </Typography>
  )
}
