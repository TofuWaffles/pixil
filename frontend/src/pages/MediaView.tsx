import ArrowBack from "@mui/icons-material/ArrowBack";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import React, { useContext } from "react";
import ReactPlayer from "react-player";
import { useNavigate, useSearchParams } from "react-router-dom";
import MediaDetails from "../components/MediaDetails";
import AddAlbumMediaButton from "../components/AddAlbumMediaButton";
import MediaDeleteButton from "../components/MediaDeleteButton";
import Tooltip from "@mui/material/Tooltip";
import { BackendApiContext } from "../App";
import ErrorBox from "../components/ErrorBox";
import LoadingIcon from "../components/LoadingIcon";

export default function MediaView() {
  const [idParam, _] = useSearchParams();
  const [mediaUrl, setMediaUrl] = React.useState("");
  const [isVideo, setIsVideo] = React.useState(false);
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const nagivate = useNavigate();
  const mediaID: number = +idParam.get("id")!;
  const backendApi = useContext(BackendApiContext);

  React.useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageResponse = await backendApi.getMediaContent(mediaID);
        if (imageResponse!.headers.get("content-type")?.startsWith("video")) {
          setIsVideo(true);
        }
        const imageBlob = await imageResponse!.blob();
        setMediaUrl(URL.createObjectURL(imageBlob));
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    fetchImage()
  }, []);

  return (
    <div className="bg-primary-contrast flex w-screen, h-screen">
      <ErrorBox message={error} />
      <Tooltip title="Back">
        <IconButton aria-label="go back" sx={{ color: "white", width: 100, height: 100 }} onClick={() => {
          nagivate(-1);
        }}>
          <ArrowBack sx={{ width: 40, height: 40 }} />
        </IconButton>
      </Tooltip>
      {
        loading ? (
          <LoadingIcon />
        ) : (
          isVideo ? (
            <div className="h-screen w-screen flex flex-row justify-center items-center">
              <ReactPlayer
                className="max-w-fit max-h-fit"
                url={mediaUrl}
                controls={true}
                playing={true}
              />
            </div>
          ) : (
            <div className="h-screen w-screen flex flex-row justify-center items-center">
              <Box
                sx={{
                  maxWidth: "100vh",
                  maxHeight: "100vh",
                  imageOrientation: "from-image"
                }}
                component="img"
                alt="User Image"
                src={mediaUrl}
              />
            </div>
          )
        )
      }
      <AddAlbumMediaButton mediaId={mediaID} />
      <MediaDeleteButton mediaId={mediaID} />
      <MediaDetails mediaID={mediaID} />
    </div>
  )
}
