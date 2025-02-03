import { Box } from "@mui/material";

export default function ImageView({ mediaID }: { mediaID: number }) {
  return (
    <Box sx={{
      bgcolor: 'black'
    }}>
      {mediaID}
    </Box>
  )
}
