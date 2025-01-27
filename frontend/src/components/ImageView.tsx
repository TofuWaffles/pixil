import { Backdrop, Typography } from "@mui/material";

export default function ImageView({ open, mediaID }: { open: boolean, mediaID: number }) {
  return (
    <Backdrop open={open}>
      <Typography>
        {mediaID}
      </Typography>
    </Backdrop>
  )
}
