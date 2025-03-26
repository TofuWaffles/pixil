import React from "react"

export default function AlbumsPage() {
  const [albums, setAlbums] = React.useState([]);

  React.useEffect(() => {
    const fetchImages = async () => {
      try {
        let requestPath = "/media?status=0";
        if (searchQuery != null) {
          requestPath += "&tag="
          requestPath += searchQuery
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
  }, [searchQuery]);

  return (
    
  )
}
