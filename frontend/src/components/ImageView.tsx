import { Backdrop, Typography } from "@mui/material";

export default function ImageView({ open, imgSrc }: { open: boolean, imgSrc: string }) {
  return (
    <Backdrop open={open}>
      <Typography>
        {imgSrc}
      </Typography>
    </Backdrop>
  )
}
