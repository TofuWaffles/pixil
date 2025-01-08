import React from "react";
import Thumbnail from "./Thumbnail";

/// USE THIS AS REFERENCE ONLY
export function DisplayImages() {
  const [images, setImages] = React.useState<{ id: number; src: string }[]>([]);
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
        const imageIds = imageList.map((item: { id: number }) => item.id);

        // Step 2: Fetch each image file by ID
        const imagePromises = imageIds.map(async (id: number) => {
          const imageResponse = await fetch(`http://127.0.0.1:4000/thumbnail?id=${id}`);
          if (!imageResponse.ok) {
            throw new Error(`Error fetching image with ID ${id}: ${imageResponse.statusText}`);
          }

          const imageBlob = await imageResponse.blob();
          const imageUrl = URL.createObjectURL(imageBlob); // Create a temporary URL for the image
          return { id, src: imageUrl };
        });

        // Wait for all image fetches to complete
        const fetchedImages = await Promise.all(imagePromises);
        setImages(fetchedImages);
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

  return (
    <div>
      <h1>Available Images</h1>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {images.map((image) => (
          <div key={image.id}>
            <Thumbnail src={image.src} />
            <p>ID: {image.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

