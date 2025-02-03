import { Backdrop, Box } from "@mui/material";

export default function ImageView({ mediaID }: { mediaID: number }) {
  return (
    <Backdrop open={true}>
      <Box sx={{
        bgcolor: 'black'
      }}>
        {mediaID}
      </Box>
    </Backdrop>
  )
}
