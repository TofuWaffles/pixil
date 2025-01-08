import { Box } from "@mui/material";

export default function Thumbnail(src: string) {
  <Box component="img" sx={{
    height: 233,
    width: 350,
    maxHeight: { xs: 233, md: 167 },
    maxWidth: { xs: 350, md: 249 },
  }}
    alt="User Image."
    src={src}
  />
}
