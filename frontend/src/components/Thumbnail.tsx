import { Box } from '@mui/material';
import { Thumbnail } from '../types/props';

export default function ThumbnailBox(thumbnail: Thumbnail) {
  return (
    <Box
      className="size-24 md:size-48 border-2 border-french-gray-2"
      component="img"
      alt="User Image."
      src={thumbnail.src}
    />
  );
}

