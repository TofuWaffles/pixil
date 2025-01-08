import { Box } from '@mui/material';

interface ThumbnailProps {
  src: string;
}

export default function Thumbnail({ src }: ThumbnailProps) {
  return (
    <Box
      className="size-24 md:size-48"
      component="img"
      alt="User Image."
      src={src}
    />
  );
}

