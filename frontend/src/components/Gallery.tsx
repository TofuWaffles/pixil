import React, { ReactElement, useContext } from "react";
import { Thumbnail } from "../types/Models";
import ThumbnailGroup from "./ThumbnailGroup";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import DateFormat from "../types/DateFormat";
import UploadButton from "./UploadButton";
import Grid2 from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { BackendApiContext } from "../App";


export default function Gallery({ queryParams }: { queryParams: string | null }) {
  const [thumbnails, setThumbnails] = React.useState<{ id: number; createdAt: Date; src: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const backendApi = useContext(BackendApiContext);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const mediaList = await backendApi.getMediaList(queryParams);
        const media = mediaList.map((item) => { return { id: item.id, createdAt: new Date(item.createdAt) } });

        const thumbnailPromises = media.map(async (m) => {
          const thumbnailUrl = await backendApi.getThumbnail(m.id);
          return { id: m.id, createdAt: m.createdAt, src: thumbnailUrl };
        });

        // Wait for all image fetches to complete
        const thumbnails = await Promise.all(thumbnailPromises);
        setThumbnails(thumbnails);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchImages();
  }, [queryParams]);

  // TODO: Make a prettier loading and error screen
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  let thumbnailGroups: Map<number, Thumbnail[]> = new Map();

  thumbnails.forEach((image) => {
    let date = image.createdAt
    date.setHours(0, 0, 0, 0)
    let unix_time = Math.floor(date.getTime() / 1000)

    if (!thumbnailGroups.has(unix_time)) {
      thumbnailGroups.set(unix_time, [])
    }
    thumbnailGroups.get(unix_time)!.push(image)
  })

  let thumbnailGroupComponents: ReactElement[] = [];
  new Map([...thumbnailGroups].sort((a, b) => { return b[0] - a[0] })).forEach((images, key) => {
    thumbnailGroupComponents.push(
      <ListItem key={key}>
        <ThumbnailGroup title={images[0].createdAt.toLocaleString('en-US', DateFormat)}
          thumbnails={images}
        />
      </ListItem>
    )
  })

  if (thumbnails.length == 0) {
    return (
      <Grid2
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}
      >
        <Typography variant="h5">
          Looks a little lonely. Let's change that.
        </Typography>
        <UploadButton />
      </Grid2>
    )
  }

  return (
    <div className="flex h-screen flex-col">
      <div style={{ display: "flex-1", flexWrap: "wrap", gap: "10px" }}>
        <List sx={{ width: "100%" }}>
          {thumbnailGroupComponents}
        </List>
      </div>
    </div>
  );
}
