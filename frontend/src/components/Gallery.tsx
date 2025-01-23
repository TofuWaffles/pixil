import React, { ReactElement } from "react";
import { Thumbnail } from "../types/props";
import ThumbnailGroup from "./ThumbnailGroup";

export function Gallery() {
  const [images, setImages] = React.useState<{ id: number; createdAt: Date; src: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(import.meta.env.VITE_BACKEND_URL + "/all-active-media");
        if (!response.ok) {
          throw new Error(`Error fetching image IDs: ${response.statusText}`);
        }

        const imageList = await response.json();
        const media = imageList.map((item: { id: number, createdAt: string }) => { return { id: item.id, createdAt: new Date(item.createdAt) } });
        console.log(media);


        const imagePromises = media.map(async (m: Thumbnail) => {
          const imageResponse = await fetch(import.meta.env.VITE_BACKEND_URL + `/thumbnail?id=${m.id}`);
          if (!imageResponse.ok) {
            throw new Error(`Error fetching image with ID ${m.id}: ${imageResponse.statusText}`);
          }

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob);
          return { id: m.id, createdAt: m.createdAt, src: imageUrl };
        });

        // Wait for all image fetches to complete
        const thumbnails = await Promise.all(imagePromises);
        setImages(thumbnails);
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

  let thumbnailGroups: Map<number, Thumbnail[]> = new Map();

  images.forEach((image) => {
    let date = image.createdAt
    date.setHours(0, 0, 0, 0)
    let unix_time = Math.floor(date.getTime() / 1000)

    if (!thumbnailGroups.has(unix_time)) {
      thumbnailGroups.set(unix_time, [])
    }
    thumbnailGroups.get(unix_time)!.push(image)
  })
  console.log(thumbnailGroups);

  let thumbnailGroupComps: ReactElement[] = [];
  thumbnailGroups.forEach((images, _) => {
    thumbnailGroupComps.push(
      <ThumbnailGroup title={images[0].createdAt.toLocaleString('en-US', {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })} thumbnails={images} />
    )
  })
  return (
    <div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {thumbnailGroupComps}
      </div>
    </div>
  );
}
