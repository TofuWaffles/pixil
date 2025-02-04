import { Dialog, Box } from "@mui/material";
import { ReactNode, SetStateAction } from "react";

export default function ImageView({ mediaID, setImgView }: { mediaID: number, setImgView: React.Dispatch<SetStateAction<ReactNode | null>> }) {
  return (
    <Dialog open={true} onClick={() => setImgView(null)}>
      <Box sx={{
        bgcolor: 'black'
      }}>
        {mediaID}
      </Box>
    </Dialog>
  )
}
