import Box from "@mui/material/Box/Box";
import Gallery from "../components/Gallery";

export function Home() {
  return (
    <Box>
      <Gallery setSearchTerm={null}></Gallery>
    </Box>
  )
}
