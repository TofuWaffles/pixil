import React, { ReactElement } from "react"
import backendRequest from "../utils/BackendRequest";
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

export default function AlbumsPage() {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [albumThumbnails, setAlbumThumbnails] = React.useState<[Album, Thumbnail][]>([]);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await backendRequest(null, "GET", "/albums", true);
        if (!response.ok) {
          throw new Error(`Error albums: ${response.statusText}`);
        }

        const albums: Album[] = await response.json();

        albums.forEach(async (album) => {
          const response = await backendRequest(null, "GET", `/media?album=${album.id}`, true);
          if (!response.ok) {
            throw new Error(`Error fetching image IDs: ${response.statusText}`);
          }
          const albumMedia: Media[] = await response.json();

          let imageUrl = GrayBackground;
          let createdAt = new Date();

          if (albumMedia.length > 0) {
            const imageResponse = await backendRequest(null, "GET", `/thumbnail?id=${albumMedia[0].id}`, true);
            if (!imageResponse.ok) {
              throw new Error(`Error fetching image with ID ${albumMedia[0].id}: ${imageResponse.statusText} `);
            }
            const imageBlob = await imageResponse.blob();
            imageUrl = URL.createObjectURL(imageBlob);
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
      <div className="lg: size-9/12">
        <Grid2 container direction="row" spacing={1}>
          <List>
            {thumbnailComponents}
          </List>
        </Grid2 >
      </div>
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
          const response = await backendRequest(null, "POST", `/albums?name=${albumName}`, true);
          if (!response.ok) {
            console.log("Something went wrong with the post request :/");
          }
        }}
      >
        Create
      </Button>
    </Box>
  );
}
