import Box from '@mui/material/Box';
import { Thumbnail } from '../types/Models';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@mui/material';

export default function ThumbnailBox({
  thumbnail,
  title,
  path,
}: {
  thumbnail: Thumbnail,
  title: string,
  path: string,
}) {
  const navigate = useNavigate();

  return (
    <Box>
      <Box
        onClick={() => {
          navigate(path == "" ? "/media?id=" + thumbnail.id.toString() : path)
        }}
        className="size-24 md:size-48 lg:size-64 border-2 border-french-gray-2"
        component="img"
        alt="User Image"
        src={thumbnail.src}
        sx={{
          imageOrientation: "from-image",
          "&:hover": {
            cursor: "pointer",
          },
        }}
      />
      {(title != "") && <Typography variant='h5'>{title}</Typography>}
    </Box>
  );
}

