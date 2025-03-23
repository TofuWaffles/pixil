import MoreVert from "@mui/icons-material/MoreVert";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import React, { ReactElement } from "react";
import backendRequest from "../utils/BackendRequest";
import Chip from "@mui/material/Chip";
import DialogContent from "@mui/material/DialogContent";
import Typography from "@mui/material/Typography";
import DateFormat from "../types/DateFormat";

interface Details {
  id: number,
  fileName: string,
  ownerEmail: string,
  fileType: string,
  status: number,
  createdAt: number,
  tags: string[],
}

export default function MediaDetails({ mediaID }: { mediaID: number }) {
  const [open, setOpen] = React.useState(false);
  const [details, setDetails] = React.useState<Details>({
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
        const detailsResponse = await backendRequest(null, "GET", `/media?id=${mediaID}`, true);
        if (!detailsResponse.ok) {
          throw new Error(`Error fetching details for media with ID ${mediaID}: ${detailsResponse.statusText}`);
        }
        const details: Details = await detailsResponse.json();
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
