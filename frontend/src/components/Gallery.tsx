import React, { ReactElement } from "react";
import { Thumbnail } from "../types/Models";
import ThumbnailGroup from "./ThumbnailGroup";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import backendRequest from "../utils/BackendRequest";
import DateFormat from "../types/DateFormat";


export default function Gallery({ queryParams }: { queryParams: string | null }) {
  const [thumbnails, setThumbnails] = React.useState<{ id: number; createdAt: Date; src: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        let requestPath = "/media?status=0";
        if (queryParams != null) {
          requestPath += `&${queryParams}`
        }
        const response = await backendRequest(null, "GET", requestPath, true);
        if (!response.ok) {
          throw new Error(`Error fetching image IDs: ${response.statusText}`);
        }

        const mediaList = await response.json();
        const media = mediaList.map((item: { id: number, createdAt: string }) => { return { id: item.id, createdAt: new Date(item.createdAt) } });

        const imagePromises = media.map(async (m: Thumbnail) => {
          const imageResponse = await backendRequest(null, "GET", `/thumbnail?id=${m.id}`, true);
          if (!imageResponse.ok) {
            throw new Error(`Error fetching image with ID ${m.id}: ${imageResponse.statusText}`);
          }

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          return { id: m.id, createdAt: m.createdAt, src: imageUrl };
        });

        // Wait for all image fetches to complete
        const thumbnails = await Promise.all(imagePromises);
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

  return (
    <div className="flex h-screen flex-col">
      <div style={{ display: "flex-1", flexWrap: "wrap", gap: "10px" }}>
        <List sx={{ width: "100%" }}>
          {thumbnailGroupComponents}
        </List>
      </div>
    </div >
  );
}
