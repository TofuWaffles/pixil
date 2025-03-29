import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "react-router-dom";
import Gallery from "../components/Gallery";

export default function AlbumView() {
  const [idParam, _] = useSearchParams();
  const albumId: number = +idParam.get("id")!;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{
        width: "100%",
        position: "static",
        marginLeft: 0,
        flex: 1,
        paddingRight: 0,
      }}>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
          >
            Album
          </Typography>
        </Toolbar>
      </AppBar>
      <Gallery queryParams={`album=${albumId}`} />
    </Box>
  )
}
