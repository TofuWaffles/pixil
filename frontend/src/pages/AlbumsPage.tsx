import React, { ReactElement, useContext } from "react"
import { Album, Media, Thumbnail } from "../types/Models";
import ListItem from "@mui/material/ListItem";
import ThumbnailBox from "../components/ThumbnailBox";
import Grid2 from "@mui/material/Grid2";
import Toolbar from "@mui/material/Toolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import { Button, List } from "@mui/material";
import GrayBackground from "../assets/gray-background.png"
import { BackendApiContext } from "../App";

export default function AlbumsPage() {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [albumThumbnails, setAlbumThumbnails] = React.useState<[Album, Thumbnail][]>([]);
  const backendApi = useContext(BackendApiContext);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const albums: Album[] = await backendApi.getAlbums();

        albums.forEach(async (album) => {
          const albumMedia: Media[] = await backendApi.getAlbumMedia(album.id);

          let imageUrl = GrayBackground;
          let createdAt = new Date();

          if (albumMedia.length > 0) {
            imageUrl = await backendApi.getThumbnail(albumMedia[0].id);
            createdAt = new Date(albumMedia[0].createdAt * 1000);
          }

          const thumbnail: Thumbnail = {
            id: album.id,
            createdAt: createdAt,
            src: imageUrl,
          }

          setAlbumThumbnails(oldList => [...oldList, [album, thumbnail]]);
        })
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("Albums: ", albumThumbnails);

  let thumbnailComponents: ReactElement[] = [];

  albumThumbnails.forEach(([album, thumbnail]) => {
    thumbnailComponents.push(
      <ListItem key={"album_thumbnail_" + album.id}>
        <ThumbnailBox thumbnail={thumbnail} title={album.name} path={`/album?id=${album.id}`} />
      </ListItem >
    )
  })

  return (
    <Box>
      <AlbumPageHeader />
      {albumThumbnails.length == 0 ?
        <Grid2
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          sx={{ minHeight: '100vh' }}
        >
          <Typography variant="h5">
            No albums yet. Create one to start organizing your photos and videos.
          </Typography>
        </Grid2> :
        <div className="lg: size-9/12">
          <Grid2 container direction="row" spacing={1}>
            <List>
              {thumbnailComponents}
            </List>
          </Grid2 >
        </div>
      }
    </Box>
  )
}

function AlbumPageHeader() {
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
            Albums
          </Typography>
          <CreateAlbumButton />
        </Toolbar>
      </AppBar>
    </Box>
  )
}

function CreateAlbumButton() {
  const backendApi = useContext(BackendApiContext);
  const [albumName, setAlbumName] = React.useState("");
  const [error, setError] = React.useState(false);

  return (
    <Box
      sx={{
        right: 0,
      }}
    >
      <TextField
        sx={{
          m: 1,
          color: "secondary.main",
        }}
        slotProps={{
          inputLabel: {
            color: "secondary"
          }
        }}
        error={error}
        id="album-name"
        label="Album Name"
        variant="filled"
        onChange={(event) => {
          setAlbumName(event.target.value);
        }}
      />
      <Button
        sx={{
          m: 2,
          backgroundColor: "secondary.main",
        }}
        variant="contained"
        onClick={async () => {
          if (albumName === "") {
            setError(true);
            return;
          }
          await backendApi.postAlbum(albumName);
        }}
      >
        Create
      </Button>
    </Box>
  );
}
