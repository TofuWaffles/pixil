import React, { ReactElement } from "react"
import backendRequest from "../utils/BackendRequest";
import { Album, Media, Thumbnail } from "../types/Models";
import ListItem from "@mui/material/ListItem";
import ThumbnailBox from "../components/ThumbnailBox";
import Grid2 from "@mui/material/Grid2";

export default function AlbumsPage() {
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  let albumThumbnails: ReactElement[] = [];

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await backendRequest(null, "GET", "/albums", true);
        if (!response.ok) {
          throw new Error(`Error albums: ${response.statusText}`);
        }

        const albums: Album[] = await response.json();

        albums.forEach(async (album) => {
          const response = await backendRequest(null, "GET", `/album_media?id=${album.id}`, true);
          if (!response.ok) {
            throw new Error(`Error fetching image IDs: ${response.statusText}`);
          }
          const albumMedia: Media = await response.json();

          const imageResponse = await backendRequest(null, "GET", `/thumbnail?id=${albumMedia.id}`, true);
          if (!imageResponse.ok) {
            throw new Error(`Error fetching image with ID ${albumMedia.id}: ${imageResponse.statusText} `);
          }
          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);

          const thumbnail: Thumbnail = {
            id: albumMedia.id,
            createdAt: new Date(albumMedia.createdAt * 1000),
            src: imageUrl,
          }
          albumThumbnails.push(
            <ListItem key={"album_thumbnail_" + album.id}>
              <ThumbnailBox thumbnail={thumbnail} title={album.name} path={`/album?id=${album.id}`} />
            </ListItem >
          );
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

  return (
    <div className="lg: size-9/12">
      < Grid2 container direction="row" spacing={1}>
        {albumThumbnails}
      </Grid2 >
    </div>
  )
}
