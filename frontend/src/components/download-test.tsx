import React, { ReactElement } from "react";
import ThumbnailGroup from "./ThumbnailGroup";
import { Thumbnail } from "../types/props";

/// USE THIS AS REFERENCE ONLY
export function DisplayImages() {
  const [images, setImages] = React.useState<{ id: number; createdAt: Date; src: string }[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        // Step 1: Fetch image IDs
        const response = await fetch("http://127.0.0.1:4000/all-active-media");
        if (!response.ok) {
          throw new Error(`Error fetching image IDs: ${response.statusText}`);
        }

        const imageList = await response.json(); // Assuming the API returns an array of objects like [{ Id: 1 }, { Id: 2 }]
        const media = imageList.map((item: { id: number, createdAt: string }) => { return { id: item.id, createdAt: new Date(item.createdAt) } });
        console.log(media);


        // Step 2: Fetch each image file by ID
        const imagePromises = media.map(async (m: Thumbnail) => {
          const imageResponse = await fetch(`http://127.0.0.1:4000/thumbnail?id=${m.id}`);
          if (!imageResponse.ok) {
            throw new Error(`Error fetching image with ID ${m.id}: ${imageResponse.statusText}`);
          }

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
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
    };

    fetchImages();
  }, []);

  // Step 3: Render the images
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  let thumbnailGroups: Map<Date, Thumbnail[]> = new Map();

  images.forEach((image) => {
    let date = image.createdAt
    date.setHours(0, 0, 0, 0)
    if (!thumbnailGroups.has(date)) {
      thumbnailGroups.set(date, [])
    }
    thumbnailGroups.get(date)!.push(image)
  })
  console.log(thumbnailGroups);

  let thumbnailGroupComps: ReactElement[] = [];
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  thumbnailGroups.forEach((images, date) => {
    thumbnailGroupComps.push(
      <ThumbnailGroup title={date.toLocaleString('en-US', options)} thumbnails={images} />
    )
  })


  return (
    <div>
      <h1>Available Images</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {thumbnailGroupComps}
      </div>
    </div>
  );
}

