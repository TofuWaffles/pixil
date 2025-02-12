import { Box } from '@mui/material';
import { Thumbnail } from '../types/props';
import { useNavigate } from 'react-router-dom';

export default function ThumbnailBox({ thumbnail }: {
  thumbnail: Thumbnail,
}) {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => {
        navigate("/media?id=" + thumbnail.id.toString())
      }}
      className="size-24 md:size-48 lg:size-64 border-2 border-french-gray-2"
      component="img"
      alt="User Image"
      src={thumbnail.src}
    />
  );
}

