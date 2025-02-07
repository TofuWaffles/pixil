import { Box } from "@mui/material";
import React from "react";
import { useSearchParams } from "react-router-dom";

// TODO: Make this its own page on the router
export default function ImageView() {
  const [idParam, _] = useSearchParams();
  const [imgUrl, setImgUrl] = React.useState("");

  React.useEffect(() => {
    const mediaID = idParam.get("id")
    const fetchImage = async () => {
      try {
        const imageResponse = await fetch(import.meta.env.VITE_BACKEND_URL + `/media?id=${mediaID}`);
        if (!imageResponse.ok) {
          throw new Error(`Error fetching image with ID ${mediaID}: ${imageResponse.statusText}`);
        }

        const imageBlob = await imageResponse.blob();
        setImgUrl(URL.createObjectURL(imageBlob));
      } catch (err: any) {
        console.log(err);
      }
    }
    fetchImage()
  }, []);

  return (
    <div className="bg-background-dark">
      <Box
        className=""
        component="img"
        alt="User Image"
        src={imgUrl}
      >
      </Box>
    </div>
  )
}
