import { Box } from '@mui/material';
import { Thumbnail } from '../types/props';

export default function ThumbnailBox({ thumbnail }: { thumbnail: Thumbnail }) {
  return (
    <Box
      onClick={() => { }}
      className="size-24 md:size-48 lg:size-64 border-2 border-french-gray-2"
      component="img"
      alt="User Image"
      src={thumbnail.src}
    />
  );
}

