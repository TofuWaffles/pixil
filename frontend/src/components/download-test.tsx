import React from "react";

export function DownloadImageTest() {
  const [images, setImages] = React.useState<number[]>([]);

  const fetchImages = async () => {
    try {
      let response = await fetch("http://127.0.0.1:4000/all-active-media")
      if (response.ok) {
        let jsonImageIds = await response.json()
        setImages(jsonImageIds.map((item: { Id: any; }) => item.Id));
      }
    } catch (err) {
      console.error(err)
    }
  };

  React.useEffect(() => {
    fetchImages();
  }, []);

  console.log(images);

  return (
    <div>
      <h1>Downloaded Images</h1>
      {images.map((src, idx) => (
        <p>Index: {idx}, ID: {src}</p>
      ))}
    </div>
  );
}

